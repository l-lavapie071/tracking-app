import * as Location from "expo-location";
import { useRouter } from "expo-router";
import { useState } from "react";
import {
  Alert,
  Button,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  TextInput,
  View,
} from "react-native";
import MapView, { Marker } from "react-native-maps";
import { API_BASE_URL } from "../constants/config";
import { setSignedUp } from "../utils/storage";

export default function WelcomeScreen() {
  const [userId, setUserId] = useState("");
  const [region, setRegion] = useState({
    latitude: 54.526, // North America center
    longitude: -105.2551,
    latitudeDelta: 40,
    longitudeDelta: 60,
  });
  const router = useRouter();

  const handleSignUp = async () => {
    const cleanedId = userId.trim().toLowerCase();
    if (!cleanedId) {
      Alert.alert("Username Required", "Please enter your GitHub username.");
      return;
    }

    try {
      // Validate GitHub user
      const response = await fetch(`https://api.github.com/users/${cleanedId}`);
      if (!response.ok) {
        Alert.alert("User Not Found", "This GitHub username does not exist.");
        return;
      }

      const githubData = await response.json();
      //Alert.alert("g", githubData.login);

      // Check if user already exists in backend
      const existingRes = await fetch(`${API_BASE_URL}/users/${cleanedId}`);

      if (existingRes.ok) {
        let existingUser = null;
        try {
          existingUser = await existingRes.json();
        } catch (e) {
          // JSON parse failed, treat as no user found
          existingUser = null;
        }

        // Check if existingUser is not null and not empty object
        if (existingUser && Object.keys(existingUser).length > 0) {
          Alert.alert("Already Registered", "This user is already signed up.");
          await setSignedUp(cleanedId);
          router.replace("/home");
          return;
        }
      }

      //Get current location
      const { status } = await Location.requestForegroundPermissionsAsync();
      //Alert.alert("Status", status);
      if (status !== "granted") {
        Alert.alert("Location Permission Denied");
        return;
      }

      const location = await Location.getCurrentPositionAsync({});
      //Alert.alert("Status", `Latitude: ${location.coords.latitude}`);

      const coords = {
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      };

      // Create user object
      const user = {
        id: cleanedId,
        name: githubData.login || cleanedId,
        avatar: githubData.avatar_url,
        bio: githubData.bio || "No bio",
        location: coords,
      };

      /* useEffect(() => {
        (async () => {
          const { status } = await Location.requestForegroundPermissionsAsync();
          if (status === "granted") {
            const location = await Location.getCurrentPositionAsync({});
            setRegion({
              latitude: location.coords.latitude,
              longitude: location.coords.longitude,
              latitudeDelta: 1.0,
              longitudeDelta: 1.0,
            });
          }
        })();
      }, []);
 */
      //Alert.alert("User ID", `${JSON.stringify(user)}`);
      // Save to JSON Server
      const apiRes = await fetch(`${API_BASE_URL}/users`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(user),
      });
      //Alert.alert("User ID", `${apiRes}`);
      if (!apiRes.ok) throw new Error("Failed to save user");
      //Alert.alert("User ID", `${user.id}`);
      // Save locally
      await setSignedUp(user.id);
      router.replace("/home");
    } catch (err) {
      console.error(err);
      Alert.alert("Signup Failed", "Something went wrong during sign up.");
    }
  };

  return (
    <View style={styles.container}>
      <MapView style={StyleSheet.absoluteFillObject} region={region}>
        <Marker coordinate={region} />
      </MapView>

      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        style={styles.overlay}
      >
        <View style={styles.formBox}>
          <TextInput
            style={styles.input}
            placeholder="Enter GitHub Username"
            value={userId}
            onChangeText={setUserId}
            autoCapitalize="none"
          />
          <View style={styles.buttonWrapper}>
            <Button title="Sign Up" onPress={handleSignUp} />
          </View>
        </View>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: "flex-end", // push to bottom
    alignItems: "center",
    paddingBottom: 40, // space from bottom
  },
  formBox: {
    width: "90%",
    backgroundColor: "rgba(255, 255, 255, 0.95)",
    borderRadius: 16,
    paddingVertical: 20,
    paddingHorizontal: 24,
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 3 },
    shadowRadius: 6,
    elevation: 6,
  },
  input: {
    width: "100%",
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 10,
    padding: 12,
    marginBottom: 12,
    backgroundColor: "#fff",
    fontSize: 16,
  },
  buttonWrapper: {
    width: "100%",
    marginTop: 8,
  },
});
