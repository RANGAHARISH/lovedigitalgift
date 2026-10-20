import "server-only";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { createHmac, randomBytes, scryptSync, timingSafeEqual } from "node:crypto";
import { nanoid } from "nanoid";
import { getDb, type UserRow } from "./db";
import { sanitizeNextPath } from "./utils";

const COOKIE_NAME = "ldg_session";
const SESSION_TTL_SECONDS = 60 * 60 * 24 * 30;

export type SessionUser = {
  id: string;
  email: string;
  name: string | null;
};

function secret() {
  return process.env.SESSION_SECRET || "ldg-dev-secret-change-me";
}

function sign(value: string) {
  return createHmac("sha256", secret()).update(value).digest("base64url");
}

export function hashPassword(password: string) {
  const salt = randomBytes(16).toString("hex");
  const hash = scryptSync(password, salt, 64).toString("hex");
  return `${salt}:${hash}`;
}

export function verifyPassword(password: string, stored: string) {
  const [salt, hash] = stored.split(":");
  if (!salt || !hash) return false;
  const expected = Buffer.from(hash, "hex");
  const candidate = scryptSync(password, salt, 64);
  return expected.length === candidate.length && timingSafeEqual(expected, candidate);
}

export function createSessionToken(userId: string) {
  const payload = Buffer.from(
    JSON.stringify({ sub: userId, exp: Date.now() + SESSION_TTL_SECONDS * 1000 }),
  ).toString("base64url");
  return `${payload}.${sign(payload)}`;
}

export function verifySessionToken(token: string | undefined | null): string | null {
  if (!token) return null;
  const [payload, signature] = token.split(".");
  if (!payload || !signature) return null;
  const expected = sign(payload);
  const a = Buffer.from(signature);
  const b = Buffer.from(expected);
  if (a.length !== b.length || !timingSafeEqual(a, b)) return null;
  try {
    const parsed = JSON.parse(Buffer.from(payload, "base64url").toString()) as {
      sub?: string;
      exp?: number;
    };
    if (!parsed.sub || !parsed.exp || parsed.exp < Date.now()) return null;
    return parsed.sub;
  } catch {
    return null;
  }
}

export function sessionCookie(token: string) {
  return {
    name: COOKIE_NAME,
    value: token,
    httpOnly: true,
    sameSite: "lax" as const,
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: SESSION_TTL_SECONDS,
  };
}

export const SESSION_COOKIE_NAME = COOKIE_NAME;

export async function getCurrentUser(): Promise<SessionUser | null> {
  const jar = await cookies();
  const userId = verifySessionToken(jar.get(COOKIE_NAME)?.value);
  if (!userId) return null;
  const row = getDb()
    .prepare("SELECT id, email, name FROM users WHERE id = ?")
    .get(userId) as Pick<UserRow, "id" | "email" | "name"> | undefined;
  if (!row) return null;
  return { id: row.id, email: row.email, name: row.name };
}

export async function requireUser(nextPath = "/dashboard"): Promise<SessionUser> {
  const user = await getCurrentUser();
  if (!user) redirect(`/login?next=${encodeURIComponent(sanitizeNextPath(nextPath))}`);
  return user;
}

export function findUserByEmail(email: string) {
  return getDb()
    .prepare("SELECT * FROM users WHERE lower(email) = lower(?)")
    .get(email.trim()) as UserRow | undefined;
}

export function createUser(email: string, password: string, name?: string | null) {
  const id = nanoid(12);
  getDb()
    .prepare("INSERT INTO users (id, email, password_hash, name) VALUES (?, ?, ?, ?)")
    .run(id, email.trim().toLowerCase(), hashPassword(password), name?.trim() || null);
  return { id, email: email.trim().toLowerCase(), name: name?.trim() || null };
}
