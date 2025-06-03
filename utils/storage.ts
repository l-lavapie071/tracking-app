import AsyncStorage from '@react-native-async-storage/async-storage';

export const setSignedUp = async (userId: string) => {
  await AsyncStorage.setItem('signedUp', 'true');
  await AsyncStorage.setItem('userId', userId);
};

export const isSignedUp = async (): Promise<boolean> => {
  const status = await AsyncStorage.getItem('signedUp');
  return status === 'true';
};

export const resetSignup = async () => {
  await AsyncStorage.removeItem('signedUp');
  await AsyncStorage.removeItem('userId');
};
