import { View, Text } from "react-native";
import { getRankForScore } from "@/lib/ranks";

interface RankBadgeProps {
  score: number;
  showLabel?: boolean;
  size?: "sm" | "md" | "lg";
}

export function RankBadge({ score, showLabel = true, size = "sm" }: RankBadgeProps) {
  const rank = getRankForScore(score);

  const textSize = size === "lg" ? "text-base" : size === "md" ? "text-sm" : "text-xs";

  return (
    <View className="flex-row items-center gap-1">
      <Text className={textSize}>{rank.icon}</Text>
      {showLabel && (
        <Text className={`${textSize} font-medium`} style={{ color: rank.color }}>
          {rank.label}
        </Text>
      )}
    </View>
  );
}
