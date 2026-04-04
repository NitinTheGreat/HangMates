import type { Metadata, Viewport } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import { ClerkProvider } from "@clerk/nextjs";
import { dark } from "@clerk/themes";
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
        baseTheme: dark,
        variables: {
          colorPrimary: "#FF6B35",
          colorBackground: "#1A1A2E",
          colorText: "#F2F0ED",
          colorInputBackground: "#1A1A2E",
          colorInputText: "#F2F0ED",
          colorNeutral: "#F2F0ED",
          colorDanger: "#EF4444",
          colorSuccess: "#4ADE80",
          colorTextOnPrimaryBackground: "#FFFFFF",
          colorTextSecondary: "#8A8A9A",
          fontFamily: "var(--font-plus-jakarta-sans), sans-serif",
          borderRadius: "12px",
        },
        elements: {
          rootBox: {
            width: "100%",
          },
          card: {
            backgroundColor: "#1A1A2E",
            border: "1px solid rgba(255, 255, 255, 0.08)",
            borderRadius: "20px",
            boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.5)",
          },
          headerTitle: {
            color: "#F2F0ED",
          },
          headerSubtitle: {
            color: "#8A8A9A",
          },
          formButtonPrimary: {
            background: "linear-gradient(135deg, #FF6B35, #FF3F6C)",
            border: "none",
            color: "#FFFFFF",
            fontWeight: "600",
            transition: "opacity 0.2s ease, transform 0.15s ease",
          },
          formButtonPrimary__loading: {
            opacity: "0.85",
          },
          formFieldInput: {
            backgroundColor: "rgba(255, 255, 255, 0.06)",
            border: "1px solid rgba(255, 255, 255, 0.08)",
            color: "#F2F0ED",
            borderRadius: "12px",
          },
          formFieldLabel: {
            color: "#8A8A9A",
          },
          footerActionLink: {
            color: "#FF6B35",
          },
          identityPreviewEditButton: {
            color: "#FF6B35",
          },
          socialButtonsBlockButton: {
            backgroundColor: "rgba(255, 255, 255, 0.06)",
            border: "1px solid rgba(255, 255, 255, 0.08)",
            color: "#F2F0ED",
            transition: "background-color 0.2s ease",
          },
          dividerLine: {
            backgroundColor: "rgba(255, 255, 255, 0.08)",
          },
          dividerText: {
            color: "#5A5A6A",
          },
          formFieldInputShowPasswordButton: {
            color: "#8A8A9A",
          },
          otpCodeFieldInput: {
            backgroundColor: "rgba(255, 255, 255, 0.06)",
            border: "1px solid rgba(255, 255, 255, 0.08)",
            color: "#F2F0ED",
          },
          footer: {
            "& a": {
              color: "#FF6B35",
            },
          },
          internal: {
            color: "#8A8A9A",
          },
          userButtonPopoverCard: {
            backgroundColor: "#1A1A2E",
            border: "1px solid rgba(255, 255, 255, 0.08)",
          },
          userButtonPopoverActionButton: {
            color: "#F2F0ED",
          },
          userButtonPopoverFooter: {
            borderTop: "1px solid rgba(255, 255, 255, 0.08)",
          },
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
