import { NextResponse } from "next/server";
import { createSessionToken, findUserByEmail, sessionCookie, verifyPassword } from "@/lib/auth";
import { loginSchema } from "@/lib/validation";

export const runtime = "nodejs";

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const parsed = loginSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Enter a valid email and password." }, { status: 400 });
  }

  const user = findUserByEmail(parsed.data.email);
  if (!user || !verifyPassword(parsed.data.password, user.password_hash)) {
    return NextResponse.json({ error: "That email and password don't match an account." }, { status: 401 });
  }

  const response = NextResponse.json({ ok: true, user: { id: user.id, email: user.email, name: user.name } });
  response.cookies.set(sessionCookie(createSessionToken(user.id)));
  return response;
}
