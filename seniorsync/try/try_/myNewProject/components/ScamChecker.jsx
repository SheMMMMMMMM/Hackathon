import React, { useState, useEffect } from "react";
import { View, Text, TextInput, TouchableOpacity, ScrollView, StyleSheet, Alert, ActivityIndicator } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useTranslation } from 'react-i18next';
import { checkScam, getScamExamples } from "../services/api";

export default function ScamChecker({ navigation }) {
  const { t } = useTranslation();
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [examples, setExamples] = useState([]);

  useEffect(() => {
    loadExamples();
  }, []);

  const loadExamples = async () => {
    try {
      const data = await getScamExamples();
      setExamples(data.examples || []);
    } catch (error) {
      console.error('Error loading examples:', error);
    }
  };

  const handleCheck = async () => {
    if (!message.trim()) {
      Alert.alert(t('scamChecker'), "Please enter a message to check");
      return;
    }

    setLoading(true);
    try {
      const analysis = await checkScam(message);
      setResult(analysis);
    } catch (error) {
      console.error('Scam check error:', error);
      Alert.alert("Error", "Could not analyze the message. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const getRiskColor = (riskLevel) => {
    switch (riskLevel) {
      case 'safe': return '#4CAF50';
      case 'warning': return '#FF9800';
      case 'danger': return '#F44336';
      default: return '#999';
    }
  };

  const getRiskIcon = (riskLevel) => {
    switch (riskLevel) {
      case 'safe': return 'checkmark-circle';
      case 'warning': return 'warning';
      case 'danger': return 'alert-circle';
      default: return 'help-circle';
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={["top", "left", "right", "bottom"]}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="#0A3D62" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{t('scamChecker')}</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <Text style={styles.sectionTitle}>{t('checkMessage')}</Text>
        
        <TextInput
          style={styles.input}
          placeholder={t('enterMessage')}
          placeholderTextColor="#999"
          value={message}
          onChangeText={setMessage}
          multiline
          numberOfLines={4}
        />

        <TouchableOpacity 
          style={styles.checkButton}
          onPress={handleCheck}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <>
              <Ionicons name="shield-checkmark" size={24} color="#fff" />
              <Text style={styles.checkButtonText}>{t('checkForScam')}</Text>
            </>
          )}
        </TouchableOpacity>

        {result && (
          <View style={[styles.resultCard, { borderLeftColor: getRiskColor(result.risk_level) }]}>
            <View style={styles.resultHeader}>
              <Ionicons 
                name={getRiskIcon(result.risk_level)} 
                size={32} 
                color={getRiskColor(result.risk_level)} 
              />
              <View style={styles.resultTitleContainer}>
                <Text style={styles.resultTitle}>{t('riskLevel')}</Text>
                <Text style={[styles.riskLevel, { color: getRiskColor(result.risk_level) }]}>
                  {t(result.risk_level).toUpperCase()}
                </Text>
              </View>
            </View>
            
            <Text style={styles.explanation}>{result.explanation}</Text>
            
            {result.indicators && result.indicators.length > 0 && (
              <View style={styles.indicatorsContainer}>
                <Text style={styles.indicatorsTitle}>Indicators:</Text>
                {result.indicators.map((indicator, index) => (
                  <Text key={index} style={styles.indicator}>• {indicator}</Text>
                ))}
              </View>
            )}
          </View>
        )}

        <Text style={styles.sectionTitle}>{t('examples')}</Text>
        
        {examples.filter(ex => ex.risk_level === 'danger').slice(0, 2).map((example, index) => (
          <TouchableOpacity 
            key={`danger-${index}`}
            style={styles.exampleCard}
            onPress={() => setMessage(example.message)}
          >
            <View style={styles.exampleHeader}>
              <Ionicons name="alert-circle" size={20} color="#F44336" />
              <Text style={[styles.exampleRisk, { color: '#F44336' }]}>
                {t('danger').toUpperCase()}
              </Text>
            </View>
            <Text style={styles.exampleMessage} numberOfLines={2}>{example.message}</Text>
          </TouchableOpacity>
        ))}

        {examples.filter(ex => ex.risk_level === 'safe').slice(0, 1).map((example, index) => (
          <TouchableOpacity 
            key={`safe-${index}`}
            style={styles.exampleCard}
            onPress={() => setMessage(example.message)}
          >
            <View style={styles.exampleHeader}>
              <Ionicons name="checkmark-circle" size={20} color="#4CAF50" />
              <Text style={[styles.exampleRisk, { color: '#4CAF50' }]}>
                {t('safe').toUpperCase()}
              </Text>
            </View>
            <Text style={styles.exampleMessage} numberOfLines={2}>{example.message}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F9FAFB",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: "#fff",
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
  content: {
    flex: 1,
    padding: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#0A3D62",
    marginBottom: 16,
    marginTop: 8,
  },
  input: {
    backgroundColor: "#fff",
    borderWidth: 2,
    borderColor: "#E5E7EB",
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    color: "#0A3D62",
    minHeight: 100,
    textAlignVertical: "top",
    marginBottom: 16,
  },
  checkButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#66B2FF",
    paddingVertical: 16,
    borderRadius: 12,
    marginBottom: 24,
  },
  checkButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "700",
    marginLeft: 8,
  },
  resultCard: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 20,
    marginBottom: 24,
    borderLeftWidth: 6,
  },
  resultHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  resultTitleContainer: {
    marginLeft: 12,
    flex: 1,
  },
  resultTitle: {
    fontSize: 14,
    color: "#666",
  },
  riskLevel: {
    fontSize: 24,
    fontWeight: "700",
  },
  explanation: {
    fontSize: 16,
    color: "#333",
    lineHeight: 24,
    marginBottom: 16,
  },
  indicatorsContainer: {
    backgroundColor: "#F9FAFB",
    padding: 12,
    borderRadius: 8,
  },
  indicatorsTitle: {
    fontSize: 14,
    fontWeight: "700",
    color: "#0A3D62",
    marginBottom: 8,
  },
  indicator: {
    fontSize: 14,
    color: "#666",
    marginBottom: 4,
  },
  exampleCard: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  exampleHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  exampleRisk: {
    fontSize: 12,
    fontWeight: "700",
    marginLeft: 8,
  },
  exampleMessage: {
    fontSize: 14,
    color: "#666",
  },
});
