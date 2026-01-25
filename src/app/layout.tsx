import type { Metadata } from "next";
// CHANGED: Imported 'DM_Sans' (Professional Modern) and 'VT323' (Retro Hacker)
import { Plus_Jakarta_Sans, Kalam, VT323, DM_Sans } from "next/font/google";
import "./globals.css";

// 1. Recruiter Font (Professional - Unchanged)
const recruiterFont = Plus_Jakarta_Sans({ 
  subsets: ["latin"], 
  variable: "--font-recruiter" 
});

// 2. Adventurer Font (Handwritten - Unchanged)
const adventurerFont = Kalam({ 
  weight: ["300", "400", "700"], 
  subsets: ["latin"], 
  variable: "--font-adventurer" 
});

// 3. Stalker Font (UPDATED: Retro Terminal Style)
const stalkerFont = VT323({ 
  weight: "400", 
  subsets: ["latin"], 
  variable: "--font-stalker" 
});

// 4. Default Font (UPDATED: Clean & Premium)
const defaultFont = DM_Sans({ 
  subsets: ["latin"], 
  variable: "--font-default" 
});

export const metadata: Metadata = {
  title: "diptaraj-portfolio.me",
  description: "A frontend portfolio with role-based UI and smooth animations.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body
        // We inject the new variables here. Tailwind will pick them up automatically.
        className={`${defaultFont.variable} ${recruiterFont.variable} ${adventurerFont.variable} ${stalkerFont.variable} font-sans antialiased bg-black text-white`}
      >
        {children}
      </body>
    </html>
  );
}