"use client";

import { useEffect, useRef, useState } from "react";
import { ArrowLeft, ArrowRight, ImagePlus, Loader2, Trash2, UploadCloud } from "lucide-react";
import type { PhotoItem } from "@/templates/types";
import { cn } from "@/lib/utils";

async function compressImage(file: File, maxSize = 1600, quality = 0.82): Promise<File> {
  if (!file.type.startsWith("image/") || file.type === "image/gif" || file.type === "image/svg+xml") {
    return file;
  }
  try {
    const bitmap = await createImageBitmap(file);
    const scale = Math.min(1, maxSize / Math.max(bitmap.width, bitmap.height));
    const canvas = document.createElement("canvas");
    canvas.width = Math.max(1, Math.round(bitmap.width * scale));
    canvas.height = Math.max(1, Math.round(bitmap.height * scale));
    const context = canvas.getContext("2d");
    if (!context) return file;
    context.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
    const blob = await new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, "image/jpeg", quality));
    bitmap.close();
    if (!blob || blob.size >= file.size) return file;
    return new File([blob], file.name.replace(/\.[^.]+$/, ".jpg"), { type: "image/jpeg" });
  } catch {
    return file;
  }
}

export function PhotoUploader({
  photos,
  max,
  captions = false,
  onChange,
}: {
  photos: PhotoItem[];
  max: number;
  captions?: boolean;
  onChange: (photos: PhotoItem[]) => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [dragging, setDragging] = useState(false);

  useEffect(() => {
    if (!error) return;
    const timer = setTimeout(() => setError(null), 6000);
    return () => clearTimeout(timer);
  }, [error]);

  async function uploadFiles(files: File[]) {
    const room = Math.max(0, max - photos.length);
    if (room === 0) {
      setError(`You've reached the limit of ${max} photos for this template.`);
      return;
    }
    const selected = files.slice(0, room);
    if (files.length > room) setError(`Only ${room} more photo${room === 1 ? "" : "s"} fit in this template.`);

    setUploading(true);
    const uploaded: PhotoItem[] = [];
    try {
      for (let index = 0; index < selected.length; index += 1) {
        const file = selected[index];
        setProgress(`Uploading ${index + 1} of ${selected.length}…`);
        const prepared = await compressImage(file);
        const form = new FormData();
        form.append("file", prepared, prepared.name);
        const response = await fetch("/api/upload", { method: "POST", body: form });
        const data = (await response.json().catch(() => null)) as { url?: string; error?: string } | null;
        if (!response.ok || !data?.url) {
          setError(data?.error ?? "That upload did not work. Please try another file.");
          continue;
        }
        uploaded.push({ url: data.url });
      }
      if (uploaded.length) onChange([...photos, ...uploaded]);
    } catch {
      setError("The upload failed. Check your connection and try again.");
    } finally {
      setUploading(false);
      setProgress("");
    }
  }

  function move(index: number, direction: -1 | 1) {
    const next = [...photos];
    const target = index + direction;
    if (target < 0 || target >= next.length) return;
    [next[index], next[target]] = [next[target], next[index]];
    onChange(next);
  }

  function updateCaption(index: number, caption: string) {
    const next = photos.map((photo, photoIndex) => (photoIndex === index ? { ...photo, caption } : photo));
    onChange(next);
  }

  return (
    <div>
      <div
        onDragOver={(event) => {
          event.preventDefault();
          setDragging(true);
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={(event) => {
          event.preventDefault();
          setDragging(false);
          const files = Array.from(event.dataTransfer.files).filter((file) => file.type.startsWith("image/"));
          if (files.length) void uploadFiles(files);
        }}
        className={cn(
          "rounded-2xl border-2 border-dashed p-5 text-center transition",
          dragging ? "border-brand bg-brand-soft/40" : "border-brand/20 bg-[#FFF8FA]",
        )}
      >
        <input
          ref={inputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp,image/gif"
          multiple
          className="hidden"
          onChange={(event) => {
            const files = Array.from(event.target.files ?? []);
            event.target.value = "";
            if (files.length) void uploadFiles(files);
          }}
        />
        <div className="flex flex-col items-center gap-2">
          <span className="flex h-11 w-11 items-center justify-center rounded-full bg-white text-brand shadow-sm">
            {uploading ? <Loader2 className="h-5 w-5 animate-spin" /> : <UploadCloud className="h-5 w-5" />}
          </span>
          <p className="text-sm font-medium text-ink">
            {uploading ? progress || "Uploading…" : "Drop photos here, or click to browse"}
          </p>
          <p className="text-[11px] text-muted">
            JPG, PNG or WEBP · up to {max} photos · resized to 1600px before upload
          </p>
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            disabled={uploading}
            className="btn-secondary mt-1 !px-4 !py-2 text-xs"
          >
            <ImagePlus className="h-3.5 w-3.5" /> Choose photos
          </button>
        </div>
      </div>

      {error ? <p className="mt-2 text-xs text-red-600">{error}</p> : null}

      {photos.length > 0 ? (
        <ul className="mt-4 space-y-2.5">
          {photos.map((photo, index) => (
            <li key={`${photo.url}-${index}`} className="flex items-start gap-3 rounded-2xl border border-brand/10 bg-white p-2.5">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={photo.url} alt="" className="h-16 w-16 shrink-0 rounded-xl object-cover" />
              <div className="min-w-0 flex-1">
                {captions ? (
                  <input
                    value={photo.caption ?? ""}
                    onChange={(event) => updateCaption(index, event.target.value)}
                    placeholder="Add a caption (optional)"
                    maxLength={90}
                    className="field-input !rounded-xl !py-1.5 text-xs"
                  />
                ) : (
                  <p className="truncate pt-2 text-xs text-muted">Photo {index + 1}</p>
                )}
                <div className="mt-1.5 flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() => move(index, -1)}
                    disabled={index === 0}
                    className="rounded-lg p-1.5 text-muted transition hover:bg-brand-soft disabled:opacity-30"
                    aria-label="Move photo earlier"
                  >
                    <ArrowLeft className="h-3.5 w-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => move(index, 1)}
                    disabled={index === photos.length - 1}
                    className="rounded-lg p-1.5 text-muted transition hover:bg-brand-soft disabled:opacity-30"
                    aria-label="Move photo later"
                  >
                    <ArrowRight className="h-3.5 w-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => onChange(photos.filter((_, photoIndex) => photoIndex !== index))}
                    className="ml-auto rounded-lg p-1.5 text-muted transition hover:bg-red-50 hover:text-red-600"
                    aria-label="Remove photo"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}
