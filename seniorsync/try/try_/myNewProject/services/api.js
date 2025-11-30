/**
 * API Service for SeniorSync Backend
 * 
 * Update API_BASE_URL with your computer's IP address when testing on physical device
 * Find your IP: Run `ipconfig` in terminal and look for IPv4 Address
 */

// For local development
// Replace with your actual IP address when testing on phone/tablet
const API_BASE_URL = 'http://10.10.86.6:8000/api';
// Example: const API_BASE_URL = 'http://192.168.1.100:8000/api';

/**
 * Chat with AI Assistant
 * @param {Array} messages - Array of {role: 'user'|'assistant', content: string}
 * @param {Object} userContext - Optional user context (age, medications, etc)
 * @returns {Promise<string>} AI response
 */
export const chatWithAI = async (messages, userContext = null) => {
  try {
    const response = await fetch(`${API_BASE_URL}/ai/chat`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        messages,
        user_context: userContext,
      }),
    });

    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }

    const data = await response.json();
    return data.response;
  } catch (error) {
    console.error('Chat API error:', error);
    throw error;
  }
};

/**
 * Get user medications
 * @param {string} userId - User ID
 * @returns {Promise<Array>} List of medications
 */
export const getMedications = async (userId) => {
  try {
    const response = await fetch(`${API_BASE_URL}/medications/${userId}`);
    
    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Get medications error:', error);
    throw error;
  }
};

/**
 * Add new medication
 * @param {Object} medication - Medication data
 * @returns {Promise<Object>} Created medication
 */
export const addMedication = async (medication) => {
  try {
    const response = await fetch(`${API_BASE_URL}/medications/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(medication),
    });

    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Add medication error:', error);
    throw error;
  }
};

/**
 * Transcribe audio to text using Whisper
 * @param {string} audioUri - Local audio file URI
 * @param {string} language - Language code (en, de, cs, sk)
 * @returns {Promise<Object>} Transcription result
 */
export const transcribeAudio = async (audioUri, language = null) => {
  try {
    const formData = new FormData();
    
    // Create file object from URI
    formData.append('audio', {
      uri: audioUri,
      type: 'audio/m4a',
      name: 'recording.m4a',
    });
    
    if (language) {
      formData.append('language', language);
    }

    const response = await fetch(`${API_BASE_URL}/speech/transcribe`, {
      method: 'POST',
      body: formData,
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Transcription error:', error);
    throw error;
  }
};

/**
 * Check if message is a scam
 * @param {string} message - Message to check
 * @param {string} language - Language code (en-US, sk-SK, etc)
 * @returns {Promise<Object>} Scam analysis result
 */
export const checkScam = async (message, language = 'en-US') => {
  try {
    const response = await fetch(`${API_BASE_URL}/scam/analyze`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        message,
        language,
      }),
    });

    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Scam check error:', error);
    throw error;
  }
};

/**
 * Get scam examples
 * @returns {Promise<Object>} Scam examples
 */
export const getScamExamples = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/scam/examples`);
    
    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Get examples error:', error);
    throw error;
  }
};

/**
 * Get weather information
 * @param {number} latitude - Latitude coordinate
 * @param {number} longitude - Longitude coordinate
 * @returns {Promise<Object>} Weather data
 */
export const getWeather = async (latitude, longitude) => {
  try {
    const response = await fetch(`${API_BASE_URL}/weather/current`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        latitude,
        longitude,
      }),
    });
    
    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Weather API error:', error);
    throw error;
  }
};

/**
 * Get news articles
 * @param {string} language - Language code
 * @returns {Promise<Array>} News articles
 */
export const getNews = async (language = 'en') => {
  try {
    const response = await fetch(`${API_BASE_URL}/news/?language=${language}`);
    
    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }

    const data = await response.json();
    return data.articles;
  } catch (error) {
    console.error('News API error:', error);
    throw error;
  }
};

/**
 * Search for local activities
 * @param {Object} params - Search parameters (location, interests, etc)
 * @returns {Promise<Object>} Activities response
 */
export const searchActivities = async (params) => {
  try {
    const response = await fetch(`${API_BASE_URL}/activities/search`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(params),
    });

    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Activities API error:', error);
    throw error;
  }
};

/**
 * Send daily health report
 * @param {Object} report - Health report data
 * @returns {Promise<Object>} Response
 */
export const sendHealthReport = async (report) => {
  try {
    const response = await fetch(`${API_BASE_URL}/eldercare/send-report`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(report),
    });

    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Health report error:', error);
    throw error;
  }
};

/**
 * Send emergency alert to Telegram
 * @param {Object} alertData - Emergency alert data
 * @returns {Promise<Object>} Response
 */
export const sendEmergencyAlert = async (alertData) => {
  try {
    const response = await fetch(`${API_BASE_URL}/telegram/alert`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(alertData),
    });

    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Emergency alert error:', error);
    throw error;
  }
};

/**
 * Test backend connection
 * @returns {Promise<Object>} Connection status
 */
export const testConnection = async () => {
  try {
    const response = await fetch(`${API_BASE_URL.replace('/api', '')}/health`);
    
    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Connection test error:', error);
    throw error;
  }
};

export default {
  chatWithAI,
  getMedications,
  addMedication,
  transcribeAudio,
  checkScam,
  getScamExamples,
  getWeather,
  getNews,
  searchActivities,
  sendHealthReport,
  sendEmergencyAlert,
  testConnection,
};
