import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/config";
import { TEMPLATES } from "@/templates/registry";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const staticRoutes = ["", "/templates", "/terms", "/privacy"].map((route) => ({
    url: `${SITE_URL}${route}`,
    lastModified: now,
    changeFrequency: "monthly" as const,
    priority: route === "" ? 1 : 0.7,
  }));

  const templateRoutes = TEMPLATES.map((template) => ({
    url: `${SITE_URL}/templates/${template.slug}`,
    lastModified: now,
    changeFrequency: "monthly" as const,
    priority: 0.6,
  }));

  return [...staticRoutes, ...templateRoutes];
}
