import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { deleteGift, updateGift } from "@/lib/gifts";
import { updateGiftSchema } from "@/lib/validation";

export const runtime = "nodejs";

type Context = { params: Promise<{ id: string }> };

export async function PATCH(request: Request, { params }: Context) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Unauthorised" }, { status: 401 });

  const { id } = await params;
  const parsed = updateGiftSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? "Invalid gift data." },
      { status: 400 },
    );
  }

  const gift = updateGift(id, user.id, parsed.data);
  if (!gift) return NextResponse.json({ error: "Gift not found." }, { status: 404 });
  return NextResponse.json({ gift });
}

export async function DELETE(_request: Request, { params }: Context) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Unauthorised" }, { status: 401 });

  const { id } = await params;
  const deleted = deleteGift(id, user.id);
  if (!deleted) return NextResponse.json({ error: "Gift not found." }, { status: 404 });
  return NextResponse.json({ ok: true });
}
