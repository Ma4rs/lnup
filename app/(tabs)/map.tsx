import { View, Text } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";

export default function MapScreen() {
  const insets = useSafeAreaInsets();

  return (
    <View className="flex-1 bg-background" style={{ paddingTop: insets.top }}>
      <View className="px-4 pt-4 pb-3">
        <Text className="text-2xl font-bold text-text-primary">Karte</Text>
      </View>

      {/* Placeholder until Google Maps API key is configured */}
      <View className="flex-1 items-center justify-center px-8">
        <View className="w-20 h-20 rounded-full bg-card items-center justify-center mb-4">
          <Ionicons name="map-outline" size={40} color="#6C5CE7" />
        </View>
        <Text className="text-lg font-semibold text-text-primary text-center mb-2">
          Karte kommt bald
        </Text>
        <Text className="text-sm text-text-secondary text-center">
          Hier siehst du alle Events auf einer interaktiven Karte.{"\n"}
          Google Maps API Key wird benötigt.
        </Text>
      </View>
    </View>
  );
}
