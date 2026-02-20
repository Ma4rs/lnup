import { View, Text, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { TrustBadge } from "./TrustBadge";
import { RankBadge } from "./RankBadge";
import { formatEventDate, formatTime } from "@/lib/utils";
import { useEventStore } from "@/stores/eventStore";
import type { Event } from "@/types";

interface EventCardProps {
  event: Event;
}

export function EventCard({ event }: EventCardProps) {
  const router = useRouter();
  const toggleSave = useEventStore((s) => s.toggleSave);
  const savedIds = useEventStore((s) => s.savedEventIds);
  const isSaved = savedIds.has(event.id);

  return (
    <TouchableOpacity
      onPress={() => router.push(`/event/${event.id}`)}
      activeOpacity={0.7}
      className="mx-4 mb-3 rounded-2xl bg-card border border-border p-4"
    >
      {/* Header: Trust badge + Creator info */}
      <View className="flex-row items-center justify-between mb-2">
        <View className="flex-row items-center gap-2">
          <TrustBadge sourceType={event.source_type} />
          {event.creator && (
            <View className="flex-row items-center gap-1.5">
              <RankBadge score={event.creator.trust_score} />
              <Text className="text-xs text-text-muted">
                · {event.creator.display_name}
                {event.creator.trust_score > 0 && ` (${event.creator.trust_score})`}
              </Text>
            </View>
          )}
        </View>
      </View>

      {/* Title */}
      <Text className="text-lg font-bold text-text-primary mb-1">
        {event.title}
      </Text>

      {/* Description */}
      <Text className="text-sm text-text-secondary mb-3" numberOfLines={2}>
        {event.description}
      </Text>

      {/* Details Row */}
      <View className="flex-row items-center flex-wrap gap-3 mb-3">
        <View className="flex-row items-center gap-1">
          <Ionicons name="location-outline" size={14} color="#A0A0B8" />
          <Text className="text-xs text-text-secondary" numberOfLines={1}>
            {event.venue?.name ?? "Unbekannt"}
          </Text>
        </View>
        <View className="flex-row items-center gap-1">
          <Ionicons name="calendar-outline" size={14} color="#A0A0B8" />
          <Text className="text-xs text-text-secondary">
            {formatEventDate(event.event_date)}
          </Text>
        </View>
        <View className="flex-row items-center gap-1">
          <Ionicons name="time-outline" size={14} color="#A0A0B8" />
          <Text className="text-xs text-text-secondary">
            {formatTime(event.time_start)}
            {event.time_end && ` – ${formatTime(event.time_end)}`}
          </Text>
        </View>
        {event.price_info && (
          <View className="flex-row items-center gap-1">
            <Ionicons name="pricetag-outline" size={14} color="#A0A0B8" />
            <Text className="text-xs text-text-secondary">{event.price_info}</Text>
          </View>
        )}
      </View>

      {/* Footer: Stats + Save button */}
      <View className="flex-row items-center justify-between border-t border-border pt-3">
        <View className="flex-row items-center gap-4">
          <View className="flex-row items-center gap-1">
            <Ionicons name="bookmark-outline" size={14} color="#6B6B80" />
            <Text className="text-xs text-text-muted">{event.saves_count}</Text>
          </View>
          {event.confirmations_count > 0 && (
            <View className="flex-row items-center gap-1">
              <Ionicons name="checkmark-circle-outline" size={14} color="#6B6B80" />
              <Text className="text-xs text-text-muted">{event.confirmations_count}</Text>
            </View>
          )}
          {event.photos_count > 0 && (
            <View className="flex-row items-center gap-1">
              <Ionicons name="camera-outline" size={14} color="#6B6B80" />
              <Text className="text-xs text-text-muted">{event.photos_count}</Text>
            </View>
          )}
          {event.source_type === "community" && event.creator?.rank === "newbie" && (
            <View className="flex-row items-center gap-1">
              <Ionicons name="alert-circle-outline" size={12} color="#FFC107" />
              <Text className="text-xs text-warning">Unbestätigt</Text>
            </View>
          )}
        </View>

        <TouchableOpacity
          onPress={() => toggleSave(event.id)}
          className="flex-row items-center gap-1 rounded-full px-3 py-1.5 bg-card-hover"
        >
          <Ionicons
            name={isSaved ? "bookmark" : "bookmark-outline"}
            size={16}
            color={isSaved ? "#6C5CE7" : "#A0A0B8"}
          />
          <Text
            className={`text-xs font-medium ${
              isSaved ? "text-primary" : "text-text-secondary"
            }`}
          >
            {isSaved ? "Gespeichert" : "Merken"}
          </Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
}
