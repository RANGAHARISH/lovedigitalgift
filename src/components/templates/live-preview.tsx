"use client";

import { useMemo } from "react";
import { getTemplate } from "@/templates/registry";

export function LivePreview({ slug, accent }: { slug: string; accent?: string }) {
  const template = useMemo(() => getTemplate(slug), [slug]);
  if (!template) return null;
  const { Component } = template;

  return (
    <div className="relative mx-auto w-[310px] sm:w-[350px]">
      <div className="absolute -inset-6 -z-10 rounded-full bg-gradient-to-br from-[#FFD1DA] to-[#FFDDE4] opacity-50 blur-2xl" />
      <div className="relative rounded-[2.6rem] border-[9px] border-[#2B1A20] bg-[#2B1A20] shadow-[0_25px_70px_rgba(58,13,22,0.25)]">
        <div className="absolute left-1/2 top-2 z-30 h-5 w-24 -translate-x-1/2 rounded-full bg-[#2B1A20]" />
        <div className="preview-scope story no-scrollbar relative h-[640px] overflow-y-auto overscroll-contain rounded-[2rem] bg-white">
          <Component content={template.defaultContent} accent={accent ?? template.accent} preview />
        </div>
      </div>
      <p className="mt-4 text-center text-[10px] uppercase tracking-[0.24em] text-muted">live preview · scroll inside</p>
    </div>
  );
}
