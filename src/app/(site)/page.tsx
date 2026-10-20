import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Hero } from "@/components/home/hero";
import { StatsStrip } from "@/components/home/stats";
import { HowItWorks } from "@/components/home/how-it-works";
import { Testimonials } from "@/components/home/testimonials";
import { FinalCTA } from "@/components/home/final-cta";
import { TemplateCard } from "@/components/templates/template-card";
import { getFeaturedTemplates, TEMPLATES } from "@/templates/registry";

export default function HomePage() {
  const featured = getFeaturedTemplates(6);

  return (
    <>
      <Hero />
      <StatsStrip />
      <HowItWorks />

      <section className="bg-gradient-to-b from-[#FFF8FB] to-white py-20 sm:py-24">
        <div className="container-page">
          <div className="mx-auto max-w-2xl text-center">
            <span className="text-[11px] font-semibold uppercase tracking-[0.28em] text-brand">pick a starting point</span>
            <h2 className="mt-4 text-4xl sm:text-5xl">Beautiful Templates</h2>
            <p className="mt-4 text-sm leading-relaxed text-muted sm:text-base">
              Each template is a unique interactive experience — perfect for any occasion
            </p>
          </div>

          <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {featured.map((template) => (
              <TemplateCard key={template.slug} template={template} />
            ))}
          </div>

          <div className="mt-10 flex flex-col items-center gap-2">
            <Link href="/templates" className="btn-primary px-7 py-3.5">
              View All Templates
              <ArrowRight className="h-4 w-4" />
            </Link>
            <p className="text-xs text-muted">{TEMPLATES.length} templates across 10+ occasions</p>
          </div>
        </div>
      </section>

      <Testimonials />
      <FinalCTA />
    </>
  );
}
