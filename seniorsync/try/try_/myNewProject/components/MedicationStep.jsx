import React, { useState } from "react";
import { View, Text, Pressable, Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import SvgIcon from "../assets/SvgIcon"; // Іконки з спрайту
import styles from "../styles/MedicationStyles";

const MedicationStep = ({ navigation }) => {
  const [selected, setSelected] = useState(null);

  const handleSelect = (option) => {
    setSelected(option);
  };

  const handleNext = () => {
    if (!selected) {
      Alert.alert("Please select an option", "Choose how often you take medications.");
      return;
    }
    Alert.alert(
      "Saved!",
      `Your medication frequency: ${selected}`,
      [
        {
          text: "OK",
          onPress: () => navigation.goBack(),
        },
      ]
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Do you take daily medications?</Text>

      <Pressable 
        style={[styles.option, selected === "Yes, every day" && styles.optionSelected]}
        onPress={() => handleSelect("Yes, every day")}
      >
        <SvgIcon name="user" width={24} height={24} />
        <Text style={styles.optionText}>Yes, every day</Text>
      </Pressable>

      <Pressable 
        style={[styles.option, selected === "Sometimes" && styles.optionSelected]}
        onPress={() => handleSelect("Sometimes")}
      >
        <SvgIcon name="pils" width={24} height={24} />
        <Text style={styles.optionText}>Sometimes</Text>
      </Pressable>

      <Pressable 
        style={[styles.option, selected === "No" && styles.optionSelected]}
        onPress={() => handleSelect("No")}
      >
        <SvgIcon name="pils" width={24} height={24} />
        <Text style={styles.optionText}>No</Text>
      </Pressable>

      <Pressable 
        style={styles.nextButton}
        onPress={handleNext}
      >
        <Text style={styles.nextText}>Next</Text>
      </Pressable>
    </SafeAreaView>
  );
};

export default MedicationStep;
