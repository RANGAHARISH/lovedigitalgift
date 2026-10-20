"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { Loader2 } from "lucide-react";
import { sanitizeNextPath } from "@/lib/utils";

type Mode = "login" | "signup";

export function AuthForm({ mode }: { mode: Mode }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const next = sanitizeNextPath(searchParams.get("next"));

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const response = await fetch(`/api/auth/${mode}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(
          mode === "signup" ? { name, email, password } : { email, password },
        ),
      });
      const data = (await response.json().catch(() => null)) as { error?: string } | null;
      if (!response.ok) {
        setError(data?.error ?? "Something went wrong. Please try again.");
        setLoading(false);
        return;
      }
      router.push(next);
      router.refresh();
    } catch {
      setError("Could not reach the server. Please try again.");
      setLoading(false);
    }
  }

  const isSignup = mode === "signup";

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      {isSignup ? (
        <label className="block">
          <span className="field-label">Your name</span>
          <input
            type="text"
            value={name}
            onChange={(event) => setName(event.target.value)}
            className="field-input"
            placeholder="Alex"
            autoComplete="name"
            maxLength={80}
          />
        </label>
      ) : null}

      <label className="block">
        <span className="field-label">Email</span>
        <input
          type="email"
          required
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          className="field-input"
          placeholder="you@example.com"
          autoComplete="email"
        />
      </label>

      <label className="block">
        <span className="field-label">
          Password
          {isSignup ? <span className="text-xs font-normal text-muted">8+ characters</span> : null}
        </span>
        <input
          type="password"
          required
          minLength={isSignup ? 8 : 1}
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          className="field-input"
          placeholder="••••••••"
          autoComplete={isSignup ? "new-password" : "current-password"}
        />
      </label>

      {error ? (
        <p role="alert" className="rounded-2xl bg-red-50 px-4 py-3 text-sm text-red-600">
          {error}
        </p>
      ) : null}

      <button type="submit" disabled={loading} className="btn-primary w-full py-3.5">
        {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
        {isSignup ? "Create my free account" : "Sign in"}
      </button>

      <p className="pt-1 text-center text-sm text-muted">
        {isSignup ? "Already have an account?" : "New to LoveDigitalGift?"}{" "}
        <Link
          href={`/${isSignup ? "login" : "signup"}${next !== "/dashboard" ? `?next=${encodeURIComponent(next)}` : ""}`}
          className="font-semibold text-brand-dark hover:underline"
        >
          {isSignup ? "Sign in" : "Create an account"}
        </Link>
      </p>
    </form>
  );
}
