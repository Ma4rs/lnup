import { format, isToday, isTomorrow, isThisWeek, isWeekend, parseISO } from "date-fns";
import { de } from "date-fns/locale";
import type { DateFilter, EventSourceType } from "@/types";

export function formatEventDate(dateStr: string): string {
  const date = parseISO(dateStr);
  if (isToday(date)) return "Heute";
  if (isTomorrow(date)) return "Morgen";
  return format(date, "EEE, d. MMM", { locale: de });
}

export function formatTime(timeStr: string): string {
  return timeStr.substring(0, 5);
}

export function matchesDateFilter(dateStr: string, filter: DateFilter): boolean {
  if (filter === "alle") return true;
  const date = parseISO(dateStr);
  switch (filter) {
    case "heute":
      return isToday(date);
    case "morgen":
      return isTomorrow(date);
    case "wochenende":
      return isWeekend(date) && isThisWeek(date);
    case "woche":
      return isThisWeek(date);
    default:
      return true;
  }
}

export function getSourceLabel(source: EventSourceType): string {
  const labels: Record<EventSourceType, string> = {
    api_eventbrite: "Eventbrite",
    api_ticketmaster: "Ticketmaster",
    platform: "LNUP",
    verified_organizer: "Veranstalter",
    verified_user: "Verifiziert",
    community: "Community",
  };
  return labels[source];
}

export function truncate(str: string, maxLength: number): string {
  if (str.length <= maxLength) return str;
  return str.substring(0, maxLength - 3) + "...";
}
