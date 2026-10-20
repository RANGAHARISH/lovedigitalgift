import fs from "node:fs";
import path from "node:path";
import { createRequire } from "node:module";

type DB = import("node:sqlite").DatabaseSync;

const globalForDb = globalThis as typeof globalThis & { __ldgDb?: DB };

const SCHEMA = `
CREATE TABLE IF NOT EXISTS users (
  id TEXT PRIMARY KEY,
  email TEXT NOT NULL UNIQUE,
  password_hash TEXT NOT NULL,
  name TEXT,
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS gifts (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  template_slug TEXT NOT NULL,
  title TEXT NOT NULL,
  recipient_name TEXT,
  content TEXT NOT NULL DEFAULT '{}',
  music TEXT,
  theme_color TEXT,
  qr_settings TEXT,
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'published')),
  views INTEGER NOT NULL DEFAULT 0,
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE INDEX IF NOT EXISTS gifts_user_idx ON gifts(user_id, created_at DESC);
CREATE INDEX IF NOT EXISTS gifts_status_idx ON gifts(status);
`;

export function dataDir() {
  const dir = process.env.DATA_DIR
    ? path.resolve(process.env.DATA_DIR)
    : path.join(process.cwd(), "data");
  fs.mkdirSync(path.join(dir, "uploads"), { recursive: true });
  return dir;
}

function createDb(): DB {
  // `node:sqlite` is a Node builtin; load it lazily so bundlers leave the import alone.
  const require = createRequire(import.meta.url);
  const { DatabaseSync } = require("node:sqlite") as typeof import("node:sqlite");
  const db = new DatabaseSync(path.join(dataDir(), "app.db"));
  db.exec("PRAGMA journal_mode = WAL;");
  db.exec(SCHEMA);
  return db;
}

export function getDb(): DB {
  if (!globalForDb.__ldgDb) globalForDb.__ldgDb = createDb();
  return globalForDb.__ldgDb;
}

export type UserRow = {
  id: string;
  email: string;
  password_hash: string;
  name: string | null;
  created_at: string;
};

export type GiftRow = {
  id: string;
  user_id: string;
  template_slug: string;
  title: string;
  recipient_name: string | null;
  content: string;
  music: string | null;
  theme_color: string | null;
  qr_settings: string | null;
  status: "draft" | "published";
  views: number;
  created_at: string;
  updated_at: string;
};
