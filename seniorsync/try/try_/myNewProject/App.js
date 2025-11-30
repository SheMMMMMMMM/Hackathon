import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { UserProvider } from "./contexts/UserContext";
import './i18n';

import WelcomeScreen from "./components/WelcomeScreen";
import { RegistrationScreen } from "./components/RegistrationScreen";
import { LoginScreen } from "./components/LoginScreen";
import { HealthCheckTest } from "./components/HealthCheckTest";
import HomeScreen from "./components/HomeScreen";
import ProfileScreen from "./components/ProfileScreen";
import { SettingsScreen } from "./components/SettingsScreen";
import ChatAssistantScreen from "./components/ChatScreen";
import FeelingScreen from "./components/FeelingScreen";
import MedicationStep from "./components/MedicationStep";
import DailyHealthReport from "./components/DailyHealthReport";
import ScamChecker from "./components/ScamChecker";
import SocialLife from "./components/SocialLife";
import Question1 from "./components/Question1";
import Question2 from "./components/Question2";
import Question3 from "./components/Question3";
import Question4 from "./components/Question4";
import Question5 from "./components/Question5";
import Question6 from "./components/Question6";
import Question7 from "./components/Question7";
import Question8 from "./components/Question8";
import Question9 from "./components/Question9";

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <UserProvider>
      <NavigationContainer>
        <Stack.Navigator
          screenOptions={{
            headerShown: false,
            cardStyle: { backgroundColor: "#fff" },
          }}
        >
          {/* Екран приходу */}
          <Stack.Screen
            name="Welcome"
            component={WelcomeScreen}
            options={{ animationEnabled: false }}
          />

          {/* Реєстрація */}
          <Stack.Screen
            name="Registration"
            component={RegistrationScreen}
            options={{
              animationEnabled: true,
              animationTypeForReplace: "push",
            }}
          />

          {/* Вхід */}
          <Stack.Screen
            name="Login"
            component={LoginScreen}
            options={{
              animationEnabled: true,
            }}
          />

          {/* Здоровіцький тест */}
          <Stack.Screen
            name="HealthCheck"
            component={HealthCheckTest}
            options={{
              animationEnabled: true,
            }}
          />

          {/* Домашня сторінка */}
          <Stack.Screen
            name="Home"
            component={HomeScreen}
            options={{
              animationEnabled: true,
            }}
          />

          {/* Profile */}
          <Stack.Screen
            name="Profile"
            component={ProfileScreen}
            options={{
              animationEnabled: true,
            }}
          />

          {/* Chat Assistant */}
          <Stack.Screen
            name="Chat"
            component={ChatAssistantScreen}
            options={{
              animationEnabled: true,
            }}
          />

          {/* Feeling Check */}
          <Stack.Screen
            name="Feeling"
            component={FeelingScreen}
            options={{
              animationEnabled: true,
            }}
          />

          {/* Daily Health Report */}
          <Stack.Screen
            name="DailyHealthReport"
            component={DailyHealthReport}
            options={{
              animationEnabled: true,
            }}
          />

          {/* Scam Checker */}
          <Stack.Screen
            name="ScamChecker"
            component={ScamChecker}
            options={{
              animationEnabled: true,
            }}
          />

          {/* Social Life */}
          <Stack.Screen
            name="SocialLife"
            component={SocialLife}
            options={{
              animationEnabled: true,
            }}
          />

          {/* Medication */}
          <Stack.Screen
            name="Medication"
            component={MedicationStep}
            options={{
              animationEnabled: true,
            }}
          />

          {/* Questionnaire Screens */}
          <Stack.Screen name="Question1" component={Question1} />
          <Stack.Screen name="Question2" component={Question2} />
          <Stack.Screen name="Question3" component={Question3} />
          <Stack.Screen name="Question4" component={Question4} />
          <Stack.Screen name="Question5" component={Question5} />
          <Stack.Screen name="Question6" component={Question6} />
          <Stack.Screen name="Question7" component={Question7} />
          <Stack.Screen name="Question8" component={Question8} />
          <Stack.Screen name="Question9" component={Question9} />

          {/* Налаштування */}
          <Stack.Screen
            name="Settings"
            component={SettingsScreen}
            options={{
              animationEnabled: true,
            }}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </UserProvider>
  );
}
