import { View, Text, ScrollView, TouchableOpacity } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useEventStore } from "@/stores/eventStore";
import { TrustBadge } from "@/components/TrustBadge";
import { RankBadge } from "@/components/RankBadge";
import { formatEventDate, formatTime } from "@/lib/utils";
import { getCategoryLabel, getCategoryIcon } from "@/lib/categories";

export default function EventDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const event = useEventStore((s) => s.getEventById(id));
  const toggleSave = useEventStore((s) => s.toggleSave);
  const savedIds = useEventStore((s) => s.savedEventIds);

  if (!event) {
    return (
      <View
        className="flex-1 bg-background items-center justify-center"
        style={{ paddingTop: insets.top }}
      >
        <Text className="text-text-secondary">Event nicht gefunden</Text>
      </View>
    );
  }

  const isSaved = savedIds.has(event.id);

  return (
    <View className="flex-1 bg-background" style={{ paddingTop: insets.top }}>
      {/* Header */}
      <View className="flex-row items-center justify-between px-4 py-3">
        <TouchableOpacity
          onPress={() => router.back()}
          className="w-10 h-10 rounded-full bg-card items-center justify-center"
        >
          <Ionicons name="arrow-back" size={20} color="#FFFFFF" />
        </TouchableOpacity>
        <View className="flex-row gap-2">
          <TouchableOpacity
            onPress={() => toggleSave(event.id)}
            className="w-10 h-10 rounded-full bg-card items-center justify-center"
          >
            <Ionicons
              name={isSaved ? "bookmark" : "bookmark-outline"}
              size={20}
              color={isSaved ? "#6C5CE7" : "#FFFFFF"}
            />
          </TouchableOpacity>
          <TouchableOpacity className="w-10 h-10 rounded-full bg-card items-center justify-center">
            <Ionicons name="share-outline" size={20} color="#FFFFFF" />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        <View className="px-4 pb-8">
          {/* Trust Badge + Creator */}
          <View className="flex-row items-center gap-2 mb-3">
            <TrustBadge sourceType={event.source_type} />
            {event.creator && (
              <View className="flex-row items-center gap-1.5">
                <RankBadge score={event.creator.trust_score} />
                <Text className="text-xs text-text-muted">
                  · {event.creator.display_name} ({event.creator.trust_score})
                </Text>
              </View>
            )}
          </View>

          {/* Title */}
          <Text className="text-3xl font-bold text-text-primary mb-2">
            {event.title}
          </Text>

          {/* Category */}
          <View className="flex-row items-center gap-1.5 mb-4">
            <Ionicons
              name={getCategoryIcon(event.category) as any}
              size={16}
              color="#6C5CE7"
            />
            <Text className="text-sm font-medium text-primary">
              {getCategoryLabel(event.category)}
            </Text>
          </View>

          {/* Description */}
          <Text className="text-base text-text-secondary leading-6 mb-6">
            {event.description}
          </Text>

          {/* Info Cards */}
          <View className="gap-3 mb-6">
            {/* Venue */}
            <View className="bg-card rounded-xl border border-border p-4 flex-row items-center gap-3">
              <View className="w-10 h-10 rounded-full bg-primary/10 items-center justify-center">
                <Ionicons name="location" size={20} color="#6C5CE7" />
              </View>
              <View className="flex-1">
                <Text className="text-sm font-semibold text-text-primary">
                  {event.venue?.name}
                </Text>
                <Text className="text-xs text-text-secondary">
                  {event.venue?.address}
                </Text>
              </View>
              <Ionicons name="navigate-outline" size={18} color="#A0A0B8" />
            </View>

            {/* Date & Time */}
            <View className="bg-card rounded-xl border border-border p-4 flex-row items-center gap-3">
              <View className="w-10 h-10 rounded-full bg-primary/10 items-center justify-center">
                <Ionicons name="calendar" size={20} color="#6C5CE7" />
              </View>
              <View>
                <Text className="text-sm font-semibold text-text-primary">
                  {formatEventDate(event.event_date)}
                </Text>
                <Text className="text-xs text-text-secondary">
                  {formatTime(event.time_start)}
                  {event.time_end && ` – ${formatTime(event.time_end)}`} Uhr
                </Text>
              </View>
            </View>

            {/* Price */}
            {event.price_info && (
              <View className="bg-card rounded-xl border border-border p-4 flex-row items-center gap-3">
                <View className="w-10 h-10 rounded-full bg-primary/10 items-center justify-center">
                  <Ionicons name="pricetag" size={20} color="#6C5CE7" />
                </View>
                <Text className="text-sm font-semibold text-text-primary">
                  {event.price_info}
                </Text>
              </View>
            )}
          </View>

          {/* Stats */}
          <View className="flex-row gap-3 mb-6">
            <View className="flex-1 bg-card rounded-xl border border-border p-3 items-center">
              <Ionicons name="bookmark" size={18} color="#6C5CE7" />
              <Text className="text-lg font-bold text-text-primary mt-1">
                {event.saves_count}
              </Text>
              <Text className="text-xs text-text-muted">Gemerkt</Text>
            </View>
            <View className="flex-1 bg-card rounded-xl border border-border p-3 items-center">
              <Ionicons name="checkmark-circle" size={18} color="#00E676" />
              <Text className="text-lg font-bold text-text-primary mt-1">
                {event.confirmations_count}
              </Text>
              <Text className="text-xs text-text-muted">War dabei</Text>
            </View>
            <View className="flex-1 bg-card rounded-xl border border-border p-3 items-center">
              <Ionicons name="camera" size={18} color="#00D2FF" />
              <Text className="text-lg font-bold text-text-primary mt-1">
                {event.photos_count}
              </Text>
              <Text className="text-xs text-text-muted">Fotos</Text>
            </View>
          </View>

          {/* Community warning for unverified events */}
          {event.source_type === "community" &&
            event.creator?.rank === "newbie" && (
              <View className="bg-warning/10 rounded-xl border border-warning/30 p-4 flex-row items-start gap-3 mb-6">
                <Ionicons name="alert-circle" size={20} color="#FFC107" />
                <View className="flex-1">
                  <Text className="text-sm font-semibold text-warning mb-1">
                    Unbestätigtes Event
                  </Text>
                  <Text className="text-xs text-text-secondary">
                    Dieses Event wurde von einem neuen Nutzer erstellt. Details
                    könnten ungenau sein.
                  </Text>
                </View>
              </View>
            )}

          {/* Action Buttons */}
          <View className="gap-3">
            <TouchableOpacity
              onPress={() => toggleSave(event.id)}
              className={`rounded-xl py-4 items-center flex-row justify-center gap-2 ${
                isSaved ? "bg-card border border-primary" : "bg-primary"
              }`}
            >
              <Ionicons
                name={isSaved ? "bookmark" : "bookmark-outline"}
                size={18}
                color="#FFFFFF"
              />
              <Text className="text-white font-bold text-base">
                {isSaved ? "Gespeichert" : "Event merken"}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity className="bg-card border border-border rounded-xl py-4 items-center flex-row justify-center gap-2">
              <Ionicons name="flag-outline" size={18} color="#FF5252" />
              <Text className="text-danger font-medium text-sm">
                Event melden
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}
