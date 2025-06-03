import { Redirect } from 'expo-router';
import { useEffect, useState } from 'react';
import { isSignedUp } from '../utils/storage';

export default function Index() {
  const [signedUp, setSignedUp] = useState<null | boolean>(null);

  useEffect(() => {
    isSignedUp().then(setSignedUp);
  }, []);

  if (signedUp === null) return null;

  return <Redirect href={signedUp ? '/home' : '/welcome'} />;
}
