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
    <section id="how-it-works" className="scroll-mt-20 bg-gradient-to-b from-white to-[#FFF9FA] py-20 sm:py-28">
      <div className="container-page">
        <div className="mx-auto max-w-2xl text-center">
          <span className="eyebrow">the simple way</span>
          <h2 className="mt-4 text-[2.3rem] sm:text-[3.2rem]">How It Works</h2>
          <p className="mt-4 text-[15px] leading-relaxed text-muted">
            Create your personalized digital gift in just three simple steps
          </p>
        </div>

        <div className="relative mt-14 grid gap-10 md:grid-cols-3 md:gap-6">
          <div
            className="pointer-events-none absolute left-1/2 top-0 hidden h-full w-px border-l border-dashed border-brand/20 md:block md:left-0 md:top-10 md:h-px md:w-full md:border-l-0 md:border-t"
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
              <div className="relative z-10 flex h-[68px] w-[68px] items-center justify-center rounded-[1.4rem] border border-brand/15 bg-gradient-to-br from-white to-[#FFF1F4] font-display text-[26px] font-semibold text-brand shadow-[0_12px_30px_-14px_rgba(215,38,61,0.55)]">
                {step.number}
                <span className="absolute -right-2 -top-2 flex h-7 w-7 items-center justify-center rounded-full border border-white bg-white text-sm shadow-sm">
                  {step.emoji}
                </span>
              </div>
              <h3 className="mt-6 text-[21px] leading-snug">{step.title}</h3>
              <p className="mt-2.5 max-w-sm text-[14px] leading-[1.7] text-muted">{step.body}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
