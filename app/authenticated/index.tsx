import React, { useEffect, useState } from 'react';
import { ScrollView, StatusBar, Text, TouchableOpacity, View, Dimensions, StyleSheet, useColorScheme } from 'react-native';
import tailwind from 'twrnc';
import { useTabVisibility } from '@/context/TabVisibilityContext';
import { SafeAreaView } from 'react-native-safe-area-context';
import UserAvatar from '@/assets/images/userAvatar.svg';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { LinearGradient } from 'expo-linear-gradient';
import PlusIcon from '@/assets/images/plus-icon.svg';
import { useFocusEffect } from '@react-navigation/native';
import { Href, router } from 'expo-router';
import MapView, { Marker } from 'react-native-maps';
import * as Location from 'expo-location'; // Import location service

export default function Home() {
  const colorScheme = useColorScheme();
  const [userName, setUserName] = useState('');
  const [userBalance, setUserBalance] = useState(0);
  const { setTabBarVisible } = useTabVisibility();
  const [location, setLocation] = useState(null); // Track user location

  useFocusEffect(
    React.useCallback(() => {
      setTabBarVisible(true);
    }, [setTabBarVisible])
  );

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const name = await AsyncStorage.getItem('loggedInUserName');
        const balance = await AsyncStorage.getItem('loggedInUserBalance');

        if (name) {
          setUserName(name);
        }

        if (balance) {
          setUserBalance(parseFloat(balance));
        }
      } catch (error) {
        console.error("Error fetching user data: ", error);
      }
    };

    fetchUserData();

    // Get user location
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        console.log('Permission to access location was denied');
        return;
      }
      let location = await Location.getCurrentPositionAsync({});
      setLocation(location);
    })();
  }, []);

  const defaultRegion = {
    latitude: 37.78825,
    longitude: -122.4324,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  };

  return (
    <SafeAreaView style={tailwind.style('bg-[#f9f9f9]', { flex: 1 })} edges={['top']}>
      <StatusBar barStyle={colorScheme === 'dark' ? 'dark-content' : 'dark-content'} />
      <ScrollView showsVerticalScrollIndicator={false} style={{ flex: 1, paddingHorizontal: 16 }} contentContainerStyle={{ flexGrow: 1 }}>
        <View style={{ flex: 1, gap: 24 }}>
          <View style={tailwind.style('flex-row justify-between items-center', { marginTop: 25 })}>
            <Text style={tailwind.style({ fontFamily: 'nunitoSansExtraBold', fontWeight: 700, fontSize: 20, lineHeight: 24.55, color: "#072F4A" })}>
              Welcome {userName}
            </Text>
            <View>
              <UserAvatar width={38} height={38} />
            </View>
          </View>

          {/** First Card */}
          <LinearGradient
            colors={['#193a69', '#1e4985', '#123566']} 
            style={tailwind.style('h-46 py-5 px-3', { borderRadius: 20 })}
          >
            <View style={tailwind.style('justify-between items-start flex-row flex-1')}>
              <View style={tailwind.style('w-full justify-start items-start gap-2 pl-1 flex-1', { fontFamily: 'nunitoSansMedium' })}>
                <Text style={tailwind.style('text-base font-semibold text-gray-100/90')}>Wallet Balance</Text>
                <Text style={tailwind.style('text-3xl text-white', { fontFamily: 'nunitoSansExtraBold' })}>
                  ₦ {userBalance.toFixed(2)}
                </Text>
              </View>
              <TouchableOpacity onPress={() => router.push('/authenticated/payment' as Href)} style={tailwind.style('bg-[#193a6980] border border-gray-50/50 flex-row justify-center items-center gap-2', { borderRadius: 20, paddingHorizontal: 18, paddingVertical: 12 })}>
                  <PlusIcon width={16} height={16} />
                  <Text style={tailwind.style('text-white', { fontSize: 14, fontWeight: '600' })}>Fund wallet</Text>
              </TouchableOpacity>
            </View>
            <View style={tailwind.style('flex-row justify-start items-start w-full gap-4 mt-5')}>
              <View style={tailwind.style('w-full justify-start items-start gap-2 pl-1', { fontFamily: 'nunitoSansMedium' })}>
                <Text style={tailwind.style('text-base text-gray-100/90')}>Total Trip</Text>
                <Text style={tailwind.style('text-xl text-white', { fontFamily: 'nunitoSansBold' })}>
                  N/A
                </Text>
              </View>
            </View>
          </LinearGradient>

          {/** OpenStreetMap Integration */}
          <View style={styles.mapContainer}>
            <MapView
              style={styles.map}
              initialRegion={location ? {
                latitude: location.coords.latitude,
                longitude: location.coords.longitude,
                latitudeDelta: 0.005,
                longitudeDelta: 0.005,
              } : defaultRegion}
              showsUserLocation={true}
              followsUserLocation={true}
            >
              {/* Example Marker */}
              <Marker
                coordinate={{
                  latitude: 37.78825,
                  longitude: -122.4324,
                }}
                title="Tricycle Station"
                description="This is where the tricycles are available."
              />
            </MapView>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  mapContainer: {
    height: Dimensions.get('window').height * 0.4, // Adjust as needed
    marginVertical: 20,
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
});
