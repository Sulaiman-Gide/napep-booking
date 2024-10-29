import { useColorScheme, StatusBar, ScrollView, View, Image, Text, TouchableOpacity, Linking } from 'react-native';
import React, { useEffect, useState } from 'react';
import tailwind from 'twrnc';
import { SafeAreaView } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import AntDesign from '@expo/vector-icons/AntDesign';
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import CustomText from '@/components/CustomText';
import { Href, router } from 'expo-router';
import { useFocusEffect } from '@react-navigation/native';
import { useTabVisibility } from '@/context/TabVisibilityContext';

export default function Profile() {
  const colorScheme = useColorScheme();
  const [userName, setUserName] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const { setTabBarVisible } = useTabVisibility();

  useFocusEffect(
    React.useCallback(() => {
      setTabBarVisible(true);
    }, [setTabBarVisible])
  );

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const name = await AsyncStorage.getItem('loggedInUserName');
        const email = await AsyncStorage.getItem('loggedInUserEmail');

        if (name) {
          setUserName(name);
        }

        if (email) {
          setUserEmail(email);
        }

      } catch (error) {
        console.error("Error fetching user data: ", error);
      }
    };

    fetchUserData();
  }, []);

  return (
    <SafeAreaView style={tailwind.style('bg-[#f9f9f9]', { flex: 1 })} edges={['top']}>
      <StatusBar barStyle={colorScheme === 'dark' ? 'dark-content' : 'dark-content'} />
      <View style={tailwind.style('flex-1')}>
        <ScrollView showsVerticalScrollIndicator={false} style={{ flex: 1, paddingHorizontal: 16 }} contentContainerStyle={{ flexGrow: 1 }}>
          <View>
            <Image 
              source={require('@/assets/images/male-avater.jpg')}
              style={tailwind.style('w-32 h-32 rounded-full mt-10 mx-auto mb-3', {})}
            />
            <Text style={tailwind.style('mx-auto pt-1',{ fontFamily: 'nunitoSansExtraBold', fontWeight: 700, fontSize: 25, lineHeight: 24.55, color: "#072F4A" })}>
              {userName}
            </Text>
            <Text style={tailwind.style('mx-auto pt-1',{ fontFamily: 'nunitoSansMedium', fontWeight: 400, fontSize: 18, lineHeight: 24.55, color: "#072F4A50" })}>
              {userEmail}
            </Text>
          </View>
          <View style={tailwind.style('flex-1 gap-5 mt-10')}>
            <TouchableOpacity 
              onPress={() => {
                const phoneNumber = '+2347068011002';
                const message = 'Hi, I need help with...';
                const url = `https://api.whatsapp.com/send?phone=${phoneNumber}&text=${encodeURIComponent(message)}`;
                Linking.openURL(url);
              }} 
              style={tailwind.style('flex-row gap-3 items-center border-gray-200 border-b border-t py-5')}
            >
              <View style={tailwind.style('bg-gray-200 rounded-full p-2.5')}>
                <AntDesign name="customerservice" size={20} color="black" />
              </View>
              <CustomText style={tailwind.style('text-black font-bold pt-1', { fontSize: 20 })}>Customer Service</CustomText>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => router.push('/authenticated/howItWorks' as Href)} style={tailwind.style('flex-row gap-3 items-center border-gray-200 border-b pb-5')}>
              <View style={tailwind.style('bg-gray-200 rounded-full p-2.5')}>
                <FontAwesome5 name="hand-point-right" size={20} color="black" />
              </View>
              <CustomText style={tailwind.style('text-black font-bold pt-1', { fontSize: 20 })}>How It Works</CustomText>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => router.push('/auth' as Href)} style={tailwind.style('flex-row gap-3 items-center border-gray-200 border-b pb-5')}>
              <View style={tailwind.style('bg-gray-200 rounded-full p-2.5')}>
                <AntDesign name="logout" size={20} color="black" />
              </View>
              <CustomText style={tailwind.style('text-black font-bold pt-1', { fontSize: 20 })}>Log Out</CustomText>
            </TouchableOpacity>
          </View>
        </ScrollView>

        <Text style={tailwind.style('mx-auto mb-3 pt-1',{ fontFamily: 'nunitoSansExtraBold', fontWeight: 400, fontSize: 16, lineHeight: 24.55, color: "#072F4A90" })}>
          Developed by: Shamwilu Umar
        </Text>

        <Text style={tailwind.style('mx-auto mb-3 pt-1',{ fontFamily: 'nunitoSansBold', fontWeight: 400, fontSize: 16, lineHeight: 24.55, color: "#072F4A9020" })}>
          App Version: <Text style={{  fontFamily: 'nunitoSansBold' }}> V1.2</Text>
        </Text>
      </View>
    </SafeAreaView>
  );
}
