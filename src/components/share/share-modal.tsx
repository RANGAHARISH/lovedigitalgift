"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  Check,
  Copy,
  Download,
  ExternalLink,
  Heart,
  Loader2,
  Mail,
  MessageCircle,
  Send,
  Share2,
  Square,
  X,
} from "lucide-react";
import type { QrStyle } from "@/lib/qr";
import {
  buildQrSvg,
  contrastRatio,
  DEFAULT_QR_STYLE,
  downloadQrPng,
  downloadQrSvg,
  svgToDataUrl,
} from "@/lib/qr";
import { cn } from "@/lib/utils";

// Every preset keeps at least a ~4.5:1 contrast ratio against white so phones
// can reliably decode it. Use the custom picker for anything else.
const FG_PRESETS = ["#A4122A", "#C9184A", "#9D174D", "#7C2D5A", "#2B1A20", "#7A0C1B", "#4A2B33", "#6B1A24"];
const BG_PRESETS = ["#FFFFFF", "#FFF6F7", "#FFF9F7", "#FFF0F3", "#FFF3F5", "#2B1A20"];

export type ShareModalProps = {
  open: boolean;
  onClose: () => void;
  giftId: string;
  initialQr?: QrStyle | null;
  title?: string;
  onSaveQr?: (style: QrStyle) => void;
};

