import Link from "next/link";
import { Instagram, Music2, Youtube } from "lucide-react";
import { CONTACT_EMAIL, SOCIALS } from "@/lib/config";
import { Logo } from "./logo";

const socialIcon = {
  instagram: Instagram,
  tiktok: Music2,
  youtube: Youtube,
};

export function Footer() {
  return (
    <footer className="border-t border-brand/10 bg-white">
      <div className="container-page grid gap-10 py-14 sm:grid-cols-2 lg:grid-cols-4">
        <div className="sm:col-span-2 lg:col-span-1">
          <Logo />
          <p className="mt-4 max-w-xs text-sm leading-relaxed text-muted">
            Interactive digital gifts made with photos, music and a heartfelt message — for the people who deserve more
            than a text.
          </p>
          <div className="mt-5 flex items-center gap-2">
            {SOCIALS.map((social) => {
              const Icon = socialIcon[social.icon];
              return (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={social.label}
                  className="flex h-9 w-9 items-center justify-center rounded-full border border-brand/15 text-muted transition hover:border-brand hover:text-brand"
                >
                  <Icon className="h-4 w-4" />
                </a>
              );
            })}
          </div>
        </div>

        <div>
          <h3 className="text-sm font-semibold text-ink">Quick Links</h3>
          <ul className="mt-4 space-y-2.5 text-sm text-muted">
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
          <h3 className="text-sm font-semibold text-ink">Legal</h3>
          <ul className="mt-4 space-y-2.5 text-sm text-muted">
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
          <h3 className="text-sm font-semibold text-ink">Say hello</h3>
          <p className="mt-4 text-sm leading-relaxed text-muted">
            Questions, ideas or a template you wish existed? We read every message.
          </p>
          <a href={`mailto:${CONTACT_EMAIL}`} className="btn-secondary mt-4 !px-4 !py-2 text-xs">
            Email us
          </a>
        </div>
      </div>

      <div className="border-t border-brand/10">
        <div className="container-page flex flex-col items-center justify-between gap-3 py-6 text-xs text-muted sm:flex-row">
          <p>Made with ♥ by LoveDigitalGift</p>
          <p>© 2026 LoveDigitalGift. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
