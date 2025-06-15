import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { Button, Image, StyleSheet, Text, View } from "react-native";
import MapView, { Marker } from "react-native-maps";
//import { USERS } from "../constants/users";
import { API_BASE_URL } from "../constants/config";
import { getSignedUpUserId, resetSignup } from "../utils/storage";

export default function HomeScreen() {
  const router = useRouter();

  // Define the type for User
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

  const [users, setUsers] = useState<User[]>([]); // all users
  const [logInUser, setLoggedInIUser] = useState<User>(); // logged in user
  const [logInUserID, setLoggedInID] = useState<string>(); // logged in user ID
  //const [userLongitude, setUSerLongitude] = useState<number>();
  //const [userLatitude, setUSerLatitude] = useState<number>();

  // Map region state, defaults to North America center
  const [region, setRegion] = useState({
    latitude: 54.526, // Default: North America center
    longitude: -105.2551,
    latitudeDelta: 40.0,
    longitudeDelta: 60.0,
  });

  // Load logged-in user ID from local storage once when component mounts
  useEffect(() => {
    const loadUser = async () => {
      const id = await getSignedUpUserId();
      if (id) {
        setLoggedInID(id);
      }
    };

    loadUser();
  }, []);

  // Fetch all users from backend on component mount
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

  // When users or logged-in user ID change, find the logged-in user object
  useEffect(() => {
    if (users.length > 0 && logInUserID) {
      const matchedUser = users.find((user) => user.id == logInUserID);
      setLoggedInIUser(matchedUser);
      //setUSerLongitude(Number(matchedUser?.location.longitude));
      //setUSerLatitude(Number(matchedUser?.location.latitude));
    }
  }, [users, logInUserID]);
  // Set map region to current location
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
  }, []); */

  // Update map region to focus on logged-in user's location
  useEffect(() => {
    if (logInUser?.location) {
      setRegion({
        latitude: logInUser.location.latitude,
        longitude: logInUser.location.longitude,
        latitudeDelta: 1.0,
        longitudeDelta: 1.0,
      });
    }
  }, [logInUser]);

  // Logout: clear stored login data and redirect to welcome screen
  const logout = async () => {
    await resetSignup();
    router.replace("/welcome");
  };

  return (
    <View style={styles.screen}>
      {/* Logout Button */}

      <View style={styles.header}>
        <View style={styles.headerRow}>
          <Text style={styles.welcomeText}>Hello, {logInUser?.name}</Text>
          <Button title="Log off" onPress={logout} />
        </View>
      </View>

      {/* Map below the header */}
      <MapView
        style={styles.map}
        region={region}
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
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  welcomeText: {
    fontSize: 16,
    fontWeight: "500",
  },
});
