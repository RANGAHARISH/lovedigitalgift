import { readFile } from "node:fs/promises";
import path from "node:path";
import { NextResponse } from "next/server";
import { dataDir } from "@/lib/db";

export const runtime = "nodejs";

const SAFE_NAME = /^[a-zA-Z0-9_-]+\.(jpg|jpeg|png|webp|gif|mp3|m4a|wav|ogg|webm)$/i;

const CONTENT_TYPES: Record<string, string> = {
  jpg: "image/jpeg",
  jpeg: "image/jpeg",
  png: "image/png",
  webp: "image/webp",
  gif: "image/gif",
  mp3: "audio/mpeg",
  m4a: "audio/mp4",
  wav: "audio/wav",
  ogg: "audio/ogg",
  webm: "audio/webm",
};

export async function GET(_request: Request, { params }: { params: Promise<{ name: string }> }) {
  const { name } = await params;
  if (!SAFE_NAME.test(name)) {
    return new NextResponse("Not found", { status: 404 });
  }

  try {
    const file = await readFile(path.join(dataDir(), "uploads", name));
    const extension = name.split(".").pop()?.toLowerCase() ?? "";
    return new NextResponse(new Uint8Array(file), {
      headers: {
        "Content-Type": CONTENT_TYPES[extension] ?? "application/octet-stream",
        "Cache-Control": "public, max-age=31536000, immutable",
      },
    });
  } catch {
    return new NextResponse("Not found", { status: 404 });
  }
}
