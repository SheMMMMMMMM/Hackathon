import React, { useState, useEffect, useRef } from "react";
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  ScrollView,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  Alert,
  Modal,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useVoiceInput } from '../hooks/useVoiceInput';
import { useTranslation } from 'react-i18next';
import i18n from '../i18n';
import { useUser } from "../contexts/UserContext";
import { chatWithAI } from "../services/api";

const ChatAssistantScreen = ({ navigation }) => {
  const { t } = useTranslation();
  const { user, chatHistory, addChatMessage } = useUser();
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState("");
  const [loading, setLoading] = useState(false);
  const [isRecordingLocal, setIsRecordingLocal] = useState(false);
  const { isRecording, isTranscribing, startRecording, stopRecording } = useVoiceInput((text) => {
    if (text) {
      const newText = inputText ? `${inputText} ${text}` : text;
      setInputText(newText);
    }
  });
  const [showLanguageModal, setShowLanguageModal] = useState(false);
  const scrollViewRef = useRef();

  // Load chat history on mount
  useEffect(() => {
    if (chatHistory.length > 0) {
      setMessages(chatHistory);
    } else {
      // Initial greeting
      const greeting = {
        role: "assistant",
        content: `Hello${user.name ? ' ' + user.name : ''}, how can I help you today?`,
      };
      setMessages([greeting]);
      addChatMessage(greeting);
    }
    
    // Permissions are handled by the voice hook when starting recording
  }, []);

  // Scroll to bottom when new messages arrive
  useEffect(() => {
    setTimeout(() => {
      scrollViewRef.current?.scrollToEnd({ animated: true });
    }, 100);
  }, [messages]);

  const sendMessage = async () => {
    if (!inputText.trim()) return;

    const userMessage = {
      role: "user",
      content: inputText.trim(),
    };

    // Add user message to chat
    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    addChatMessage(userMessage);
    setInputText("");
    setLoading(true);

    try {
      // Prepare user context
      const userContext = user.isLoggedIn ? {
        name: user.name,
        age: user.age,
        medications: user.medications && user.medications.length > 0 
          ? user.medications.map(m => m.name) 
          : [],
      } : null;

      // Call AI API
      const response = await chatWithAI(newMessages, userContext);

      // Add AI response to chat
      const aiMessage = {
        role: "assistant",
        content: response,
      };
      
      setMessages([...newMessages, aiMessage]);
      addChatMessage(aiMessage);
    } catch (error) {
      console.error("Chat error:", error);
      Alert.alert(
        "Connection Error",
        "Could not reach the assistant. Please check if the backend is running and try again.",
        [{ text: "OK" }]
      );
      
      // Add error message
      const errorMessage = {
        role: "assistant",
        content: "I'm sorry, I'm having trouble connecting right now. Please make sure the backend server is running.",
      };
      setMessages([...newMessages, errorMessage]);
    } finally {
      setLoading(false);
    }
  };

  // Recording handled by useVoiceInput hook; we provide a small local flag for UI if needed
  const toggleRecording = async () => {
    try {
      if (isRecording) {
        await stopRecording();
        setIsRecordingLocal(false);
      } else {
        await startRecording();
        setIsRecordingLocal(true);
      }
    } catch (err) {
      console.error('Voice input error:', err);
      setIsRecordingLocal(false);
      Alert.alert('Error', 'Voice input failed.');
    }
  };

  const changeLanguage = (languageCode) => {
    i18n.changeLanguage(languageCode);
    setShowLanguageModal(false);
    Alert.alert(
      t('selectLanguage'),
      `Language changed to ${languageCode.toUpperCase()}`,
      [{ text: 'OK' }]
    );
  };

  const languages = [
    { code: 'en', name: t('english'), flag: '🇬🇧' },
    { code: 'de', name: t('german'), flag: '🇩🇪' },
    { code: 'cs', name: t('czech'), flag: '🇨🇿' },
    { code: 'sk', name: t('slovak'), flag: '🇸🇰' },
  ];

  return (
    <SafeAreaView
      style={styles.container}
      edges={["top", "left", "right", "bottom"]}
    >
      {/* --- HEADER --- */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={24} color="#0A3D62" />
        </TouchableOpacity>
        
        <View style={styles.headerCenter}>
          <View style={styles.botIconContainer}>
            <Ionicons name="happy-outline" size={24} color="#fff" />
          </View>
          <Text style={styles.headerTitle}>{t('yourAssistant')}</Text>
        </View>
        
        <View style={styles.headerButtons}>
          <TouchableOpacity 
            style={styles.headerButton}
            onPress={() => setShowLanguageModal(true)}
          >
            <Ionicons name="language" size={24} color="#66B2FF" />
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.headerButton}
            onPress={() => navigation.navigate('Settings')}
          >
            <Ionicons name="settings-outline" size={24} color="#66B2FF" />
          </TouchableOpacity>
        </View>
      </View>

      {/* --- CHAT AREA --- */}
      <ScrollView
        ref={scrollViewRef}
        style={styles.chatArea}
        contentContainerStyle={styles.chatContent}
        showsVerticalScrollIndicator={false}
      >
        {messages.map((message, index) => (
          <View
            key={index}
            style={
              message.role === "assistant"
                ? styles.bubbleAssistant
                : styles.bubbleUser
            }
          >
            <Text
              style={
                message.role === "assistant"
                  ? styles.textAssistant
                  : styles.textUser
              }
            >
              {message.content}
            </Text>
          </View>
        ))}

        {/* Loading indicator */}
        {loading && (
          <View style={styles.bubbleAssistant}>
            <ActivityIndicator color="#66B2FF" size="small" />
          </View>
        )}
      </ScrollView>

      {/* --- INPUT AREA --- */}
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={Platform.OS === "ios" ? 10 : 0}
      >
        <View style={styles.inputContainer}>
          <TouchableOpacity
            style={[styles.micButton, (isRecording || isRecordingLocal) && styles.micButtonRecording]}
            onPress={toggleRecording}
            disabled={loading || isTranscribing}
          >
            <Ionicons 
              name={(isRecording || isRecordingLocal) ? "mic" : "mic-outline"} 
              size={24} 
              color={(isRecording || isRecordingLocal) ? "#FF5252" : "#66B2FF"} 
            />
          </TouchableOpacity>
          <TextInput
            style={styles.inputField}
            placeholder={t('typeMessage')}
            placeholderTextColor="#99A1AF"
            value={inputText}
            onChangeText={setInputText}
            onSubmitEditing={sendMessage}
            editable={!loading}
            multiline={true}
          />
          <TouchableOpacity
            style={[styles.sendButton, loading && styles.sendButtonDisabled]}
            onPress={sendMessage}
            disabled={loading || !inputText.trim()}
          >
            <Ionicons 
              name={loading ? "hourglass" : "send"} 
              size={20} 
              color="#fff" 
            />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>

      {/* Language Selection Modal */}
      <Modal
        visible={showLanguageModal}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowLanguageModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>{t('selectLanguage')}</Text>
            
            {languages.map((lang) => (
              <TouchableOpacity
                key={lang.code}
                style={[
                  styles.languageButton,
                  i18n.language === lang.code && styles.languageButtonActive
                ]}
                onPress={() => changeLanguage(lang.code)}
              >
                <Text style={styles.languageFlag}>{lang.flag}</Text>
                <Text style={[
                  styles.languageText,
                  i18n.language === lang.code && styles.languageTextActive
                ]}>
                  {lang.name}
                </Text>
                {i18n.language === lang.code && (
                  <Ionicons name="checkmark-circle" size={24} color="#66B2FF" />
                )}
              </TouchableOpacity>
            ))}

            <TouchableOpacity
              style={styles.modalCloseButton}
              onPress={() => setShowLanguageModal(false)}
            >
              <Text style={styles.modalCloseText}>{t('cancel')}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F9FAFB",
  },

  // --- HEADER STYLES ---
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#F3F4F6",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 3,
  },
  backButton: {
    padding: 8,
  },
  headerCenter: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
    justifyContent: "center",
    marginRight: 40, // Balance the back button
  },
  botIconContainer: {
    width: 40,
    height: 40,
    backgroundColor: "#66B2FF",
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#0A3D62",
    fontFamily: Platform.OS === "ios" ? "Arial" : "Roboto",
    marginLeft: 12,
  },
  headerButtons: {
    flexDirection: "row",
    gap: 8,
  },
  headerButton: {
    padding: 8,
  },
  settingsButton: {
    padding: 8,
  },

  // --- CHAT AREA STYLES ---
  chatArea: {
    flex: 1,
    backgroundColor: "#F9FAFB",
  },
  chatContent: {
    padding: 16,
    paddingTop: 12,
    paddingBottom: 40,
  },

  // --- ASSISTANT BUBBLE ---
  bubbleAssistant: {
    alignSelf: "flex-start",
    backgroundColor: "#EBF5FF",
    padding: 14,
    borderRadius: 20,
    borderBottomLeftRadius: 4,
    marginBottom: 14,
    maxWidth: "85%",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  textAssistant: {
    fontSize: 16,
    color: "#0A3D62",
    lineHeight: 24,
  },

  // --- USER BUBBLE ---
  bubbleUser: {
    alignSelf: "flex-end",
    backgroundColor: "#fff",
    borderWidth: 1.5,
    borderColor: "#0A3D62",
    padding: 14,
    borderRadius: 20,
    borderBottomRightRadius: 4,
    marginBottom: 14,
    maxWidth: "85%",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  textUser: {
    fontSize: 16,
    color: "#0A3D62",
    fontWeight: "500",
    lineHeight: 24,
  },

  // --- INPUT AREA STYLES ---
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: "#fff",
    borderTopWidth: 1,
    borderColor: "#E5E7EB",
    gap: 8,
  },
  micButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "#F0F7FF",
    justifyContent: "center",
    alignItems: "center",
  },
  micButtonRecording: {
    backgroundColor: "#FFEBEE",
  },
  inputField: {
    flex: 1,
    backgroundColor: "#F9FAFB",
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 25,
    paddingHorizontal: 18,
    paddingVertical: 12,
    fontSize: 15,
    color: "#0A3D62",
    minHeight: 48,
    maxHeight: 100,
  },
  sendButton: {
    width: 48,
    height: 48,
    backgroundColor: "#66B2FF",
    borderRadius: 24,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#66B2FF",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  sendButtonDisabled: {
    backgroundColor: "#B0BEC5",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  modalContent: {
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 24,
    width: "100%",
    maxWidth: 400,
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: "700",
    color: "#0A3D62",
    marginBottom: 24,
    textAlign: "center",
  },
  languageButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F0F7FF",
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 2,
    borderColor: "#E3F2FD",
  },
  languageButtonActive: {
    backgroundColor: "#E3F2FD",
    borderColor: "#66B2FF",
  },
  languageFlag: {
    fontSize: 32,
    marginRight: 16,
  },
  languageText: {
    flex: 1,
    fontSize: 18,
    fontWeight: "600",
    color: "#0A3D62",
  },
  languageTextActive: {
    color: "#66B2FF",
  },
  modalCloseButton: {
    backgroundColor: "#E5E7EB",
    padding: 16,
    borderRadius: 12,
    marginTop: 12,
  },
  modalCloseText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#666",
    textAlign: "center",
  },
});

export default ChatAssistantScreen;
