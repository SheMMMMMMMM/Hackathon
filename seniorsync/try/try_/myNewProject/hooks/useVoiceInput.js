import { useState } from 'react';
import { Alert } from 'react-native';
import { Audio } from 'expo-av';
import { transcribeAudio } from '../services/api';

/**
 * Custom hook for voice input functionality with speech-to-text
 * Returns recording state and control functions
 */
export const useVoiceInput = (onTranscriptionComplete) => {
  const [recording, setRecording] = useState(null);
  const [isRecording, setIsRecording] = useState(false);
  const [isTranscribing, setIsTranscribing] = useState(false);

  const startRecording = async () => {
    try {
      // Clean up any existing recording
      if (recording) {
        await recording.stopAndUnloadAsync();
        setRecording(null);
      }

      // Request permissions
      const { status } = await Audio.requestPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert(
          'Permission Required',
          'Please grant microphone permission to use voice input.'
        );
        return null;
      }

      // Set audio mode for recording
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
      });

      // Start recording
      const { recording: newRecording } = await Audio.Recording.createAsync(
        Audio.RecordingOptionsPresets.HIGH_QUALITY
      );
      
      setRecording(newRecording);
      setIsRecording(true);
      
      return newRecording;
    } catch (err) {
      console.error('Failed to start recording', err);
      Alert.alert('Error', 'Could not start voice recording');
      return null;
    }
  };

  const stopRecording = async (language = null) => {
    if (!recording) return null;

    try {
      setIsRecording(false);
      
      await recording.stopAndUnloadAsync();
      const uri = recording.getURI();
      setRecording(null);

      // Reset audio mode
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: false,
      });

      // Transcribe the audio
      if (onTranscriptionComplete) {
        setIsTranscribing(true);
        try {
          const result = await transcribeAudio(uri, language);
          if (result.success && result.text) {
            onTranscriptionComplete(result.text);
          } else {
            Alert.alert('Transcription Error', 'Could not convert speech to text');
          }
        } catch (error) {
          console.error('Transcription error:', error);
          Alert.alert('Transcription Error', 'Speech-to-text service is unavailable');
        } finally {
          setIsTranscribing(false);
        }
      }

      return uri;
    } catch (err) {
      console.error('Failed to stop recording', err);
      setRecording(null);
      setIsTranscribing(false);
      return null;
    }
  };

  const cancelRecording = async () => {
    if (!recording) return;

    try {
      setIsRecording(false);
      await recording.stopAndUnloadAsync();
      setRecording(null);
      
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: false,
      });
    } catch (err) {
      console.error('Failed to cancel recording', err);
      setRecording(null);
    }
  };

  const playRecording = async (uri) => {
    try {
      const { sound } = await Audio.Sound.createAsync({ uri });
      
      // Play the sound
      await sound.playAsync();
      
      // Clean up when finished
      sound.setOnPlaybackStatusUpdate((status) => {
        if (status.didJustFinish) {
          sound.unloadAsync();
        }
      });
      
      return sound;
    } catch (err) {
      console.error('Failed to play recording', err);
      Alert.alert('Error', 'Could not play recording');
      return null;
    }
  };

  return {
    recording,
    isRecording,
    isTranscribing,
    startRecording,
    stopRecording,
    cancelRecording,
    playRecording,
  };
};
