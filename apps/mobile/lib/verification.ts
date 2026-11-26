/** The mentor's project rating translated to the Module 4 skill decision. */
export type VerificationDecision = "verified" | "revise";

/** Average the mentor's five rubric ratings into a whole-number 1–5 score. */
export function verificationScore(ratings: readonly number[]): number {
  if (ratings.length !== 5 || ratings.some((rating) => !Number.isInteger(rating) || rating < 1 || rating > 5)) {
    throw new RangeError("A verification score needs five whole-number ratings from 1 to 5.");
  }
  return Math.round(ratings.reduce((total, rating) => total + rating, 0) / ratings.length);
}

/**
 * A mentor rating of 3, 4, or 5 verifies the skill; 1 or 2 means the student should revise.
 * Ratings are whole numbers on the rubric's 1–5 scale.
 */
export function verificationDecision(rating: number): VerificationDecision {
  if (!Number.isInteger(rating) || rating < 1 || rating > 5) {
    throw new RangeError("Mentor rating must be a whole number from 1 to 5.");
  }

  return rating >= 3 ? "verified" : "revise";
}
