import { create } from "zustand";
import type { EventCategory, DateFilter } from "@/types";

interface FilterState {
  dateFilter: DateFilter;
  categoryFilter: EventCategory | null;
  searchQuery: string;
  city: string;
  setDateFilter: (filter: DateFilter) => void;
  setCategoryFilter: (category: EventCategory | null) => void;
  setSearchQuery: (query: string) => void;
  setCity: (city: string) => void;
  resetFilters: () => void;
}

export const useFilterStore = create<FilterState>((set) => ({
  dateFilter: "alle",
  categoryFilter: null,
  searchQuery: "",
  city: "",

  setDateFilter: (dateFilter) => set({ dateFilter }),
  setCategoryFilter: (categoryFilter) => set({ categoryFilter }),
  setSearchQuery: (searchQuery) => set({ searchQuery }),
  setCity: (city) => set({ city }),
  resetFilters: () =>
    set({ dateFilter: "alle", categoryFilter: null, searchQuery: "" }),
}));