export function ShareModal({ open, onClose, giftId, initialQr, title, onSaveQr }: ShareModalProps) {
  const [origin, setOrigin] = useState("");
  const [settings, setSettings] = useState<QrStyle>(initialQr ?? DEFAULT_QR_STYLE);
  const [copied, setCopied] = useState(false);
  const [saved, setSaved] = useState(false);
  const [downloading, setDownloading] = useState<"png" | "svg" | null>(null);
  const [error, setError] = useState<string | null>(null);
  const initialRef = useRef<QrStyle>(initialQr ?? DEFAULT_QR_STYLE);

  useEffect(() => {
    if (open) setSettings(initialRef.current);
  }, [open]);

  useEffect(() => {
    setOrigin(window.location.origin);
  }, []);

  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = previous;
    };
  }, [open, onClose]);

  // Persist QR settings shortly after the user stops fiddling.
  useEffect(() => {
    if (!open || !onSaveQr) return;
    if (JSON.stringify(settings) === JSON.stringify(initialRef.current)) return;
    const timer = setTimeout(() => {
      onSaveQr(settings);
      setSaved(true);
      setTimeout(() => setSaved(false), 1600);
    }, 650);
    return () => clearTimeout(timer);
  }, [settings, open, onSaveQr]);

  const publicUrl = `${origin || ""}/g/${giftId}`;
  const qr = useMemo(() => buildQrSvg(publicUrl, settings, 720), [publicUrl, settings]);
  const qrPreview = useMemo(() => svgToDataUrl(qr.svg), [qr.svg]);
  const contrast = contrastRatio(settings.fg, settings.bg);
  const lowContrast = contrast < 4.5;

  const shareText = `I made you a little something 💝${title ? ` (${title})` : ""}`;

  async function copyLink() {
    try {
      await navigator.clipboard.writeText(publicUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      setError("Your browser blocked the clipboard — select the link and copy it manually.");
    }
  }

  async function nativeShare() {
    if (!navigator.share) return;
    try {
      await navigator.share({ title: title ?? "A digital gift", text: shareText, url: publicUrl });
    } catch {
      /* user dismissed */
    }
  }

  async function onDownload(kind: "png" | "svg") {
    setDownloading(kind);
    setError(null);
    try {
      if (kind === "png") {
        await downloadQrPng(qr.svg, `lovedigitalgift-${giftId}.png`);
      } else {
        downloadQrSvg(qr.svg, `lovedigitalgift-${giftId}.svg`);
      }
    } catch {
      setError("The download failed in this browser. Try the SVG instead.");
    } finally {
      setDownloading(null);
    }
  }

  const shareLinks = [
    {
      label: "WhatsApp",
      href: `https://wa.me/?text=${encodeURIComponent(`${shareText} ${publicUrl}`)}`,
      icon: MessageCircle,
      className: "bg-[#25D366] text-white",
    },
    {
      label: "Telegram",
      href: `https://t.me/share/url?url=${encodeURIComponent(publicUrl)}&text=${encodeURIComponent(shareText)}`,
      icon: Send,
      className: "bg-[#2AABEE] text-white",
    },
    {
      label: "X",
      href: `https://twitter.com/intent/tweet?url=${encodeURIComponent(publicUrl)}&text=${encodeURIComponent(shareText)}`,
      icon: Share2,
      className: "bg-ink text-white",
    },
    {
      label: "Email",
      href: `mailto:?subject=${encodeURIComponent("A little something for you 💝")}&body=${encodeURIComponent(`${shareText}\n\n${publicUrl}`)}`,
      icon: Mail,
      className: "bg-brand-soft text-ink",
    },
  ];

  return (
    <AnimatePresence>
      {open ? (
        <motion.div
          className="fixed inset-0 z-[80] flex items-start justify-center overflow-y-auto bg-ink/40 p-4 backdrop-blur-sm sm:items-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          role="dialog"
          aria-modal="true"
          aria-label="Share your gift"
        >
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 12, scale: 0.98 }}
            transition={{ duration: 0.25 }}
            className="my-6 w-full max-w-3xl rounded-[2rem] bg-white p-6 shadow-2xl sm:p-8"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 className="text-2xl">Your gift is ready 🎉</h2>
                <p className="mt-1 text-sm text-muted">
                  Share the link, or print the QR code and tuck it into a card.
                </p>
              </div>
              <button
                type="button"
                onClick={onClose}
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-brand-soft text-ink transition hover:bg-brand/20"
                aria-label="Close"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="mt-6 grid gap-7 md:grid-cols-[1.1fr_0.9fr]">
              <div>
                <label className="field-label" htmlFor="gift-link">
                  Gift link
                </label>
                <div className="flex items-center gap-2">
                  <input
                    id="gift-link"
                    readOnly
                    value={publicUrl}
                    onFocus={(event) => event.currentTarget.select()}
                    className="field-input flex-1 !rounded-2xl font-mono text-xs"
                  />
                  <button type="button" onClick={copyLink} className="btn-primary shrink-0 !px-4 !py-2.5 text-xs">
                    {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
                    {copied ? "Copied" : "Copy"}
                  </button>
                </div>

                <p className="mt-6 text-xs font-semibold uppercase tracking-[0.16em] text-muted">Share it</p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {shareLinks.map((link) => (
                    <a
                      key={link.label}
                      href={link.href}
                      target="_blank"
                      rel="noreferrer"
                      className={cn(
                        "inline-flex items-center gap-1.5 rounded-full px-3.5 py-2 text-xs font-semibold transition hover:opacity-90",
                        link.className,
                      )}
                    >
                      <link.icon className="h-3.5 w-3.5" />
                      {link.label}
                    </a>
                  ))}
                  <button
                    type="button"
                    onClick={nativeShare}
                    className="inline-flex items-center gap-1.5 rounded-full border border-brand/20 px-3.5 py-2 text-xs font-semibold text-ink transition hover:border-brand/50"
                  >
                    <Share2 className="h-3.5 w-3.5" /> More
                  </button>
                </div>

                <div className="mt-6 rounded-2xl bg-[#FFF8FB] p-4">
                  <p className="flex items-center gap-2 text-xs font-semibold text-ink">
                    <Heart className="h-3.5 w-3.5 text-brand" /> Try it yourself
                  </p>
                  <a
                    href={`/g/${giftId}`}
                    target="_blank"
                    rel="noreferrer"
                    className="mt-1 inline-flex items-center gap-1.5 text-xs font-medium text-brand-dark hover:underline"
                  >
                    Open the gift page <ExternalLink className="h-3 w-3" />
                  </a>
                </div>
              </div>

              <div className="rounded-3xl border border-brand/10 bg-white p-4">
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-muted">QR code</p>

                <div className="mx-auto mt-3 w-full max-w-[220px] overflow-hidden rounded-2xl border border-brand/10 bg-white">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={qrPreview} alt={`QR code for ${publicUrl}`} className="h-auto w-full" />
                </div>

                <div className="mt-4 grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setSettings((current) => ({ ...current, shape: "heart" }))}
                    className={cn(
                      "flex flex-col items-center gap-1 rounded-2xl border p-2.5 text-[11px] font-semibold transition",
                      settings.shape === "heart"
                        ? "border-brand bg-brand-soft/50 text-brand-dark"
                        : "border-brand/15 text-muted hover:border-brand/40",
                    )}
                    aria-pressed={settings.shape === "heart"}
                    title="Soft rounded dots with a heart in the middle"
                  >
                    <Heart className="h-4 w-4" /> Heart
                  </button>
                  <button
                    type="button"
                    onClick={() => setSettings((current) => ({ ...current, shape: "square" }))}
                    className={cn(
                      "flex flex-col items-center gap-1 rounded-2xl border p-2.5 text-[11px] font-semibold transition",
                      settings.shape === "square"
                        ? "border-brand bg-brand-soft/50 text-brand-dark"
                        : "border-brand/15 text-muted hover:border-brand/40",
                    )}
                    aria-pressed={settings.shape === "square"}
                  >
                    <Square className="h-4 w-4" /> Classic
                  </button>
                </div>

                <div className="mt-4 space-y-3">
                  <div>
                    <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-muted">Dot colour</p>
                    <div className="mt-2 flex flex-wrap items-center gap-1.5">
                      {FG_PRESETS.map((colour) => (
                        <button
                          key={colour}
                          type="button"
                          onClick={() => setSettings((current) => ({ ...current, fg: colour }))}
                          className={cn(
                            "h-6 w-6 rounded-full border-2 transition",
                            settings.fg.toLowerCase() === colour.toLowerCase()
                              ? "border-ink"
                              : "border-white shadow-sm",
                          )}
                          style={{ backgroundColor: colour }}
                          aria-label={`Use ${colour}`}
                        />
                      ))}
                      <label className="relative ml-1 inline-flex h-6 w-6 cursor-pointer items-center justify-center rounded-full border border-dashed border-brand/40 text-[10px] text-muted">
                        +
                        <input
                          type="color"
                          value={settings.fg}
                          onChange={(event) => setSettings((current) => ({ ...current, fg: event.target.value }))}
                          className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
                          aria-label="Custom dot colour"
                        />
                      </label>
                    </div>
                  </div>

                  <div>
                    <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-muted">Background</p>
                    <div className="mt-2 flex flex-wrap items-center gap-1.5">
                      {BG_PRESETS.map((colour) => (
                        <button
                          key={colour}
                          type="button"
                          onClick={() => setSettings((current) => ({ ...current, bg: colour }))}
                          className={cn(
                            "h-6 w-6 rounded-full border-2 transition",
                            settings.bg.toLowerCase() === colour.toLowerCase()
                              ? "border-ink"
                              : "border-white shadow-sm",
                          )}
                          style={{ backgroundColor: colour }}
                          aria-label={`Use ${colour} background`}
                        />
                      ))}
                      <label className="relative ml-1 inline-flex h-6 w-6 cursor-pointer items-center justify-center rounded-full border border-dashed border-brand/40 text-[10px] text-muted">
                        +
                        <input
                          type="color"
                          value={settings.bg}
                          onChange={(event) => setSettings((current) => ({ ...current, bg: event.target.value }))}
                          className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
                          aria-label="Custom background colour"
                        />
                      </label>
                    </div>
                  </div>

                  <label className="flex cursor-pointer items-center justify-between rounded-xl bg-[#FFF8FB] px-3 py-2 text-[11px] font-medium text-ink">
                    Heart in the middle
                    <input
                      type="checkbox"
                      checked={Boolean(settings.logo)}
                      onChange={(event) => setSettings((current) => ({ ...current, logo: event.target.checked }))}
                      className="h-4 w-4 accent-[#D7263D]"
                    />
                  </label>

                  {lowContrast ? (
                    <div className="rounded-xl bg-amber-50 px-3 py-2 text-[10px] leading-relaxed text-amber-800">
                      Low contrast ({contrast.toFixed(1)}:1) — some phones will struggle to scan this. Pick a darker dot
                      colour or a lighter background.
                      <button
                        type="button"
                        onClick={() => setSettings((current) => ({ ...current, fg: "#2B1A20" }))}
                        className="mt-1 block font-semibold underline"
                      >
                        Use near-black dots
                      </button>
                    </div>
                  ) : null}
                </div>

                <div className="mt-4 grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => onDownload("png")}
                    disabled={downloading !== null}
                    className="btn-secondary !px-2 !py-2 text-[11px]"
                  >
                    {downloading === "png" ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Download className="h-3.5 w-3.5" />}
                    PNG
                  </button>
                  <button
                    type="button"
                    onClick={() => onDownload("svg")}
                    disabled={downloading !== null}
                    className="btn-secondary !px-2 !py-2 text-[11px]"
                  >
                    {downloading === "svg" ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Download className="h-3.5 w-3.5" />}
                    SVG
                  </button>
                </div>

                {saved ? <p className="mt-3 text-center text-[10px] font-medium text-emerald-600">QR style saved ✓</p> : null}
              </div>
            </div>

            {error ? (
              <p role="alert" className="mt-4 rounded-xl bg-red-50 px-4 py-2 text-xs text-red-600">
                {error}
              </p>
            ) : null}
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
