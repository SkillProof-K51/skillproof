// pnpm db:check — runs every migration and the seed on an in-memory Postgres (PGlite), offline, then
// tries the access rules as two students, a company, an admin and a signed-out visitor. This is
// AGENTS.md rule 1's two-account test, run before anything touches the Supabase project. It fails
// loudly: a public table without RLS or a policy, a check below that doesn't hold.
//
// PGlite isn't Supabase, so step 1 creates what the migrations expect: the API roles (anon,
// authenticated, service_role) with Supabase's default grants, auth.users and auth.uid(), and
// Storage's two tables. A module whose migration needs more adds its stub there.
import { readdir, readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { PGlite } from "@electric-sql/pglite";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const db = new PGlite();
let failures = 0;
const ok = (msg) => console.log(`  ✓ ${msg}`);
const fail = (msg) => {
  failures += 1;
  console.log(`  ✗ ${msg}`);
};

// want: "rows:N" (a select returns N rows) · "affected:N" · "refused:CODE" (Postgres error code) · "ok"
async function expect(label, fn, want) {
  try {
    const res = await fn();
    if (want.startsWith("rows:")) {
      const n = Number(want.slice(5));
      res.rows.length === n ? ok(`${label} → ${n} row(s)`) : fail(`${label} → expected ${n} row(s), got ${res.rows.length}`);
    } else if (want.startsWith("affected:")) {
      const n = Number(want.slice(9));
      res.affectedRows === n ? ok(`${label} → ${n} changed`) : fail(`${label} → expected ${n} changed, got ${res.affectedRows}`);
    } else if (want.startsWith("refused:")) {
      fail(`${label} → expected refusal ${want.slice(8)}, but it went through`);
    } else {
      ok(label);
    }
  } catch (e) {
    const text = e?.message ?? String(e);
    if (want.startsWith("refused:")) {
      const code = want.slice(8);
      e?.code === code || (code === "42501" && /permission denied|row-level security/i.test(text))
        ? ok(`${label} → refused (${code})`)
        : fail(`${label} → expected ${code}, got ${e?.code}: ${text}`);
    } else {
      fail(`${label} → ${text}`);
    }
  }
}

// ── 1. What Supabase provides ───────────────────────────────────────────────────────────────
await db.exec(`
  create role anon nologin;
  create role authenticated nologin;
  create role service_role nologin bypassrls;
  grant usage on schema public to anon, authenticated, service_role;
  -- Supabase's default: everything created in public is granted to the API roles.
  alter default privileges in schema public grant all on tables to anon, authenticated, service_role;
  alter default privileges in schema public grant all on sequences to anon, authenticated, service_role;
  alter default privileges in schema public grant all on functions to anon, authenticated, service_role;

  create schema auth;
  create table auth.users (
    id uuid primary key default gen_random_uuid(),
    email text unique,
    raw_user_meta_data jsonb not null default '{}'::jsonb,
    created_at timestamptz not null default now()
  );
  create function auth.uid() returns uuid language sql stable as $$
    select nullif(current_setting('request.jwt.claim.sub', true), '')::uuid
  $$;
  grant usage on schema auth to anon, authenticated, service_role;
  grant execute on function auth.uid() to anon, authenticated, service_role;

  create schema storage;
  create table storage.buckets (
    id text primary key, name text not null, public boolean not null default false,
    file_size_limit bigint, allowed_mime_types text[], created_at timestamptz default now()
  );
  create table storage.objects (
    id uuid primary key default gen_random_uuid(),
    bucket_id text references storage.buckets (id),
    name text not null,
    owner uuid,
    created_at timestamptz default now()
  );
  create function storage.foldername(name text) returns text[] language sql immutable as $$
    select _parts[1 : array_length(_parts, 1) - 1] from (select string_to_array(name, '/') as _parts) p
  $$;
  alter table storage.objects enable row level security;
  grant usage on schema storage to anon, authenticated, service_role;
  grant select, insert, update, delete on storage.objects to anon, authenticated, service_role;
  grant select on storage.buckets to anon, authenticated, service_role;
`);

// ── 2. Migrations in file order, then the seed ──────────────────────────────────────────────
const migrationsDir = path.join(root, "supabase", "migrations");
const files = (await readdir(migrationsDir)).filter((f) => f.endsWith(".sql")).sort();
console.log(`Applying ${files.length} migration(s) and the seed on PGlite:`);
for (const f of [...files.map((f) => path.join(migrationsDir, f)), path.join(root, "supabase", "seed.sql")]) {
  try {
    await db.exec(await readFile(f, "utf8"));
    ok(path.basename(f));
  } catch (e) {
    fail(`${path.basename(f)}: ${e.message}`);
    process.exit(1);
  }
}
await expect("the seed runs twice without errors", async () => db.exec(await readFile(path.join(root, "supabase", "seed.sql"), "utf8")), "ok");

// ── 3. Every table ──────────────────────────────────────────────────────────────────────────
console.log("\nEvery table:");
const tables = (sql) => db.query(sql).then((r) => r.rows.map((x) => x.relname));
const noRls = await tables(`
  select c.relname from pg_class c join pg_namespace n on n.oid = c.relnamespace
  where n.nspname = 'public' and c.relkind = 'r' and not c.relrowsecurity order by 1`);
noRls.length === 0 ? ok("every public table has RLS on") : fail(`RLS off: ${noRls.join(", ")}`);
const noPolicy = await tables(`
  select c.relname from pg_class c join pg_namespace n on n.oid = c.relnamespace
  where n.nspname = 'public' and c.relkind = 'r'
    and not exists (select 1 from pg_policies p where p.schemaname = 'public' and p.tablename = c.relname) order by 1`);
noPolicy.length === 0 ? ok("every public table has at least one policy") : fail(`no policy: ${noPolicy.join(", ")}`);
const definers = await db.query(`
  select p.proname from pg_proc p join pg_namespace n on n.oid = p.pronamespace
  where n.nspname = 'public' and p.prosecdef order by 1`);
definers.rows.length === 0 ? ok("no definer function in public (they belong in private)") : fail(`definer in public: ${definers.rows.map((r) => r.proname).join(", ")}`);

// The shared core's grants, exactly (the warm-up tables keep Supabase's defaults).
const CORE = ["profiles", "student_profiles", "programmes", "skills", "job_roles", "job_role_skills", "student_skills", "companies", "mentors", "coordinators"];
const WANT = {
  "anon:SELECT": ["job_role_skills", "job_roles", "programmes", "skills"],
  "authenticated:SELECT": [...CORE].sort(),
  "authenticated:INSERT": ["job_role_skills", "job_roles", "programmes", "skills"],
  "authenticated:UPDATE": [
    "companies(document_path,join_code,name,ssm_no,website)", "coordinators(faculty)", "job_role_skills", "job_roles",
    "mentors(job_title)", "profiles(full_name,role,status)", "programmes", "skills", "student_profiles(job_role_id,programme_id,year)",
  ],
  "authenticated:DELETE": ["job_role_skills", "job_roles", "mentors", "programmes", "skills"],
};
const got = {};
// SELECT / INSERT / UPDATE can be granted per column; DELETE, TRUNCATE, TRIGGER only per table.
const grants = await db.query(`
  select c.table_name, c.grantee, c.privilege_type, string_agg(c.column_name, ',' order by c.column_name) as cols,
         (select count(*) from information_schema.columns k where k.table_schema = 'public' and k.table_name = c.table_name)::int as total
  from information_schema.column_privileges c
  where c.table_schema = 'public' and c.grantee in ('anon', 'authenticated') and c.table_name = any($1)
  group by 1, 2, 3
  union all
  select t.table_name, t.grantee, t.privilege_type, null, null
  from information_schema.role_table_grants t
  where t.table_schema = 'public' and t.grantee in ('anon', 'authenticated') and t.table_name = any($1)
    and t.privilege_type in ('DELETE', 'TRUNCATE', 'TRIGGER')`, [CORE]);
for (const g of grants.rows) {
  const all = g.cols === null || g.cols.split(",").length === g.total;
  (got[`${g.grantee}:${g.privilege_type}`] ??= []).push(all ? g.table_name : `${g.table_name}(${g.cols})`);
}
for (const key of new Set([...Object.keys(WANT), ...Object.keys(got)])) {
  const want = (WANT[key] ?? []).join(" ");
  const have = (got[key] ?? []).sort().join(" ");
  want === have ? ok(`${key.padEnd(22)} ${have || "nothing"}`) : fail(`${key}: expected [${want}], got [${have}]`);
}

// ── 4. Sign-up ──────────────────────────────────────────────────────────────────────────────
console.log("\nSign-up (the trigger on auth.users):");
const AINA = "11111111-1111-4111-8111-111111111111"; // student
const HARIZ = "22222222-2222-4222-8222-222222222222"; // student
const CO = "33333333-3333-4333-8333-333333333333"; // company
const ADMIN = "44444444-4444-4444-8444-444444444444";
const signUp = (id, email, meta) =>
  db.query(`insert into auth.users (id, email, raw_user_meta_data) values ($1, $2, $3::jsonb)`, [id, email, JSON.stringify(meta)]);

await expect("Aina signs up as a student with her onboarding answers", () =>
  signUp(AINA, "aina@example.com", { full_name: "Aina Sofea", role: "student", job_role_id: "web", programme_id: "software", year: 2, used_skill_ids: ["javascript", "git", "cobol"] }), "affected:1");
await expect("her profile: student, active, her name", async () => {
  const r = await db.query(`select role, status, full_name from public.profiles where id = $1`, [AINA]);
  const p = r.rows[0];
  if (p?.role !== "student" || p.status !== "active" || p.full_name !== "Aina Sofea") throw new Error(JSON.stringify(p));
  return r;
}, "ok");
await expect("her student profile: web, software, year 2, unknown skill 'cobol' dropped", async () => {
  const r = await db.query(`select job_role_id, programme_id, year, used_skill_ids from public.student_profiles where id = $1`, [AINA]);
  const s = r.rows[0];
  if (s?.job_role_id !== "web" || s.programme_id !== "software" || s.year !== 2 || s.used_skill_ids.join() !== "git,javascript") throw new Error(JSON.stringify(s));
  return r;
}, "ok");
await expect("Hariz signs up with no metadata → student, name from the email, empty answers", async () => {
  await signUp(HARIZ, "hariz@example.com", {});
  const r = await db.query(`select p.full_name, s.job_role_id, s.year from public.profiles p join public.student_profiles s using (id) where p.id = $1`, [HARIZ]);
  if (r.rows[0]?.full_name !== "hariz" || r.rows[0].job_role_id !== null) throw new Error(JSON.stringify(r.rows));
  return r;
}, "ok");
await expect("bad answers are dropped, not trusted (role 'ghost', year 9)", async () => {
  const id = "55555555-5555-4555-8555-555555555555";
  await signUp(id, "x@example.com", { full_name: "X", job_role_id: "ghost", programme_id: "nope", year: 9 });
  const r = await db.query(`select job_role_id, programme_id, year from public.student_profiles where id = $1`, [id]);
  if (r.rows[0].job_role_id !== null || r.rows[0].programme_id !== null || r.rows[0].year !== null) throw new Error(JSON.stringify(r.rows));
  await db.query(`delete from auth.users where id = $1`, [id]);
  return r;
}, "ok");
await expect("a company signs up → pending, no student profile", async () => {
  await signUp(CO, "hr@example.com", { full_name: "Lina Contoh", role: "company", company_name: "Contoh Tech Sdn Bhd", ssm_no: "2024 0101 2345", website: "contoh.example" });
  const r = await db.query(`select p.status, s.id as student from public.profiles p left join public.student_profiles s using (id) where p.id = $1`, [CO]);
  if (r.rows[0].status !== "pending" || r.rows[0].student !== null) throw new Error(JSON.stringify(r.rows));
  return r;
}, "ok");
await expect("nobody signs up as an admin", () => signUp("66666666-6666-4666-8666-666666666666", "boss@example.com", { role: "admin" }), "refused:42501");
// An admin is made by hand: sign up, then the SQL editor sets the role.
await signUp(ADMIN, "admin@example.com", { full_name: "Admin" });
await db.query(`update public.profiles set role = 'admin' where id = $1`, [ADMIN]);

// ── 5. Who reads and writes what ────────────────────────────────────────────────────────────
const as = async (uid, fn) => {
  await db.exec(`set role ${uid ? "authenticated" : "anon"}; select set_config('request.jwt.claim.sub', '${uid ?? ""}', false);`);
  try {
    return await fn();
  } finally {
    await db.exec(`reset role; select set_config('request.jwt.claim.sub', '', false);`);
  }
};
const q = (uid, sql, params) => as(uid, () => db.query(sql, params));

console.log("\nprofiles:");
await expect("Aina reads only her own profile", () => q(AINA, `select id from public.profiles`), "rows:1");
await expect("Aina renames herself", () => q(AINA, `update public.profiles set full_name = 'Aina S.' where id = $1`, [AINA]), "affected:1");
await expect("Aina cannot rename Hariz", () => q(AINA, `update public.profiles set full_name = 'x' where id = $1`, [HARIZ]), "affected:0");
await expect("Aina cannot make herself an admin", () => q(AINA, `update public.profiles set role = 'admin' where id = $1`, [AINA]), "refused:42501");
await expect("the company cannot approve itself", () => q(CO, `update public.profiles set status = 'active' where id = $1`, [CO]), "refused:42501");
await expect("Aina cannot add a profile", () => q(AINA, `insert into public.profiles (id, role, status, full_name) values ($1, 'admin', 'active', 'x')`, [HARIZ]), "refused:42501");
await expect("Aina cannot delete her profile through the API", () => q(AINA, `delete from public.profiles where id = $1`, [AINA]), "refused:42501");
await expect("a visitor reads no profiles", () => q(null, `select id from public.profiles`), "refused:42501");
await expect("the admin reads every profile", () => q(ADMIN, `select id from public.profiles`), "rows:4");
await expect("a visitor cannot call private.is_admin()", () => q(null, `select private.is_admin()`), "refused:42501");

console.log("\nthe catalogue (programmes, skills, job roles, weights):");
await expect("a visitor reads the 4 roles (onboarding, before sign-up)", () => q(null, `select id from public.job_roles`), "rows:4");
await expect("a visitor reads the web roadmap: 6 skills", () => q(null, `select skill_id from public.job_role_skills where job_role_id = 'web'`), "rows:6");
await expect("a visitor reads the 5 programmes", () => q(null, `select id from public.programmes`), "rows:5");
await expect("each seeded role's weights sum to 100", async () => {
  const r = await db.query(`select job_role_id, sum(weight)::int as total from public.job_role_skills group by 1 having sum(weight) <> 100`);
  if (r.rows.length) throw new Error(JSON.stringify(r.rows));
  return r;
}, "ok");
await expect("a visitor cannot add a skill", () => q(null, `insert into public.skills (id, name) values ('rust', 'Rust')`), "refused:42501");
await expect("Aina cannot add a skill", () => q(AINA, `insert into public.skills (id, name) values ('rust', 'Rust')`), "refused:42501");
await expect("Aina cannot change a weight", () => q(AINA, `update public.job_role_skills set weight = 100 where job_role_id = 'web'`), "affected:0");
await expect("the admin adds a skill", () => q(ADMIN, `insert into public.skills (id, name) values ('rust', 'Rust')`), "affected:1");
await expect("the admin changes a weight", () => q(ADMIN, `update public.job_role_skills set weight = 30 where job_role_id = 'web' and skill_id = 'html_css'`), "affected:1");
await expect("the admin deletes the skill", () => q(ADMIN, `delete from public.skills where id = 'rust'`), "affected:1");
await expect("an unapproved company is no admin", async () => {
  await db.query(`update public.profiles set role = 'admin', status = 'pending' where id = $1`, [CO]);
  try {
    return await q(CO, `insert into public.skills (id, name) values ('rust', 'Rust')`);
  } finally {
    await db.query(`update public.profiles set role = 'company' where id = $1`, [CO]);
  }
}, "refused:42501");

console.log("\nstudent_profiles:");
await expect("Aina reads only her own", () => q(AINA, `select id from public.student_profiles`), "rows:1");
await expect("Aina changes her target role", () => q(AINA, `update public.student_profiles set job_role_id = 'data' where id = $1`, [AINA]), "affected:1");
await expect("Aina cannot change Hariz's", () => q(AINA, `update public.student_profiles set year = 4 where id = $1`, [HARIZ]), "affected:0");
await expect("Aina cannot rewrite the skills she said she'd used", () => q(AINA, `update public.student_profiles set used_skill_ids = '{react}' where id = $1`, [AINA]), "refused:42501");
await expect("Aina cannot add a student profile", () => q(AINA, `insert into public.student_profiles (id) values ($1)`, [CO]), "refused:42501");

console.log("\nstudent_skills (rule 7):");
const status = (id, skill) => db.query(`select status, practised_at, verified_at from public.student_skills where student_id = $1 and skill_id = $2`, [id, skill]).then((r) => r.rows[0]);
await expect("Aina cannot give herself a status", () => q(AINA, `insert into public.student_skills (student_id, skill_id, status) values ($1, 'git', 'practised')`, [AINA]), "refused:42501");
// Below: as the database owner, standing in for the Module 3 / Module 4 functions to come.
await expect("Module 3 marks git practised → practised_at stamped", async () => {
  await db.query(`insert into public.student_skills (student_id, skill_id, status, practised_at) values ($1, 'git', 'practised', '2000-01-01')`, [AINA]);
  const s = await status(AINA, "git");
  if (s.status !== "practised" || s.practised_at.getFullYear() === 2000) throw new Error(JSON.stringify(s));
  return s;
}, "ok");
await expect("Aina cannot change it either", () => q(AINA, `update public.student_skills set status = 'verified' where student_id = $1`, [AINA]), "refused:42501");
await expect("practised → not_yet is refused", () => db.query(`update public.student_skills set status = 'not_yet' where student_id = $1 and skill_id = 'git'`, [AINA]), "refused:23514");
await expect("straight to verified is refused", () => db.query(`insert into public.student_skills (student_id, skill_id, status) values ($1, 'react', 'verified')`, [AINA]), "refused:23514");
await expect("Module 4 verifies git → verified_at stamped, practised_at kept", async () => {
  const before = await status(AINA, "git");
  await db.query(`update public.student_skills set status = 'verified', practised_at = null where student_id = $1 and skill_id = 'git'`, [AINA]);
  const s = await status(AINA, "git");
  if (s.status !== "verified" || !s.verified_at || +s.practised_at !== +before.practised_at) throw new Error(JSON.stringify(s));
  return s;
}, "ok");
await expect("verified → practised is refused", () => db.query(`update public.student_skills set status = 'practised' where student_id = $1 and skill_id = 'git'`, [AINA]), "refused:23514");
await expect("a status cannot move to another student", () => db.query(`update public.student_skills set student_id = $1 where student_id = $2`, [HARIZ, AINA]), "refused:23514");
await expect("Aina reads her status", () => q(AINA, `select skill_id from public.student_skills`), "rows:1");
await expect("Hariz cannot see Aina's status", () => q(HARIZ, `select skill_id from public.student_skills`), "rows:0");
await expect("a visitor reads no statuses", () => q(null, `select skill_id from public.student_skills`), "refused:42501");
await expect("the admin reads every status", () => q(ADMIN, `select skill_id from public.student_skills`), "rows:1");
await expect("a skill a student holds cannot be deleted", () => db.query(`delete from public.skills where id = 'git'`), "refused:23001");
await expect("a company has no student profile, so no status", () => db.query(`insert into public.student_skills (student_id, skill_id, status) values ($1, 'git', 'practised')`, [CO]), "refused:23503");
await expect("deleting Aina's account removes her rows", async () => {
  await db.query(`delete from auth.users where id = $1`, [AINA]);
  const r = await db.query(`select 1 from public.profiles where id = $1 union all select 1 from public.student_skills where student_id = $1`, [AINA]);
  if (r.rows.length) throw new Error(`${r.rows.length} row(s) left`);
  return r;
}, "ok");

// ── 6. Portal accounts: companies, join codes, mentors, coordinators, documents ────────────
console.log("\nportal accounts:");
const CO2 = "77777777-7777-4777-8777-777777777777"; // a second company
const MENTOR = "88888888-8888-4888-8888-888888888888"; // joins Contoh Tech
const MENTOR2 = "99999999-9999-4999-8999-999999999999"; // joins the second company
const COORD = "aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa";
const NOBODY = "bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb"; // sign-ups that must fail
const CODE = /^[A-HJ-NP-Z2-9]{4}-[A-HJ-NP-Z2-9]{4}$/;
const company = (owner) => db.query(`select id, join_code, website, ssm_no from public.companies where owner_id = $1`, [owner]).then((r) => r.rows[0]);

await expect("the company got a join code, and its details were tidied (SSM spaces, https://)", async () => {
  const c = await company(CO);
  if (!CODE.test(c.join_code) || c.website !== "https://contoh.example" || c.ssm_no !== "202401012345") throw new Error(JSON.stringify(c));
  return c;
}, "ok");
const firstCode = (await company(CO)).join_code;
await expect("a mentor can't join a company that isn't approved yet", () => signUp(NOBODY, "early@example.com", { role: "mentor", join_code: firstCode }), "refused:22023");
await expect("a student can't approve the company", () => q(HARIZ, `update public.profiles set status = 'active' where id = $1`, [CO]), "affected:0");
await expect("the admin approves the company", () => q(ADMIN, `update public.profiles set status = 'active' where id = $1`, [CO]), "affected:1");
await expect("a mentor joins with the code typed lower-case without the dash → active, linked", async () => {
  await signUp(MENTOR, "kamal@example.com", { full_name: "Kamal Ariff", role: "mentor", join_code: firstCode.replace("-", "").toLowerCase(), job_title: "Senior developer" });
  const r = await db.query(`select p.role, p.status, m.company_id, m.job_title from public.profiles p join public.mentors m using (id) where p.id = $1`, [MENTOR]);
  const m = r.rows[0];
  if (m?.role !== "mentor" || m.status !== "active" || m.company_id !== (await company(CO)).id || m.job_title !== "Senior developer") throw new Error(JSON.stringify(m));
  return r;
}, "ok");
await expect("a wrong join code fails the sign-up", () => signUp(NOBODY, "guess@example.com", { role: "mentor", join_code: "ABCD-EFGH" }), "refused:22023");
await expect("a coordinator signs up → pending, with their faculty", async () => {
  await signUp(COORD, "coordinator@example.com", { full_name: "Hafiz Rahim", role: "coordinator", faculty: "Faculty of ICT" });
  const r = await db.query(`select p.status, c.faculty from public.profiles p join public.coordinators c using (id) where p.id = $1`, [COORD]);
  if (r.rows[0]?.status !== "pending" || r.rows[0].faculty !== "Faculty of ICT") throw new Error(JSON.stringify(r.rows));
  return r;
}, "ok");
await expect("the admin approves the coordinator", () => q(ADMIN, `update public.profiles set status = 'active' where id = $1`, [COORD]), "affected:1");
await signUp(CO2, "hello@kilangkod.example", { full_name: "Wei Ling", role: "company", company_name: "Kilang Kod Studio", ssm_no: "202201056789" });
await expect("a coordinator is no admin: can't approve a company", () => q(COORD, `update public.profiles set status = 'active' where id = $1`, [CO2]), "affected:0");
await q(ADMIN, `update public.profiles set status = 'active' where id = $1`, [CO2]);
await signUp(MENTOR2, "devi@example.com", { full_name: "Devi Nair", role: "mentor", join_code: (await company(CO2)).join_code });

await expect("the company reads its own company only", () => q(CO, `select id from public.companies`), "rows:1");
await expect("the company reads its mentor and the mentor's name", () => q(CO, `select m.id from public.mentors m union all select p.id from public.profiles p where p.id = '${MENTOR}'`), "rows:2");
await expect("the company can't see the other company's mentor", () => q(CO, `select id from public.mentors where id = $1 union all select id from public.profiles where id = $1`, [MENTOR2]), "rows:0");
await expect("the mentor reads their own company, not the other", () => q(MENTOR, `select id from public.companies`), "rows:1");
await expect("a student sees no companies", () => q(HARIZ, `select id from public.companies`), "rows:0");
await expect("a visitor reads no companies, mentors or coordinators", () => q(null, `select id from public.companies`), "refused:42501");
await expect("the admin reads both companies, both mentors and the coordinator", () => q(ADMIN, `select id from public.companies union all select id from public.mentors union all select id from public.coordinators`), "rows:5");

await expect("the company can't pick its own join code", () => q(CO, `update public.companies set join_code = 'AAAA-BBBB' where owner_id = $1`, [CO]), "refused:42501");
await expect("the company draws a new code (set it to null)", async () => {
  await q(CO, `update public.companies set join_code = null where owner_id = $1`, [CO]);
  const c = await company(CO);
  if (!CODE.test(c.join_code) || c.join_code === firstCode) throw new Error(c.join_code);
  return c;
}, "ok");
await expect("the old code no longer works", () => signUp(NOBODY, "late@example.com", { role: "mentor", join_code: firstCode }), "refused:22023");
await expect("the company can't point its document at another folder", () => q(CO, `update public.companies set document_path = $2 where owner_id = $1`, [CO, `${CO2}/x.pdf`]), "refused:42501");

const upload = (uid, path) => q(uid, `insert into storage.objects (bucket_id, name, owner) values ('company-documents', $1, $2)`, [path, uid]);
await expect("the company uploads its SSM document into its own folder", () => upload(CO, `${CO}/ssm.pdf`), "affected:1");
await expect("… and records it", () => q(CO, `update public.companies set document_path = $2 where owner_id = $1`, [CO, `${CO}/ssm.pdf`]), "affected:1");
await expect("the company can't upload into another company's folder", () => upload(CO, `${CO2}/ssm.pdf`), "refused:42501");
await expect("a student can't upload company documents", () => upload(HARIZ, `${HARIZ}/ssm.pdf`), "refused:42501");
await expect("the admin reads the document", () => q(ADMIN, `select name from storage.objects where bucket_id = 'company-documents'`), "rows:1");
await expect("the other company can't read it", () => q(CO2, `select name from storage.objects where bucket_id = 'company-documents'`), "rows:0");

await expect("a mentor can't remove another mentor", () => q(MENTOR, `delete from public.mentors where id = $1`, [MENTOR2]), "affected:0");
await expect("the company removes its mentor", () => q(CO, `delete from public.mentors where id = $1`, [MENTOR]), "affected:1");
await expect("the admin promotes the coordinator to admin", () => q(ADMIN, `update public.profiles set role = 'admin' where id = $1`, [COORD]), "affected:1");
await expect("… but can't turn a student into a company", () => q(ADMIN, `update public.profiles set role = 'company' where id = $1`, [HARIZ]), "refused:42501");
await expect("an email changed in Auth reaches the profile", async () => {
  await db.query(`update auth.users set email = 'hariz.new@example.com' where id = $1`, [HARIZ]);
  const r = await db.query(`select email from public.profiles where id = $1`, [HARIZ]);
  if (r.rows[0].email !== "hariz.new@example.com") throw new Error(JSON.stringify(r.rows));
  return r;
}, "ok");

console.log(failures ? `\n✗ ${failures} check(s) failed` : "\n✓ all checks passed");
process.exit(failures ? 1 : 0);
