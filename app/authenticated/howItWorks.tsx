import { useColorScheme, StatusBar, ScrollView, View } from 'react-native'
import { TouchableOpacity, Text, Platform} from 'react-native';
import React from 'react'
import tailwind from 'twrnc'
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTabVisibility } from '@/context/TabVisibilityContext';
import { useFocusEffect } from '@react-navigation/native';
import Entypo from '@expo/vector-icons/Entypo';
import CustomText from '@/components/CustomText';
import { router } from 'expo-router';


const Content = () => {
  return (
    <ScrollView style={tailwind.style('bg-white flex-1', { paddingVertical: 0, paddingHorizontal: 16 })}>
      {/* Header */}
      <View style={tailwind.style({ gap: 5 })}>
        {/* Title Section */}
        <Text style={tailwind.style('text-[#1F1F1F]', { fontWeight: 'bold', fontFamily: 'nunitoSansBold', fontSize: 24, lineHeight: 34 })}>
          How it works
        </Text>

        {/* Subtitle / Description */}
        <CustomText style={tailwind.style('text-[#7D7D7D]', { fontSize: 16, lineHeight: 24, fontWeight: 'normal', fontFamily: 'nunitoSans' })}>
          Complete your payment to fund your wallet and start using our services seamlessly.
        </CustomText>
      </View>
    </ScrollView>
  );
};


export default function AssetsPage() {
  const { setTabBarVisible } = useTabVisibility();
  const colorScheme = useColorScheme();

  useFocusEffect(
    React.useCallback(() => {
      setTabBarVisible(false);
    }, [setTabBarVisible])
  );


  return (
    Platform.OS === 'android' ? (
    <SafeAreaView style={tailwind.style('bg-white flex-1')}>
      <View style={tailwind.style({ gap: 10, padding: 16 })}>
        <TouchableOpacity onPress={() => router.push('/authenticated/profile')}>
          <Entypo name="chevron-small-left" size={27} color="#242424" />
        </TouchableOpacity>
      </View>
      <Content />
    </SafeAreaView>
  ) : (
    <SafeAreaView style={tailwind.style('bg-white flex-1')}>
      <View style={tailwind.style('bg-white flex-1')}>
        <View style={tailwind.style({ gap: 10, padding: 16 })}>
          <TouchableOpacity onPress={() => router.push('/authenticated/profile')}>
            <Entypo name="chevron-small-left" size={27} color="#242424" />
          </TouchableOpacity>
        </View>
        <Content />
      </View>
    </SafeAreaView>
  )
  )
}