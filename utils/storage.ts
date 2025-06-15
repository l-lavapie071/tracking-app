import AsyncStorage from '@react-native-async-storage/async-storage';

// Save the signup status and user ID in AsyncStorage
export const setSignedUp = async (userId: string) => {
  await AsyncStorage.setItem('signedUp', 'true');  // Mark user as signed up
  await AsyncStorage.setItem('userId', userId);    // Save the user's ID
};

// Retrieve the stored user ID from AsyncStorage
export const getSignedUpUserId = async (): Promise<string | null> => {
  try {
    const userId = await AsyncStorage.getItem('userId');
    return userId;  // Return the user ID or null if not found
  } catch (err) {
    console.error("Error retrieving user ID:", err);
    return null;
  }
};

// Check if a user is marked as signed up
export const isSignedUp = async (): Promise<boolean> => {
  const status = await AsyncStorage.getItem('signedUp');
  return status === 'true';  // Return true if signed up, false otherwise
};

// Clear the signup status and user ID from AsyncStorage (logout/reset)
export const resetSignup = async () => {
  await AsyncStorage.removeItem('signedUp');  // Remove signed up flag
  await AsyncStorage.removeItem('userId');    // Remove stored user ID
};
