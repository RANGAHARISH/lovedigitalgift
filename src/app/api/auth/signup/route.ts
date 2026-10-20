import { NextResponse } from "next/server";
import { createSessionToken, createUser, findUserByEmail, sessionCookie } from "@/lib/auth";
import { signupSchema } from "@/lib/validation";

export const runtime = "nodejs";

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const parsed = signupSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? "Please check your details." },
      { status: 400 },
    );
  }

  if (findUserByEmail(parsed.data.email)) {
    return NextResponse.json({ error: "An account with that email already exists." }, { status: 409 });
  }

  const user = createUser(parsed.data.email, parsed.data.password, parsed.data.name);
  const response = NextResponse.json({ ok: true, user: { id: user.id, email: user.email, name: user.name } });
  response.cookies.set(sessionCookie(createSessionToken(user.id)));
  return response;
}
