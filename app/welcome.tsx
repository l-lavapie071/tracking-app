import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Alert, Button, StyleSheet, TextInput, View } from 'react-native';
import { VALID_USER_IDS } from '../constants/users';
import { setSignedUp } from '../utils/storage';

export default function WelcomeScreen() {
  const [userId, setUserId] = useState('');
  const router = useRouter();

  const handleSignUp = async () => {
    if (!VALID_USER_IDS.includes(userId.trim().toLowerCase())) {
      Alert.alert('User ID Not Found', 'There is no such username on GitHub');
      return;
    }

    await setSignedUp(userId);
    router.replace('/home');
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
  container: { flex: 1, justifyContent: 'center', padding: 20 },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 20, textAlign: 'center' },
  input: { borderWidth: 1, borderColor: '#ccc', borderRadius: 8, padding: 10, marginBottom: 20 },
});
