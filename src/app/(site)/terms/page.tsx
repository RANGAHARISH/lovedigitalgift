import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Terms & Conditions",
  description: "The terms that apply when you create or receive a whishmydear.com digital gift.",
};

const SECTIONS = [
  {
    title: "1. About this service",
    body: "whishmydear.com lets you build a personalised web page (a “gift”) from a template, add your own text, photos and music, and share it with a unique link or QR code. These terms apply to anyone who creates an account or opens a gift.",
  },
  {
    title: "2. Your account",
    body: "You need an account to create gifts. You are responsible for keeping your password safe and for everything done through your account. Use a real email address so we can help you recover access.",
  },
  {
    title: "3. Your content",
    body: "You keep ownership of the photos, text and audio you upload. By uploading them you confirm you have the right to use them and you give us permission to store and display them for the purpose of showing your gift to the people you share it with.",
  },
  {
    title: "4. Music and copyright",
    body: "You are responsible for any audio you upload. Do not upload commercial music you do not have a licence for. The built-in tracks in the editor are generated for this project and can be used inside your gifts without additional permission.",
  },
  {
    title: "5. Acceptable use",
    body: "Do not use the service to harass, threaten, defame or share intimate images of someone without consent, and do not upload illegal content. We may remove gifts or suspend accounts that break these rules.",
  },
  {
    title: "6. Sharing and privacy of gifts",
    body: "A published gift is readable by anyone who has the link. Do not put sensitive information (passwords, financial details, identification numbers) into a gift. You can delete a gift at any time from your dashboard, which immediately stops the link from working.",
  },
  {
    title: "7. Availability and changes",
    body: "The service is provided as-is. We may change, pause or discontinue features, and we do not guarantee uninterrupted availability. Where possible we will give notice of significant changes.",
  },
  {
    title: "8. Contact",
    body: "Questions about these terms can be sent to hello@whishmydear.com.",
  },
];

export default function TermsPage() {
  return (
    <div className="bg-white py-14 sm:py-20">
      <div className="container-page max-w-3xl">
        <p className="eyebrow">legal</p>
        <h1 className="mt-3 text-[2.5rem] leading-tight sm:text-[3.2rem]">Terms &amp; Conditions</h1>
        <p className="mt-4 text-[13px] text-muted">Last updated: 1 January 2026</p>

        <div className="mt-8 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-xs leading-relaxed text-amber-800">
          <strong>Placeholder text.</strong> This page is a starting point, not legal advice. Have it reviewed by a
          qualified lawyer before you launch publicly.
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
          <Link href="/privacy" className="font-medium text-brand-dark hover:underline">
            Privacy Policy
          </Link>
          .
        </div>
      </div>
    </div>
  );
}
