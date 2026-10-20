"use client";

import { motion } from "framer-motion";

const STEPS = [
  {
    number: 1,
    emoji: "🎨",
    title: "Choose a Template",
    body: "Browse our collection of beautifully designed templates for every occasion. Each one is interactive and fully customizable.",
  },
  {
    number: 2,
    emoji: "✍️",
    title: "Personalize It",
    body: "Add your personal touch: change the text, upload your photos, pick background music, and make it uniquely yours.",
  },
  {
    number: 3,
    emoji: "💝",
    title: "Share the Love",
    body: "Get a unique link and a fully customizable QR code (heart or classic square, in any color!) for your personalized website. Share it instantly and watch them smile.",
  },
];

export function HowItWorks() {
  return (
    <section id="how-it-works" className="scroll-mt-20 bg-white py-20 sm:py-24">
      <div className="container-page">
        <div className="mx-auto max-w-2xl text-center">
          <span className="text-[11px] font-semibold uppercase tracking-[0.28em] text-brand">the simple way</span>
          <h2 className="mt-4 text-4xl sm:text-5xl">How It Works</h2>
          <p className="mt-4 text-sm leading-relaxed text-muted sm:text-base">
            Create your personalized digital gift in just three simple steps
          </p>
        </div>

        <div className="relative mt-14 grid gap-10 md:grid-cols-3 md:gap-6">
          <div
            className="pointer-events-none absolute left-1/2 top-0 hidden h-full w-px border-l border-dashed border-brand/25 md:block md:left-0 md:top-9 md:h-px md:w-full md:border-l-0 md:border-t"
            aria-hidden
          />
          {STEPS.map((step, index) => (
            <motion.div
              key={step.number}
              initial={{ opacity: 0, y: 26 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.6, delay: index * 0.12 }}
              className="relative"
            >
              <div className="relative z-10 flex h-[72px] w-[72px] items-center justify-center rounded-full border border-brand/20 bg-white font-display text-2xl font-semibold text-brand shadow-soft">
                {step.number}
                <span className="absolute -right-1 -top-1 text-sm">{step.emoji}</span>
              </div>
              <h3 className="mt-6 text-xl font-semibold">{step.title}</h3>
              <p className="mt-3 max-w-sm text-sm leading-relaxed text-muted">{step.body}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
