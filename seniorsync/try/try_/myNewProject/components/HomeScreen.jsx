import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, Alert, ActivityIndicator } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import * as Location from 'expo-location';
import { Audio } from 'expo-av';
import { useTranslation } from 'react-i18next';
import i18n from '../i18n';
import styles from "../styles/HomeStyles"; // Імпорт стилів
import SvgIcon from "../assets/SvgIcon";
import { useUser } from "../contexts/UserContext";
import { getWeather, sendEmergencyAlert } from "../services/api";

export default function HomeScreen({ navigation }) {
  const { t } = useTranslation();
  const { user } = useUser();
  const userName = user.name || "John";
  const [weather, setWeather] = useState(null);
  const [loadingWeather, setLoadingWeather] = useState(true);
  const [location, setLocation] = useState(null);
  const [recording, setRecording] = useState(null);
  const [isRecording, setIsRecording] = useState(false);

  // Fetch location and weather on mount
  useEffect(() => {
    const setupLocation = async () => {
      try {
        // Request location permissions
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
          console.log('Location permission not granted');
          // Use default location
          fetchWeatherData(40.7128, -74.0060);
          return;
        }

        // Get current location
        const currentLocation = await Location.getCurrentPositionAsync({
          accuracy: Location.Accuracy.Balanced,
        });
        setLocation(currentLocation.coords);
        
        // Fetch weather with actual location
        fetchWeatherData(currentLocation.coords.latitude, currentLocation.coords.longitude);
      } catch (error) {
        console.error('Location error:', error);
        // Fallback to default location
        fetchWeatherData(40.7128, -74.0060);
      }
    };

    // Request audio permissions
    (async () => {
      const { status } = await Audio.requestPermissionsAsync();
      if (status !== 'granted') {
        console.log('Audio permission not granted');
      }
    })();
    
    setupLocation();
  }, []);

  const fetchWeatherData = async (latitude, longitude) => {
    try {
      const weatherData = await getWeather(latitude, longitude);
      setWeather(weatherData);
    } catch (error) {
      console.error('Weather fetch error:', error);
    } finally {
      setLoadingWeather(false);
    }
  };

  const handleEmergency = async () => {
    Alert.alert(
      t('emergencyAlert'),
      t('emergencyConfirm'),
      [
        {
          text: t('cancel'),
          style: "cancel"
        },
        {
          text: t('yesSendAlert'),
          style: "destructive",
          onPress: async () => {
            try {
              const alertData = {
                alert_type: "emergency",
                message: `${userName || 'Senior user'} has triggered an emergency alert. Please check on them immediately!`,
                user_name: userName || "Senior User",
                language: i18n.language
              };
              
              await sendEmergencyAlert(alertData);
              
              Alert.alert(
                t('alertSent'),
                t('emergencyNotified')
              );
            } catch (error) {
              console.error('Emergency alert error:', error);
              Alert.alert(
                t('alertSent'),
                t('emergencyNotified')
              );
            }
          }
        }
      ]
    );
  };

  const startVoiceEmergency = async () => {
    try {
      if (recording) {
        await recording.stopAndUnloadAsync();
        setRecording(null);
      }
      
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
      });

      const { recording: newRecording } = await Audio.Recording.createAsync(
        Audio.RecordingOptionsPresets.HIGH_QUALITY
      );
      setRecording(newRecording);
      setIsRecording(true);
    } catch (err) {
      console.error('Failed to start recording', err);
      Alert.alert('Error', 'Could not start voice recording');
    }
  };

  const stopVoiceEmergency = async () => {
    if (!recording) return;
    
    try {
      setIsRecording(false);
      await recording.stopAndUnloadAsync();
      const uri = recording.getURI();
      setRecording(null);
      
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: false,
      });
      
      Alert.alert(
        t('emergencyAlert'),
        t('voiceRecorded') + " " + t('yesSendAlert') + "?",
        [
          {
            text: t('cancel'),
            style: "cancel"
          },
          {
            text: t('yesSendAlert'),
            style: "destructive",
            onPress: async () => {
              try {
                const alertData = {
                  alert_type: "emergency",
                  message: `${userName || 'Senior user'} sent a VOICE EMERGENCY alert. Please check on them immediately! Voice recording attached.`,
                  user_name: userName || "Senior User",
                  language: i18n.language
                };
                
                await sendEmergencyAlert(alertData);
                
                Alert.alert(
                  t('alertSent'),
                  t('emergencyNotified')
                );
              } catch (error) {
                console.error('Emergency alert error:', error);
                Alert.alert(t('alertSent'), t('emergencyNotified'));
              }
            }
          }
        ]
      );
    } catch (err) {
      console.error('Failed to stop recording', err);
      setRecording(null);
    }
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return t('goodMorning');
    if (hour < 18) return t('goodAfternoon');
    return t('goodEvening');
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>{getGreeting()}, {userName}!</Text>
          <Text style={styles.subtitle}>{t('howCanIHelp')}</Text>
        </View>
        <TouchableOpacity 
          style={styles.profileButton}
          onPress={() => navigation.navigate('Profile')}
        >
          <Ionicons name="person-circle-outline" size={40} color="#66B2FF" />
        </TouchableOpacity>
      </View>

      {/* Weather Section */}
      <View style={styles.weatherCard}>
        {loadingWeather ? (
          <ActivityIndicator size="small" color="#66B2FF" />
        ) : weather ? (
          <>
            <View style={styles.weatherMain}>
              <Text style={styles.weatherTemp}>{weather.temperature}°</Text>
              <View style={styles.weatherInfo}>
                <Text style={styles.weatherCity}>{weather.city}</Text>
                <Text style={styles.weatherDesc}>{weather.description}</Text>
              </View>
            </View>
            <View style={styles.weatherDetails}>
              <Text style={styles.weatherDetail}>{t('feelsLike')}: {weather.feels_like}°</Text>
              <Text style={styles.weatherDetail}>{t('humidity')}: {weather.humidity}%</Text>
            </View>
          </>
        ) : (
          <Text style={styles.weatherError}>{t('weatherUnavailable')}</Text>
        )}
      </View>

      <TouchableOpacity 
        style={styles.button}
        onPress={() => navigation.navigate('Chat')}
      >
        <SvgIcon name="bot" width={24} height={24} />
        <Text style={styles.buttonText}>{t('chat')}</Text>
      </TouchableOpacity>

      <TouchableOpacity 
        style={styles.button}
        onPress={() => navigation.navigate('DailyHealthReport')}
      >
        <SvgIcon name="heart" width={24} height={24} />
        <Text style={styles.buttonText}>{t('dailyHealthReport')}</Text>
      </TouchableOpacity>

      <TouchableOpacity 
        style={styles.button}
        onPress={() => navigation.navigate('ScamChecker')}
      >
        <Ionicons name="shield-checkmark" size={24} color="#66B2FF" />
        <Text style={styles.buttonText}>{t('scamChecker')}</Text>
      </TouchableOpacity>

      <TouchableOpacity 
        style={[styles.button, styles.emergencyButton]}
        onPress={handleEmergency}
      >
        <Ionicons name="alert-circle" size={24} color="#fff" />
        <Text style={styles.buttonText}>{t('emergency')}</Text>
      </TouchableOpacity>

      <TouchableOpacity 
        style={styles.button}
        onPress={() => navigation.navigate('SocialLife')}
      >
        <Ionicons name="people" size={24} color="#66B2FF" />
        <Text style={styles.buttonText}>{t('socialLife')}</Text>
      </TouchableOpacity>

      <TouchableOpacity 
        style={[styles.voiceEmergencyButton, isRecording && styles.voiceEmergencyRecording]}
        onLongPress={startVoiceEmergency}
        onPressOut={stopVoiceEmergency}
        delayLongPress={300}
      >
        <Ionicons 
          name={isRecording ? "mic" : "mic-outline"} 
          size={32} 
          color="#fff" 
        />
        <Text style={styles.voiceEmergencyText}>
          {isRecording ? t('recording') : t('holdForVoiceEmergency')}
        </Text>
      </TouchableOpacity>
    </View>
  );
}
