import type { ComponentType } from "react";

export type Occasion =
  | "birthday"
  | "anniversary"
  | "wedding"
  | "valentine"
  | "graduation"
  | "christmas"
  | "friendship"
  | "thank-you"
  | "apology"
  | "new-year"
  | "other";

export type FieldDef =
  | {
      key: string;
      label: string;
      type: "text" | "textarea" | "date" | "color";
      max?: number;
      placeholder?: string;
      help?: string;
    }
  | {
      key: string;
      label: string;
      type: "images";
      max: number;
      captions?: boolean;
      help?: string;
    }
  | {
      key: string;
      label: string;
      type: "list";
      itemLabel: string;
      max: number;
      placeholder?: string;
      help?: string;
    };

export type PhotoItem = { url: string; caption?: string };

export type TemplateRenderProps = {
  content: Record<string, any>;
  accent?: string;
  preview?: boolean;
};

export type TemplateSummary = {
  slug: string;
  name: string;
  occasion: Occasion;
  occasionLabel?: string;
  description: string;
  emoji: string;
  gradient: [string, string];
  accent: string;
};

export type TemplateDef = TemplateSummary & {
  fields: FieldDef[];
  defaultContent: Record<string, any>;
  Component: ComponentType<TemplateRenderProps>;
};

export { OCCASION_LABELS, FILTER_OCCASIONS } from "./occasions";
