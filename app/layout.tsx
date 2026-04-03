import type { Metadata, Viewport } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import { ClerkProvider } from "@clerk/nextjs";
import "./globals.css";

const plusJakartaSans = Plus_Jakarta_Sans({
  variable: "--font-plus-jakarta-sans",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "HangMates — Never Hang Alone",
  description:
    "Rent friends for any occasion. From birthdays to study sessions — find your vibe.",
};

export const viewport: Viewport = {
  themeColor: "#0F0F1A",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider
      appearance={{
        variables: {
          colorPrimary: "#FF6B35",
          colorBackground: "#0F0F1A",
          colorText: "#F2F0ED",
          colorInputBackground: "rgba(255, 255, 255, 0.06)",
          colorInputText: "#F2F0ED",
        },
      }}
    >
      <html lang="en" className={`${plusJakartaSans.variable} h-full`}>
        <body className="min-h-full flex flex-col font-sans antialiased">
          {children}
        </body>
      </html>
    </ClerkProvider>
  );
}
