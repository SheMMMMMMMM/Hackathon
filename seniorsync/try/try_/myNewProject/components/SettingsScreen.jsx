

import React, { useState } from "react";
import {
  SafeAreaView,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Switch,
  ScrollView,
  Platform,
} from "react-native";

export const SettingsScreen = () => {
  const [textSize, setTextSize] = useState("xlarge");
  const [volume, setVolume] = useState("medium");
  const [bigButtons, setBigButtons] = useState(true);
  const [voiceCommands, setVoiceCommands] = useState(false);

  const renderOptionButton = (label, isActive, onPress) => (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.8}
      style={[styles.optionButton, isActive && styles.optionButtonActive]}
    >
      <Text
        style={[
          styles.optionButtonText,
          isActive && styles.optionButtonTextActive,
        ]}
      >
        {label}
      </Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.screenTitle}>Settings</Text>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Text size</Text>
          <View style={styles.optionRow}>
            {renderOptionButton("Large", textSize === "large", () =>
              setTextSize("large")
            )}
            {renderOptionButton("Extra\nLarge", textSize === "xlarge", () =>
              setTextSize("xlarge")
            )}
            {renderOptionButton("Giant", textSize === "giant", () =>
              setTextSize("giant")
            )}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Sound volume</Text>
          <View style={styles.optionRow}>
            {renderOptionButton("Low", volume === "low", () =>
              setVolume("low")
            )}
            {renderOptionButton("Medium", volume === "medium", () =>
              setVolume("medium")
            )}
            {renderOptionButton("High", volume === "high", () =>
              setVolume("high")
            )}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Interaction mode</Text>

          <View style={styles.toggleCard}>
            <View style={styles.toggleTextBlock}>
              <Text style={styles.toggleTitle}>Big buttons{"\n"}mode</Text>
            </View>
            <Switch
              value={bigButtons}
              onValueChange={setBigButtons}
              trackColor={{ false: "#E5E7EB", true: "#66B2FF" }}
              thumbColor="#FFFFFF"
              ios_backgroundColor="#E5E7EB"
            />
          </View>

          <View style={styles.toggleCard}>
            <View style={styles.toggleTextBlock}>
              <Text style={styles.toggleTitle}>Voice{"\n"}commands</Text>
            </View>
            <Switch
              value={voiceCommands}
              onValueChange={setVoiceCommands}
              trackColor={{ false: "#E5E7EB", true: "#66B2FF" }}
              thumbColor="#FFFFFF"
              ios_backgroundColor="#E5E7EB"
            />
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const CARD_SHADOW =
  Platform.OS === "ios"
    ? {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.06,
        shadowRadius: 8,
      }
    : {
        elevation: 3,
      };

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F3F5F9",
  },
  scrollContent: {
    paddingHorizontal: 24,
    paddingTop: 12,
    paddingBottom: 32,
  },
  screenTitle: {
    fontSize: 32,
    fontWeight: "700",
    textAlign: "center",
    marginBottom: 32,
    color: "#0A3D62",
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#0A3D62",
    marginBottom: 16,
  },
  optionRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  optionButton: {
    flex: 1,
    minHeight: 72,
    borderRadius: 18,
    borderWidth: 2,
    borderColor: "#D0E4FF",
    backgroundColor: "#FFFFFF",
    justifyContent: "center",
    alignItems: "center",
    marginHorizontal: 4,
  },
  optionButtonActive: {
    backgroundColor: "#66B2FF",
    borderColor: "#66B2FF",
  },
  optionButtonText: {
    fontSize: 18,
    fontWeight: "600",
    color: "#0A3D62",
    textAlign: "center",
  },
  optionButtonTextActive: {
    color: "#FFFFFF",
  },
  toggleCard: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 18,
    borderRadius: 20,
    backgroundColor: "#FFFFFF",
    marginBottom: 14,
    borderWidth: 1,
    borderColor: "rgba(0,0,0,0.03)",
    ...CARD_SHADOW,
  },
  toggleTextBlock: {
    flexShrink: 1,
    marginRight: 12,
  },
  toggleTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#0A3D62",
  },
});

