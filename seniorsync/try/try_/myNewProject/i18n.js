import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import * as Localization from 'expo-localization';

const resources = {
  en: {
    translation: {
      // Welcome & Auth
      "welcome": "Welcome to SeniorSync",
      "getStarted": "Get Started",
      "login": "Login",
      "register": "Create Account",
      "email": "Email",
      "password": "Password",
      "name": "Name",
      
      // Home Screen
      "goodMorning": "Good morning",
      "goodAfternoon": "Good afternoon",
      "goodEvening": "Good evening",
      "howCanIHelp": "How can I help you today?",
      "chat": "CHAT",
      "dailyHealthReport": "Daily Health Report",
      "emergency": "Emergency",
      "holdForVoiceEmergency": "Hold for Voice Emergency",
      "recording": "Recording...",
      
      // Weather
      "feelsLike": "Feels like",
      "humidity": "Humidity",
      "weatherUnavailable": "Weather unavailable",
      
      // Profile
      "profile": "Profile",
      "age": "Age",
      "healthInformation": "Health Information",
      "healthConditions": "Health conditions",
      "dailyMedications": "Daily medications",
      "mobilityLevel": "Mobility level",
      "preferences": "Preferences",
      "techComfort": "Tech comfort",
      "socialFrequency": "Social frequency",
      "interactionMode": "Interaction mode",
      "caregiver": "Caregiver",
      "phone": "Phone",
      "contactCaregiver": "Contact caregiver",
      "editProfile": "Edit profile",
      
      // Chat
      "yourAssistant": "Your Assistant",
      "typeMessage": "Type a message...",
      "connectionError": "Connection Error",
      "couldNotReach": "Could not reach the assistant. Please check if the backend is running and try again.",
      
      // Emergency
      "emergencyAlert": "🚨 Emergency Alert",
      "emergencyConfirm": "This will notify your family/caregiver via Telegram. Are you in an emergency?",
      "cancel": "Cancel",
      "yesSendAlert": "YES - Send Alert",
      "alertSent": "Alert Sent! ✅",
      "emergencyNotified": "Your emergency contact has been notified via Telegram.",
      
      // Voice
      "voiceRecorded": "Voice Recorded",
      "speakYourName": "Speak Your Name",
      "speakYourAge": "Speak Your Age",
      "speakYourAnswer": "Speak Your Answer",
      "recordingTapToStop": "Recording... (Tap to Stop)",
      
      // Questions
      "question": "Question",
      "of": "of",
      "next": "Next",
      "previous": "Previous",
      "q1": "What is your full name?",
      "q2": "What is your age?",
      "q3": "Do you have any health conditions?",
      "q4": "How many medications do you take daily?",
      "q5": "What is your living situation?",
      "q6": "How is your mobility?",
      "q7": "How comfortable are you with technology?",
      "q8": "How often do you see family/friends?",
      "q9": "How do you prefer to interact?",
      
      // Scam Checker
      "scamChecker": "Scam Checker",
      "checkMessage": "Check Message for Scams",
      "enterMessage": "Enter message to check...",
      "checkForScam": "Check for Scam",
      "examples": "Examples",
      "scamExamples": "Scam Examples",
      "safeExamples": "Safe Examples",
      "riskLevel": "Risk Level",
      "safe": "Safe",
      "warning": "Warning",
      "danger": "Danger",
      
      // Health Report
      "setupComplete": "Setup Complete! 🎉",
      "thankYouSetup": "Thank you for completing the setup. Let's get started!",
      "letsGo": "Let's Go!",
      
      // Social Life
      "socialLife": "Social Life",
      "nearbyActivities": "Nearby Activities",
      "potentialConnections": "Potential Connections",
      "away": "away",
      "openInMaps": "Open in Maps",
      "noActivitiesFound": "No activities found nearby",
      "yearsOld": "years old",
      "connect": "Connect",
      "connectWith": "Connect with",
      "connectionFeatureComingSoon": "Connection feature coming soon! This will allow you to send a message to this person.",
      "socialLifeInfo": "Discover local activities and connect with people nearby who share your interests.",
      "activitiesLoadError": "Could not load activities. Please try again.",
      "error": "Error",
      
      // Language Selection
      "selectLanguage": "Select Language",
      "english": "English",
      "german": "German",
      "czech": "Czech",
      "slovak": "Slovak",
    }
  },
  de: {
    translation: {
      // Welcome & Auth
      "welcome": "Willkommen bei SeniorSync",
      "getStarted": "Loslegen",
      "login": "Anmelden",
      "register": "Konto erstellen",
      "email": "E-Mail",
      "password": "Passwort",
      "name": "Name",
      
      // Home Screen
      "goodMorning": "Guten Morgen",
      "goodAfternoon": "Guten Tag",
      "goodEvening": "Guten Abend",
      "howCanIHelp": "Wie kann ich Ihnen heute helfen?",
      "chat": "CHAT",
      "dailyHealthReport": "Täglicher Gesundheitsbericht",
      "emergency": "Notfall",
      "holdForVoiceEmergency": "Halten für Sprach-Notfall",
      "recording": "Aufnahme...",
      
      // Weather
      "feelsLike": "Gefühlt",
      "humidity": "Luftfeuchtigkeit",
      "weatherUnavailable": "Wetter nicht verfügbar",
      
      // Profile
      "profile": "Profil",
      "age": "Alter",
      "healthInformation": "Gesundheitsinformationen",
      "healthConditions": "Gesundheitszustände",
      "dailyMedications": "Tägliche Medikamente",
      "mobilityLevel": "Mobilitätsniveau",
      "preferences": "Präferenzen",
      "techComfort": "Technik-Komfort",
      "socialFrequency": "Soziale Häufigkeit",
      "interactionMode": "Interaktionsmodus",
      "caregiver": "Betreuer",
      "phone": "Telefon",
      "contactCaregiver": "Betreuer kontaktieren",
      "editProfile": "Profil bearbeiten",
      
      // Chat
      "yourAssistant": "Ihr Assistent",
      "typeMessage": "Nachricht eingeben...",
      "connectionError": "Verbindungsfehler",
      "couldNotReach": "Assistent konnte nicht erreicht werden. Bitte überprüfen Sie, ob das Backend läuft.",
      
      // Emergency
      "emergencyAlert": "🚨 Notfallalarm",
      "emergencyConfirm": "Dies benachrichtigt Ihre Familie/Betreuer über Telegram. Haben Sie einen Notfall?",
      "cancel": "Abbrechen",
      "yesSendAlert": "JA - Alarm senden",
      "alertSent": "Alarm gesendet! ✅",
      "emergencyNotified": "Ihr Notfallkontakt wurde über Telegram benachrichtigt.",
      
      // Voice
      "voiceRecorded": "Sprache aufgenommen",
      "speakYourName": "Sprechen Sie Ihren Namen",
      "speakYourAge": "Sprechen Sie Ihr Alter",
      "speakYourAnswer": "Sprechen Sie Ihre Antwort",
      "recordingTapToStop": "Aufnahme... (Tippen zum Stoppen)",
      
      // Questions
      "question": "Frage",
      "of": "von",
      "next": "Weiter",
      "previous": "Zurück",
      "q1": "Wie ist Ihr vollständiger Name?",
      "q2": "Wie alt sind Sie?",
      "q3": "Haben Sie gesundheitliche Beschwerden?",
      "q4": "Wie viele Medikamente nehmen Sie täglich ein?",
      "q5": "Wie ist Ihre Wohnsituation?",
      "q6": "Wie ist Ihre Mobilität?",
      "q7": "Wie vertraut sind Sie mit Technologie?",
      "q8": "Wie oft sehen Sie Familie/Freunde?",
      "q9": "Wie möchten Sie am liebsten kommunizieren?",
      
      // Scam Checker
      "scamChecker": "Betrugsüberprüfung",
      "checkMessage": "Nachricht auf Betrug prüfen",
      "enterMessage": "Nachricht eingeben...",
      "checkForScam": "Auf Betrug prüfen",
      "examples": "Beispiele",
      "scamExamples": "Betrugsbeispiele",
      "safeExamples": "Sichere Beispiele",
      "riskLevel": "Risikostufe",
      "safe": "Sicher",
      "warning": "Warnung",
      "danger": "Gefahr",
      
      // Health Report
      "setupComplete": "Einrichtung abgeschlossen! 🎉",
      "thankYouSetup": "Vielen Dank für die Einrichtung. Los geht's!",
      "letsGo": "Los geht's!",
      
      // Social Life
      "socialLife": "Sozialleben",
      "nearbyActivities": "Aktivitäten in der Nähe",
      "potentialConnections": "Mögliche Kontakte",
      "away": "entfernt",
      "openInMaps": "In Karten öffnen",
      "noActivitiesFound": "Keine Aktivitäten in der Nähe gefunden",
      "yearsOld": "Jahre alt",
      "connect": "Verbinden",
      "connectWith": "Verbinden mit",
      "connectionFeatureComingSoon": "Verbindungsfunktion kommt bald! Damit können Sie dieser Person eine Nachricht senden.",
      "socialLifeInfo": "Entdecken Sie lokale Aktivitäten und verbinden Sie sich mit Menschen in der Nähe, die Ihre Interessen teilen.",
      "activitiesLoadError": "Aktivitäten konnten nicht geladen werden. Bitte versuchen Sie es erneut.",
      "error": "Fehler",
      
      // Language Selection
      "selectLanguage": "Sprache wählen",
      "english": "Englisch",
      "german": "Deutsch",
      "czech": "Tschechisch",
      "slovak": "Slowakisch",
    }
  },
  cs: {
    translation: {
      // Welcome & Auth
      "welcome": "Vítejte v SeniorSync",
      "getStarted": "Začít",
      "login": "Přihlásit se",
      "register": "Vytvořit účet",
      "email": "E-mail",
      "password": "Heslo",
      "name": "Jméno",
      
      // Home Screen
      "goodMorning": "Dobré ráno",
      "goodAfternoon": "Dobré odpoledne",
      "goodEvening": "Dobrý večer",
      "howCanIHelp": "Jak vám dnes mohu pomoci?",
      "chat": "CHAT",
      "dailyHealthReport": "Denní zdravotní zpráva",
      "emergency": "Nouze",
      "holdForVoiceEmergency": "Podržte pro hlasovou tísňovou výzvu",
      "recording": "Nahrávání...",
      
      // Weather
      "feelsLike": "Pocitově",
      "humidity": "Vlhkost",
      "weatherUnavailable": "Počasí nedostupné",
      
      // Profile
      "profile": "Profil",
      "age": "Věk",
      "healthInformation": "Zdravotní informace",
      "healthConditions": "Zdravotní stavy",
      "dailyMedications": "Denní léky",
      "mobilityLevel": "Úroveň mobility",
      "preferences": "Preference",
      "techComfort": "Pohodlí s technologií",
      "socialFrequency": "Sociální frekvence",
      "interactionMode": "Režim interakce",
      "caregiver": "Pečovatel",
      "phone": "Telefon",
      "contactCaregiver": "Kontaktovat pečovatele",
      "editProfile": "Upravit profil",
      
      // Chat
      "yourAssistant": "Váš asistent",
      "typeMessage": "Napište zprávu...",
      "connectionError": "Chyba připojení",
      "couldNotReach": "Nelze se připojit k asistentovi. Zkontrolujte, zda backend běží.",
      
      // Emergency
      "emergencyAlert": "🚨 Nouzové upozornění",
      "emergencyConfirm": "Toto upozorní vaši rodinu/pečovatele přes Telegram. Máte nouzi?",
      "cancel": "Zrušit",
      "yesSendAlert": "ANO - Odeslat upozornění",
      "alertSent": "Upozornění odesláno! ✅",
      "emergencyNotified": "Váš nouzový kontakt byl upozorněn přes Telegram.",
      
      // Voice
      "voiceRecorded": "Hlas nahrán",
      "speakYourName": "Řekněte své jméno",
      "speakYourAge": "Řekněte svůj věk",
      "speakYourAnswer": "Řekněte svou odpověď",
      "recordingTapToStop": "Nahrávání... (Klepněte pro zastavení)",
      
      // Questions
      "question": "Otázka",
      "of": "z",
      "next": "Další",
      "previous": "Předchozí",
      "q1": "Jaké je vaše celé jméno?",
      "q2": "Kolik je vám let?",
      "q3": "Máte nějaké zdravotní problémy?",
      "q4": "Kolik léků užíváte denně?",
      "q5": "Jaká je vaše životní situace?",
      "q6": "Jaká je vaše mobilita?",
      "q7": "Jak pohodlně se cítíte s technologií?",
      "q8": "Jak často vídáte rodinu/přátele?",
      "q9": "Jak preferujete komunikaci?",
      
      // Scam Checker
      "scamChecker": "Kontrola podvodů",
      "checkMessage": "Zkontrolovat zprávu na podvody",
      "enterMessage": "Zadejte zprávu...",
      "checkForScam": "Zkontrolovat podvod",
      "examples": "Příklady",
      "scamExamples": "Příklady podvodů",
      "safeExamples": "Bezpečné příklady",
      "riskLevel": "Úroveň rizika",
      "safe": "Bezpečné",
      "warning": "Varování",
      "danger": "Nebezpečí",
      
      // Health Report
      "setupComplete": "Nastavení dokončeno! 🎉",
      "thankYouSetup": "Děkujeme za dokončení nastavení. Pojďme začít!",
      "letsGo": "Pojďme!",
      
      // Social Life
      "socialLife": "Společenský život",
      "nearbyActivities": "Aktivity v okolí",
      "potentialConnections": "Možná spojení",
      "away": "daleko",
      "openInMaps": "Otevřít v Mapách",
      "noActivitiesFound": "V okolí nebyly nalezeny žádné aktivity",
      "yearsOld": "let",
      "connect": "Připojit",
      "connectWith": "Připojit se k",
      "connectionFeatureComingSoon": "Funkce připojení již brzy! To vám umožní poslat této osobě zprávu.",
      "socialLifeInfo": "Objevte místní aktivity a spojte se s lidmi v okolí, kteří sdílejí vaše zájmy.",
      "activitiesLoadError": "Nepodařilo se načíst aktivity. Zkuste to prosím znovu.",
      "error": "Chyba",
      
      // Language Selection
      "selectLanguage": "Vyberte jazyk",
      "english": "Angličtina",
      "german": "Němčina",
      "czech": "Čeština",
      "slovak": "Slovenština",
    }
  },
  sk: {
    translation: {
      // Welcome & Auth
      "welcome": "Vitajte v SeniorSync",
      "getStarted": "Začať",
      "login": "Prihlásiť sa",
      "register": "Vytvoriť účet",
      "email": "E-mail",
      "password": "Heslo",
      "name": "Meno",
      
      // Home Screen
      "goodMorning": "Dobré ráno",
      "goodAfternoon": "Dobré popoludnie",
      "goodEvening": "Dobrý večer",
      "howCanIHelp": "Ako vám dnes môžem pomôcť?",
      "chat": "CHAT",
      "dailyHealthReport": "Denná zdravotná správa",
      "emergency": "Núdza",
      "holdForVoiceEmergency": "Podržte pre hlasovú tiesňovú výzvu",
      "recording": "Nahrávanie...",
      
      // Weather
      "feelsLike": "Pocitovo",
      "humidity": "Vlhkosť",
      "weatherUnavailable": "Počasie nedostupné",
      
      // Profile
      "profile": "Profil",
      "age": "Vek",
      "healthInformation": "Zdravotné informácie",
      "healthConditions": "Zdravotné stavy",
      "dailyMedications": "Denné lieky",
      "mobilityLevel": "Úroveň mobility",
      "preferences": "Preferencie",
      "techComfort": "Pohodlie s technológiou",
      "socialFrequency": "Sociálna frekvencia",
      "interactionMode": "Režim interakcie",
      "caregiver": "Opatrovateľ",
      "phone": "Telefón",
      "contactCaregiver": "Kontaktovať opatrovateľa",
      "editProfile": "Upraviť profil",
      
      // Chat
      "yourAssistant": "Váš asistent",
      "typeMessage": "Napíšte správu...",
      "connectionError": "Chyba pripojenia",
      "couldNotReach": "Nepodarilo sa pripojiť k asistentovi. Skontrolujte, či backend beží.",
      
      // Emergency
      "emergencyAlert": "🚨 Núdzové upozornenie",
      "emergencyConfirm": "Toto upozorní vašu rodinu/opatrovateľa cez Telegram. Máte núdzu?",
      "cancel": "Zrušiť",
      "yesSendAlert": "ÁNO - Odoslať upozornenie",
      "alertSent": "Upozornenie odoslané! ✅",
      "emergencyNotified": "Váš núdzový kontakt bol upozornený cez Telegram.",
      
      // Voice
      "voiceRecorded": "Hlas nahraný",
      "speakYourName": "Povedzte svoje meno",
      "speakYourAge": "Povedzte svoj vek",
      "speakYourAnswer": "Povedzte svoju odpoveď",
      "recordingTapToStop": "Nahrávanie... (Klepnite pre zastavenie)",
      
      // Questions
      "question": "Otázka",
      "of": "z",
      "next": "Ďalej",
      "previous": "Späť",
      "q1": "Aké je vaše celé meno?",
      "q2": "Koľko máte rokov?",
      "q3": "Máte nejaké zdravotné problémy?",
      "q4": "Koľko liekov užívate denne?",
      "q5": "Aká je vaša životná situácia?",
      "q6": "Aká je vaša mobilita?",
      "q7": "Ako pohodlne sa cítite s technológiou?",
      "q8": "Ako často vídavate rodinu/priateľov?",
      "q9": "Ako preferujete komunikáciu?",
      
      // Scam Checker
      "scamChecker": "Kontrola podvodov",
      "checkMessage": "Skontrolovať správu na podvody",
      "enterMessage": "Zadajte správu...",
      "checkForScam": "Skontrolovať podvod",
      "examples": "Príklady",
      "scamExamples": "Príklady podvodov",
      "safeExamples": "Bezpečné príklady",
      "riskLevel": "Úroveň rizika",
      "safe": "Bezpečné",
      "warning": "Varovanie",
      "danger": "Nebezpečenstvo",
      
      // Health Report
      "setupComplete": "Nastavenie dokončené! 🎉",
      "thankYouSetup": "Ďakujeme za dokončenie nastavenia. Poďme začať!",
      "letsGo": "Poďme!",
      
      // Social Life
      "socialLife": "Spoločenský život",
      "nearbyActivities": "Aktivity v okolí",
      "potentialConnections": "Možné spojenia",
      "away": "ďaleko",
      "openInMaps": "Otvoriť v Mapách",
      "noActivitiesFound": "V okolí sa nenašli žiadne aktivity",
      "yearsOld": "rokov",
      "connect": "Pripojiť",
      "connectWith": "Pripojiť sa k",
      "connectionFeatureComingSoon": "Funkcia pripojenia už čoskoro! To vám umožní poslať tejto osobe správu.",
      "socialLifeInfo": "Objavte miestne aktivity a spojte sa s ľuďmi v okolí, ktorí zdieľajú vaše záujmy.",
      "activitiesLoadError": "Nepodarilo sa načítať aktivity. Skúste to prosím znova.",
      "error": "Chyba",
      
      // Language Selection
      "selectLanguage": "Vyberte jazyk",
      "english": "Angličtina",
      "german": "Nemčina",
      "czech": "Čeština",
      "slovak": "Slovenčina",
    }
  }
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: Localization.locale ? Localization.locale.split('-')[0] : 'en', // Get device language
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false
    }
  });

export default i18n;
