import { NextResponse } from "next/server";
import { getPublicGift, incrementViews } from "@/lib/gifts";

export const runtime = "nodejs";

export async function POST(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const gift = getPublicGift(id);
  if (!gift) return NextResponse.json({ ok: false }, { status: 404 });
  incrementViews(id);
  return NextResponse.json({ ok: true, views: gift.views + 1 });
}
