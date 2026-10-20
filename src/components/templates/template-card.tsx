import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { templateOccasionLabel } from "@/templates/registry";
import type { TemplateSummary } from "@/templates/types";
import { cn } from "@/lib/utils";

export function TemplateCard({ template, className }: { template: TemplateSummary; className?: string }) {
  return (
    <article
      className={cn(
        "group flex flex-col overflow-hidden rounded-[1.6rem] border border-brand/10 bg-white shadow-[0_2px_10px_rgba(43,26,32,0.04)] transition duration-300 hover:-translate-y-1 hover:border-brand/25 hover:shadow-soft",
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
        <span className="absolute inset-0 flex items-center justify-center text-6xl drop-shadow-sm transition duration-500 group-hover:scale-[1.08]">
          {template.emoji}
        </span>
        <span className="absolute left-3 top-3 rounded-full bg-white/90 px-2.5 py-1 text-[9px] font-bold uppercase tracking-[0.16em] text-ink/80 backdrop-blur">
          {templateOccasionLabel(template)}
        </span>
        <span className="absolute inset-0 flex items-end justify-center bg-gradient-to-t from-black/25 via-transparent to-transparent p-4 opacity-0 transition duration-300 group-hover:opacity-100">
          <span className="rounded-full bg-white px-4 py-2 text-[11px] font-semibold text-ink shadow-lg">
            Preview template →
          </span>
        </span>
      </Link>

      <div className="flex flex-1 flex-col p-5">
        <h3 className="text-[19px] leading-snug">{template.name}</h3>
        <p className="mt-1.5 line-clamp-2 flex-1 text-[13.5px] leading-relaxed text-muted">{template.description}</p>
        <div className="mt-4 flex items-center gap-2">
          <Link href={`/templates/${template.slug}`} className="btn-secondary flex-1 !px-3 !py-2 text-xs">
            Preview
          </Link>
          <Link href={`/create/${template.slug}`} className="btn-primary group/btn flex-1 !px-3 !py-2 text-xs">
            Use template
            <ArrowUpRight className="h-3 w-3 transition group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5" />
          </Link>
        </div>
      </div>
    </article>
  );
}
