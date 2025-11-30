import React, { useState } from "react";
import { View, Text, Pressable, Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import SvgIcon from "../assets/SvgIcon"; // Іконки зі спрайту
import styles from "../styles/FeelingScreenStyles";

export default function FeelingScreen({ navigation }) {
  const [selectedFeeling, setSelectedFeeling] = useState(null);

  const handleFeelingSelect = (feeling) => {
    setSelectedFeeling(feeling);
    Alert.alert(
      "Thank you!",
      `You selected: ${feeling}. This will be recorded in your health diary.`,
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
      <Text style={styles.title}>How are you feeling today?</Text>

      <Pressable 
        style={styles.option}
        onPress={() => handleFeelingSelect("I feel good")}
      >
        <SvgIcon name="happy" width={24} height={24} />
        <Text style={styles.optionText}>I feel good</Text>
      </Pressable>

      <Pressable 
        style={styles.option}
        onPress={() => handleFeelingSelect("I feel okay")}
      >
        <SvgIcon name="neutral" width={24} height={24} />
        <Text style={styles.optionText}>I feel okay</Text>
      </Pressable>

      <Pressable 
        style={styles.option}
        onPress={() => handleFeelingSelect("I feel bad")}
      >
        <SvgIcon name="sad" width={24} height={24} />
        <Text style={styles.optionText}>I feel bad</Text>
      </Pressable>

      <Pressable 
        style={styles.micButton}
        onPress={() => Alert.alert("Voice Input", "Voice input feature coming soon!")}
      >
        <SvgIcon name="mic" width={24} height={24} />
      </Pressable>
    </SafeAreaView>
  );
};

