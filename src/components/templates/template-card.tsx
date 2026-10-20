import Link from "next/link";
import { templateOccasionLabel } from "@/templates/registry";
import type { TemplateSummary } from "@/templates/types";
import { cn } from "@/lib/utils";

export function TemplateCard({ template, className }: { template: TemplateSummary; className?: string }) {
  return (
    <article
      className={cn(
        "group flex flex-col overflow-hidden rounded-3xl border border-white bg-white shadow-softer transition duration-300 hover:-translate-y-1 hover:shadow-soft",
        className,
      )}
    >
      <Link
        href={`/templates/${template.slug}`}
        className="relative block aspect-[4/3] overflow-hidden"
        style={{
          backgroundImage: `linear-gradient(135deg, ${template.gradient[0]}, ${template.gradient[1]})`,
        }}
        aria-label={`Preview ${template.name}`}
      >
        <span className="absolute inset-0 flex items-center justify-center text-6xl drop-shadow-sm transition duration-500 group-hover:scale-110">
          {template.emoji}
        </span>
        <span className="absolute left-3 top-3 rounded-full bg-white/85 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.12em] text-ink backdrop-blur">
          {templateOccasionLabel(template)}
        </span>
        <span className="absolute inset-0 flex items-end justify-center bg-black/0 p-4 opacity-0 transition group-hover:bg-black/10 group-hover:opacity-100">
          <span className="rounded-full bg-white/95 px-4 py-2 text-xs font-semibold text-ink shadow">
            Preview template →
          </span>
        </span>
      </Link>

      <div className="flex flex-1 flex-col p-5">
        <h3 className="text-lg font-semibold leading-snug">{template.name}</h3>
        <p className="mt-1.5 line-clamp-2 flex-1 text-sm leading-relaxed text-muted">{template.description}</p>
        <div className="mt-4 flex items-center gap-2">
          <Link href={`/templates/${template.slug}`} className="btn-secondary flex-1 !px-3 !py-2 text-xs">
            Preview
          </Link>
          <Link href={`/create/${template.slug}`} className="btn-primary flex-1 !px-3 !py-2 text-xs">
            Use template
          </Link>
        </div>
      </div>
    </article>
  );
}
