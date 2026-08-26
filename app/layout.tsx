import type { Metadata } from "next";
import { Nunito } from "next/font/google";
import "./globals.css";
import { ProfileSync } from "@/components/activation-lab/profile-sync";

const nunito = Nunito({
  variable: "--font-nunito",
  subsets: ["latin"],
  weight: ["400", "600", "700", "800", "900"],
});

export const metadata: Metadata = {
  title: "AI Visualization Lab ⚡",
  description: "Unlock the power of AI.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${nunito.variable} h-full antialiased`}>
      <body className="min-h-full">
        <ProfileSync />
        <div className="lab-shell">{children}</div>
      </body>
    </html>
  );
}