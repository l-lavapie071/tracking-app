import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { Button, Image, StyleSheet, View } from "react-native";
import MapView, { Marker } from "react-native-maps";
//import { USERS } from "../constants/users";
import { API_BASE_URL } from "../constants/config";
import { resetSignup } from "../utils/storage";

export default function HomeScreen() {
  const router = useRouter();
  // Define the type
  type User = {
    id: string;
    name: string;
    avatar: string;
    bio: string;
    location: {
      latitude: number;
      longitude: number;
    };
  };

  const logout = async () => {
    await resetSignup();
    router.replace("/welcome");
  };

  const [users, setUsers] = useState<User[]>([]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/users`);
        const data = await res.json();
        setUsers(data);
      } catch (err) {
        console.error("Failed to load users", err);
      }
    };

    fetchUsers();
  }, []);

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
          latitude: 51.0447, //  set Alberta as default
          longitude: -114.0719,
          latitudeDelta: 10.0, // Zoom level large enough to show the province
          longitudeDelta: 10.0,
        }}
        showsUserLocation={true}
        showsMyLocationButton={true}
        zoomEnabled={true}
        scrollEnabled={true}
        rotateEnabled={true}
        pitchEnabled={true}
      >
        {users.map((user) => (
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
