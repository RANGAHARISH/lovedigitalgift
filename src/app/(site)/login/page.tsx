import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { AuthForm } from "@/components/auth/auth-form";
import { AuthShell, AuthSuspense } from "@/components/auth/auth-shell";
import { getCurrentUser } from "@/lib/auth";

export const metadata: Metadata = {
  title: "Sign in",
  description: "Sign in to your LoveDigitalGift dashboard to edit and share your digital gifts.",
};

export default async function LoginPage() {
  const user = await getCurrentUser();
  if (user) redirect("/dashboard");

  return (
    <AuthShell
      eyebrow="welcome back"
      title="Sign in to your gifts"
      subtitle="Pick up where you left off, copy a link, or send a QR code to someone you love."
    >
      <AuthSuspense>
        <AuthForm mode="login" />
      </AuthSuspense>
    </AuthShell>
  );
}
