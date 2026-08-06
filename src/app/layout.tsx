import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Bite Wise | Smarter Nutrition Guidance",
  description:
    "An accessible, responsive nutrition platform for meal awareness, healthier habits, and personalized guidance.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
