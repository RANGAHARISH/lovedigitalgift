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
      <section className="relative overflow-hidden bg-gradient-to-b from-[#FFF5F8] via-[#FFF8FA] to-white pb-12 pt-16 sm:pt-20">
        <div className="pointer-events-none absolute -right-16 top-0 h-64 w-64 rounded-full bg-[#FFD9E0] opacity-70 blur-3xl" />
        <div className="container-page relative text-center">
          <span className="eyebrow">the collection</span>
          <h1 className="mt-4 text-[2.6rem] sm:text-[3.6rem]">Beautiful Templates</h1>
          <p className="mx-auto mt-4 max-w-xl text-[15px] leading-relaxed text-muted">
            Each template is a unique interactive experience — pick an occasion, make it yours and send a link they
            will keep forever.
          </p>
        </div>
      </section>

      <section className="container-page pb-24">
        <TemplateGallery templates={TEMPLATE_SUMMARIES} />
      </section>
    </div>
  );
}

