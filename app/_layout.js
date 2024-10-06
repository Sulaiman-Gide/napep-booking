import React, { useEffect } from 'react';
import { View, ActivityIndicator, StyleSheet, useColorScheme } from 'react-native';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import 'react-native-gesture-handler';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { AuthProvider } from '@/hooks/useAuth';

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

const InitialLayout = () => {
  const [loaded, error] = useFonts({
    nunitoSansRegular: require('../assets/fonts/NunitoSans-Regular.ttf'),
    nunitoSansMedium: require('../assets/fonts/NunitoSans-Medium.ttf'),
    nunitoSansBold: require('../assets/fonts/NunitoSans-Bold.ttf'),
    nunitoSansExtraBold: require('../assets/fonts/NunitoSans-ExtraBold.ttf'),
    ...FontAwesome.font,
  });

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    } else if (error) {
      console.error("Error loading fonts:", error);
    }
  }, [loaded, error]);

  if (!loaded) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#081225" />
      </View>
    );
  }

  return (
    <GestureHandlerRootView>
      <Stack>
        <Stack.Screen name="index" options={{ headerShown: false }} />
        <Stack.Screen name="auth" options={{ headerShown: false }} />
        <Stack.Screen name="authenticated" options={{ headerShown: false }} />
      </Stack>
    </GestureHandlerRootView>
  );
};

const RootLayout = () => {
  const colorScheme = useColorScheme();
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <StatusBar
        barStyle={colorScheme === 'dark' ? 'dark-content' : 'dark-content'}
      />
      <AuthProvider>
        <InitialLayout />
      </AuthProvider>
    </GestureHandlerRootView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
});

export default RootLayout;
