import React from "react";
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  Platform,
} from "react-native";
import { Ionicons } from "@expo/vector-icons"; // Для іконки аватара
import { useTranslation } from 'react-i18next';
import { useUser } from "../contexts/UserContext";


const ProfileScreen = ({ navigation }) => {
  const { t } = useTranslation();
  const { user } = useUser();
  
  // Get questionnaire data or use defaults
  const questionnaireData = user.questionnaireData || {};
  const name = user.name || questionnaireData.name || "John Miller";
  const age = user.age || questionnaireData.age || "78";
  const healthConditions = questionnaireData.healthConditions || "Not specified";
  const medicationCount = questionnaireData.medicationCount || "Not specified";
  const livingSituation = questionnaireData.livingSituation || "Not specified";
  const mobilityLevel = questionnaireData.mobilityLevel || "Not specified";
  const techComfort = questionnaireData.techComfort || "Not specified";
  const socialFrequency = questionnaireData.socialFrequency || "Not specified";
  const preferredInteraction = questionnaireData.preferredInteraction || "Not specified";

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* --- HEADER PROFILE SECTION --- */}
        <View style={styles.header}>
          <TouchableOpacity 
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Ionicons name="arrow-back" size={24} color="#0A3D62" />
          </TouchableOpacity>
          <View style={styles.avatarContainer}>
            <Ionicons name="person-outline" size={40} color="#fff" />
          </View>
          <Text style={styles.nameText}>{name}</Text>
          <Text style={styles.ageText}>{t('age')} {age}</Text>
          <Text style={styles.statusText}>{livingSituation} · {preferredInteraction} mode</Text>
        </View>

        {/* --- CARD: HEALTH --- */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>{t('healthInformation')}</Text>

          <View style={styles.row}>
            <Text style={styles.label}>{t('healthConditions')}:</Text>
            <Text style={styles.value}> {healthConditions}</Text>
          </View>

          <View style={styles.row}>
            <Text style={styles.label}>{t('dailyMedications')}:</Text>
            <Text style={styles.value}> {medicationCount}</Text>
          </View>

          <View style={styles.row}>
            <Text style={styles.label}>{t('mobilityLevel')}:</Text>
            <Text style={styles.value}> {mobilityLevel}</Text>
          </View>
        </View>

        {/* --- CARD: PREFERENCES --- */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>{t('preferences')}</Text>

          <View style={styles.row}>
            <Text style={styles.label}>{t('techComfort')}:</Text>
            <Text style={styles.value}> {techComfort}</Text>
          </View>

          <View style={styles.row}>
            <Text style={styles.label}>{t('socialFrequency')}:</Text>
            <Text style={styles.value}> {socialFrequency}</Text>
          </View>

          <View style={styles.row}>
            <Text style={styles.label}>{t('interactionMode')}:</Text>
            <Text style={styles.value}> {preferredInteraction}</Text>
          </View>
        </View>

        {/* --- CARD: CAREGIVER --- */}
        {questionnaireData.caregiverName && (
          <View style={styles.card}>
            <Text style={[styles.cardTitle, { textAlign: "center" }]}>
              {t('caregiver')}
            </Text>

            <View style={styles.caregiverInfo}>
              <Text style={styles.caregiverText}>{t('caregiver')}: {questionnaireData.caregiverName || 'Anna Miller'}</Text>
              <Text style={styles.caregiverText}>{t('phone')}: {questionnaireData.caregiverPhone || '+1 (408) 345 2291'}</Text>
            </View>

            <TouchableOpacity style={styles.primaryButton}>
              <Text style={styles.primaryButtonText}>{t('contactCaregiver')}</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* --- FOOTER BUTTON --- */}
        <TouchableOpacity 
          style={styles.outlineButton}
          onPress={() => navigation.navigate('Question1', { 
            questionnaireData: user.questionnaireData,
            editMode: true 
          })}
        >
          <Text style={styles.outlineButtonText}>{t('editProfile')}</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F9FAFB", // Світло-сірий фон
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 40,
  },

  // --- Header Styles ---
  header: {
    alignItems: "center",
    marginBottom: 24,
    marginTop: 10,
    position: "relative",
    width: "100%",
  },
  backButton: {
    position: "absolute",
    left: 0,
    top: 0,
    padding: 8,
    zIndex: 10,
  },
  avatarContainer: {
    width: 80,
    height: 80,
    backgroundColor: "#66B2FF", // Блакитний колір аватара
    borderRadius: 40,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 12,
    // Тінь для аватара
    shadowColor: "#66B2FF",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  nameText: {
    fontSize: 24,
    fontWeight: "700",
    color: "#0A3D62", // Темно-синій
    marginBottom: 4,
  },
  ageText: {
    fontSize: 18,
    fontWeight: "600",
    color: "#5A6B7C",
    marginBottom: 4,
  },
  statusText: {
    fontSize: 14,
    color: "#8896A6",
  },

  // --- Card Common Styles ---
  card: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    // Тінь картки (Card Shadow)
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 3, // Android shadow
    borderWidth: 1,
    borderColor: "rgba(0,0,0,0.02)",
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#0A3D62",
    marginBottom: 12,
  },
  row: {
    flexDirection: "row",
    marginBottom: 8,
    alignItems: "center",
  },
  label: {
    fontSize: 16,
    color: "#0A3D62",
    fontWeight: "400",
  },
  value: {
    fontSize: 16,
    color: "#0A3D62",
    fontWeight: "400",
  },

  // --- Caregiver Specific ---
  caregiverInfo: {
    alignItems: "center",
    marginBottom: 16,
  },
  caregiverText: {
    fontSize: 16,
    color: "#0A3D62",
    marginBottom: 4,
  },

  // --- Buttons ---
  primaryButton: {
    backgroundColor: "#66B2FF",
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: "center",
    width: "100%",
    // Button Shadow
    shadowColor: "#66B2FF",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  primaryButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  outlineButton: {
    backgroundColor: "#fff",
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: "center",
    width: "100%",
    borderWidth: 1,
    borderColor: "#E5E7EB",
    marginTop: 8,
  },
  outlineButtonText: {
    color: "#0A3D62",
    fontSize: 16,
    fontWeight: "600",
  },
});

export default ProfileScreen;
