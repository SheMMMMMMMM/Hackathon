import { StyleSheet } from "react-native";

export const loginStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 40,
    paddingBottom: 60,
  },

  // --- NAME SECTION ---
  section: {
    marginBottom: 24,
  },
  sectionLabel: {
    fontSize: 18,
    fontWeight: "700",
    color: "#0A3D62",
    marginBottom: 14,
    textAlign: "center",
  },

  // --- TEXT INPUT ---
  textInput: {
    paddingVertical: 16,
    paddingHorizontal: 18,
    borderRadius: 16,
    borderWidth: 2.5,
    borderColor: "#66B2FF",
    fontSize: 16,
    color: "#0A3D62",
    backgroundColor: "#F9FAFB",
    fontWeight: "500",
  },

  // --- PIN CARD (CONTAINER) ---
  pinCard: {
    borderWidth: 3,
    borderColor: "#66B2FF",
    borderRadius: 20,
    paddingHorizontal: 18,
    paddingVertical: 22,
    marginBottom: 28,
    backgroundColor: "#FFFFFF",
    shadowColor: "#66B2FF",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  pinCardTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#0A3D62",
    marginBottom: 16,
    textAlign: "center",
  },

  // --- PIN HINT ---
  pinHint: {
    fontSize: 14,
    color: "#8896A6",
    marginTop: 12,
    textAlign: "center",
    fontWeight: "500",
  },

  // --- SIGN IN BUTTON ---
  signInButton: {
    width: "100%",
    paddingVertical: 16,
    borderRadius: 16,
    backgroundColor: "#66B2FF",
    alignItems: "center",
    marginBottom: 32,
    shadowColor: "#66B2FF",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.35,
    shadowRadius: 10,
    elevation: 8,
  },
  signInButtonText: {
    fontSize: 16,
    fontWeight: "700",
    color: "#FFFFFF",
    letterSpacing: 1.2,
  },

  // --- CREATE ACCOUNT LINK ---
  createAccountContainer: {
    alignItems: "center",
    marginTop: 16,
  },
  createAccountText: {
    fontSize: 15,
    color: "#5A6B7C",
    marginBottom: 6,
    fontWeight: "500",
  },
  createAccountLink: {
    fontSize: 15,
    color: "#66B2FF",
    fontWeight: "700",
    textDecorationLine: "underline",
  },
});
