import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Alert,
  StyleSheet,
  Linking,
  Platform,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import * as Location from 'expo-location';
import { useTranslation } from 'react-i18next';
import { searchActivities } from "../services/api";

const SocialLife = ({ navigation }) => {
  const { t } = useTranslation();
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [location, setLocation] = useState(null);

  // Placeholder connections
  const connections = [
    {
      id: 1,
      name: "Zuzana Tomcova",
      age: 72,
      interests: ["Gardening", "Reading"],
      distance: "1.2 km",
      avatar: "👵"
    },
    {
      id: 2,
      name: "Miroslav Novak",
      age: 68,
      interests: ["Walking", "Chess"],
      distance: "2.5 km",
      avatar: "👴"
    },
    {
      id: 3,
      name: "Yolana Petrova",
      age: 75,
      interests: ["Sewing", "Music"],
      distance: "3.1 km",
      avatar: "👵"
    }
  ];

  useEffect(() => {
    setupLocationAndActivities();
  }, []);

  const setupLocationAndActivities = async () => {
    try {
      // Request location permissions
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        console.log('Location permission not granted');
        // Use default location (New York)
        fetchActivities(40.7128, -74.0060);
        return;
      }

      // Get current location
      const currentLocation = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
      });
      setLocation(currentLocation.coords);
      
      // Fetch activities with actual location
      fetchActivities(currentLocation.coords.latitude, currentLocation.coords.longitude);
    } catch (error) {
      console.error('Location error:', error);
      // Fallback to default location
      fetchActivities(40.7128, -74.0060);
    }
  };

  const fetchActivities = async (latitude, longitude) => {
    try {
      setLoading(true);
      const response = await searchActivities({
        location: { latitude, longitude },
        radius: 5000,
        interests: ["senior", "community", "social"]
      });
      
      setActivities(response.activities || []);
    } catch (error) {
      console.error('Activities fetch error:', error);
      Alert.alert(t('error'), t('activitiesLoadError'));
    } finally {
      setLoading(false);
    }
  };

  const openInMaps = (latitude, longitude, name) => {
    const scheme = Platform.select({ ios: 'maps:0,0?q=', android: 'geo:0,0?q=' });
    const latLng = `${latitude},${longitude}`;
    const label = name;
    const url = Platform.select({
      ios: `${scheme}${label}@${latLng}`,
      android: `${scheme}${latLng}(${label})`
    });

    Linking.openURL(url);
  };

  const openActivityInMaps = (activity) => {
    // Since we don't have exact coordinates, open search by name
    const query = encodeURIComponent(activity.name + ' ' + activity.address);
    const url = Platform.select({
      ios: `maps:0,0?q=${query}`,
      android: `geo:0,0?q=${query}`
    });
    Linking.openURL(url);
  };

  const connectWithPerson = (person) => {
    Alert.alert(
      t('connectWith') + ' ' + person.name,
      t('connectionFeatureComingSoon'),
      [{ text: 'OK' }]
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={24} color="#0A3D62" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{t('socialLife')}</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Nearby Activities Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Ionicons name="location" size={24} color="#66B2FF" />
            <Text style={styles.sectionTitle}>{t('nearbyActivities')}</Text>
          </View>

          {loading ? (
            <ActivityIndicator size="large" color="#66B2FF" style={styles.loader} />
          ) : activities.length > 0 ? (
            activities.map((activity, index) => (
              <TouchableOpacity
                key={index}
                style={styles.activityCard}
                onPress={() => openActivityInMaps(activity)}
              >
                <View style={styles.activityHeader}>
                  <Text style={styles.activityName}>{activity.name}</Text>
                  {activity.rating && (
                    <View style={styles.ratingContainer}>
                      <Ionicons name="star" size={16} color="#FFB800" />
                      <Text style={styles.rating}>{activity.rating}</Text>
                    </View>
                  )}
                </View>
                <Text style={styles.activityAddress}>{activity.address}</Text>
                {activity.distance && (
                  <Text style={styles.activityDistance}>
                    📍 {(activity.distance / 1000).toFixed(1)} km {t('away')}
                  </Text>
                )}
                {activity.types && activity.types.length > 0 && (
                  <View style={styles.tagsContainer}>
                    {activity.types.slice(0, 3).map((type, idx) => (
                      <View key={idx} style={styles.tag}>
                        <Text style={styles.tagText}>{type.replace(/_/g, ' ')}</Text>
                      </View>
                    ))}
                  </View>
                )}
                <View style={styles.activityFooter}>
                  <Ionicons name="navigate" size={16} color="#66B2FF" />
                  <Text style={styles.openMaps}>{t('openInMaps')}</Text>
                </View>
              </TouchableOpacity>
            ))
          ) : (
            <View style={styles.emptyState}>
              <Ionicons name="location-outline" size={48} color="#99A1AF" />
              <Text style={styles.emptyText}>{t('noActivitiesFound')}</Text>
            </View>
          )}
        </View>

        {/* Potential Connections Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Ionicons name="people" size={24} color="#66B2FF" />
            <Text style={styles.sectionTitle}>{t('potentialConnections')}</Text>
          </View>

          {connections.map((person) => (
            <View key={person.id} style={styles.connectionCard}>
              <View style={styles.connectionHeader}>
                <Text style={styles.avatar}>{person.avatar}</Text>
                <View style={styles.connectionInfo}>
                  <Text style={styles.connectionName}>{person.name}</Text>
                  <Text style={styles.connectionAge}>{person.age} {t('yearsOld')}</Text>
                  <Text style={styles.connectionDistance}>{person.distance}</Text>
                </View>
              </View>
              <View style={styles.interestsContainer}>
                {person.interests.map((interest, idx) => (
                  <View key={idx} style={styles.interestTag}>
                    <Text style={styles.interestText}>{interest}</Text>
                  </View>
                ))}
              </View>
              <TouchableOpacity
                style={styles.connectButton}
                onPress={() => connectWithPerson(person)}
              >
                <Ionicons name="person-add" size={18} color="#fff" />
                <Text style={styles.connectButtonText}>{t('connect')}</Text>
              </TouchableOpacity>
            </View>
          ))}
        </View>

        {/* Info Box */}
        <View style={styles.infoBox}>
          <Ionicons name="information-circle" size={24} color="#66B2FF" />
          <Text style={styles.infoText}>{t('socialLifeInfo')}</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F7FA",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#E3F2FD",
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
    padding: 16,
  },
  section: {
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#0A3D62",
    marginLeft: 8,
  },
  loader: {
    marginVertical: 32,
  },
  activityCard: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#E3F2FD",
  },
  activityHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 8,
  },
  activityName: {
    fontSize: 18,
    fontWeight: "700",
    color: "#0A3D62",
    flex: 1,
  },
  ratingContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFF9E6",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    marginLeft: 8,
  },
  rating: {
    fontSize: 14,
    fontWeight: "600",
    color: "#FFB800",
    marginLeft: 4,
  },
  activityAddress: {
    fontSize: 14,
    color: "#666",
    marginBottom: 8,
  },
  activityDistance: {
    fontSize: 14,
    color: "#66B2FF",
    fontWeight: "600",
    marginBottom: 8,
  },
  tagsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginBottom: 12,
  },
  tag: {
    backgroundColor: "#E3F2FD",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    marginRight: 8,
    marginBottom: 4,
  },
  tagText: {
    fontSize: 12,
    color: "#66B2FF",
    textTransform: "capitalize",
  },
  activityFooter: {
    flexDirection: "row",
    alignItems: "center",
  },
  openMaps: {
    fontSize: 14,
    color: "#66B2FF",
    fontWeight: "600",
    marginLeft: 4,
  },
  emptyState: {
    alignItems: "center",
    paddingVertical: 48,
  },
  emptyText: {
    fontSize: 16,
    color: "#99A1AF",
    marginTop: 12,
  },
  connectionCard: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#E3F2FD",
  },
  connectionHeader: {
    flexDirection: "row",
    marginBottom: 12,
  },
  avatar: {
    fontSize: 48,
    marginRight: 12,
  },
  connectionInfo: {
    flex: 1,
  },
  connectionName: {
    fontSize: 18,
    fontWeight: "700",
    color: "#0A3D62",
    marginBottom: 4,
  },
  connectionAge: {
    fontSize: 14,
    color: "#666",
    marginBottom: 2,
  },
  connectionDistance: {
    fontSize: 14,
    color: "#66B2FF",
    fontWeight: "600",
  },
  interestsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginBottom: 12,
  },
  interestTag: {
    backgroundColor: "#F0F7FF",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    marginRight: 8,
    marginBottom: 4,
  },
  interestText: {
    fontSize: 13,
    color: "#0A3D62",
    fontWeight: "600",
  },
  connectButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#66B2FF",
    padding: 12,
    borderRadius: 12,
  },
  connectButtonText: {
    fontSize: 16,
    fontWeight: "700",
    color: "#fff",
    marginLeft: 8,
  },
  infoBox: {
    flexDirection: "row",
    backgroundColor: "#E3F2FD",
    padding: 16,
    borderRadius: 12,
    marginBottom: 24,
  },
  infoText: {
    flex: 1,
    fontSize: 14,
    color: "#0A3D62",
    marginLeft: 12,
    lineHeight: 20,
  },
});

export default SocialLife;
