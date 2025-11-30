import { StyleSheet } from "react-native";

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  step: {
    fontSize: 16,
    color: "#666",
    marginBottom: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#003366",
    marginBottom: 30,
    textAlign: "center",
  },
  option: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 2,
    borderColor: "#66B2FF",
    borderRadius: 12,
    paddingVertical: 15,
    paddingHorizontal: 20,
    marginBottom: 15,
    width: "100%",
    backgroundColor: "#fff",
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  optionSelected: {
    backgroundColor: "#EBF5FF",
    borderColor: "#003366",
    borderWidth: 3,
  },
  optionText: {
    fontSize: 16,
    color: "#003366",
    fontWeight: "600",
    marginLeft: 10,
  },
  nextButton: {
    backgroundColor: "#66B2FF",
    paddingVertical: 15,
    borderRadius: 12,
    width: "100%",
    marginTop: 20,
    alignItems: "center",
  },
  nextText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "700",
  },
});
