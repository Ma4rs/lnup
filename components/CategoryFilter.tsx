import { ScrollView, TouchableOpacity, Text } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { EVENT_CATEGORIES } from "@/lib/categories";
import type { EventCategory } from "@/types";

interface CategoryFilterProps {
  selected: EventCategory | null;
  onSelect: (category: EventCategory | null) => void;
}

export function CategoryFilter({ selected, onSelect }: CategoryFilterProps) {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerClassName="px-4 gap-2"
    >
      <TouchableOpacity
        onPress={() => onSelect(null)}
        className={`flex-row items-center gap-1.5 rounded-full px-4 py-2 ${
          selected === null ? "bg-primary" : "bg-card border border-border"
        }`}
      >
        <Ionicons
          name="apps"
          size={14}
          color={selected === null ? "#FFFFFF" : "#A0A0B8"}
        />
        <Text
          className={`text-sm font-medium ${
            selected === null ? "text-white" : "text-text-secondary"
          }`}
        >
          Alle
        </Text>
      </TouchableOpacity>

      {EVENT_CATEGORIES.map((cat) => (
        <TouchableOpacity
          key={cat.id}
          onPress={() => onSelect(selected === cat.id ? null : cat.id)}
          className={`flex-row items-center gap-1.5 rounded-full px-4 py-2 ${
            selected === cat.id ? "bg-primary" : "bg-card border border-border"
          }`}
        >
          <Ionicons
            name={cat.icon as any}
            size={14}
            color={selected === cat.id ? "#FFFFFF" : "#A0A0B8"}
          />
          <Text
            className={`text-sm font-medium ${
              selected === cat.id ? "text-white" : "text-text-secondary"
            }`}
          >
            {cat.label}
          </Text>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
}
