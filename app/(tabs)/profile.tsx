import { View, Text, TouchableOpacity, ScrollView } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useAuthStore } from "@/stores/authStore";
import { getRankForScore, getNextRank, getProgressToNextRank } from "@/lib/ranks";

export default function ProfileScreen() {
  const insets = useSafeAreaInsets();
  const user = useAuthStore((s) => s.user);
  const logout = useAuthStore((s) => s.logout);

  if (!user) {
    return (
      <View
        className="flex-1 bg-background items-center justify-center px-8"
        style={{ paddingTop: insets.top }}
      >
        <Text className="text-4xl mb-4">👤</Text>
        <Text className="text-lg font-semibold text-text-primary text-center mb-2">
          Nicht angemeldet
        </Text>
        <Text className="text-sm text-text-secondary text-center mb-6">
          Melde dich an, um Events zu erstellen und deinen Rang aufzubauen.
        </Text>
        <TouchableOpacity className="bg-primary rounded-xl px-8 py-3">
          <Text className="text-white font-bold text-base">Anmelden</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const rank = getRankForScore(user.trust_score);
  const nextRank = getNextRank(rank.id);
  const progress = getProgressToNextRank(user.trust_score);

  return (
    <ScrollView
      className="flex-1 bg-background"
      contentContainerStyle={{ paddingTop: insets.top }}
      showsVerticalScrollIndicator={false}
    >
      {/* Profile Header */}
      <View className="px-4 pt-4 pb-6">
        <View className="items-center">
          {/* Avatar */}
          <View className="w-20 h-20 rounded-full bg-card border-2 border-primary items-center justify-center mb-3">
            <Text className="text-3xl">{rank.icon}</Text>
          </View>

          <Text className="text-xl font-bold text-text-primary">
            {user.display_name}
          </Text>
          <Text className="text-sm text-text-muted mb-2">@{user.username}</Text>

          {/* Rank Badge */}
          <View
            className="rounded-full px-4 py-1.5 mb-4"
            style={{ backgroundColor: rank.color + "20" }}
          >
            <Text className="text-sm font-bold" style={{ color: rank.color }}>
              {rank.icon} {rank.label}
            </Text>
          </View>

          {/* Points */}
          <Text className="text-3xl font-bold text-text-primary mb-1">
            {user.trust_score}
          </Text>
          <Text className="text-sm text-text-secondary mb-4">Punkte</Text>

          {/* Progress Bar */}
          {nextRank && (
            <View className="w-full px-4">
              <View className="flex-row justify-between mb-1.5">
                <Text className="text-xs text-text-muted">{rank.label}</Text>
                <Text className="text-xs text-text-muted">
                  {nextRank.icon} {nextRank.label}
                </Text>
              </View>
              <View className="h-2.5 bg-card rounded-full overflow-hidden">
                <View
                  className="h-full rounded-full"
                  style={{
                    width: `${progress * 100}%`,
                    backgroundColor: rank.color,
                  }}
                />
              </View>
              <Text className="text-xs text-text-muted text-center mt-1.5">
                Noch {nextRank.min_score - user.trust_score} Punkte bis{" "}
                {nextRank.label}
              </Text>
            </View>
          )}
        </View>
      </View>

      {/* Stats Grid */}
      <View className="flex-row mx-4 gap-3 mb-6">
        <View className="flex-1 bg-card rounded-xl p-4 items-center border border-border">
          <Text className="text-2xl font-bold text-text-primary">
            {user.events_posted}
          </Text>
          <Text className="text-xs text-text-secondary mt-1">Events</Text>
        </View>
        <View className="flex-1 bg-card rounded-xl p-4 items-center border border-border">
          <Text className="text-2xl font-bold text-text-primary">
            {user.events_confirmed}
          </Text>
          <Text className="text-xs text-text-secondary mt-1">Bestätigt</Text>
        </View>
        <View className="flex-1 bg-card rounded-xl p-4 items-center border border-border">
          <Text className="text-2xl font-bold text-success">
            {user.reports_count}
          </Text>
          <Text className="text-xs text-text-secondary mt-1">Reports</Text>
        </View>
      </View>

      {/* Verification Status */}
      <View className="mx-4 mb-6">
        <Text className="text-sm font-semibold text-text-primary mb-3">
          Verifizierung
        </Text>
        <View className="bg-card rounded-xl border border-border p-4 gap-3">
          <View className="flex-row items-center gap-3">
            <Ionicons
              name={user.email_verified ? "checkmark-circle" : "close-circle"}
              size={20}
              color={user.email_verified ? "#00E676" : "#6B6B80"}
            />
            <Text className="text-sm text-text-secondary">E-Mail verifiziert</Text>
          </View>
          <View className="flex-row items-center gap-3">
            <Ionicons
              name={user.phone_verified ? "checkmark-circle" : "close-circle"}
              size={20}
              color={user.phone_verified ? "#00E676" : "#6B6B80"}
            />
            <Text className="text-sm text-text-secondary">
              Telefon verifiziert
            </Text>
          </View>
        </View>
      </View>

      {/* Member Since */}
      <View className="mx-4 mb-6">
        <View className="bg-card rounded-xl border border-border p-4">
          <View className="flex-row items-center gap-3">
            <Ionicons name="calendar-outline" size={20} color="#A0A0B8" />
            <Text className="text-sm text-text-secondary">
              Mitglied seit{" "}
              {new Date(user.created_at).toLocaleDateString("de-DE", {
                month: "long",
                year: "numeric",
              })}
            </Text>
          </View>
        </View>
      </View>

      {/* Logout */}
      <View className="mx-4 mb-12">
        <TouchableOpacity
          onPress={logout}
          className="bg-card rounded-xl border border-border p-4 flex-row items-center justify-center gap-2"
        >
          <Ionicons name="log-out-outline" size={20} color="#FF5252" />
          <Text className="text-sm font-medium text-danger">Abmelden</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}
