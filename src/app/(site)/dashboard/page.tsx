import type { Metadata } from "next";
import { DashboardClient } from "@/components/dashboard/dashboard-client";
import { requireUser } from "@/lib/auth";
import { listGifts } from "@/lib/gifts";

export const metadata: Metadata = {
  title: "My Dashboard",
  description: "Manage, edit and share the interactive digital gifts you have created.",
};

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const user = await requireUser("/dashboard");
  const gifts = listGifts(user.id);

  return (
    <DashboardClient
      name={user.name ?? user.email.split("@")[0]}
      gifts={gifts.map((gift) => ({
        id: gift.id,
        title: gift.title,
        recipient_name: gift.recipient_name,
        template_slug: gift.template_slug,
        status: gift.status,
        views: gift.views,
        updated_at: gift.updated_at,
        created_at: gift.created_at,
        qr_settings: gift.qr_settings,
      }))}
    />
  );
}
