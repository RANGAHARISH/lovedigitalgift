"use client";

import { useMemo, useState } from "react";
import { Search, SlidersHorizontal } from "lucide-react";
import type { Occasion, TemplateSummary } from "@/templates/types";
import { FILTER_OCCASIONS } from "@/templates/occasions";
import { TemplateCard } from "./template-card";
import { cn } from "@/lib/utils";

export function TemplateGallery({ templates }: { templates: TemplateSummary[] }) {
  const [query, setQuery] = useState("");
  const [occasion, setOccasion] = useState<Occasion | "all">("all");

  const counts = useMemo(() => {
    const map: Record<string, number> = { all: templates.length };
    for (const template of templates) {
      map[template.occasion] = (map[template.occasion] ?? 0) + 1;
    }
    return map;
  }, [templates]);

  const filtered = useMemo(() => {
    const term = query.trim().toLowerCase();
    return templates.filter((template) => {
      const matchesOccasion = occasion === "all" || template.occasion === occasion;
      if (!matchesOccasion) return false;
      if (!term) return true;
      return (
        template.name.toLowerCase().includes(term) ||
        template.description.toLowerCase().includes(term) ||
        (template.occasionLabel ?? "").toLowerCase().includes(term)
      );
    });
  }, [templates, occasion, query]);

  return (
    <div>
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="relative w-full lg:max-w-xs">
          <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted/70" />
          <input
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search templates…"
            aria-label="Search templates"
            className="field-input !rounded-full !py-3 pl-11 pr-4"
          />
        </div>
        <p className="flex items-center gap-2 text-xs text-muted">
          <SlidersHorizontal className="h-3.5 w-3.5" />
          {filtered.length} of {templates.length} templates
        </p>
      </div>

      <div className="no-scrollbar -mx-1 mt-6 flex gap-2 overflow-x-auto px-1 pb-2">
        {FILTER_OCCASIONS.map((filter) => {
          const count = counts[filter.value] ?? 0;
          return (
            <button
              key={filter.value}
              type="button"
              onClick={() => setOccasion(filter.value)}
              className={cn("chip shrink-0", occasion === filter.value && "chip-active")}
              aria-pressed={occasion === filter.value}
            >
              {filter.label}
              <span className={cn("text-[10px]", occasion === filter.value ? "text-white/75" : "text-muted/60")}>
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {filtered.length === 0 ? (
        <div className="mt-12 rounded-3xl border border-dashed border-brand/30 bg-white/60 p-12 text-center">
          <p className="text-3xl">🔍</p>
          <p className="mt-3 font-semibold">No templates match that search</p>
          <p className="mt-1 text-sm text-muted">Try a different occasion or a shorter phrase.</p>
          <button
            type="button"
            onClick={() => {
              setQuery("");
              setOccasion("all");
            }}
            className="btn-secondary mt-5 !px-5 !py-2 text-xs"
          >
            Clear filters
          </button>
        </div>
      ) : (
        <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((template) => (
            <TemplateCard key={template.slug} template={template} />
          ))}
        </div>
      )}
    </div>
  );
}
