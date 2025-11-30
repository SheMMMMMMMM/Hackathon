import React, { useState } from "react";
import {
  SafeAreaView,
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
} from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { RegistrationStyles as styles } from "../styles/RegistrationStyles";
import { useUser } from "../contexts/UserContext";

export const RegistrationScreen = ({ navigation }) => {
  const { login } = useUser();
  const [name, setName] = useState("");
  const [pin, setPin] = useState("");
  const [repeatPin, setRepeatPin] = useState("");
  const [currentStep, setCurrentStep] = useState(1);

  const handleCreateAccount = () => {
    if (!name.trim()) {
      Alert.alert("Error", "Please enter your name");
      return;
    }
    if (pin.length < 4 || pin.length > 6) {
      Alert.alert("Error", "PIN must be 4-6 digits");
      return;
    }
    if (pin !== repeatPin) {
      Alert.alert("Error", "PINs do not match");
      return;
    }
    
    // Save user data to context
    login({
      id: Date.now().toString(), // Simple ID generation
      name: name.trim(),
      pin: pin,
      questionnaireCompleted: false, // New user hasn't completed questionnaire
    });
    
    Alert.alert("Success", `Account created for ${name}!`, [
      {
        text: "OK",
        onPress: () => navigation.navigate("Question1", { questionnaireData: {} }),
      },
    ]);
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* --- HEADER --- */}
        <View style={styles.header}>
          <MaterialCommunityIcons
            name="account-plus"
            size={60}
            color="#66B2FF"
          />
          <Text style={styles.headerTitle}>Create Account</Text>
          <Text style={styles.headerSubtitle}>It's easy!</Text>
        </View>

        {/* --- STEP 1: NAME --- */}
        <View style={styles.stepContainer}>
          <View style={styles.stepCircle}>
            <Text style={styles.stepNumber}>1</Text>
          </View>
          <Text style={styles.stepTitle}>Choose Your Name</Text>

          <TextInput
            placeholder="For example: John"
            placeholderTextColor="#8896A6"
            value={name}
            onChangeText={setName}
            style={styles.textInput}
            maxLength={50}
          />
        </View>

        {/* --- STEP 2: PIN --- */}
        <View style={styles.stepContainer}>
          <View style={styles.stepCircle}>
            <Text style={styles.stepNumber}>2</Text>
          </View>
          <Text style={styles.stepTitle}>Create PIN Code</Text>

          <TextInput
            placeholder="4 - 6 digits"
            placeholderTextColor="#8896A6"
            value={pin}
            onChangeText={(text) => setPin(text.replace(/[^0-9]/g, ""))}
            keyboardType="numeric"
            maxLength={6}
            secureTextEntry={false}
            style={styles.textInput}
          />
        </View>

        {/* --- STEP 3: REPEAT PIN --- */}
        <View style={styles.stepContainer}>
          <View style={styles.stepCircle}>
            <Text style={styles.stepNumber}>3</Text>
          </View>
          <Text style={styles.stepTitle}>Repeat PIN Code</Text>

          <TextInput
            placeholder="Repeat PIN"
            placeholderTextColor="#8896A6"
            value={repeatPin}
            onChangeText={(text) => setRepeatPin(text.replace(/[^0-9]/g, ""))}
            keyboardType="numeric"
            maxLength={6}
            secureTextEntry={false}
            style={styles.textInput}
          />
        </View>

        {/* --- CREATE ACCOUNT BUTTON --- */}
        <TouchableOpacity
          style={styles.createButton}
          onPress={handleCreateAccount}
          activeOpacity={0.8}
        >
          <Text style={styles.createButtonText}>CREATE ACCOUNT</Text>
        </TouchableOpacity>

        {/* --- SIGN IN LINK --- */}
        <View style={styles.signInContainer}>
          <Text style={styles.signInText}>Already have an account?</Text>
          <TouchableOpacity onPress={() => navigation.navigate("Login")}>
            <Text style={styles.signInLink}>Sign In</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};
