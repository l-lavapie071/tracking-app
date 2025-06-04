import { useRouter } from "expo-router";
import { Button, Image, StyleSheet, View } from "react-native";
import MapView, { Marker } from "react-native-maps";
import { USERS } from "../constants/users";
import { resetSignup } from "../utils/storage";

export default function HomeScreen() {
  const router = useRouter();

  const logout = async () => {
    await resetSignup();
    router.replace("/welcome");
  };

  return (
    <View style={styles.screen}>
      {/* Logout Button */}
      <View style={styles.header}>
        <Button title="Log off" onPress={logout} />
      </View>

      {/* Map below the header */}
      <MapView
        style={styles.map}
        initialRegion={{
          latitude: 51.045,
          longitude: -114.057,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        }}
      >
        {USERS.map((user) => (
          <Marker
            key={user.id}
            coordinate={user.location}
            onPress={() => router.push(`./profile/${user.id}`)}
          >
            <Image source={{ uri: user.avatar }} style={styles.avatar} />
          </Marker>
        ))}
      </MapView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  header: {
    paddingTop: 50,
    paddingHorizontal: 15,
    paddingBottom: 10,
    backgroundColor: "#fff",
    zIndex: 10,
  },
  map: {
    flex: 1,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: "#fff",
  },
});
