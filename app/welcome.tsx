import * as Location from "expo-location";
import { useRouter } from "expo-router";
import { useState } from "react";
import { Alert, Button, StyleSheet, TextInput, View } from "react-native";
import { setSignedUp } from "../utils/storage";

export default function WelcomeScreen() {
  const [userId, setUserId] = useState("");
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
      const existingRes = await fetch(
        `http://172.16.35.4:3001/users/${cleanedId}`
      );
      if (existingRes.ok) {
        Alert.alert("Already Registered", "This user is already signed up.");
        await setSignedUp(cleanedId);
        router.replace("/home");
        return;
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

      //Alert.alert("User ID", `${JSON.stringify(user)}`);
      // Save to JSON Server
      const apiRes = await fetch("http://172.16.35.4:3001/users", {
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
      //console.error(err);
      //Alert.alert("Signup Failed", "Something went wrong during sign up.");
    }
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Enter Your GitHub Username"
        value={userId}
        onChangeText={setUserId}
        autoCapitalize="none"
      />
      <Button title="Sign Up" onPress={handleSignUp} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", padding: 20 },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 10,
    marginBottom: 20,
  },
});
