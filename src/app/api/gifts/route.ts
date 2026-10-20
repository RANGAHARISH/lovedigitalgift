import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { createGift, listGifts } from "@/lib/gifts";
import { getTemplate } from "@/templates/registry";
import { createGiftSchema } from "@/lib/validation";

export const runtime = "nodejs";

export async function GET() {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Unauthorised" }, { status: 401 });
  return NextResponse.json({ gifts: listGifts(user.id) });
}

export async function POST(request: Request) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Please sign in to create a gift." }, { status: 401 });

  const parsed = createGiftSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid gift details." }, { status: 400 });
  }

  const template = getTemplate(parsed.data.templateSlug);
  if (!template) return NextResponse.json({ error: "Unknown template." }, { status: 404 });

  const gift = createGift({
    userId: user.id,
    templateSlug: template.slug,
    title: parsed.data.title,
    recipientName: parsed.data.recipientName ?? null,
  });

  return NextResponse.json({ gift });
}
