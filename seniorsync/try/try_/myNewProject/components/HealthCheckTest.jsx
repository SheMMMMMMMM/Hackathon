import React, { useState } from "react";
import {
  SafeAreaView,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
} from "react-native";


const HEALTH_CHECK_QUESTIONS = [
  {
    id: 1,
    step: 1,
    title: "How are you\nfeeling today?",
    options: [
      { id: "good", text: "I feel good", emoji: "😊" },
      { id: "okay", text: "I feel okay", emoji: "😐" },
      { id: "bad", text: "I feel bad", emoji: "😞" },
    ],
  },
  {
    id: 2,
    step: 2,
    title: "Do you take daily\nmedications?",
    options: [
      { id: "everyday", text: "Yes, every day", emoji: "💊" },
      { id: "sometimes", text: "Sometimes", emoji: "🕐" },
      { id: "no", text: "No", emoji: "❌" },
    ],
  },
  {
    id: 3,
    step: 3,
    title: "Do you have\nany pain?",
    options: [
      { id: "yes", text: "Yes", emoji: "🍴" },
      { id: "little", text: "A little", emoji: "🥪" },
      { id: "no", text: "No", emoji: "❌" },
    ],
  },
  {
    id: 4,
    step: 4,
    title: "Did you sleep\nwell last night?",
    options: [
      { id: "yes", text: "Yes", emoji: "😴" },
      { id: "okay", text: "It was okay", emoji: "😐" },
      { id: "bad", text: "No, I slept bad", emoji: "😫" },
    ],
  },
  {
    id: 5,
    step: 5,
    title: "Do you feel any\npain right now?",
    options: [
      { id: "no", text: "No pain", emoji: "✅" },
      { id: "mild", text: "Mild pain", emoji: "😐" },
      { id: "strong", text: "Strong pain", emoji: "😫" },
    ],
  },
  {
    id: 6,
    step: 6,
    title: "Was it easy to\nstand up from a\nchair today?",
    options: [
      { id: "yes", text: "Yes", emoji: "✅" },
      { id: "difficult", text: "A little difficult", emoji: "😐" },
      { id: "very_difficult", text: "Very difficult", emoji: "😭" },
    ],
  },
  {
    id: 7,
    step: 7,
    title: "Did you go\noutside today?",
    options: [
      { id: "yes", text: "Yes", emoji: "☀️" },
      { id: "little", text: "A little", emoji: "🚶" },
      { id: "no", text: "No", emoji: "🏠" },
    ],
  },
];

export const HealthCheckTest = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState({});

  const currentQuestion = HEALTH_CHECK_QUESTIONS[currentStep];
  const totalSteps = HEALTH_CHECK_QUESTIONS.length;
  const isLastStep = currentStep === totalSteps - 1;

  const handleSelectOption = (optionId) => {
    setAnswers({
      ...answers,
      [currentQuestion.id]: optionId,
    });
  };

  const handleNext = async () => {
    if (!answers[currentQuestion.id]) {
      Alert.alert("Error", "Please select an option");
      return;
    }

    if (isLastStep) {
      try {
        // Зберігаємо результати через сервіс
        await saveTestResult(answers);

        Alert.alert(
          "Success",
          "Test completed and saved!",
          [
            {
              text: "Start Over",
              onPress: () => {
                setCurrentStep(0);
                setAnswers({});
              },
            },
          ],
          { cancelable: false }
        );
      } catch (error) {
        Alert.alert("Error", "Failed to save test results");
      }
    } else {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const selectedOption = answers[currentQuestion.id];

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.progressText}>
          Step {currentQuestion.step} of {totalSteps}
        </Text>

        <Text style={styles.questionTitle}>{currentQuestion.title}</Text>

        <View style={styles.optionsContainer}>
          {currentQuestion.options.map((option) => (
            <TouchableOpacity
              key={option.id}
              onPress={() => handleSelectOption(option.id)}
              style={[
                styles.optionButton,
                selectedOption === option.id && styles.optionButtonActive,
              ]}
              activeOpacity={0.8}
            >
              <Text style={styles.optionEmoji}>{option.emoji}</Text>
              <Text
                style={[
                  styles.optionText,
                  selectedOption === option.id && styles.optionTextActive,
                ]}
              >
                {option.text}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.buttonsContainer}>
          {currentStep > 0 && (
            <TouchableOpacity
              style={styles.backButton}
              onPress={handleBack}
              activeOpacity={0.8}
            >
              <Text style={styles.backButtonText}>Back</Text>
            </TouchableOpacity>
          )}

          <TouchableOpacity
            style={[styles.nextButton, currentStep === 0 && { width: "100%" }]}
            onPress={handleNext}
            activeOpacity={0.8}
          >
            <Text style={styles.nextButtonText}>
              {isLastStep ? "Finish" : "Next"}
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 32,
    paddingBottom: 40,
  },
  progressText: {
    fontSize: 14,
    color: "#8896A6",
    textAlign: "center",
    marginBottom: 20,
    fontWeight: "500",
  },
  questionTitle: {
    fontSize: 28,
    fontWeight: "700",
    color: "#0A3D62",
    textAlign: "center",
    marginBottom: 32,
    lineHeight: 36,
  },
  optionsContainer: {
    marginBottom: 40,
  },
  optionButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: "#66B2FF",
    backgroundColor: "#F9FAFB",
    marginBottom: 12,
  },
  optionButtonActive: {
    backgroundColor: "#E8F4FF",
    borderColor: "#66B2FF",
  },
  optionEmoji: {
    fontSize: 24,
    marginRight: 12,
  },
  optionText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#0A3D62",
    flex: 1,
  },
  optionTextActive: {
    color: "#0A3D62",
  },
  buttonsContainer: {
    flexDirection: "row",
    gap: 12,
  },
  backButton: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 16,
    backgroundColor: "#E5E7EB",
    alignItems: "center",
  },
  backButtonText: {
    fontSize: 16,
    fontWeight: "700",
    color: "#0A3D62",
  },
  nextButton: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 16,
    backgroundColor: "#66B2FF",
    alignItems: "center",
    shadowColor: "#66B2FF",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  nextButtonText: {
    fontSize: 16,
    fontWeight: "700",
    color: "#FFFFFF",
    letterSpacing: 0.5,
  },
});
