import Link from "next/link";
import { Instagram, Music2, Youtube } from "lucide-react";
import { CONTACT_EMAIL, SOCIALS } from "@/lib/config";
import { Logo } from "./logo";

const socialIcon = {
  instagram: Instagram,
  tiktok: Music2,
  youtube: Youtube,
};

const heading = "text-[11px] font-semibold uppercase tracking-[0.2em] text-ink/70";

export function Footer() {
  return (
    <footer className="border-t border-brand/10 bg-gradient-to-b from-white to-[#FFF9FA]">
      <div className="container-page grid gap-12 py-16 sm:grid-cols-2 lg:grid-cols-4">
        <div className="sm:col-span-2 lg:col-span-1">
          <Logo />
          <p className="mt-5 max-w-xs text-[13.5px] leading-relaxed text-muted">
            Interactive digital gifts made with photos, music and a heartfelt message — for the people who deserve more
            than a text.
          </p>
          <div className="mt-6 flex items-center gap-2">
            {SOCIALS.map((social) => {
              const Icon = socialIcon[social.icon];
              return (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={social.label}
                  className="flex h-9 w-9 items-center justify-center rounded-xl border border-brand/15 bg-white text-muted transition hover:-translate-y-0.5 hover:border-brand/40 hover:text-brand"
                >
                  <Icon className="h-4 w-4" />
                </a>
              );
            })}
          </div>
        </div>

        <div>
          <h3 className={heading}>Quick Links</h3>
          <ul className="mt-5 space-y-3 text-[13.5px] text-muted">
            <li>
              <Link href="/templates" className="transition hover:text-brand-dark">
                Templates
              </Link>
            </li>
            <li>
              <Link href="/dashboard" className="transition hover:text-brand-dark">
                Dashboard
              </Link>
            </li>
            <li>
              <a href={`mailto:${CONTACT_EMAIL}`} className="transition hover:text-brand-dark">
                {CONTACT_EMAIL}
              </a>
            </li>
          </ul>
        </div>

        <div>
          <h3 className={heading}>Legal</h3>
          <ul className="mt-5 space-y-3 text-[13.5px] text-muted">
            <li>
              <Link href="/terms" className="transition hover:text-brand-dark">
                Terms &amp; Conditions
              </Link>
            </li>
            <li>
              <Link href="/privacy" className="transition hover:text-brand-dark">
                Privacy Policy
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <h3 className={heading}>Say hello</h3>
          <p className="mt-5 text-[13.5px] leading-relaxed text-muted">
            Questions, ideas or a template you wish existed? We read every message.
          </p>
          <a href={`mailto:${CONTACT_EMAIL}`} className="btn-secondary mt-5 !px-5 !py-2.5 text-xs">
            Email us
          </a>
        </div>
      </div>

      <div className="border-t border-brand/10">
        <div className="container-page flex flex-col items-center justify-between gap-2 py-6 text-[11px] tracking-[0.06em] text-muted/90 sm:flex-row">
          <p>Made with ♥ by LoveDigitalGift</p>
          <p>© 2026 LoveDigitalGift. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
