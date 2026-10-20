import { z } from "zod";

export const giftMusicSchema = z.object({
  type: z.enum(["library", "upload"]),
  url: z.string().min(1).max(500),
  name: z.string().min(1).max(120),
});

export const qrSettingsSchema = z.object({
  shape: z.enum(["heart", "square"]),
  fg: z.string().regex(/^#[0-9a-fA-F]{6}$/),
  bg: z.string().regex(/^#[0-9a-fA-F]{6}$/),
  logo: z.boolean().optional(),
});

export const createGiftSchema = z.object({
  templateSlug: z.string().min(1).max(80),
  title: z.string().max(120).optional(),
  recipientName: z.string().max(120).optional().nullable(),
});

export const updateGiftSchema = z.object({
  title: z.string().max(120).optional(),
  recipient_name: z.string().max(120).optional().nullable(),
  content: z.record(z.unknown()).optional(),
  music: giftMusicSchema.optional().nullable(),
  theme_color: z
    .string()
    .regex(/^#[0-9a-fA-F]{6}$/)
    .optional()
    .nullable(),
  qr_settings: qrSettingsSchema.optional().nullable(),
  status: z.enum(["draft", "published"]).optional(),
});

export const signupSchema = z.object({
  email: z.string().email().max(200),
  password: z.string().min(8, "Use at least 8 characters").max(200),
  name: z.string().max(80).optional(),
});

export const loginSchema = z.object({
  email: z.string().email().max(200),
  password: z.string().min(1).max(200),
});
