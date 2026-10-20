"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import {
  Copy,
  CopyPlus,
  ExternalLink,
  Eye,
  Loader2,
  Pencil,
  Plus,
  QrCode,
  Sparkles,
  Trash2,
} from "lucide-react";
import type { Gift } from "@/lib/gifts";
import type { QrStyle } from "@/lib/qr";
import { ShareModal } from "@/components/share/share-modal";
import { getTemplate } from "@/templates/registry";
import { cn, formatDate } from "@/lib/utils";

type DashboardGift = Pick<
  Gift,
  | "id"
  | "title"
  | "recipient_name"
  | "template_slug"
  | "status"
  | "views"
  | "updated_at"
  | "created_at"
  | "qr_settings"
>;

export function DashboardClient({ gifts: initialGifts, name }: { gifts: DashboardGift[]; name: string }) {
  const router = useRouter();
  const [gifts, setGifts] = useState(initialGifts);
  const [shareGift, setShareGift] = useState<DashboardGift | null>(null);
  const [deleteGift, setDeleteGift] = useState<DashboardGift | null>(null);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const stats = useMemo(
    () => ({
      total: gifts.length,
      published: gifts.filter((gift) => gift.status === "published").length,
      views: gifts.reduce((total, gift) => total + gift.views, 0),
    }),
    [gifts],
  );

  function copyLink(gift: DashboardGift) {
    const url = `${window.location.origin}/g/${gift.id}`;
    navigator.clipboard
      .writeText(url)
      .then(() => {
        setNotice(gift.status === "published" ? "Link copied to your clipboard." : "Link copied — publish the gift to make it live.");
        setTimeout(() => setNotice(null), 3000);
      })
      .catch(() => setError("Your browser blocked the clipboard. Open the gift and copy the address bar instead."));
  }

  async function duplicate(gift: DashboardGift) {
    setBusyId(gift.id);
    setError(null);
    try {
      const response = await fetch(`/api/gifts/${gift.id}/duplicate`, { method: "POST" });
      const data = (await response.json().catch(() => null)) as { gift?: DashboardGift; error?: string } | null;
      if (!response.ok || !data?.gift) throw new Error(data?.error ?? "Could not duplicate this gift.");
      setGifts((current) => [data.gift as DashboardGift, ...current]);
      setNotice("Duplicated as a new draft.");
      setTimeout(() => setNotice(null), 3000);
      router.refresh();
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Could not duplicate this gift.");
    } finally {
      setBusyId(null);
    }
  }

  async function remove(gift: DashboardGift) {
    setBusyId(gift.id);
    setError(null);
    try {
      const response = await fetch(`/api/gifts/${gift.id}`, { method: "DELETE" });
      if (!response.ok) throw new Error("Could not delete this gift.");
      setGifts((current) => current.filter((item) => item.id !== gift.id));
      setDeleteGift(null);
      setNotice("Gift deleted.");
      setTimeout(() => setNotice(null), 3000);
      router.refresh();
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Could not delete this gift.");
    } finally {
      setBusyId(null);
    }
  }

  const saveQr = async (gift: DashboardGift, style: QrStyle) => {
    await fetch(`/api/gifts/${gift.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ qr_settings: style }),
    });
  };

  return (
    <div className="bg-[#FFF8FA]">
      <div className="border-b border-brand/10 bg-gradient-to-b from-[#FFF5F8] to-white">
        <div className="container-page flex flex-col gap-5 py-10 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="eyebrow">your gifts</p>
            <h1 className="mt-3 text-[2.5rem]">My Dashboard</h1>
            <p className="mt-2 text-[13.5px] text-muted">
              {name ? `Welcome back, ${name}. ` : ""}Everything you have made, ready to edit or send again.
            </p>
          </div>
          <Link href="/templates" className="btn-primary shrink-0 px-6 py-3">
            <Plus className="h-4 w-4" /> Create new gift
          </Link>
        </div>
      </div>

      <div className="container-page py-8">
        {notice ? (
          <p className="mb-4 rounded-2xl bg-emerald-50 px-4 py-3 text-sm text-emerald-700" role="status">
            {notice}
          </p>
        ) : null}
        {error ? (
          <p className="mb-4 rounded-2xl bg-red-50 px-4 py-3 text-sm text-red-600" role="alert">
            {error}
          </p>
        ) : null}

        <div className="grid grid-cols-3 gap-3 sm:gap-4">
          {[
            { label: "Gifts created", value: stats.total, icon: "🎁" },
            { label: "Published", value: stats.published, icon: "🔗" },
            { label: "Total views", value: stats.views, icon: "👀" },
          ].map((stat) => (
            <div key={stat.label} className="rounded-2xl border border-white bg-white px-4 py-4 shadow-softer">
              <p className="text-lg">{stat.icon}</p>
              <p className="mt-1 font-display text-2xl font-semibold">{stat.value}</p>
              <p className="text-[10px] uppercase tracking-[0.14em] text-muted">{stat.label}</p>
            </div>
          ))}
        </div>

        {gifts.length === 0 ? (
          <div className="mt-10 flex flex-col items-center rounded-[2rem] border border-dashed border-brand/30 bg-white/70 px-6 py-16 text-center">
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-brand-soft text-4xl">🎁</div>
            <h2 className="mt-6 text-2xl">You haven&apos;t created a gift yet</h2>
            <p className="mt-2 max-w-sm text-sm leading-relaxed text-muted">
              Pick a template, add a few photos and a song, and send someone a link they will keep forever.
            </p>
            <Link href="/templates" className="btn-primary mt-7 px-6 py-3">
              <Sparkles className="h-4 w-4" /> Browse Templates
            </Link>
          </div>
        ) : (
          <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {gifts.map((gift) => {
              const template = getTemplate(gift.template_slug);
              const gradient = template?.gradient ?? ["#D7263D", "#FF8FA3"];
              return (
                <article
                  key={gift.id}
                  className="group flex flex-col overflow-hidden rounded-3xl border border-white bg-white shadow-softer transition hover:-translate-y-0.5 hover:shadow-soft"
                >
                  <div
                    className="relative h-28"
                    style={{ backgroundImage: `linear-gradient(135deg, ${gradient[0]}, ${gradient[1]})` }}
                  >
                    <span className="absolute inset-0 flex items-center justify-center text-4xl drop-shadow-sm transition duration-500 group-hover:scale-110">
                      {template?.emoji ?? "🎁"}
                    </span>
                    <span
                      className={cn(
                        "absolute left-3 top-3 rounded-full px-2.5 py-1 text-[9px] font-bold uppercase tracking-[0.12em]",
                        gift.status === "published" ? "bg-white text-emerald-700" : "bg-white/90 text-ink",
                      )}
                    >
                      {gift.status === "published" ? "Published" : "Draft"}
                    </span>
                    <span className="absolute right-3 top-3 flex items-center gap-1 rounded-full bg-black/25 px-2.5 py-1 text-[10px] font-medium text-white backdrop-blur">
                      <Eye className="h-3 w-3" /> {gift.views}
                    </span>
                  </div>

                  <div className="flex flex-1 flex-col p-4">
                    <h2 className="truncate text-base font-semibold" title={gift.title}>
                      {gift.title}
                    </h2>
                    <p className="mt-0.5 truncate text-[11px] text-muted">
                      {template?.name ?? gift.template_slug}
                      {gift.recipient_name ? ` · for ${gift.recipient_name}` : ""}
                    </p>
                    <p className="mt-1 text-[10px] text-muted/80">Updated {formatDate(gift.updated_at)}</p>

                    <div className="mt-4 flex items-center gap-1.5">
                      <Link
                        href={`/create/${gift.template_slug}?gift=${gift.id}`}
                        className="btn-secondary flex-1 !px-3 !py-2 text-[11px]"
                      >
                        <Pencil className="h-3 w-3" /> Edit
                      </Link>
                      {gift.status === "published" ? (
                        <a
                          href={`/g/${gift.id}`}
                          target="_blank"
                          rel="noreferrer"
                          className="btn flex-1 border border-brand/15 !px-3 !py-2 text-[11px] text-ink hover:border-brand/40"
                        >
                          <ExternalLink className="h-3 w-3" /> Open
                        </a>
                      ) : (
                        <span className="btn flex-1 cursor-not-allowed border border-brand/10 !px-3 !py-2 text-[11px] text-muted/50">
                          <ExternalLink className="h-3 w-3" /> Unpublished
                        </span>
                      )}
                    </div>

                    <div className="mt-2 flex items-center gap-1">
                      <button
                        type="button"
                        onClick={() => copyLink(gift)}
                        className="flex flex-1 items-center justify-center gap-1 rounded-xl py-2 text-[10px] font-medium text-muted transition hover:bg-brand-soft/50 hover:text-ink"
                      >
                        <Copy className="h-3 w-3" /> Link
                      </button>
                      <button
                        type="button"
                        onClick={() => setShareGift(gift)}
                        className="flex flex-1 items-center justify-center gap-1 rounded-xl py-2 text-[10px] font-medium text-muted transition hover:bg-brand-soft/50 hover:text-ink"
                      >
                        <QrCode className="h-3 w-3" /> QR
                      </button>
                      <button
                        type="button"
                        onClick={() => duplicate(gift)}
                        disabled={busyId === gift.id}
                        className="flex flex-1 items-center justify-center gap-1 rounded-xl py-2 text-[10px] font-medium text-muted transition hover:bg-brand-soft/50 hover:text-ink disabled:opacity-50"
                      >
                        {busyId === gift.id ? <Loader2 className="h-3 w-3 animate-spin" /> : <CopyPlus className="h-3 w-3" />}
                        Duplicate
                      </button>
                      <button
                        type="button"
                        onClick={() => setDeleteGift(gift)}
                        className="flex items-center justify-center rounded-xl p-2 text-muted transition hover:bg-red-50 hover:text-red-600"
                        aria-label={`Delete ${gift.title}`}
                      >
                        <Trash2 className="h-3 w-3" />
                      </button>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </div>

      {shareGift ? (
        <ShareModal
          open={Boolean(shareGift)}
          onClose={() => setShareGift(null)}
          giftId={shareGift.id}
          initialQr={shareGift.qr_settings}
          title={shareGift.title}
          onSaveQr={(style) => void saveQr(shareGift, style)}
        />
      ) : null}

      {deleteGift ? (
        <div
          className="fixed inset-0 z-[90] flex items-center justify-center bg-ink/40 p-4 backdrop-blur-sm"
          role="dialog"
          aria-modal="true"
          aria-label="Delete gift"
          onClick={() => setDeleteGift(null)}
        >
          <div className="w-full max-w-sm rounded-3xl bg-white p-6 shadow-2xl" onClick={(event) => event.stopPropagation()}>
            <p className="text-3xl">🗑️</p>
            <h2 className="mt-3 text-xl">Delete this gift?</h2>
            <p className="mt-2 text-sm leading-relaxed text-muted">
              &ldquo;{deleteGift.title}&rdquo; and its public link will stop working immediately. This cannot be undone.
            </p>
            <div className="mt-6 flex gap-2">
              <button type="button" onClick={() => setDeleteGift(null)} className="btn-secondary flex-1 !py-2.5 text-xs">
                Keep it
              </button>
              <button
                type="button"
                onClick={() => void remove(deleteGift)}
                disabled={busyId === deleteGift.id}
                className="btn flex-1 bg-red-600 !py-2.5 text-xs text-white hover:bg-red-700"
              >
                {busyId === deleteGift.id ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : null}
                Delete forever
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
