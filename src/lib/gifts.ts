"server-only";

import { customAlphabet, nanoid } from "nanoid";
import { getDb, type GiftRow } from "./db";
import { getTemplate } from "@/templates/registry";

const giftId = customAlphabet("23456789abcdefghjkmnpqrstuvwxyz", 10);

export type GiftStatus = "draft" | "published";

export type GiftMusic = {
  type: "library" | "upload";
  url: string;
  name: string;
};

export type QrSettings = {
  shape: "heart" | "square";
  fg: string;
  bg: string;
  logo?: boolean;
};

export type Gift = {
  id: string;
  user_id: string;
  template_slug: string;
  title: string;
  recipient_name: string | null;
  content: Record<string, unknown>;
  music: GiftMusic | null;
  theme_color: string | null;
  qr_settings: QrSettings | null;
  status: GiftStatus;
  views: number;
  created_at: string;
  updated_at: string;
};

function parseJson<T>(value: string | null, fallback: T): T {
  if (!value) return fallback;
  try {
    return JSON.parse(value) as T;
  } catch {
    return fallback;
  }
}

function rowToGift(row: GiftRow): Gift {
  return {
    ...row,
    content: parseJson<Record<string, unknown>>(row.content, {}),
    music: parseJson<GiftMusic | null>(row.music, null),
    qr_settings: parseJson<QrSettings | null>(row.qr_settings, null),
  };
}

export function getGift(id: string): Gift | null {
  const row = getDb().prepare("SELECT * FROM gifts WHERE id = ?").get(id) as GiftRow | undefined;
  return row ? rowToGift(row) : null;
}

export function getOwnedGift(id: string, userId: string): Gift | null {
  const row = getDb()
    .prepare("SELECT * FROM gifts WHERE id = ? AND user_id = ?")
    .get(id, userId) as GiftRow | undefined;
  return row ? rowToGift(row) : null;
}

export function getPublicGift(id: string): Gift | null {
  const row = getDb()
    .prepare("SELECT * FROM gifts WHERE id = ? AND status = 'published'")
    .get(id) as GiftRow | undefined;
  return row ? rowToGift(row) : null;
}

export function listGifts(userId: string): Gift[] {
  const rows = getDb()
    .prepare("SELECT * FROM gifts WHERE user_id = ? ORDER BY updated_at DESC")
    .all(userId) as GiftRow[];
  return rows.map(rowToGift);
}

export type CreateGiftInput = {
  userId: string;
  templateSlug: string;
  title?: string;
  recipientName?: string | null;
  content?: Record<string, unknown>;
  music?: GiftMusic | null;
  themeColor?: string | null;
};

export function createGift(input: CreateGiftInput): Gift {
  const template = getTemplate(input.templateSlug);
  if (!template) throw new Error("Unknown template");
  const id = giftId();
  const title = (input.title || `${template.name} gift`).slice(0, 120);
  getDb()
    .prepare(
      `INSERT INTO gifts (id, user_id, template_slug, title, recipient_name, content, music, theme_color)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
    )
    .run(
      id,
      input.userId,
      input.templateSlug,
      title,
      input.recipientName ?? null,
      JSON.stringify(input.content ?? template.defaultContent),
      input.music ? JSON.stringify(input.music) : null,
      input.themeColor ?? template.accent,
    );
  return getGift(id)!;
}

export type UpdateGiftInput = Partial<{
  title: string;
  recipient_name: string | null;
  content: Record<string, unknown>;
  music: GiftMusic | null;
  theme_color: string | null;
  qr_settings: QrSettings | null;
  status: GiftStatus;
}>;

export function updateGift(id: string, userId: string, patch: UpdateGiftInput): Gift | null {
  const existing = getOwnedGift(id, userId);
  if (!existing) return null;

  const sets: string[] = [];
  const values: (string | number | null)[] = [];

  if (patch.title !== undefined) {
    sets.push("title = ?");
    values.push(patch.title.slice(0, 120));
  }
  if (patch.recipient_name !== undefined) {
    sets.push("recipient_name = ?");
    values.push(patch.recipient_name?.slice(0, 120) ?? null);
  }
  if (patch.content !== undefined) {
    sets.push("content = ?");
    values.push(JSON.stringify(patch.content));
  }
  if (patch.music !== undefined) {
    sets.push("music = ?");
    values.push(patch.music ? JSON.stringify(patch.music) : null);
  }
  if (patch.theme_color !== undefined) {
    sets.push("theme_color = ?");
    values.push(patch.theme_color);
  }
  if (patch.qr_settings !== undefined) {
    sets.push("qr_settings = ?");
    values.push(patch.qr_settings ? JSON.stringify(patch.qr_settings) : null);
  }
  if (patch.status !== undefined) {
    sets.push("status = ?");
    values.push(patch.status);
  }

  if (sets.length === 0) return existing;
  sets.push("updated_at = datetime('now')");
  values.push(id, userId);

  getDb()
    .prepare(`UPDATE gifts SET ${sets.join(", ")} WHERE id = ? AND user_id = ?`)
    .run(...values);

  return getOwnedGift(id, userId);
}

export function deleteGift(id: string, userId: string) {
  const result = getDb()
    .prepare("DELETE FROM gifts WHERE id = ? AND user_id = ?")
    .run(id, userId);
  return result.changes > 0;
}

export function duplicateGift(id: string, userId: string): Gift | null {
  const source = getOwnedGift(id, userId);
  if (!source) return null;
  const newId = giftId();
  getDb()
    .prepare(
      `INSERT INTO gifts (id, user_id, template_slug, title, recipient_name, content, music, theme_color, qr_settings, status)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 'draft')`,
    )
    .run(
      newId,
      userId,
      source.template_slug,
      `${source.title} (copy)`.slice(0, 120),
      source.recipient_name,
      JSON.stringify(source.content),
      source.music ? JSON.stringify(source.music) : null,
      source.theme_color,
      source.qr_settings ? JSON.stringify(source.qr_settings) : null,
    );
  return getGift(newId);
}

export function incrementViews(id: string) {
  getDb().prepare("UPDATE gifts SET views = views + 1 WHERE id = ?").run(id);
}

export function newGiftId() {
  return nanoid(10);
}
