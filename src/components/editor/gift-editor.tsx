"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  ArrowLeft,
  Check,
  ChevronDown,
  Cloud,
  CloudOff,
  Eye,
  Loader2,
  Pencil,
  Send,
  Share2,
  Sparkles,
} from "lucide-react";
import type { FieldDef, TemplateRenderProps } from "@/templates/types";
import type { GiftMusic, QrSettings } from "@/lib/gifts";
import type { QrStyle } from "@/lib/qr";
import { getTemplate } from "@/templates/registry";
import { ShareModal } from "@/components/share/share-modal";
import { FieldInput } from "./field-inputs";
import { MusicPicker } from "./music-picker";
import { cn } from "@/lib/utils";

export type EditorGift = {
  id: string;
  title: string;
  recipient_name: string | null;
  content: Record<string, unknown>;
  music: GiftMusic | null;
  theme_color: string | null;
  qr_settings: QrSettings | null;
  status: "draft" | "published";
};

type SaveState = "idle" | "saving" | "saved" | "error";

const ACCENTS = ["#D7263D", "#A4122A", "#FFA6B5", "#A4122A", "#FF8FA3", "#FFC9D3", "#C33B52", "#8C0F22", "#2B1A20"];

export function GiftEditor({
  slug,
  templateName,
  accent,
  fields,
  defaultContent,
  initialGift,
}: {
  slug: string;
  templateName: string;
  accent: string;
  fields: FieldDef[];
  defaultContent: Record<string, unknown>;
  initialGift: EditorGift | null;
}) {
  const [giftId, setGiftId] = useState<string | null>(initialGift?.id ?? null);
  const [title, setTitle] = useState(initialGift?.title ?? `${templateName} gift`);
  const [recipient, setRecipient] = useState(initialGift?.recipient_name ?? "");
  const [content, setContent] = useState<Record<string, unknown>>({
    ...defaultContent,
    ...(initialGift?.content ?? {}),
  });
  const [music, setMusic] = useState<GiftMusic | null>(initialGift?.music ?? null);
  const [themeColor, setThemeColor] = useState(initialGift?.theme_color ?? accent);
  const [status, setStatus] = useState<"draft" | "published">(initialGift?.status ?? "draft");
  const [qrSettings, setQrSettings] = useState<QrStyle | null>(initialGift?.qr_settings ?? null);

  const [dirty, setDirty] = useState(false);
  const [saveState, setSaveState] = useState<SaveState>("idle");
  const [shareOpen, setShareOpen] = useState(false);
  const [tab, setTab] = useState<"edit" | "preview">("edit");
  const [error, setError] = useState<string | null>(null);

  const giftIdRef = useRef<string | null>(initialGift?.id ?? null);
  const creatingRef = useRef<Promise<string> | null>(null);
  const pendingRef = useRef<Promise<boolean> | null>(null);

  const template = useMemo(() => getTemplate(slug), [slug]);
  const PreviewComponent = template?.Component;

  const textFields = fields.filter(
    (field) => field.type === "text" || field.type === "textarea" || field.type === "date",
  );
  const listFields = fields.filter((field) => field.type === "list");
  const imageFields = fields.filter((field) => field.type === "images");

  const ensureGift = useCallback(async (): Promise<string> => {
    if (giftIdRef.current) return giftIdRef.current;
    if (creatingRef.current) return creatingRef.current;

    creatingRef.current = (async () => {
      const response = await fetch("/api/gifts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          templateSlug: slug,
          title: title.trim() || `${templateName} gift`,
          recipientName: recipient.trim() || null,
        }),
      });
      const data = (await response.json().catch(() => null)) as { gift?: { id: string }; error?: string } | null;
      if (!response.ok || !data?.gift?.id) {
        throw new Error(data?.error ?? "Could not start this gift");
      }
      giftIdRef.current = data.gift.id;
      setGiftId(data.gift.id);
      return data.gift.id;
    })();

    try {
      return await creatingRef.current;
    } finally {
      creatingRef.current = null;
    }
  }, [slug, title, recipient, templateName]);

  const save = useCallback(
    async (patch: Record<string, unknown> = {}, silent = false): Promise<boolean> => {
      const previous = pendingRef.current;
      const run = (async () => {
        if (previous) await previous;
        if (!silent) setSaveState("saving");
        try {
          const id = await ensureGift();
          const response = await fetch(`/api/gifts/${id}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              title: title.trim() || `${templateName} gift`,
              recipient_name: recipient.trim() || null,
              content,
              music,
              theme_color: themeColor,
              ...patch,
            }),
          });
          if (!response.ok) throw new Error("save failed");
          setDirty(false);
          setSaveState("saved");
          setTimeout(() => setSaveState((state) => (state === "saved" ? "idle" : state)), 2500);
          return true;
        } catch {
          setSaveState("error");
          setError("We could not save your gift. Check your connection and try again.");
          return false;
        }
      })();

      pendingRef.current = run;
      return run;
    },
    [content, ensureGift, music, recipient, templateName, themeColor, title],
  );

  // Autosave a couple of seconds after the last edit.
  useEffect(() => {
    if (!dirty) return;
    const timer = setTimeout(() => {
      void save();
    }, 2200);
    return () => clearTimeout(timer);
  }, [dirty, save]);

  const updateField = (key: string, value: unknown) => {
    setContent((current) => ({ ...current, [key]: value }));
    setDirty(true);
    setError(null);
  };

  async function publish() {
    setError(null);
    if (!title.trim()) {
      setError("Give your gift a title before publishing — it is what you will see in your dashboard.");
      return;
    }
    const ok = await save({ status: "published" });
    if (ok) {
      setStatus("published");
      setShareOpen(true);
    }
  }

  const saveQr = useCallback(async (style: QrStyle) => {
    setQrSettings(style);
    const id = giftIdRef.current;
    if (!id) return;
    await fetch(`/api/gifts/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ qr_settings: style }),
    });
  }, []);

  const previewContent: TemplateRenderProps["content"] = content;

  const saveLabel =
    saveState === "saving"
      ? "Saving…"
      : saveState === "saved"
        ? "Saved"
        : saveState === "error"
          ? "Not saved"
          : dirty
            ? "Unsaved changes"
            : "All changes saved";

  return (
    <div className="bg-[#FFF8FA]">
      <div className="sticky top-16 z-30 border-b border-brand/10 bg-white/90 backdrop-blur">
        <div className="container-page flex flex-wrap items-center gap-3 py-3">
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-1.5 text-xs font-medium text-muted transition hover:text-brand-dark"
          >
            <ArrowLeft className="h-3.5 w-3.5" /> Dashboard
          </Link>
          <span
            className={cn(
              "rounded-full px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.12em]",
              status === "published" ? "bg-emerald-50 text-emerald-700" : "bg-brand-soft text-brand-dark",
            )}
          >
            {status === "published" ? "Published" : "Draft"}
          </span>

          <span className="hidden items-center gap-1.5 text-[11px] text-muted sm:flex">
            {saveState === "saving" ? <Loader2 className="h-3 w-3 animate-spin" /> : null}
            {saveState === "saved" ? <Check className="h-3 w-3 text-emerald-600" /> : null}
            {saveState === "error" ? <CloudOff className="h-3 w-3 text-red-500" /> : null}
            {saveState === "idle" ? <Cloud className="h-3 w-3" /> : null}
            {saveLabel}
          </span>

          <div className="ml-auto flex items-center gap-2">
            <button
              type="button"
              onClick={() => void save()}
              disabled={saveState === "saving"}
              className="btn-secondary !px-4 !py-2 text-xs"
            >
              Save draft
            </button>
            {status === "published" ? (
              <button type="button" onClick={() => setShareOpen(true)} className="btn-primary !px-4 !py-2 text-xs">
                <Share2 className="h-3.5 w-3.5" /> Share
              </button>
            ) : (
              <button type="button" onClick={publish} className="btn-primary !px-4 !py-2 text-xs">
                <Send className="h-3.5 w-3.5" /> Publish
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="container-page py-6 lg:py-10">
        {error ? (
          <p role="alert" className="mb-5 rounded-2xl bg-red-50 px-4 py-3 text-sm text-red-600">
            {error}
          </p>
        ) : null}

        {status === "published" ? (
          <div className="mb-5 flex flex-wrap items-center gap-3 rounded-2xl border border-emerald-200 bg-emerald-50/70 px-4 py-3 text-xs text-emerald-800">
            <Sparkles className="h-4 w-4" />
            <span>Your gift is live at /g/{giftId}. Changes you save appear immediately.</span>
            <button type="button" onClick={() => setShareOpen(true)} className="ml-auto font-semibold underline">
              Share it
            </button>
          </div>
        ) : null}

        <div className="mb-5 flex rounded-full border border-brand/15 bg-white p-1 lg:hidden">
          <button
            type="button"
            onClick={() => setTab("edit")}
            className={cn(
              "flex flex-1 items-center justify-center gap-1.5 rounded-full py-2 text-xs font-semibold transition",
              tab === "edit" ? "bg-brand text-white" : "text-muted",
            )}
          >
            <Pencil className="h-3.5 w-3.5" /> Edit
          </button>
          <button
            type="button"
            onClick={() => setTab("preview")}
            className={cn(
              "flex flex-1 items-center justify-center gap-1.5 rounded-full py-2 text-xs font-semibold transition",
              tab === "preview" ? "bg-brand text-white" : "text-muted",
            )}
          >
            <Eye className="h-3.5 w-3.5" /> Preview
          </button>
        </div>

        <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_368px] lg:gap-8">
          <div className={cn("space-y-5", tab === "preview" && "hidden lg:block")}>
            <section className="card p-5 sm:p-6">
              <h2 className="text-lg">The basics</h2>
              <p className="mt-1 text-xs text-muted">
                The title is just for your dashboard. The recipient name is used on the gift&apos;s opening screen.
              </p>
              <div className="mt-4 space-y-4">
                <label className="block">
                  <span className="field-label">
                    <span>Gift title</span>
                    <span className="text-[11px] font-normal text-muted">{title.length}/120</span>
                  </span>
                  <input
                    className="field-input"
                    value={title}
                    maxLength={120}
                    onChange={(event) => {
                      setTitle(event.target.value);
                      setDirty(true);
                    }}
                    placeholder="Sophie's 27th"
                  />
                </label>
                <label className="block">
                  <span className="field-label">Recipient name</span>
                  <input
                    className="field-input"
                    value={recipient}
                    maxLength={120}
                    onChange={(event) => {
                      setRecipient(event.target.value);
                      setDirty(true);
                    }}
                    placeholder="Sophie"
                  />
                </label>
              </div>
            </section>

            {textFields.length > 0 ? (
              <section className="card p-5 sm:p-6">
                <h2 className="text-lg">Your words</h2>
                <div className="mt-4 space-y-5">
                  {textFields.map((field) => (
                    <FieldInput
                      key={field.key}
                      field={field}
                      value={content[field.key]}
                      onChange={(value) => updateField(field.key, value)}
                    />
                  ))}
                </div>
              </section>
            ) : null}

            {listFields.length > 0 ? (
              <section className="card p-5 sm:p-6">
                <h2 className="text-lg">Little lists</h2>
                <p className="mt-1 text-xs text-muted">Each item becomes its own card or timeline moment.</p>
                <div className="mt-4 space-y-5">
                  {listFields.map((field) => (
                    <FieldInput
                      key={field.key}
                      field={field}
                      value={content[field.key]}
                      onChange={(value) => updateField(field.key, value)}
                    />
                  ))}
                </div>
              </section>
            ) : null}

            {imageFields.length > 0 ? (
              <section className="card p-5 sm:p-6">
                <h2 className="text-lg">Photos</h2>
                <div className="mt-4 space-y-5">
                  {imageFields.map((field) => (
                    <FieldInput
                      key={field.key}
                      field={field}
                      value={content[field.key]}
                      onChange={(value) => updateField(field.key, value)}
                    />
                  ))}
                </div>
              </section>
            ) : null}

            <section className="card p-5 sm:p-6">
              <h2 className="text-lg">Background music</h2>
              <p className="mt-1 text-xs text-muted">
                Music starts after your recipient taps to open the gift (browsers require that first tap).
              </p>
              <div className="mt-4">
                <MusicPicker value={music} onChange={(next) => setMusic(next)} />
              </div>
            </section>

            <section className="card p-5 sm:p-6">
              <h2 className="text-lg">Accent colour</h2>
              <p className="mt-1 text-xs text-muted">This tints the buttons, hearts and highlights inside the gift.</p>
              <div className="mt-4 flex flex-wrap items-center gap-2">
                {ACCENTS.map((colour) => (
                  <button
                    key={colour}
                    type="button"
                    onClick={() => {
                      setThemeColor(colour);
                      setDirty(true);
                    }}
                    className={cn(
                      "h-8 w-8 rounded-full border-2 transition",
                      themeColor.toLowerCase() === colour.toLowerCase() ? "border-ink" : "border-white shadow-sm",
                    )}
                    style={{ backgroundColor: colour }}
                    aria-label={`Use ${colour}`}
                  />
                ))}
                <input
                  type="color"
                  value={themeColor}
                  onChange={(event) => {
                    setThemeColor(event.target.value);
                    setDirty(true);
                  }}
                  className="h-9 w-11 cursor-pointer rounded-xl border border-brand/20 bg-white p-1"
                  aria-label="Custom accent colour"
                />
              </div>
            </section>

            <section className="flex flex-col items-center gap-2 rounded-3xl border border-dashed border-brand/30 bg-white/60 p-6 text-center">
              <p className="text-sm font-semibold">Happy with it?</p>
              <p className="max-w-sm text-xs text-muted">
                Publishing gives you a permanent link plus a QR code you can print, text or tuck into a card.
              </p>
              <div className="mt-1 flex flex-wrap justify-center gap-2">
                <button type="button" onClick={publish} className="btn-primary !px-5 !py-2.5 text-xs">
                  {status === "published" ? "Save changes" : "Publish my gift"}
                </button>
                {status === "published" ? (
                  <button type="button" onClick={() => setShareOpen(true)} className="btn-secondary !px-5 !py-2.5 text-xs">
                    Share again
                  </button>
                ) : null}
              </div>
            </section>
          </div>

          <aside className={cn(tab === "edit" && "hidden lg:block")}>
            <div className="lg:sticky lg:top-36">
              <div className="mb-2 flex items-center justify-between">
                <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-muted">Live preview</p>
                <span className="text-[10px] text-muted">{templateName}</span>
              </div>
              <div className="relative mx-auto w-full max-w-[330px]">
                <div className="absolute -inset-4 -z-10 rounded-full bg-gradient-to-br from-[#FFD1DA] to-[#FFDDE4] opacity-40 blur-2xl" />
                <div className="rounded-[2.4rem] border-[8px] border-[#2B1A20] bg-[#2B1A20] shadow-[0_20px_60px_rgba(58,13,22,0.22)]">
                  <div className="preview-scope story no-scrollbar relative h-[560px] overflow-y-auto overscroll-contain rounded-[1.8rem] bg-white">
                    {PreviewComponent ? (
                      <PreviewComponent content={previewContent} accent={themeColor} preview />
                    ) : null}
                  </div>
                </div>
              </div>
              <p className="mt-3 text-center text-[10px] text-muted">
                Preview updates instantly. Scroll inside the phone to see every section.
              </p>
            </div>
          </aside>
        </div>
      </div>

      {giftId ? (
        <ShareModal
          open={shareOpen}
          onClose={() => setShareOpen(false)}
          giftId={giftId}
          initialQr={qrSettings}
          title={title}
          onSaveQr={saveQr}
        />
      ) : null}

      <div className="lg:hidden">
        <button
          type="button"
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          className="fixed bottom-5 right-5 z-40 flex h-11 w-11 items-center justify-center rounded-full bg-white text-brand shadow-soft"
          aria-label="Back to top"
        >
          <ChevronDown className="h-5 w-5 rotate-180" />
        </button>
      </div>
    </div>
  );
}
