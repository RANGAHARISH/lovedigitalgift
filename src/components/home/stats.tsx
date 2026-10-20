"use client";

import { useInView } from "framer-motion";
import { useEffect, useRef, useState } from "react";

const STATS = [
  { emoji: "🎁", value: 20, suffix: "+", label: "Gift Templates" },
  { emoji: "✨", value: 100, suffix: "%", label: "Customizable" },
  { emoji: "🔗", value: null, display: "∞", label: "Unlimited Sharing" },
  { emoji: "💖", value: 2000, suffix: "+", label: "Happy Customers" },
];

function useCountUp(target: number, active: boolean, duration = 1500) {
  const [value, setValue] = useState(0);

  useEffect(() => {
    if (!active) return;
    let frame = 0;
    const start = performance.now();
    const tick = (now: number) => {
      const progress = Math.min(1, (now - start) / duration);
      const eased = 1 - Math.pow(1 - progress, 3);
      setValue(Math.round(target * eased));
      if (progress < 1) frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [target, active, duration]);

  return value;
}

function StatCard({
  emoji,
  label,
  value,
  suffix,
  display,
  active,
}: {
  emoji: string;
  label: string;
  value: number | null;
  suffix?: string;
  display?: string;
  active: boolean;
}) {
  const counted = useCountUp(value ?? 0, active);
  return (
    <div className="rounded-[1.5rem] border border-brand/10 bg-white/70 px-5 py-6 text-center shadow-[0_2px_12px_rgba(43,26,32,0.05)] backdrop-blur transition duration-300 hover:-translate-y-0.5 hover:border-brand/25 hover:bg-white">
      <div className="text-[22px]">{emoji}</div>
      <div className="mt-2 font-display text-[2rem] font-semibold leading-none text-ink sm:text-[2.35rem]">
        {display ?? `${counted.toLocaleString("en-US")}${suffix ?? ""}`}
      </div>
      <div className="mt-2 text-[10px] font-semibold uppercase tracking-[0.18em] text-muted">{label}</div>
    </div>
  );
}

export function StatsStrip() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.35 });

  return (
    <section className="relative -mt-2 bg-white pb-4">
      <div className="container-page">
        <div ref={ref} className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
          {STATS.map((stat) => (
            <StatCard key={stat.label} {...stat} active={inView} />
          ))}
        </div>
      </div>
    </section>
  );
}
