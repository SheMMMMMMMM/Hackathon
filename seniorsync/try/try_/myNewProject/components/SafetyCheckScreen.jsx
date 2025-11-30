import * as React from "react";
import { Text, StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const SafetyCheckScreen = () => {
  return (
    <SafeAreaView style={styles.viewBg}>
      <View style={[styles.view, styles.viewFlexBox]}>
        <View style={styles.heading1}>
          <Text style={[styles.areYouOkay, styles.text2Typo]}>
            Are you okay?
          </Text>
        </View>
        <View style={styles.container}>
          <View style={[styles.button, styles.buttonSpaceBlock]}>
            <View style={[styles.container2, styles.viewFlexBox]}>
              <View style={styles.text}>
                <Text style={[styles.text2, styles.text2Typo]}>🙂</Text>
              </View>
              <View style={styles.text3}>
                <Text style={[styles.yesIAm, styles.yesIAmTypo]}>
                  Yes, I am okay
                </Text>
              </View>
            </View>
          </View>
          <View style={[styles.button2, styles.buttonSpaceBlock]}>
            <View style={[styles.container2, styles.viewFlexBox]}>
              <View style={styles.text}>
                <Text style={[styles.text2, styles.text2Typo]}>⚠️</Text>
              </View>
              <View style={styles.text6}>
                <Text style={[styles.noINeed, styles.yesIAmTypo]}>
                  No, I need help
                </Text>
              </View>
            </View>
          </View>
        </View>
        <View style={styles.paragraph}>
          <Text style={[styles.tapOneOf, styles.text2Typo]}>
            Tap one of the buttons above
          </Text>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safetycheckscreen: {
    flex: 1,
    backgroundColor: "#fff",
  },
  viewFlexBox: {
    justifyContent: "center",
    alignItems: "center",
  },
  text2Typo: {
    textAlign: "center",
    fontFamily: "Arial",
  },
  buttonSpaceBlock: {
    paddingBottom: 4,
    paddingTop: 36,
    paddingHorizontal: 28,
    borderWidth: 4,
    borderStyle: "solid",
    borderRadius: 24,
    elevation: 25,
    boxShadow: "0px 20px 25px rgba(0, 0, 0, 0.1)",
    width: 326,
  },
  yesIAmTypo: {
    color: "#fff",
    lineHeight: 36,
    fontSize: 28,
    top: -3,
    textAlign: "center",
    fontFamily: "Arial",
    fontWeight: "700",
    position: "absolute",
  },
  viewBg: {
    backgroundColor: "#fff",
    flex: 1,
  },
  view: {
    width: "100%",
    height: 844,
    paddingTop: 0,
    gap: 48,
    backgroundColor: "#fff",
    flex: 1,
  },
  heading1: {
    width: 278,
    height: 50,
  },
  areYouOkay: {
    left: -6,
    fontSize: 42,
    lineHeight: 50,
    color: "#0a3d62",
    fontWeight: "700",
    fontFamily: "Arial",
    top: -4,
    position: "absolute",
  },
  container: {
    height: 276,
    gap: 24,
    width: 326,
  },
  button: {
    height: 126,
    backgroundColor: "#2ecc71",
    borderColor: "#27ae60",
  },
  container2: {
    alignSelf: "stretch",
    paddingRight: 0,
    gap: 16,
    flexDirection: "row",
    height: 54,
  },
  text: {
    width: 49,
    height: 54,
  },
  text2: {
    left: 7,
    fontSize: 36,
    lineHeight: 54,
    color: "#0a0a0a",
    top: -4,
    position: "absolute",
    fontFamily: "Arial",
  },
  text3: {
    width: 185,
    height: 36,
  },
  yesIAm: {
    left: -3,
  },
  button2: {
    backgroundColor: "#e74c3c",
    borderColor: "#c0392b",
    flex: 1,
    paddingBottom: 4,
    paddingTop: 36,
    paddingHorizontal: 28,
    borderWidth: 4,
    borderStyle: "solid",
    borderRadius: 24,
    elevation: 25,
    boxShadow: "0px 20px 25px rgba(0, 0, 0, 0.1)",
  },
  text6: {
    width: 201,
    height: 36,
  },
  noINeed: {
    left: 0,
  },
  paragraph: {
    width: 240,
    height: 25,
    flexDirection: "row",
  },
  tapOneOf: {
    fontSize: 18,
    lineHeight: 25,
    color: "rgba(10, 61, 98, 0.7)",
  },
});

export default SafetyCheckScreen;
