import React, { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet, Alert, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useVoiceInput } from "../hooks/useVoiceInput";

export default function Question3({ navigation, route }) {
  const [selected, setSelected] = useState(null);
  const { questionnaireData = {} } = route.params || {};
  const { isRecording, isTranscribing, startRecording, stopRecording } = useVoiceInput((text) => {
    if (!text) return;
    const t = text.toLowerCase();
    if (t.includes('good')) setSelected('good');
    else if (t.includes('okay') || t.includes('ok')) setSelected('okay');
    else if (t.includes('support') || t.includes('need') || t.includes('help')) setSelected('support');
  });

  const handleVoiceInput = async () => {
    if (isRecording) {
      // Stop recording
      const uri = await stopRecording();
      if (uri) {
        Alert.alert(
          "Voice Recorded",
          "Voice input recorded! (Note: Speech-to-text requires additional setup. For now, please select an option.)",
          [{ text: "OK" }]
        );
      }
    } else {
      // Start recording
      await startRecording();
    }
  };

  const options = [
    { id: "good", emoji: "💪", label: "Good" },
    { id: "okay", emoji: "👍", label: "Okay" },
    { id: "support", emoji: "🏥", label: "I need regular support" },
  ];

  const handleNext = () => {
    if (!selected) {
      Alert.alert("Please select an option", "Choose how you describe your general health.");
      return;
    }
    navigation.navigate("Question4", {
      questionnaireData: { ...questionnaireData, generalHealth: selected }
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.progressContainer}>
          <View style={styles.stepCircle}>
            <Text style={styles.stepNumber}>3</Text>
          </View>
          <Text style={styles.progressText}>Question 3 of 9</Text>
        </View>

        <View style={styles.iconContainer}>
          <Text style={styles.emoji}>❤️</Text>
        </View>

        <Text style={styles.question}>How would you describe your general health?</Text>

        {options.map((option) => (
          <TouchableOpacity
            key={option.id}
            style={[styles.option, selected === option.id && styles.optionSelected]}
            onPress={() => setSelected(option.id)}
          >
            <Text style={styles.optionEmoji}>{option.emoji}</Text>
            <Text style={styles.optionText}>{option.label}</Text>
            {selected === option.id && (
              <Ionicons name="checkmark-circle" size={24} color="#0A3D62" style={styles.checkmark} />
            )}
          </TouchableOpacity>
        ))}

        <TouchableOpacity 
          style={[styles.voiceButton, isRecording && styles.voiceButtonRecording]}
          onPress={handleVoiceInput}
          disabled={isTranscribing}
        >
          <Ionicons 
            name={isRecording ? "mic" : "mic-outline"} 
            size={24} 
            color={isRecording ? "#FF5252" : "#66B2FF"} 
          />
          <Text style={[styles.voiceButtonText, isRecording && styles.voiceButtonTextRecording]}>
            {isTranscribing ? "Transcribing..." : (isRecording ? "Recording... (Tap to Stop)" : "Speak Your Answer")}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.nextButton} onPress={handleNext}>
          <Text style={styles.nextButtonText}>Next</Text>
          <Ionicons name="arrow-forward" size={20} color="#fff" />
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F9FAFB" },
  content: { flex: 1, paddingHorizontal: 24, paddingTop: 20, paddingBottom: 40 },
  progressContainer: { flexDirection: "row", alignItems: "center", marginBottom: 30 },
  stepCircle: { width: 40, height: 40, borderRadius: 20, backgroundColor: "#66B2FF", justifyContent: "center", alignItems: "center", marginRight: 12 },
  stepNumber: { fontSize: 18, fontWeight: "700", color: "#fff" },
  progressText: { fontSize: 14, color: "#6B7280" },
  iconContainer: { alignSelf: "center", marginBottom: 24 },
  emoji: { fontSize: 64 },
  question: { fontSize: 24, fontWeight: "700", color: "#0A3D62", textAlign: "center", marginBottom: 32 },
  option: { flexDirection: "row", alignItems: "center", backgroundColor: "#fff", borderWidth: 2, borderColor: "#E5E7EB", borderRadius: 16, paddingVertical: 18, paddingHorizontal: 20, marginBottom: 12 },
  optionSelected: { borderColor: "#66B2FF", backgroundColor: "#EBF5FF", borderWidth: 3 },
  optionEmoji: { fontSize: 32, marginRight: 16 },
  optionText: { fontSize: 18, fontWeight: "600", color: "#0A3D62", flex: 1 },
  checkmark: { marginLeft: 8 },
  voiceButton: { flexDirection: "row", alignItems: "center", justifyContent: "center", backgroundColor: "#fff", borderWidth: 2, borderColor: "#66B2FF", borderRadius: 16, paddingVertical: 16, marginTop: 12 },
  voiceButtonRecording: { backgroundColor: "#FFEBEE", borderColor: "#FF5252" },
  voiceButtonText: { fontSize: 16, fontWeight: "600", color: "#66B2FF", marginLeft: 8 },
  voiceButtonTextRecording: { color: "#FF5252" },
  nextButton: { flexDirection: "row", alignItems: "center", justifyContent: "center", backgroundColor: "#66B2FF", borderRadius: 16, paddingVertical: 18, marginTop: 20 },
  nextButtonText: { fontSize: 18, fontWeight: "700", color: "#fff", marginRight: 8 },
});
