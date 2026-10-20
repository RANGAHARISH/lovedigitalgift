"use client";

import { useEffect, useRef, useState } from "react";
import { Loader2, Pause, Play, Trash2, UploadCloud } from "lucide-react";
import { MUSIC_LIBRARY } from "@/lib/config";
import type { GiftMusic } from "@/lib/gifts";
import { cn } from "@/lib/utils";

export function MusicPicker({
  value,
  onChange,
}: {
  value: GiftMusic | null;
  onChange: (music: GiftMusic | null) => void;
}) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [playing, setPlaying] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    return () => {
      audioRef.current?.pause();
    };
  }, []);

  function toggle(url: string, name: string, type: "library" | "upload" = "library") {
    if (!audioRef.current) audioRef.current = new Audio();
    const audio = audioRef.current;
    if (playing === url) {
      audio.pause();
      setPlaying(null);
      return;
    }
    audio.src = url;
    audio.loop = true;
    void audio
      .play()
      .then(() => setPlaying(url))
      .catch(() => setError("This browser would not play the preview. You can still save the track."));
    onChange({ type, url, name });
  }

  async function upload(file: File) {
    setUploading(true);
    setError(null);
    try {
      const form = new FormData();
      form.append("file", file, file.name);
      const response = await fetch("/api/upload", { method: "POST", body: form });
      const data = (await response.json().catch(() => null)) as { url?: string; error?: string } | null;
      if (!response.ok || !data?.url) {
        setError(data?.error ?? "That audio file could not be uploaded.");
        return;
      }
      onChange({ type: "upload", url: data.url, name: file.name.replace(/\.[^.]+$/, "") });
    } catch {
      setError("The upload failed. Please try again.");
    } finally {
      setUploading(false);
    }
  }

  return (
    <div>
      <div className="grid gap-2 sm:grid-cols-2">
        {MUSIC_LIBRARY.map((track) => {
          const selected = value?.url === track.url;
          const isPlaying = playing === track.url;
          return (
            <div
              key={track.id}
              className={cn(
                "flex items-center gap-2 rounded-2xl border px-3 py-2 transition",
                selected ? "border-brand bg-brand-soft/40" : "border-brand/10 bg-white hover:border-brand/30",
              )}
            >
              <button
                type="button"
                onClick={() => toggle(track.url, track.name)}
                className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white text-brand shadow-sm"
                aria-label={isPlaying ? `Pause ${track.name}` : `Preview ${track.name}`}
              >
                {isPlaying ? <Pause className="h-3.5 w-3.5" /> : <Play className="h-3.5 w-3.5" />}
              </button>
              <button type="button" onClick={() => toggle(track.url, track.name)} className="min-w-0 flex-1 text-left">
                <p className="truncate text-xs font-semibold text-ink">{track.name}</p>
                <p className="text-[10px] text-muted">{track.mood}</p>
              </button>
              {selected ? <span className="text-[10px] font-semibold text-brand-dark">✓</span> : null}
            </div>
          );
        })}
      </div>

      <div className="mt-3 flex flex-wrap items-center gap-2">
        <input
          ref={inputRef}
          type="file"
          accept="audio/mpeg,audio/mp4,audio/wav,audio/ogg,audio/webm,.mp3,.m4a,.wav,.ogg"
          className="hidden"
          onChange={(event) => {
            const file = event.target.files?.[0];
            event.target.value = "";
            if (file) void upload(file);
          }}
        />
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={uploading}
          className="btn-secondary !px-4 !py-2 text-xs"
        >
          {uploading ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <UploadCloud className="h-3.5 w-3.5" />}
          Upload your own MP3
        </button>
        {value ? (
          <button
            type="button"
            onClick={() => {
              audioRef.current?.pause();
              setPlaying(null);
              onChange(null);
            }}
            className="inline-flex items-center gap-1.5 rounded-full px-3 py-2 text-xs font-medium text-muted transition hover:bg-red-50 hover:text-red-600"
          >
            <Trash2 className="h-3.5 w-3.5" /> Remove music
          </button>
        ) : null}
      </div>

      {value ? (
        <p className="mt-2 text-[11px] text-muted">
          Selected: <span className="font-medium text-ink">{value.name}</span>
          {value.type === "upload" ? " (your upload)" : " (library track)"}
        </p>
      ) : (
        <p className="mt-2 text-[11px] text-muted">No music yet — gifts play music after the first tap.</p>
      )}

      {error ? <p className="mt-2 text-xs text-red-600">{error}</p> : null}
    </div>
  );
}
