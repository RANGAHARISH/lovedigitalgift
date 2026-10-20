import type { Occasion } from "./types";

export const OCCASION_LABELS: Record<Occasion, string> = {
  birthday: "Birthday",
  anniversary: "Anniversary",
  wedding: "Wedding",
  valentine: "Valentine",
  graduation: "Graduation",
  christmas: "Christmas",
  friendship: "Friendship",
  "thank-you": "Thank You",
  apology: "Apology",
  "new-year": "New Year",
  other: "Others",
};

export const FILTER_OCCASIONS: { value: Occasion | "all"; label: string }[] = [
  { value: "all", label: "All" },
  { value: "birthday", label: "Birthday" },
  { value: "anniversary", label: "Anniversary" },
  { value: "wedding", label: "Wedding" },
  { value: "valentine", label: "Valentine" },
  { value: "graduation", label: "Graduation" },
  { value: "christmas", label: "Christmas" },
  { value: "friendship", label: "Friendship" },
  { value: "thank-you", label: "Thank You" },
  { value: "other", label: "Others" },
];
