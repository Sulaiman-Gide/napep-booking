import useAuth from '@/hooks/useAuth';
import { useRouter } from 'expo-router';
import React, { useEffect, useRef, useState } from 'react';
import { View, ActivityIndicator, StyleSheet, Image } from 'react-native';

export default function Login() {
  const router = useRouter();
  const { user } = useAuth();
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (isMounted) {
      if (user) {
        router.replace('/authenticated');
      } else {
        router.replace('/auth');
      }
    }
  }, [user, router, isMounted]);
  
  return (
    <View style={styles.container}>

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f1f5f9',
  },
});