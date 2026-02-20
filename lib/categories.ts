import type { Category, DateFilter } from "@/types";

export const EVENT_CATEGORIES: Category[] = [
  { id: "nightlife", label: "Nightlife", icon: "moon" },
  { id: "food_drink", label: "Food & Drinks", icon: "restaurant" },
  { id: "concert", label: "Konzerte", icon: "musical-notes" },
  { id: "festival", label: "Festivals", icon: "bonfire" },
  { id: "sports", label: "Sport", icon: "football" },
  { id: "art", label: "Kunst", icon: "color-palette" },
  { id: "family", label: "Familie", icon: "people" },
  { id: "other", label: "Sonstiges", icon: "ellipsis-horizontal" },
];

export const DATE_FILTERS: { id: DateFilter; label: string }[] = [
  { id: "heute", label: "Heute" },
  { id: "morgen", label: "Morgen" },
  { id: "wochenende", label: "Wochenende" },
  { id: "woche", label: "Diese Woche" },
  { id: "alle", label: "Alle" },
];

export function getCategoryLabel(id: string): string {
  return EVENT_CATEGORIES.find((c) => c.id === id)?.label ?? id;
}

export function getCategoryIcon(id: string): string {
  return EVENT_CATEGORIES.find((c) => c.id === id)?.icon ?? "ellipsis-horizontal";
}
