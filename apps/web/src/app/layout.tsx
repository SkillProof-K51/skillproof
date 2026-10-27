import type { Metadata } from "next";
import { Inter, Roboto_Mono } from "next/font/google";

import { TooltipProvider } from "@/components/ui/tooltip";

import "./globals.css";

// The portal's fonts (look A, Azim 28 Oct). The token stacks in @skillproof/tokens read these
// variables: --font-portal → --font-inter, --font-portal-mono → --font-roboto-mono.
const inter = Inter({ variable: "--font-inter", subsets: ["latin"] });
const robotoMono = Roboto_Mono({ variable: "--font-roboto-mono", subsets: ["latin"] });

export const metadata: Metadata = {
  title: "SkillProof Portal",
  description: "For companies, mentors, university coordinators and admins.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${inter.variable} ${robotoMono.variable} h-full antialiased`}>
      <body className="flex min-h-full flex-col">
        <TooltipProvider>{children}</TooltipProvider>
      </body>
    </html>
  );
}
