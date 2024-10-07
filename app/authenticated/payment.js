import React, { useEffect, useState } from 'react';
import { ScrollView, StatusBar, Text, TouchableOpacity, View, Dimensions, StyleSheet, Alert } from 'react-native';
import tailwind from 'twrnc';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Location from 'expo-location';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFocusEffect } from '@react-navigation/native';
import * as geolib from 'geolib';

export default function ViewBookings() {
  const [bookings, setBookings] = useState([]);
  const [userBalance, setUserBalance] = useState(0);
  const [currentLocation, setCurrentLocation] = useState(null);

  // Fetch user data and bookings from AsyncStorage
  useEffect(() => {
    const fetchBookingsAndBalance = async () => {
      try {
        const storedBookings = await AsyncStorage.getItem('rideRequests');
        const balance = await AsyncStorage.getItem('loggedInUserBalance');

        if (storedBookings) {
          setBookings(JSON.parse(storedBookings));
        }

        if (balance) {
          setUserBalance(parseFloat(balance));
        }
      } catch (error) {
        console.error("Error fetching bookings or balance: ", error);
      }
    };

    fetchBookingsAndBalance();

    // Get current location
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        console.log('Permission to access location was denied');
        return;
      }
      let location = await Location.getCurrentPositionAsync({});
      setCurrentLocation(location.coords);
    })();
  }, []);

  // Calculate distance between two coordinates using geolib
  const calculateDistance = (pickupCoords, destinationCoords) => {
    const distance = geolib.getDistance(
      { latitude: pickupCoords.latitude, longitude: pickupCoords.longitude },
      { latitude: destinationCoords.latitude, longitude: destinationCoords.longitude }
    );
    return distance; // Distance in meters
  };

  // Calculate the price based on the distance (₦300 per meter/kilometer)
  const calculatePrice = (distance) => {
    return (distance / 1000) * 300;
  };

  // Handle payment
  const handlePayment = async (bookingIndex, price) => {
    if (price > userBalance) {
      Alert.alert('Insufficient Balance', 'You do not have enough funds to make this payment.');
      return;
    }

    // Deduct price from balance
    const updatedBalance = userBalance - price;

    try {
      // Update the wallet balance in AsyncStorage
      await AsyncStorage.setItem('loggedInUserBalance', updatedBalance.toString());

      // Mark the booking as paid
      const updatedBookings = [...bookings];
      updatedBookings[bookingIndex].status = 'paid';
      setBookings(updatedBookings);

      // Save the updated bookings in AsyncStorage
      await AsyncStorage.setItem('rideRequests', JSON.stringify(updatedBookings));

      // Update balance state
      setUserBalance(updatedBalance);

      Alert.alert('Payment Successful', `₦${price.toFixed(2)} has been deducted from your wallet.`);
    } catch (error) {
      console.error('Error during payment: ', error);
    }
  };

  return (
    <SafeAreaView style={tailwind.style('bg-[#f9f9f9]', { flex: 1 })} edges={['top']}>
      <StatusBar barStyle="dark-content" />
      <View style={{ padding: 16 }}>
        <Text style={tailwind.style('text-2xl font-bold text-black my-3')}>Your Bookings</Text>
        <View style={styles.walletContainer}>
          <Text style={tailwind.style('font-semibold text-lg')}>Wallet Balance: ₦{userBalance.toFixed(2)}</Text>
        </View>
      </View>
      <ScrollView contentContainerStyle={{ padding: 16 }}>        
        {bookings.length === 0 ? (
          <Text>No bookings available</Text>
        ) : (
          bookings.map((booking, index) => {
            const distance = currentLocation
              ? calculateDistance(currentLocation, booking.destination)
              : 0;
            const price = calculatePrice(distance);

            return (
              <View key={index} style={styles.bookingCard}>
                <Text style={tailwind.style('font-semibold text-lg')}>
                  Booking {index + 1}
                </Text>
                <Text>Pickup: {booking.pickup.latitude}, {booking.pickup.longitude}</Text>
                <Text>Destination: {booking.destination.latitude}, {booking.destination.longitude}</Text>
                <Text>Destination Address: {booking.destinationAddress}</Text>
                <Text>Distance: {(distance / 1000).toFixed(2)} km</Text>
                <Text>Price: ₦{price.toFixed(2)}</Text>
                <Text>Status: {booking.status}</Text>

                {booking.status !== 'paid' && (
                  <TouchableOpacity
                    style={styles.payButton}
                    onPress={() => handlePayment(index, price)}
                  >
                    <Text style={styles.payButtonText}>Pay ₦{price.toFixed(2)}</Text>
                  </TouchableOpacity>
                )}
              </View>
            );
          })
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  bookingCard: {
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 10,
  },
  payButton: {
    marginTop: 10,
    backgroundColor: '#123566',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
    alignItems: 'center',
  },
  payButtonText: {
    color: 'white',
    fontWeight: '600',
    fontSize: 16,
  },
  walletContainer: {
    marginTop: 5,
    padding: 15,
    backgroundColor: '#f0f0f0',
    borderRadius: 10,
    alignItems: 'center',
  },
});
