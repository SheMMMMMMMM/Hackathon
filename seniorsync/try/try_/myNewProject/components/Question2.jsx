import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useVoiceInput } from "../hooks/useVoiceInput";

export default function Question2({ navigation, route }) {
  const [age, setAge] = useState("");
  const { questionnaireData = {} } = route.params || {};
  const { isRecording, isTranscribing, startRecording, stopRecording } = useVoiceInput((text) => {
    // Extract digits from transcription and set as age
    if (text) {
      const digits = text.replace(/\D+/g, '');
      if (digits) setAge(digits.slice(0,3));
    }
  });

  const handleVoiceInput = async () => {
    if (isRecording) {
      // Stop recording
      const uri = await stopRecording();
      if (uri) {
        Alert.alert(
          "Voice Recorded",
          "Voice input recorded! (Note: Speech-to-text requires additional setup. For now, please type your age.)",
          [{ text: "OK" }]
        );
      }
    } else {
      // Start recording
      await startRecording();
    }
  };

  const handleNext = () => {
    const ageNum = parseInt(age);
    if (!age || isNaN(ageNum) || ageNum < 1 || ageNum > 120) {
      Alert.alert("Invalid age", "Please enter a valid age.");
      return;
    }
    navigation.navigate("Question3", {
      questionnaireData: { ...questionnaireData, age: ageNum }
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <View style={styles.progressContainer}>
          <View style={styles.stepCircle}>
            <Text style={styles.stepNumber}>2</Text>
          </View>
          <Text style={styles.progressText}>Question 2 of 9</Text>
        </View>

        <View style={styles.iconContainer}>
          <Text style={styles.emoji}>🎂</Text>
        </View>

        <Text style={styles.question}>How old are you?</Text>

        <TextInput
          style={styles.input}
          placeholder="Your age"
          placeholderTextColor="#8896A6"
          value={age}
          onChangeText={(text) => setAge(text.replace(/[^0-9]/g, ""))}
          keyboardType="numeric"
          maxLength={3}
        />

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
            {isTranscribing ? "Transcribing..." : (isRecording ? "Recording... (Tap to Stop)" : "Speak Your Age")}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.nextButton} onPress={handleNext}>
          <Text style={styles.nextButtonText}>Next</Text>
          <Ionicons name="arrow-forward" size={20} color="#fff" />
        </TouchableOpacity>
      </View>
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
  input: { backgroundColor: "#fff", borderWidth: 2, borderColor: "#E5E7EB", borderRadius: 16, paddingHorizontal: 20, paddingVertical: 16, fontSize: 18, color: "#0A3D62", marginBottom: 16 },
  voiceButton: { flexDirection: "row", alignItems: "center", justifyContent: "center", backgroundColor: "#fff", borderWidth: 2, borderColor: "#66B2FF", borderRadius: 16, paddingVertical: 16, marginBottom: 32 },
  voiceButtonRecording: { backgroundColor: "#FFEBEE", borderColor: "#FF5252" },
  voiceButtonText: { fontSize: 16, fontWeight: "600", color: "#66B2FF", marginLeft: 8 },
  voiceButtonTextRecording: { color: "#FF5252" },
  nextButton: { flexDirection: "row", alignItems: "center", justifyContent: "center", backgroundColor: "#66B2FF", borderRadius: 16, paddingVertical: 18, marginTop: "auto" },
  nextButtonText: { fontSize: 18, fontWeight: "700", color: "#fff", marginRight: 8 },
});
