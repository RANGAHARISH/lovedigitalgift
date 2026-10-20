import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import { GiftEditor } from "@/components/editor/gift-editor";
import { requireUser } from "@/lib/auth";
import { getOwnedGift } from "@/lib/gifts";
import { getTemplate } from "@/templates/registry";

export const metadata: Metadata = {
  title: "Create your gift",
  description: "Personalise your interactive gift with photos, music and your own words.",
};

type Props = {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ gift?: string }>;
};

export default async function CreatePage({ params, searchParams }: Props) {
  const { slug } = await params;
  const { gift: giftId } = await searchParams;

  const template = getTemplate(slug);
  if (!template) notFound();

  const user = await requireUser(`/create/${slug}${giftId ? `?gift=${giftId}` : ""}`);
  const existing = giftId ? getOwnedGift(giftId, user.id) : null;

  if (existing && existing.template_slug !== slug) {
    redirect(`/create/${existing.template_slug}?gift=${existing.id}`);
  }

  return (
    <GiftEditor
      slug={template.slug}
      templateName={template.name}
      accent={template.accent}
      fields={template.fields}
      defaultContent={template.defaultContent}
      initialGift={
        existing
          ? {
              id: existing.id,
              title: existing.title,
              recipient_name: existing.recipient_name,
              content: existing.content,
              music: existing.music,
              theme_color: existing.theme_color,
              qr_settings: existing.qr_settings,
              status: existing.status,
            }
          : null
      }
    />
  );
}
