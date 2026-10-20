export const SITE_NAME = "whishmydear.com";

export const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL || "https://whishmydear.com"
).replace(/\/$/, "");

export const CONTACT_EMAIL =
  process.env.NEXT_PUBLIC_CONTACT_EMAIL || "hello@whishmydear.com";

export const SOCIALS = [
  { label: "Instagram", href: "https://www.instagram.com/whishmydear", icon: "instagram" as const },
  { label: "TikTok", href: "https://www.tiktok.com/@whishmydear", icon: "tiktok" as const },
  { label: "YouTube", href: "https://www.youtube.com/@whishmydear", icon: "youtube" as const },
];

export type MusicTrack = {
  id: string;
  name: string;
  mood: string;
  url: string;
};

/** Built-in royalty-free (synthesised) background tracks. */
export const MUSIC_LIBRARY: MusicTrack[] = [
  { id: "romantic-piano", name: "Romantic Piano", mood: "Tender", url: "/music/romantic-piano.wav" },
  { id: "happy-birthday", name: "Happy Birthday Vibes", mood: "Playful", url: "/music/happy-birthday.wav" },
  { id: "soft-acoustic", name: "Soft Acoustic", mood: "Warm", url: "/music/soft-acoustic.wav" },
  { id: "cinematic-love", name: "Cinematic Love", mood: "Dreamy", url: "/music/cinematic-love.wav" },
  { id: "celebration", name: "Celebration", mood: "Upbeat", url: "/music/celebration.wav" },
  { id: "lofi-chill", name: "Lo-fi Chill", mood: "Mellow", url: "/music/lofi-chill.wav" },
  { id: "wedding-bells", name: "Wedding Bells", mood: "Elegant", url: "/music/wedding-bells.wav" },
  { id: "christmas-bells", name: "Christmas Bells", mood: "Festive", url: "/music/christmas-bells.wav" },
];

export const NAV_LINKS = [
  { href: "/templates", label: "Templates" },
  { href: "/dashboard", label: "Dashboard" },
];
