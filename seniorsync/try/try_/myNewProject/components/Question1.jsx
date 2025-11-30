import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ActivityIndicator } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useVoiceInput } from "../hooks/useVoiceInput";

export default function Question1({ navigation, route }) {
  const [name, setName] = useState("");
  const { questionnaireData = {} } = route.params || {};
  const { isRecording, isTranscribing, startRecording, stopRecording } = useVoiceInput((text) => {
    setName(text);
  });

  const handleVoiceInput = async () => {
    if (isRecording) {
      // Stop recording and transcribe
      await stopRecording();
    } else {
      // Start recording
      await startRecording();
    }
  };

  const handleNext = () => {
    if (!name.trim()) {
      Alert.alert("Please enter your name", "We need your name to personalize your experience.");
      return;
    }
    navigation.navigate("Question2", {
      questionnaireData: { ...questionnaireData, name: name.trim() }
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        {/* Progress indicator */}
        <View style={styles.progressContainer}>
          <View style={styles.stepCircle}>
            <Text style={styles.stepNumber}>1</Text>
          </View>
          <Text style={styles.progressText}>Question 1 of 9</Text>
        </View>

        {/* Icon */}
        <View style={styles.iconContainer}>
          <Text style={styles.emoji}>👤</Text>
        </View>

        {/* Question */}
        <Text style={styles.question}>What is your full name?</Text>

        {/* Input */}
        <TextInput
          style={styles.input}
          placeholder="Type your name here..."
          placeholderTextColor="#8896A6"
          value={name}
          onChangeText={setName}
          maxLength={100}
        />

        {/* Voice button (optional) */}
        <TouchableOpacity 
          style={[styles.voiceButton, isRecording && styles.voiceButtonRecording]}
          onPress={handleVoiceInput}
          disabled={isTranscribing}
        >
          {isTranscribing ? (
            <ActivityIndicator color="#66B2FF" />
          ) : (
            <Ionicons 
              name={isRecording ? "mic" : "mic-outline"} 
              size={24} 
              color={isRecording ? "#FF5252" : "#66B2FF"} 
            />
          )}
          <Text style={[styles.voiceButtonText, isRecording && styles.voiceButtonTextRecording]}>
            {isTranscribing ? "Transcribing..." : (isRecording ? "Recording... (Tap to Stop)" : "Speak Your Name")}
          </Text>
        </TouchableOpacity>

        {/* Next button */}
        <TouchableOpacity 
          style={styles.nextButton}
          onPress={handleNext}
        >
          <Text style={styles.nextButtonText}>Next</Text>
          <Ionicons name="arrow-forward" size={20} color="#fff" />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F9FAFB",
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 20,
    paddingBottom: 40,
  },
  progressContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 30,
  },
  stepCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#66B2FF",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  stepNumber: {
    fontSize: 18,
    fontWeight: "700",
    color: "#fff",
  },
  progressText: {
    fontSize: 14,
    color: "#6B7280",
  },
  iconContainer: {
    alignSelf: "center",
    marginBottom: 24,
  },
  emoji: {
    fontSize: 64,
  },
  question: {
    fontSize: 24,
    fontWeight: "700",
    color: "#0A3D62",
    textAlign: "center",
    marginBottom: 32,
  },
  input: {
    backgroundColor: "#fff",
    borderWidth: 2,
    borderColor: "#E5E7EB",
    borderRadius: 16,
    paddingHorizontal: 20,
    paddingVertical: 16,
    fontSize: 18,
    color: "#0A3D62",
    marginBottom: 16,
  },
  voiceButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#fff",
    borderWidth: 2,
    borderColor: "#66B2FF",
    borderRadius: 16,
    paddingVertical: 16,
    marginBottom: 24,
  },
  voiceButtonRecording: {
    backgroundColor: "#FFEBEE",
    borderColor: "#FF5252",
  },
  voiceButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#66B2FF",
    marginLeft: 8,
  },
  voiceButtonTextRecording: {
    color: "#FF5252",
  },
  nextButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#66B2FF",
    borderRadius: 16,
    paddingVertical: 18,
    marginTop: "auto",
  },
  nextButtonText: {
    fontSize: 18,
    fontWeight: "700",
    color: "#fff",
    marginRight: 8,
  },
});
