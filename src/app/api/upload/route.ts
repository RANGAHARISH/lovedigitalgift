import { randomUUID } from "node:crypto";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { dataDir } from "@/lib/db";

export const runtime = "nodejs";

const IMAGE_TYPES: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
  "image/gif": "gif",
};

const AUDIO_TYPES: Record<string, string> = {
  "audio/mpeg": "mp3",
  "audio/mp3": "mp3",
  "audio/wav": "wav",
  "audio/x-wav": "wav",
  "audio/mp4": "m4a",
  "audio/x-m4a": "m4a",
  "audio/ogg": "ogg",
  "audio/webm": "webm",
};

export async function POST(request: Request) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Please sign in first." }, { status: 401 });

  const form = await request.formData().catch(() => null);
  const file = form?.get("file");
  if (!(file instanceof File)) {
    return NextResponse.json({ error: "No file received." }, { status: 400 });
  }

  const isImage = file.type in IMAGE_TYPES;
  const isAudio = file.type in AUDIO_TYPES;
  if (!isImage && !isAudio) {
    return NextResponse.json({ error: "Only JPG, PNG, WEBP, GIF, MP3, M4A, OGG or WAV files are supported." }, { status: 415 });
  }

  const maxBytes = isImage ? 8 * 1024 * 1024 : 12 * 1024 * 1024;
  if (file.size > maxBytes) {
    return NextResponse.json(
      { error: `That file is too large — the limit is ${Math.round(maxBytes / 1024 / 1024)} MB.` },
      { status: 413 },
    );
  }

  const extension = (isImage ? IMAGE_TYPES : AUDIO_TYPES)[file.type];
  const filename = `${user.id.slice(0, 8)}-${randomUUID()}.${extension}`;
  const uploadDir = path.join(dataDir(), "uploads");
  await mkdir(uploadDir, { recursive: true });
  await writeFile(path.join(uploadDir, filename), Buffer.from(await file.arrayBuffer()));

  return NextResponse.json({
    url: `/api/media/${filename}`,
    type: isImage ? "image" : "audio",
    name: file.name,
    size: file.size,
  });
}
