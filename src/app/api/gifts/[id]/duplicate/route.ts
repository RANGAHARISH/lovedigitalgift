import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { duplicateGift } from "@/lib/gifts";

export const runtime = "nodejs";

export async function POST(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Unauthorised" }, { status: 401 });

  const { id } = await params;
  const gift = duplicateGift(id, user.id);
  if (!gift) return NextResponse.json({ error: "Gift not found." }, { status: 404 });
  return NextResponse.json({ gift });
}
