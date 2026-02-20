import { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { EVENT_CATEGORIES } from "@/lib/categories";
import { COLORS } from "@/lib/constants";
import type { EventCategory } from "@/types";

export default function CreateEventScreen() {
  const insets = useSafeAreaInsets();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [venueName, setVenueName] = useState("");
  const [address, setAddress] = useState("");
  const [date, setDate] = useState("");
  const [timeStart, setTimeStart] = useState("");
  const [timeEnd, setTimeEnd] = useState("");
  const [category, setCategory] = useState<EventCategory | null>(null);
  const [priceInfo, setPriceInfo] = useState("");

  const handleSubmit = () => {
    if (!title || !description || !venueName || !date || !timeStart || !category) {
      Alert.alert("Fehlende Angaben", "Bitte fülle alle Pflichtfelder aus.");
      return;
    }
    // TODO: Submit to Supabase
    Alert.alert("Event erstellt!", "Dein Event wurde erfolgreich erstellt.", [
      { text: "OK" },
    ]);
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      className="flex-1 bg-background"
      style={{ paddingTop: insets.top }}
    >
      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        <View className="px-4 pt-4 pb-3">
          <Text className="text-2xl font-bold text-text-primary">
            Event erstellen
          </Text>
          <Text className="text-sm text-text-secondary mt-1">
            Teile ein Event mit deiner Community
          </Text>
        </View>

        <View className="px-4 gap-4 pb-8">
          {/* Title */}
          <View>
            <Text className="text-sm font-medium text-text-secondary mb-1.5">
              Titel *
            </Text>
            <TextInput
              value={title}
              onChangeText={setTitle}
              placeholder="z.B. 90s Techno Night"
              placeholderTextColor={COLORS.textMuted}
              className="bg-card border border-border rounded-xl px-4 py-3 text-text-primary text-base"
            />
          </View>

          {/* Description */}
          <View>
            <Text className="text-sm font-medium text-text-secondary mb-1.5">
              Beschreibung *
            </Text>
            <TextInput
              value={description}
              onChangeText={setDescription}
              placeholder="Was erwartet die Besucher?"
              placeholderTextColor={COLORS.textMuted}
              multiline
              numberOfLines={4}
              textAlignVertical="top"
              className="bg-card border border-border rounded-xl px-4 py-3 text-text-primary text-base min-h-[100px]"
            />
          </View>

          {/* Venue */}
          <View>
            <Text className="text-sm font-medium text-text-secondary mb-1.5">
              Location *
            </Text>
            <TextInput
              value={venueName}
              onChangeText={setVenueName}
              placeholder="Name der Location"
              placeholderTextColor={COLORS.textMuted}
              className="bg-card border border-border rounded-xl px-4 py-3 text-text-primary text-base mb-2"
            />
            <TextInput
              value={address}
              onChangeText={setAddress}
              placeholder="Adresse"
              placeholderTextColor={COLORS.textMuted}
              className="bg-card border border-border rounded-xl px-4 py-3 text-text-primary text-base"
            />
          </View>

          {/* Date & Time */}
          <View className="flex-row gap-3">
            <View className="flex-1">
              <Text className="text-sm font-medium text-text-secondary mb-1.5">
                Datum *
              </Text>
              <TextInput
                value={date}
                onChangeText={setDate}
                placeholder="TT.MM.JJJJ"
                placeholderTextColor={COLORS.textMuted}
                className="bg-card border border-border rounded-xl px-4 py-3 text-text-primary text-base"
              />
            </View>
            <View className="flex-1">
              <Text className="text-sm font-medium text-text-secondary mb-1.5">
                Von *
              </Text>
              <TextInput
                value={timeStart}
                onChangeText={setTimeStart}
                placeholder="HH:MM"
                placeholderTextColor={COLORS.textMuted}
                className="bg-card border border-border rounded-xl px-4 py-3 text-text-primary text-base"
              />
            </View>
            <View className="flex-1">
              <Text className="text-sm font-medium text-text-secondary mb-1.5">
                Bis
              </Text>
              <TextInput
                value={timeEnd}
                onChangeText={setTimeEnd}
                placeholder="HH:MM"
                placeholderTextColor={COLORS.textMuted}
                className="bg-card border border-border rounded-xl px-4 py-3 text-text-primary text-base"
              />
            </View>
          </View>

          {/* Category */}
          <View>
            <Text className="text-sm font-medium text-text-secondary mb-2">
              Kategorie *
            </Text>
            <View className="flex-row flex-wrap gap-2">
              {EVENT_CATEGORIES.map((cat) => (
                <TouchableOpacity
                  key={cat.id}
                  onPress={() => setCategory(cat.id)}
                  className={`flex-row items-center gap-1.5 rounded-full px-3 py-2 ${
                    category === cat.id
                      ? "bg-primary"
                      : "bg-card border border-border"
                  }`}
                >
                  <Ionicons
                    name={cat.icon as any}
                    size={14}
                    color={category === cat.id ? "#FFFFFF" : "#A0A0B8"}
                  />
                  <Text
                    className={`text-sm ${
                      category === cat.id
                        ? "text-white font-medium"
                        : "text-text-secondary"
                    }`}
                  >
                    {cat.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Price */}
          <View>
            <Text className="text-sm font-medium text-text-secondary mb-1.5">
              Eintritt
            </Text>
            <TextInput
              value={priceInfo}
              onChangeText={setPriceInfo}
              placeholder="z.B. Kostenlos, 5€, Ab 10€"
              placeholderTextColor={COLORS.textMuted}
              className="bg-card border border-border rounded-xl px-4 py-3 text-text-primary text-base"
            />
          </View>

          {/* Submit */}
          <TouchableOpacity
            onPress={handleSubmit}
            className="bg-primary rounded-xl py-4 items-center mt-2"
          >
            <Text className="text-white font-bold text-base">
              Event veröffentlichen
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
