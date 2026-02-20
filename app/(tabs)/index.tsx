import { View, Text, FlatList, RefreshControl } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useState, useMemo } from "react";
import { EventCard } from "@/components/EventCard";
import { CategoryFilter } from "@/components/CategoryFilter";
import { DateFilter } from "@/components/DateFilter";
import { useEventStore } from "@/stores/eventStore";
import { useFilterStore } from "@/stores/filterStore";
import { matchesDateFilter } from "@/lib/utils";
import { COLORS } from "@/lib/constants";

export default function FeedScreen() {
  const insets = useSafeAreaInsets();
  const events = useEventStore((s) => s.events);
  const fetchEvents = useEventStore((s) => s.fetchEvents);
  const { dateFilter, categoryFilter, setDateFilter, setCategoryFilter, city } =
    useFilterStore();
  const [refreshing, setRefreshing] = useState(false);

  const filteredEvents = useMemo(() => {
    return events.filter((event) => {
      if (!matchesDateFilter(event.event_date, dateFilter)) return false;
      if (categoryFilter && event.category !== categoryFilter) return false;
      return event.status === "active";
    });
  }, [events, dateFilter, categoryFilter]);

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchEvents();
    setRefreshing(false);
  };

  return (
    <View className="flex-1 bg-background" style={{ paddingTop: insets.top }}>
      {/* Header */}
      <View className="px-4 pb-3 pt-4">
        <Text className="text-xs font-semibold uppercase tracking-wider text-primary mb-1">
          Local Nights, Unique Places
        </Text>
        <View className="flex-row items-center justify-between">
          <Text className="text-2xl font-bold text-text-primary">LNUP</Text>
          <View className="flex-row items-center gap-1 bg-card rounded-full px-3 py-1.5">
            <Text className="text-xs text-text-secondary">📍 {city}</Text>
          </View>
        </View>
      </View>

      {/* Date Filter */}
      <View className="mb-2">
        <DateFilter selected={dateFilter} onSelect={setDateFilter} />
      </View>

      {/* Category Filter */}
      <View className="mb-3">
        <CategoryFilter selected={categoryFilter} onSelect={setCategoryFilter} />
      </View>

      {/* Event List */}
      <FlatList
        data={filteredEvents}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <EventCard event={item} />}
        contentContainerStyle={{ paddingBottom: 20 }}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={COLORS.primary}
          />
        }
        ListEmptyComponent={
          <View className="items-center justify-center py-20 px-8">
            <Text className="text-4xl mb-4">🔍</Text>
            <Text className="text-lg font-semibold text-text-primary text-center mb-2">
              Keine Events gefunden
            </Text>
            <Text className="text-sm text-text-secondary text-center">
              Versuch andere Filter oder schau später nochmal vorbei.
            </Text>
          </View>
        }
      />
    </View>
  );
}
