import Link from "next/link";
import { cn } from "@/lib/utils";
import { SITE_NAME } from "@/lib/config";

/** The simple brand mark: a white heart on a crimson-to-strawberry squircle. */
export function LogoMark({ className, tone = "brand" }: { className?: string; tone?: "brand" | "light" }) {
  const light = tone === "light";
  return (
    <span
      className={cn(
        "relative inline-flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-[0.85rem] ring-1 ring-inset",
        light
          ? "bg-white shadow-[0_8px_20px_-10px_rgba(58,13,22,0.6)] ring-white/40"
          : "bg-gradient-to-br from-[#D7263D] via-[#E2455C] to-[#FF8FA3] shadow-[0_8px_20px_-8px_rgba(215,38,61,0.7)] ring-white/25",
        className,
      )}
      aria-hidden
    >
      <svg viewBox="0 0 24 24" className="relative h-[21px] w-[21px]">
        <path
          d="M12 20.3c-4.85-3.15-7.65-5.85-7.65-9a4.18 4.18 0 0 1 7.65-2.18 4.18 4.18 0 0 1 7.65 2.18c0 3.15-2.8 5.85-7.65 9Z"
          fill={light ? "#D7263D" : "#fff"}
          fillOpacity="0.97"
        />
      </svg>
      {light ? null : (
        <span className="pointer-events-none absolute inset-x-1 top-0.5 h-1/2 rounded-t-full bg-white/10 blur-[5px]" />
      )}
    </span>
  );
}

export function Logo({ className, showText = true }: { className?: string; showText?: boolean }) {
  return (
    <Link
      href="/"
      className={cn("group inline-flex items-center gap-2.5", className)}
      aria-label={`${SITE_NAME} home`}
    >
      <LogoMark className="transition duration-300 group-hover:scale-[1.04] group-hover:shadow-[0_10px_24px_-8px_rgba(215,38,61,0.8)]" />
      {showText ? (
        <span className="text-[17px] font-semibold leading-none tracking-[-0.02em] text-ink">
          whishmydear<span className="text-brand">.com</span>
        </span>
      ) : null}
    </Link>
  );
}
