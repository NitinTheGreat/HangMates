import { SignIn } from "@clerk/nextjs";

export default function SignInPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-bg-base px-4">
      <SignIn
        appearance={{
          variables: {
            colorPrimary: "#FF6B35",
            colorBackground: "#0F0F1A",
            colorText: "#F2F0ED",
            colorInputBackground: "rgba(255, 255, 255, 0.06)",
            colorInputText: "#F2F0ED",
          },
          elements: {
            card: "bg-bg-base border border-glass-border shadow-2xl",
            headerTitle: "text-text-primary",
            headerSubtitle: "text-text-secondary",
            formButtonPrimary:
              "gradient-button border-0 hover:opacity-90 transition-opacity",
            footerActionLink: "text-primary hover:text-primary-hover",
            formFieldInput:
              "bg-bg-surface border-glass-border text-text-primary",
            formFieldLabel: "text-text-secondary",
            identityPreviewEditButton: "text-primary",
            socialButtonsBlockButton:
              "bg-bg-surface border-glass-border text-text-primary hover:bg-bg-surface-hover",
          },
        }}
      />
    </div>
  );
}
