import React, { useEffect, useState } from 'react';
import { ScrollView, StatusBar, Text, TouchableOpacity, View, Dimensions, StyleSheet, Alert } from 'react-native';
import tailwind from 'twrnc';
import { useTabVisibility } from '@/context/TabVisibilityContext';
import { SafeAreaView } from 'react-native-safe-area-context';
import UserAvatar from '@/assets/images/userAvatar.svg';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { LinearGradient } from 'expo-linear-gradient';
import PlusIcon from '@/assets/images/plus-icon.svg';
import { useFocusEffect } from '@react-navigation/native';
import MapView, { Marker } from 'react-native-maps';
import * as Location from 'expo-location';

export default function Home() {
  const [userName, setUserName] = useState('');
  const [userBalance, setUserBalance] = useState(0);
  const [totalSpent, setTotalSpent] = useState(0);
  const { setTabBarVisible } = useTabVisibility();
  const [location, setLocation] = useState(null);
  const [destination, setDestination] = useState(null); 
  const [destinationAddress, setDestinationAddress] = useState('');

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
        const totalSpent = await AsyncStorage.getItem('totalSpent');
  
        if (name) {
          setUserName(name);
        }
  
        if (balance) {
          setUserBalance(parseFloat(balance));
        }
  
        if (totalSpent) {
          setTotalSpent(parseFloat(totalSpent));
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

  const getReverseGeocode = async (coordinate) => {
    try {
      const address = await Location.reverseGeocodeAsync({
        latitude: coordinate.latitude,
        longitude: coordinate.longitude,
      });

      if (address && address.length > 0) {
        const { street, city, region, country } = address[0];
        return `${street}, ${city}, ${region}, ${country}`;
      } else {
        return 'Unknown location';
      }
    } catch (error) {
      console.error("Error during reverse geocoding: ", error);
      return 'Error fetching address';
    }
  };

  // Function to book a ride
  const bookRide = async () => {
    if (!destination) {
      Alert.alert('Set a destination first');
      return;
    }

    // Calculate the distance in meters
    const distanceInMeters = getDistance(location.coords, destination);
    const cost = distanceInMeters * 300; // Cost is 300 naira per meter

    // Reverse geocode the destination to get the address
    const address = await getReverseGeocode(destination);
    setDestinationAddress(address);

    const rideDetails = {
      pickup: {
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      },
      destination: {
        latitude: destination.latitude,
        longitude: destination.longitude,
      },
      destinationAddress: address,
      status: 'pending',
      cost: cost,
    };

    // Store the ride details in AsyncStorage
    try {
      const existingRequests = await AsyncStorage.getItem('rideRequests');
      const requests = existingRequests ? JSON.parse(existingRequests) : [];

      requests.push(rideDetails);

      await AsyncStorage.setItem('rideRequests', JSON.stringify(requests));

      const totalSpent = await AsyncStorage.getItem('totalSpent');
      const newTotalSpent = (parseFloat(totalSpent) || 0) + cost;
      await AsyncStorage.setItem('totalSpent', newTotalSpent.toString());

      Alert.alert(
        'Ride Booked',
        `Pickup: ${location.coords.latitude}, ${location.coords.longitude}\nDestination: ${address}\nCost: ₦${cost}`
      );
    } catch (error) {
      console.error('Error booking ride: ', error);
    }
  };

  const getDistance = (start, end) => {
    const rad = (x) => (x * Math.PI) / 180;
    const R = 6371e3;
    const φ1 = rad(start.latitude);
    const φ2 = rad(end.latitude);
    const Δφ = rad(end.latitude - start.latitude);
    const Δλ = rad(end.longitude - start.longitude);

    const a =
      Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
      Math.cos(φ1) * Math.cos(φ2) *
      Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return R * c;
  };


  return (
    <SafeAreaView style={tailwind.style('bg-[#f9f9f9]', { flex: 1 })} edges={['top']}>
      <StatusBar barStyle="dark-content" />
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

          <LinearGradient
            colors={['#193a69', '#1e4985', '#123566']} 
            style={tailwind.style('h-[170px] py-5 px-3', { borderRadius: 20 })}>
            <View style={tailwind.style('justify-between items-start flex-row flex-1')}>
              <View style={tailwind.style('w-full justify-start items-start gap-2 pl-1 flex-1', { fontFamily: 'nunitoSansMedium' })}>
                <Text style={tailwind.style('text-base font-semibold text-gray-100/90')}>Wallet Balance</Text>
                <Text style={tailwind.style('text-3xl text-white', { fontFamily: 'nunitoSansExtraBold' })}>
                  ₦ {userBalance.toFixed(2)}
                </Text>
                <Text style={tailwind.style('text-base font-semibold text-gray-100/90')}>Total Spent</Text>
                <Text style={tailwind.style('text-2xl text-white', { fontFamily: 'nunitoSansExtraBold' })}>
                  ₦ {totalSpent.toFixed(2)}
                </Text>
              </View>
              <TouchableOpacity onPress={() => router.push('/authenticated/payment')} style={tailwind.style('bg-[#193a6980] border border-gray-50/50 flex-row justify-center items-center gap-2', { borderRadius: 20, paddingHorizontal: 18, paddingVertical: 12 })}>
                <PlusIcon width={16} height={16} />
                <Text style={tailwind.style('text-white', { fontSize: 14, fontWeight: '600' })}>Fund wallet</Text>
              </TouchableOpacity>
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
              onPress={(e) => setDestination(e.nativeEvent.coordinate)}
            >
              {destination && (
                <Marker coordinate={destination} title="Destination" description={destinationAddress || 'This is your ride destination'} />
              )}
            </MapView>
          </View>

          {destination && (
            <TouchableOpacity onPress={bookRide} style={styles.rideButton}>
              <Text style={styles.rideButtonText}>Book Ride</Text>
            </TouchableOpacity>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  mapContainer: {
    height: Dimensions.get('window').height * 0.5,
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
  rideButton: {
    backgroundColor: '#123566',
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 30,
    alignItems: 'center',
    marginBottom: 20,
  },
  rideButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: '600',
  },
});
