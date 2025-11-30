import { StyleSheet } from "react-native";

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",

  },
  headerText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#003366",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    marginVertical: 10,
    


  },
  chatArea: {
    flex: 1,

  },
  assistantBubble: {
    backgroundColor: "#dfefff",
    padding: 12,
    borderRadius: 12,
    marginBottom: 10,
    alignSelf: "flex-start",
    maxWidth: "80%",
  },
  assistantText: {
    color: "#003366",
    fontSize: 16,
  },
  userBubble: {
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#66B2FF",
    padding: 12,
    borderRadius: 12,
    marginBottom: 10,
    alignSelf: "flex-end",
    maxWidth: "80%",
  },
  userText: {
    color: "#003366",
    fontSize: 16,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderTopWidth: 1,
    borderColor: "#ccc",
    paddingVertical: 10,
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 20,
    paddingHorizontal: 15,
    paddingVertical: 10,
    marginRight: 10,
  },
  micButton: {
    backgroundColor: "#66B2FF",
    borderRadius: 20,
    padding: 10,
  },
});
