import {useRef}  from "react";
import {
  StyleSheet,
  View,
  Text,
  Image,
  TouchableOpacity,
  PanResponder,
  Animated,
} from "react-native";
import { FontFamily, Color, FontSize, Padding, Border } from "./globalstyles";

const Group = ({ navigation }) => {
  const translateX = useRef(new Animated.Value(0)).current;

  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: (_, gestureState) => {
        return gestureState.dx > 10; // only activate if swiped right
      },
      onPanResponderMove: (_, gestureState) => {
        translateX.setValue(gestureState.dx);
      },
      onPanResponderRelease: (_, gestureState) => {
        if (gestureState.dx > 100) {
          // If swiped far enough, navigate back
          Animated.timing(translateX, {
            toValue: 300, // Move out of the screen
            duration: 200,
            useNativeDriver: true,
          }).start(() => navigation.goBack());
        } else {
          // Reset position
          Animated.timing(translateX, {
            toValue: 0,
            duration: 200,
            useNativeDriver: true,
          }).start();
        }
      },
    })
  ).current;

  const handleCallSOS = () => {
    // Add functionality to call SOS
    console.log("Calling SOS...");
  };

  const handleShareLocation = () => {
    // Add functionality to share live location
    console.log("Sharing location...");
  };

  return (
    <Animated.View
      style={[styles.rectangleParent, { transform: [{ translateX }] }]}
      {...panResponder.panHandlers}
    >
      <View style={styles.groupChild} />
      <Text style={[styles.routeDeviationDetected, styles.largeBoldText]}>
        {`Route Deviation 
        Detected!`}
      </Text>
      <View style={styles.groupItem} />
      <Image
        style={[styles.groupInner, styles.groupInnerLayout]}
        resizeMode="cover"
        source={require("../assets/arrow.png")} // Replace with your image path
      />
      <Text style={[styles.dismiss, styles.largeBoldText]}>Dismiss</Text>
      <Text style={[styles.kmAwayFrom]}>
        1KM away from your route.
      </Text>
      <TouchableOpacity
        style={[styles.button, styles.buttonShadowBox]}
        onPress={handleCallSOS}
      >
        <Text style={[styles.signUp]}>Call SOS</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={[styles.button1, styles.buttonShadowBox]}
        onPress={handleShareLocation}
      >
        <Text style={[styles.signUp]}>
          Alert Emergency Contact
        </Text>
      </TouchableOpacity>
      <Image
        style={styles.icons8Alert501}
        resizeMode="cover"
        source={require("../assets/alert.png")} // Replace with your image path
      />
      <Image
        style={[styles.unnamed1Icon, styles.groupInnerLayout]}
        resizeMode="cover"
        source={require("../assets/deviation.png")} // Replace with your image path
      />
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  largeBoldText: {
    fontWeight: "bold",
    fontSize: 30, // Adjusted to make text larger
    color: Color.colorBlack,
    textAlign: "left",
    position: "absolute",
  },
  groupInnerLayout: {
    maxHeight: "100%",
    overflow: "hidden",
    maxWidth: "100%",
    position: "absolute",
  },
  buttonShadowBox: {
    paddingVertical: Padding.p_3xs,
    paddingHorizontal: Padding.p_mini,
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
    backgroundColor: Color.primaryRed,
    borderRadius: Border.br_31xl,
    shadowOpacity: 1,
    elevation: 14,
    shadowRadius: 14,
    shadowOffset: {
      width: 0,
      height: 5,
    },
    shadowColor: "rgba(236, 95, 95, 0.25)",
    right: "3.8%",
    width: "92.11%",
    height: "6.23%",
    left: "4.09%",
    position: "absolute",
  },
  groupChild: {
    height: "100%",
    width: "99.12%",
    top: "0%",
    right: "0.88%",
    bottom: "0%",
    left: "0%",
    borderRadius: 20,
    backgroundColor: "rgba(236, 95, 95, 0.35)",
    position: "absolute",
  },
  routeDeviationDetected: {
    height: "15.01%",
    width: "80%", // Adjusted width for better layout
    top: "6.23%",
    left: "35%", // Centered more
  },
  groupItem: {
    height: "9.92%",
    width: "87.13%",
    top: "84.28%",
    right: "7.31%",
    bottom: "5.81%",
    left: "5.56%",
    borderRadius: 30,
    backgroundColor: "rgba(236, 95, 95, 0.47)",
    position: "absolute",
  },
  groupInner: {
    height: "7.08%",
    width: "17.25%",
    top: "85.69%",
    right: "74.27%",
    bottom: "7.22%",
    left: "8.48%",
  },
  dismiss: {
    top: "86.69%",
    left: "55.56%",
  },
  kmAwayFrom: {
    height: "8.78%",
    width: "80%", // Adjusted width for better layout
    top: "53.4%",
    left: "10%", // Centered more
    color: Color.colorBlack,
    fontWeight: "bold",
    fontSize: 20, // Adjusted to make text larger
    textAlign: "center",
    position: "absolute",
  },
  signUp: {
    fontSize: FontSize.buttonNormalMedium_size,
    lineHeight: 24,
    color: Color.neutralWhite,
  },
  button: {
    top: "75.5%",
    bottom: "18.27%",
  },
  button1: {
    top: "67.28%",
    bottom: "26.49%",
  },
  icons8Alert501: {
    height: "14.16%",
    width: "29.24%",
    top: "4.25%",
    right: "66.67%",
    bottom: "81.59%",
    left: "4.09%",
    maxHeight: "100%",
    overflow: "hidden",
    maxWidth: "100%",
    position: "absolute",
  },
  unnamed1Icon: {
    height: "29.32%",
    width: "60.53%",
    top: "21.25%",
    right: "21.05%",
    bottom: "49.43%",
    left: "18.42%",
  },
  rectangleParent: {
    flex: 1,
    width: "100%",
    height: 706,
  },
});

export default Group;
