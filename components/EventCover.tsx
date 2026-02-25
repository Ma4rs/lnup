import { View, Text } from "react-native";
import { Image } from "expo-image";
import { Ionicons } from "@expo/vector-icons";
import { getCategoryIcon, getCategoryLabel, getCategoryGradient } from "@/lib/categories";
import type { EventCategory } from "@/types";

interface EventCoverProps {
  category: EventCategory;
  imageUrl?: string | null;
  size?: "card" | "detail";
}

export function EventCover({ category, imageUrl, size = "card" }: EventCoverProps) {
  const [colorStart, colorEnd] = getCategoryGradient(category);
  const isDetail = size === "detail";

  if (imageUrl) {
    const imageHeight = isDetail ? 220 : 120;
    return (
      <View style={{ backgroundColor: colorStart }}>
        <View style={{ height: imageHeight }}>
          <Image
            source={{ uri: imageUrl }}
            style={{ width: "100%", height: "100%" }}
            contentFit="cover"
            transition={200}
          />
        </View>
        <View
          className="flex-row items-center justify-between px-3 py-1.5"
          style={{ backgroundColor: colorStart + "20" }}
        >
          <View className="flex-row items-center gap-1.5">
            <Ionicons name={getCategoryIcon(category) as any} size={12} color={colorStart} />
            <Text style={{ color: colorStart }} className="text-xs font-semibold">
              {getCategoryLabel(category)}
            </Text>
          </View>
        </View>
      </View>
    );
  }

  const placeholderHeight = isDetail ? 160 : 90;
  return (
    <View
      className="items-center justify-center"
      style={{ height: placeholderHeight, backgroundColor: colorStart }}
    >
      <View
        className="absolute inset-0"
        style={{ backgroundColor: "rgba(0,0,0,0.15)" }}
      />
      <Ionicons
        name={getCategoryIcon(category) as any}
        size={isDetail ? 40 : 28}
        color="rgba(255,255,255,0.85)"
      />
      <Text className={`${isDetail ? "text-base" : "text-xs"} font-bold text-white/80 mt-1`}>
        {getCategoryLabel(category)}
      </Text>
    </View>
  );
}
