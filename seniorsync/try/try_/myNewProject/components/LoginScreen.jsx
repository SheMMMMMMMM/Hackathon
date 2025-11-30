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
import { loginStyles as styles } from "../styles/LoginStyles";
import SvgIcon from "../assets/SvgIcon";
import Svg from "react-native-svg";
import { useUser } from "../contexts/UserContext";



export const LoginScreen = ({ navigation }) => {
  const { login } = useUser();
  const [name, setName] = useState("");
  const [pin, setPin] = useState("");

  const handleSignIn = () => {
    if (!name.trim()) {
      Alert.alert("Error", "Please enter your name");
      return;
    }
    if (pin.length < 4 || pin.length > 6) {
      Alert.alert("Error", "PIN must be 4-6 digits");
      return;
    }
    
    // Login user
    login({
      id: Date.now().toString(),
      name: name.trim(),
      pin: pin,
      questionnaireCompleted: true, // Existing user already completed questionnaire
    });
    
    Alert.alert("Success", `Welcome back, ${name}!`, [
      {
        text: "OK",
        onPress: () => navigation.navigate("Home"),
      },
    ]);
  };

  const handleCreateAccount = () => {
    navigation.navigate("Registration");
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* --- NAME INPUT --- */}
        <View style={styles.section}>
          <SvgIcon name="user" width={24} height={24} />
          <Text style={styles.sectionLabel}>Your Name</Text>
          <TextInput
            placeholder="Enter your name"
            placeholderTextColor="#8896A6"
            value={name}
            onChangeText={setName}
            style={styles.textInput}
            maxLength={50}
          />
        </View>

        {/* --- PIN CODE CARD --- */}
        <View style={styles.pinCard}>
          <Text style={styles.pinCardTitle}>Your PIN Code</Text>

          <TextInput
            placeholder="Enter PIN"
            placeholderTextColor="#8896A6"
            value={pin}
            onChangeText={(text) => setPin(text.replace(/[^0-9]/g, ""))}
            keyboardType="numeric"
            maxLength={6}
            secureTextEntry={false}
            style={styles.textInput}
          />

          <Text style={styles.pinHint}>4-6 digits</Text>
        </View>

        {/* --- SIGN IN BUTTON --- */}
        <TouchableOpacity
          style={styles.signInButton}
          onPress={handleSignIn}
          activeOpacity={0.8}
        >
          <Text style={styles.signInButtonText}>SIGN IN</Text>
        </TouchableOpacity>

        {/* --- CREATE ACCOUNT LINK --- */}
        <View style={styles.createAccountContainer}>
          <Text style={styles.createAccountText}>Don't have an account?</Text>
          <TouchableOpacity onPress={handleCreateAccount}>
            <Text style={styles.createAccountLink}>Create New Account</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};
