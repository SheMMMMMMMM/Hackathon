import React, { createContext, useState, useContext, useEffect } from 'react';

const UserContext = createContext();

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used within UserProvider');
  }
  return context;
};

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState({
    id: null,
    name: '',
    age: null,
    medications: [],
    isLoggedIn: false,
    // Questionnaire / profile fields
    questionnaireCompleted: false,
    questionnaireData: {},
    generalHealth: null,
    dailyMedications: null,
    livingArrangement: null,
    mobilityDifficulties: null,
    techComfort: null,
    socialFrequency: null,
    preferredInteraction: null,
  });

  const [chatHistory, setChatHistory] = useState([]);

  // Login user
  const login = (userData) => {
    setUser({
      ...userData,
      isLoggedIn: true,
    });
  };

  // Logout user
  const logout = () => {
    setUser({
      id: null,
      name: '',
      age: null,
      medications: [],
      isLoggedIn: false,
      questionnaireCompleted: false,
      questionnaireData: {},
    });
    setChatHistory([]);
  };

  // Update user profile
  const updateProfile = (updates) => {
    setUser((prev) => ({
      ...prev,
      ...updates,
    }));
  };

  // Complete questionnaire
  const completeQuestionnaire = (data) => {
    setUser((prev) => ({
      ...prev,
      questionnaireCompleted: true,
      questionnaireData: data,
      // Mirror key questionnaire fields into top-level user state for easy access
      name: data.name ?? prev.name,
      age: data.age ?? prev.age,
      generalHealth: data.generalHealth ?? prev.generalHealth,
      dailyMedications: data.dailyMedications ?? prev.dailyMedications,
      livingArrangement: data.livingArrangement ?? prev.livingArrangement,
      mobilityDifficulties: data.mobilityDifficulties ?? prev.mobilityDifficulties,
      techComfort: data.techComfort ?? prev.techComfort,
      socialFrequency: data.socialFrequency ?? prev.socialFrequency,
      preferredInteraction: data.preferredInteraction ?? prev.preferredInteraction,
    }));
  };

  // Add medication
  const addMedication = (medication) => {
    setUser((prev) => ({
      ...prev,
      medications: [...prev.medications, medication],
    }));
  };

  // Remove medication
  const removeMedication = (medicationId) => {
    setUser((prev) => ({
      ...prev,
      medications: prev.medications.filter((med) => med.id !== medicationId),
    }));
  };

  // Add message to chat history
  const addChatMessage = (message) => {
    setChatHistory((prev) => [...prev, message]);
  };

  // Clear chat history
  const clearChatHistory = () => {
    setChatHistory([]);
  };

  const value = {
    user,
    chatHistory,
    login,
    logout,
    updateProfile,
    completeQuestionnaire,
    addMedication,
    removeMedication,
    addChatMessage,
    clearChatHistory,
  };

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
};
