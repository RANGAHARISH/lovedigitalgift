import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "What whishmydear.com collects, how your photos and gifts are stored, and the choices you have.",
};

const SECTIONS = [
  {
    title: "1. What we collect",
    body: "Account details: your email address, an optional display name, and a securely hashed password. Gift content: the text, photos and audio you add, plus the template you chose. Usage data: an anonymous view counter for each published gift, so you can see whether it has been opened.",
  },
  {
    title: "2. Cookies",
    body: "We use one cookie, which keeps you signed in. It is HTTP-only and is not used for advertising or analytics. There are no third-party tracking cookies in this build.",
  },
  {
    title: "3. How your photos and audio are stored",
    body: "Uploads are stored on the server that runs this site and are served only through the gift page that uses them. They are not indexed by search engines. Published gifts can be opened by anyone with the link, so only share the link with people you trust.",
  },
  {
    title: "4. What we do not do",
    body: "We do not sell your data, we do not use your photos to train models, and we do not send marketing email unless you ask us to.",
  },
  {
    title: "5. Retention and deletion",
    body: "Deleting a gift from your dashboard removes it from the database and stops its link working; uploaded files may remain on the server until routine cleanup. To delete your account and all of its content, contact us and we will remove it.",
  },
  {
    title: "6. Your rights",
    body: "You can ask for a copy of your data, ask us to correct it, or ask us to delete it by emailing hello@whishmydear.com. Depending on where you live you may have additional statutory rights.",
  },
  {
    title: "7. Children",
    body: "The service is not intended for children under 13. If you believe a child has created an account, contact us and we will remove it.",
  },
  {
    title: "8. Changes to this policy",
    body: "If this policy changes in a meaningful way we will update the date below and, where appropriate, tell you by email.",
  },
];

export default function PrivacyPage() {
  return (
    <div className="bg-white py-14 sm:py-20">
      <div className="container-page max-w-3xl">
        <p className="eyebrow">legal</p>
        <h1 className="mt-3 text-[2.5rem] leading-tight sm:text-[3.2rem]">Privacy Policy</h1>
        <p className="mt-4 text-[13px] text-muted">Last updated: 1 January 2026</p>

        <div className="mt-8 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-xs leading-relaxed text-amber-800">
          <strong>Placeholder text.</strong> Describe your real hosting, retention period and legal basis before
          launching publicly. Have it reviewed by a qualified lawyer.
        </div>

        <div className="mt-10 space-y-8">
          {SECTIONS.map((section) => (
            <section key={section.title}>
              <h2 className="text-[19px] leading-snug">{section.title}</h2>
              <p className="mt-2.5 text-[14px] leading-[1.8] text-muted">{section.body}</p>
            </section>
          ))}
        </div>

        <div className="mt-12 border-t border-brand/10 pt-6 text-sm text-muted">
          See also our{" "}
          <Link href="/terms" className="font-medium text-brand-dark hover:underline">
            Terms &amp; Conditions
          </Link>
          .
        </div>
      </div>
    </div>
  );
}
