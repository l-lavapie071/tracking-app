import { useRouter } from 'expo-router';
import { Button, StyleSheet, Text, View } from 'react-native';
import { resetSignup } from '../utils/storage';

export default function HomeScreen() {
  const router = useRouter();

  const logout = async () => {
    await resetSignup();
    router.replace('/welcome');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.text}>You’re signed in.</Text>
      <Button title="Logout" onPress={logout} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  text: { fontSize: 20, marginBottom: 20 },
});
