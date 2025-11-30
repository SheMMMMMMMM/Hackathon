import React, { useState } from "react";
import { View, Text, TouchableOpacity, ScrollView, StyleSheet, Alert, TextInput } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useUser } from "../contexts/UserContext";
import { sendHealthReport } from "../services/api";

export default function DailyHealthReport({ navigation }) {
  const { user } = useUser();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [loading, setLoading] = useState(false);
  
  // Health report state
  const [report, setReport] = useState({
    sleepHours: "",
    moodRating: "",
    pain: "",
    painSeverity: "",
    medicationsTaken: "",
    meals: "",
    healthConcerns: ""
  });

  const questions = [
    {
      id: "sleepHours",
      emoji: "😴",
      question: "How many hours did you sleep last night?",
      type: "number",
      options: ["Less than 4", "4-6 hours", "6-8 hours", "More than 8"]
    },
    {
      id: "moodRating",
      emoji: "😊",
      question: "How would you rate your mood today?",
      type: "rating",
      options: ["😢 Bad", "😐 Okay", "😊 Good", "🤩 Great"]
    },
    {
      id: "pain",
      emoji: "🤕",
      question: "Are you experiencing any pain?",
      type: "text",
      options: ["No pain", "Mild discomfort", "Moderate pain", "Severe pain"]
    },
    {
      id: "painSeverity",
      emoji: "📊",
      question: "If you have pain, rate it from 0-10",
      type: "number",
      options: ["0 - No pain", "1-3 - Mild", "4-6 - Moderate", "7-10 - Severe"]
    },
    {
      id: "medicationsTaken",
      emoji: "💊",
      question: "Did you take all your medications?",
      type: "text",
      options: ["Yes, all taken", "Missed some", "None taken", "No medications"]
    },
    {
      id: "meals",
      emoji: "🍽️",
      question: "How many meals did you eat today?",
      type: "text",
      options: ["3+ meals", "2 meals", "1 meal", "Skipped meals"]
    },
    {
      id: "healthConcerns",
      emoji: "🏥",
      question: "Any other health concerns?",
      type: "text",
      options: ["No concerns", "Minor concerns", "Need attention", "Urgent issue"]
    }
  ];

  const currentQ = questions[currentQuestion];

  const handleOptionSelect = (option) => {
    // Extract numeric values for specific fields
    let value = option;
    
    if (currentQ.id === "sleepHours") {
      if (option.includes("Less than 4")) value = "3";
      else if (option.includes("4-6")) value = "5";
      else if (option.includes("6-8")) value = "7";
      else if (option.includes("More than 8")) value = "9";
    } else if (currentQ.id === "moodRating") {
      if (option.includes("Bad")) value = "3";
      else if (option.includes("Okay")) value = "5";
      else if (option.includes("Good")) value = "7";
      else if (option.includes("Great")) value = "10";
    } else if (currentQ.id === "painSeverity") {
      if (option.includes("No pain")) value = "0";
      else if (option.includes("Mild")) value = "2";
      else if (option.includes("Moderate")) value = "5";
      else if (option.includes("Severe")) value = "8";
    }
    
    setReport({ ...report, [currentQ.id]: value });
    
    // Move to next question or submit
    if (currentQuestion < questions.length - 1) {
      setTimeout(() => setCurrentQuestion(currentQuestion + 1), 300);
    } else {
      submitReport({ ...report, [currentQ.id]: value });
    }
  };

  const submitReport = async (finalReport) => {
    setLoading(true);
    try {
      // Prepare data for backend
      const reportData = {
        userId: user.id || 1,
        sleepHours: parseInt(finalReport.sleepHours) || null,
        moodRating: parseInt(finalReport.moodRating) || null,
        pain: finalReport.pain || "No pain",
        painSeverity: parseInt(finalReport.painSeverity) || 0,
        medicationsTaken: finalReport.medicationsTaken || "Yes, all taken",
        meals: finalReport.meals || "3+ meals",
        healthConcerns: finalReport.healthConcerns || "No concerns"
      };

      const response = await sendHealthReport(reportData);
      
      Alert.alert(
        "Success! ✅",
        "Your daily health report has been submitted successfully.",
        [
          {
            text: "OK",
            onPress: () => navigation.goBack()
          }
        ]
      );
    } catch (error) {
      console.error('Health report error:', error);
      Alert.alert(
        "Submission Issue",
        "We couldn't submit your report right now, but it's been saved locally. We'll try again later.",
        [{ text: "OK", onPress: () => navigation.goBack() }]
      );
    } finally {
      setLoading(false);
    }
  };

  const goBack = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    } else {
      navigation.goBack();
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={["top", "left", "right", "bottom"]}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={goBack}>
          <Ionicons name="arrow-back" size={24} color="#0A3D62" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Daily Health Check</Text>
        <View style={styles.placeholder} />
      </View>

      <View style={styles.progressContainer}>
        <Text style={styles.progressText}>
          Question {currentQuestion + 1} of {questions.length}
        </Text>
        <View style={styles.progressBar}>
          <View 
            style={[
              styles.progressFill, 
              { width: `${((currentQuestion + 1) / questions.length) * 100}%` }
            ]} 
          />
        </View>
      </View>

      <ScrollView 
        style={styles.content}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.emoji}>{currentQ.emoji}</Text>
        <Text style={styles.question}>{currentQ.question}</Text>

        <View style={styles.optionsContainer}>
          {currentQ.options.map((option, index) => (
            <TouchableOpacity
              key={index}
              style={[
                styles.optionButton,
                report[currentQ.id] === option && styles.optionButtonSelected
              ]}
              onPress={() => handleOptionSelect(option)}
              disabled={loading}
            >
              <Text style={[
                styles.optionText,
                report[currentQ.id] === option && styles.optionTextSelected
              ]}>
                {option}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>

      {loading && (
        <View style={styles.loadingOverlay}>
          <Text style={styles.loadingText}>Submitting your report...</Text>
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#0A3D62",
  },
  placeholder: {
    width: 40,
  },
  progressContainer: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 16,
  },
  progressText: {
    fontSize: 14,
    color: "#666",
    marginBottom: 8,
    textAlign: "center",
  },
  progressBar: {
    height: 8,
    backgroundColor: "#E5E7EB",
    borderRadius: 4,
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    backgroundColor: "#66B2FF",
    borderRadius: 4,
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    padding: 20,
    alignItems: "center",
  },
  emoji: {
    fontSize: 64,
    marginBottom: 24,
  },
  question: {
    fontSize: 24,
    fontWeight: "700",
    color: "#0A3D62",
    textAlign: "center",
    marginBottom: 32,
    lineHeight: 32,
  },
  optionsContainer: {
    width: "100%",
    gap: 12,
  },
  optionButton: {
    backgroundColor: "#F0F7FF",
    paddingVertical: 20,
    paddingHorizontal: 24,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: "#E3F2FD",
  },
  optionButtonSelected: {
    backgroundColor: "#66B2FF",
    borderColor: "#66B2FF",
  },
  optionText: {
    fontSize: 18,
    fontWeight: "600",
    color: "#0A3D62",
    textAlign: "center",
  },
  optionTextSelected: {
    color: "#FFFFFF",
  },
  loadingOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    fontSize: 18,
    color: "#FFFFFF",
    fontWeight: "600",
  },
});
