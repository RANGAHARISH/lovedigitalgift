import type { Metadata } from "next";
import { TemplateGallery } from "@/components/templates/template-gallery";
import { TEMPLATE_SUMMARIES } from "@/templates/registry";

export const metadata: Metadata = {
  title: "Interactive Gift Templates",
  description:
    "Browse interactive digital gift templates for birthdays, anniversaries, weddings, Valentine's Day, graduations and more. Personalise with photos, music and your own words.",
};

export default function TemplatesPage() {
  return (
    <div className="bg-white">
      <section className="relative overflow-hidden bg-gradient-to-b from-[#FFF5F8] via-[#FFF8FA] to-white pb-10 pt-16">
        <div className="pointer-events-none absolute -right-16 top-0 h-64 w-64 rounded-full bg-[#FFD9E0] opacity-70 blur-3xl" />
        <div className="container-page relative text-center">
          <span className="text-[11px] font-semibold uppercase tracking-[0.28em] text-brand">the collection</span>
          <h1 className="mt-4 text-4xl sm:text-6xl">Beautiful Templates</h1>
          <p className="mx-auto mt-4 max-w-xl text-sm leading-relaxed text-muted sm:text-base">
            Each template is a unique interactive experience — pick an occasion, make it yours and send a link they
            will keep forever.
          </p>
        </div>
      </section>

      <section className="container-page pb-20">
        <TemplateGallery templates={TEMPLATE_SUMMARIES} />
      </section>
    </div>
  );
}

