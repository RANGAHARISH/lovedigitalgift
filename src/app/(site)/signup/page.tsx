import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { AuthForm } from "@/components/auth/auth-form";
import { AuthShell, AuthSuspense } from "@/components/auth/auth-shell";
import { getCurrentUser } from "@/lib/auth";

export const metadata: Metadata = {
  title: "Create your account",
  description: "Create a free LoveDigitalGift account and start building an interactive digital gift.",
};

export default async function SignupPage() {
  const user = await getCurrentUser();
  if (user) redirect("/dashboard");

  return (
    <AuthShell
      eyebrow="it's free"
      title="Create your first gift"
      subtitle="No design skills needed. Pick a template, add your photos and music, and send something unforgettable."
    >
      <AuthSuspense>
        <AuthForm mode="signup" />
      </AuthSuspense>
    </AuthShell>
  );
}
