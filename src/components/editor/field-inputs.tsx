"use client";

import { ArrowDown, ArrowUp, Plus, Trash2 } from "lucide-react";
import type { FieldDef, PhotoItem } from "@/templates/types";
import { PhotoUploader } from "./photo-uploader";
import { cn } from "@/lib/utils";

const SWATCHES = ["#D7263D", "#A4122A", "#FFA6B5", "#A4122A", "#FF8FA3", "#FFC9D3", "#C33B52", "#2B1A20", "#C33B52"];

function Label({
  field,
  count,
}: {
  field: Extract<FieldDef, { type: "text" | "textarea" | "date" | "color" }>;
  count?: number;
}) {
  return (
    <span className="field-label">
      <span>{field.label}</span>
      {field.max && count !== undefined ? (
        <span className={cn("text-[11px] font-normal", count > field.max * 0.9 ? "text-amber-600" : "text-muted")}>
          {count}/{field.max}
        </span>
      ) : null}
    </span>
  );
}

function Help({ text }: { text?: string }) {
  if (!text) return null;
  return <p className="mt-1 text-[11px] leading-relaxed text-muted">{text}</p>;
}

export function FieldInput({
  field,
  value,
  onChange,
}: {
  field: FieldDef;
  value: unknown;
  onChange: (value: unknown) => void;
}) {
  if (field.type === "text") {
    const text = typeof value === "string" ? value : "";
    return (
      <div>
        <label className="block">
          <Label field={field} count={text.length} />
          <input
            type="text"
            className="field-input"
            value={text}
            maxLength={field.max}
            placeholder={field.placeholder}
            onChange={(event) => onChange(event.target.value)}
          />
        </label>
        <Help text={field.help} />
      </div>
    );
  }

  if (field.type === "textarea") {
    const text = typeof value === "string" ? value : "";
    return (
      <div>
        <label className="block">
          <Label field={field} count={text.length} />
          <textarea
            className="field-input min-h-[112px] resize-y leading-relaxed"
            value={text}
            maxLength={field.max}
            placeholder={field.placeholder}
            onChange={(event) => onChange(event.target.value)}
          />
        </label>
        <Help text={field.help} />
      </div>
    );
  }

  if (field.type === "date") {
    return (
      <div>
        <label className="block">
          <Label field={field} />
          <input
            type="date"
            className="field-input"
            value={typeof value === "string" ? value : ""}
            onChange={(event) => onChange(event.target.value)}
          />
        </label>
        <Help text={field.help} />
      </div>
    );
  }

  if (field.type === "color") {
    const colour = typeof value === "string" ? value : "#D7263D";
    return (
      <div>
        <Label field={field} />
        <div className="flex flex-wrap items-center gap-2">
          {SWATCHES.map((swatch) => (
            <button
              key={swatch}
              type="button"
              onClick={() => onChange(swatch)}
              className={cn(
                "h-7 w-7 rounded-full border-2 transition",
                colour.toLowerCase() === swatch.toLowerCase() ? "border-ink" : "border-white shadow-sm",
              )}
              style={{ backgroundColor: swatch }}
              aria-label={`Use ${swatch}`}
            />
          ))}
          <input
            type="color"
            value={colour}
            onChange={(event) => onChange(event.target.value)}
            className="h-8 w-10 cursor-pointer rounded-lg border border-brand/20 bg-white p-1"
            aria-label="Custom colour"
          />
        </div>
        <Help text={field.help} />
      </div>
    );
  }

  if (field.type === "images") {
    const photos = Array.isArray(value) ? (value as PhotoItem[]) : [];
    return (
      <div>
        <div className="field-label">
          <span>{field.label}</span>
          <span className="text-[11px] font-normal text-muted">
            {photos.length}/{field.max}
          </span>
        </div>
        <PhotoUploader photos={photos} max={field.max} captions={field.captions} onChange={(next) => onChange(next)} />
        <Help text={field.help} />
      </div>
    );
  }

  if (field.type !== "list") return null;

  const items = Array.isArray(value) ? (value as string[]) : [];
  return (
    <div>
      <div className="field-label">
        <span>{field.label}</span>
        <span className="text-[11px] font-normal text-muted">
          {items.length}/{field.max}
        </span>
      </div>
      <div className="space-y-2">
        {items.map((item, index) => (
          <div key={index} className="flex items-center gap-1.5">
            <input
              value={item}
              maxLength={180}
              placeholder={field.placeholder ?? `${field.itemLabel} ${index + 1}`}
              onChange={(event) => {
                const next = [...items];
                next[index] = event.target.value;
                onChange(next);
              }}
              className="field-input flex-1 !rounded-xl !py-2 text-xs"
            />
            <div className="flex shrink-0 items-center gap-0.5 rounded-xl border border-brand/10 bg-white p-0.5">
              <button
                type="button"
                disabled={index === 0}
                onClick={() => {
                  const next = [...items];
                  [next[index - 1], next[index]] = [next[index], next[index - 1]];
                  onChange(next);
                }}
                className="rounded-lg p-1 text-muted hover:bg-brand-soft disabled:opacity-30"
                aria-label="Move up"
              >
                <ArrowUp className="h-3.5 w-3.5" />
              </button>
              <button
                type="button"
                disabled={index === items.length - 1}
                onClick={() => {
                  const next = [...items];
                  [next[index + 1], next[index]] = [next[index], next[index + 1]];
                  onChange(next);
                }}
                className="rounded-lg p-1 text-muted hover:bg-brand-soft disabled:opacity-30"
                aria-label="Move down"
              >
                <ArrowDown className="h-3.5 w-3.5" />
              </button>
              <button
                type="button"
                onClick={() => onChange(items.filter((_, itemIndex) => itemIndex !== index))}
                className="rounded-lg p-1 text-muted hover:bg-red-50 hover:text-red-600"
                aria-label="Remove item"
              >
                <Trash2 className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>
      <button
        type="button"
        disabled={items.length >= field.max}
        onClick={() => onChange([...items, ""])}
        className="mt-2.5 inline-flex items-center gap-1.5 rounded-full border border-dashed border-brand/40 px-3.5 py-1.5 text-xs font-medium text-brand-dark transition hover:bg-brand-soft/40 disabled:opacity-40"
      >
        <Plus className="h-3.5 w-3.5" /> Add {field.itemLabel.toLowerCase()}
      </button>
      <Help text={field.help} />
    </div>
  );
}
