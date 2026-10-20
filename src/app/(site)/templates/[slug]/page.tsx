import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight, Check, Heart, Image as ImageIcon, Music2, Palette, QrCode } from "lucide-react";
import { LivePreview } from "@/components/templates/live-preview";
import { TemplateCard } from "@/components/templates/template-card";
import { getTemplate, TEMPLATE_SUMMARIES, templateOccasionLabel } from "@/templates/registry";

type Params = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const template = getTemplate(slug);
  if (!template) return { title: "Template not found" };
  return {
    title: `${template.name} — interactive gift template`,
    description: template.description,
    openGraph: {
      title: `${template.name} · whishmydear.com`,
      description: template.description,
      images: ["/og-image.png"],
    },
  };
}

const FEATURES = [
  { icon: Heart, label: "Animated, interactive opening" },
  { icon: ImageIcon, label: "Your own photos, with captions" },
  { icon: Music2, label: "Background music (library or your own)" },
  { icon: Palette, label: "Pick any accent colour" },
  { icon: QrCode, label: "Link + heart or square QR code" },
];

export default async function TemplatePreviewPage({ params }: Params) {
  const { slug } = await params;
  const template = getTemplate(slug);
  if (!template) notFound();

  const photoField = template.fields.find((field) => field.type === "images");
  const listField = template.fields.find((field) => field.type === "list");
  const related = TEMPLATE_SUMMARIES.filter(
    (item) => item.occasion === template.occasion && item.slug !== template.slug,
  ).slice(0, 3);

  return (
    <div className="bg-white">
      <div className="border-b border-brand/10 bg-[#FFF8FA]">
        <div className="container-page flex items-center gap-3 py-4 text-xs text-muted">
          <Link href="/templates" className="inline-flex items-center gap-1.5 hover:text-brand-dark">
            <ArrowLeft className="h-3.5 w-3.5" /> All templates
          </Link>
          <span className="text-muted/40">/</span>
          <span className="text-ink">{template.name}</span>
        </div>
      </div>

      <section className="container-page grid gap-14 py-14 lg:grid-cols-[1fr_auto] lg:items-start lg:gap-10">
        <div className="max-w-xl">
          <div className="flex items-center gap-3">
            <span
              className="rounded-full px-3.5 py-1.5 text-[10px] font-semibold uppercase tracking-[0.16em] text-white"
              style={{ backgroundColor: template.accent }}
            >
              {templateOccasionLabel(template)}
            </span>
            <span className="text-xs text-muted">Free · unlimited sharing</span>
          </div>

          <h1 className="mt-5 text-4xl sm:text-5xl">{template.name}</h1>
          <p className="mt-4 text-base leading-relaxed text-muted">{template.description}</p>

          <ul className="mt-8 space-y-3">
            {FEATURES.map((feature) => (
              <li key={feature.label} className="flex items-start gap-3 text-sm text-ink/80">
                <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-brand-soft text-brand-dark">
                  <Check className="h-3.5 w-3.5" strokeWidth={3} />
                </span>
                {feature.label}
              </li>
            ))}
            {photoField ? (
              <li className="flex items-start gap-3 text-sm text-ink/80">
                <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-brand-soft text-brand-dark">
                  <Check className="h-3.5 w-3.5" strokeWidth={3} />
                </span>
                Up to {(photoField as { max: number }).max} photos
              </li>
            ) : null}
            {listField ? (
              <li className="flex items-start gap-3 text-sm text-ink/80">
                <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-brand-soft text-brand-dark">
                  <Check className="h-3.5 w-3.5" strokeWidth={3} />
                </span>
                Up to {(listField as { max: number }).max} {(listField as { itemLabel: string }).itemLabel.toLowerCase()}s
              </li>
            ) : null}
          </ul>

          <div className="mt-9 flex flex-col gap-3 sm:flex-row">
            <Link href={`/create/${template.slug}`} className="btn-primary px-7 py-3.5">
              Use this template
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link href="/templates" className="btn-secondary px-7 py-3.5">
              Browse all templates
            </Link>
          </div>

          <p className="mt-6 flex items-center gap-2 text-xs text-muted">
            <span className="text-base">{template.emoji}</span>
            Signed out? You will be asked to create a free account first.
          </p>
        </div>

        <LivePreview slug={template.slug} accent={template.accent} />
      </section>

      {related.length > 0 ? (
        <section className="border-t border-brand/10 bg-[#FFF8FA] py-16">
          <div className="container-page">
            <div className="flex items-end justify-between gap-4">
              <h2 className="text-2xl sm:text-3xl">More {templateOccasionLabel(template).toLowerCase()} templates</h2>
              <Link href="/templates" className="text-xs font-semibold text-brand-dark hover:underline">
                View all
              </Link>
            </div>
            <div className="mt-7 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {related.map((item) => (
                <TemplateCard key={item.slug} template={item} />
              ))}
            </div>
          </div>
        </section>
      ) : null}
    </div>
  );
}
