import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { GiftExperience } from "@/components/gift/gift-experience";
import { getPublicGift } from "@/lib/gifts";
import { getTemplate } from "@/templates/registry";

export const dynamic = "force-dynamic";

type Props = { params: Promise<{ id: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const gift = getPublicGift(id);
  if (!gift) return { title: "Gift not found" };

  const template = getTemplate(gift.template_slug);
  const title = `A gift for ${gift.recipient_name || "you"}`;
  const description = template
    ? `Open your ${template.name.toLowerCase()} — a little world of photos, music and words made just for you.`
    : "Open your interactive digital gift.";

  return {
    title,
    description,
    robots: { index: false, follow: false },
    openGraph: {
      title,
      description,
      type: "website",
      images: [{ url: "/og-image.png", width: 1200, height: 630, alt: title }],
    },
    twitter: { card: "summary_large_image", title, description, images: ["/og-image.png"] },
  };
}

export default async function GiftPage({ params }: Props) {
  const { id } = await params;
  const gift = getPublicGift(id);
  if (!gift) notFound();

  const template = getTemplate(gift.template_slug);
  if (!template) notFound();

  return (
    <GiftExperience
      gift={{
        id: gift.id,
        recipientName: gift.recipient_name,
        content: gift.content,
        music: gift.music,
        themeColor: gift.theme_color,
        templateSlug: gift.template_slug,
      }}
    />
  );
}
