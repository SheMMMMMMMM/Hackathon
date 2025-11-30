import React from "react";
import { View, Text, Pressable } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import SvgIcon from "../assets/SvgIcon";
import styles from "../styles/WelcomeStyles";

const WelcomeScreen = ({ navigation }) => {
  const handleSelfSetup = () => {
    // Перехід на реєстрацію
    navigation.navigate("Registration");
  };

  const handleFamilySetup = () => {
    // Для родинного налаштування (може бути інший екран)
    navigation.navigate("Registration");
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Welcome!</Text>
      <Text style={styles.subtitle}>Who is setting up the app today?</Text>

      {/* Кнопка для самостійного налаштування */}
      <Pressable style={styles.button} onPress={handleSelfSetup}>
        <SvgIcon name="user" width={24} height={24} />
        <Text style={styles.buttonText}>I will use the app myself</Text>
      </Pressable>

      {/* Кнопка для налаштування для родини */}
      <Pressable style={styles.button} onPress={handleFamilySetup}>
        <SvgIcon name="heart" width={24} height={24} />
        <Text style={styles.buttonText}>
          I am setting it up for a family member
        </Text>
      </Pressable>
    </SafeAreaView>
  );
};

export default WelcomeScreen;
