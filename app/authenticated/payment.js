import { useColorScheme, StatusBar, ScrollView, View, Image, Dimensions } from 'react-native';
import { TouchableOpacity, Text, Platform } from 'react-native';
import React, { useEffect, useState, useRef} from 'react';
import tailwind from 'twrnc';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTabVisibility } from '@/context/TabVisibilityContext';
import { useFocusEffect } from '@react-navigation/native';
import Entypo from '@expo/vector-icons/Entypo';
import CustomText from '@/components/CustomText';
import { router } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import AsyncStorage from '@react-native-async-storage/async-storage';
import PlusIcon from '@/assets/images/plus-icon.svg';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { PaymentBottomSheet, SuccessBottomSheet } from '@/components/PaymentBottomSheet';

const Content = () => {
  const [userName, setUserName] = useState('');
  const [userBalance, setUserBalance] = useState(0);
  const [transactions, setTransactions] = useState([]);
  const [showAll, setShowAll] = useState(false);
  const [isPaymentSuccessful, setIsPaymentSuccessful] = useState(false);
  const bottomSheetRef = useRef(null);
  const successBottomSheetRef = useRef(null);

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const storedTransactions = await AsyncStorage.getItem('userTransactions');
        if (storedTransactions) {
          setTransactions(JSON.parse(storedTransactions));
        }
      } catch (error) {
        console.error("Error fetching transactions: ", error);
      }
    };

    fetchTransactions();
  }, []);

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
  }, []);

  const openPaymentSheet = () => {
    if (bottomSheetRef.current) {
      bottomSheetRef.current.expand();
    }
  };

  const handlePaymentSuccess = (amount) => {
    const newBalance = userBalance + parseFloat(amount);
    setUserBalance(newBalance);
    AsyncStorage.setItem('loggedInUserBalance', newBalance.toString());
    setIsPaymentSuccessful(true);

    // Create a new transaction
    const newTransaction = {
      id: transactions.length + 1,
      name: 'Account Credit',
      type: 'Wallet credit',
      amount: `+ ₦ ${amount}`,
      color: 'green'
    };

    // Update transactions state
    const updatedTransactions = [...transactions, newTransaction];
    setTransactions(updatedTransactions);

    // Save transactions to AsyncStorage
    AsyncStorage.setItem('userTransactions', JSON.stringify(updatedTransactions));

    if (successBottomSheetRef.current) {
      successBottomSheetRef.current.expand();
    }
  };

  const displayedTransactions = showAll ? transactions : transactions.slice(0, 5);

  return (
    <View style={tailwind.style('bg-white flex-1')}>
      <View style={tailwind.style({ gap: 8, marginTop: 10, paddingHorizontal: 16, })}>
        {/* Title Section */}
        <Text style={tailwind.style('text-[#1F1F1F]', { fontWeight: 'bold', fontFamily: 'nunitoSansBold', fontSize: 26, lineHeight: 34 })}>
          Payment
        </Text>

        {/* Subtitle / Description */}
        <CustomText style={tailwind.style('text-[#7D7D7D]', { fontSize: 16, lineHeight: 24, fontWeight: 'normal', fontFamily: 'nunitoSansMedium' })}>
          Complete your payment to fund your wallet and start using our services seamlessly.
        </CustomText>
      </View>
      {/** First Card */}
      <LinearGradient
        colors={['#193a69', '#1e4985', '#123566']} 
        style={tailwind.style('h-46 py-5 px-3 mt-6', { borderRadius: 20, marginHorizontal: 16  })}
      >
        <View style={tailwind.style('justify-between items-start flex-row flex-1')}>
          <View style={tailwind.style('w-full justify-start items-start gap-2 pl-1 flex-1', { fontFamily: 'nunitoSansMedium' })}>
            <Text style={tailwind.style('text-base font-semibold text-gray-100/90')}>Wallet Balance</Text>
            <Text style={tailwind.style('text-3xl text-white', { fontFamily: 'nunitoSansExtraBold' })}>
              ₦ {userBalance.toFixed(2)}
            </Text>
          </View>
          <TouchableOpacity onPress={openPaymentSheet} style={tailwind.style('bg-[#193a6980] border border-gray-50/50 flex-row justify-center items-center gap-2', { borderRadius: 20, paddingHorizontal: 18, paddingVertical: 12 })}>
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

      <View style={tailwind.style('flex-1 border-2 border-gray-100/80',{ paddingHorizontal: 16, paddingVertical: 25, gap: 16 })}>
        <View style={tailwind.style('justify-between items-center flex-row')}>
          <Text style={tailwind.style({ fontFamily: 'nunitoSansBold', fontWeight: 700, fontSize: 18, lineHeight: 24, color: '#242424' })}>
            Transaction history
          </Text>
          <TouchableOpacity onPress={() => setShowAll(!showAll)}>
            <CustomText style={tailwind.style('underline text-[#0065F5]', { lineHeight: 16, fontSize: 14 })}>
              {showAll ? 'see less' : 'see all'}
            </CustomText>
          </TouchableOpacity>
        </View>

        <ScrollView style={tailwind.style({ gap: 24 })}>
          {displayedTransactions.map((transaction, index) => (
            <View key={transaction.id} style={tailwind.style('justify-between items-center flex-row mb-4')}>
              <View style={tailwind.style('justify-between items-center flex-row', { gap: 8 })}>
                <View
                  style={tailwind.style({
                    backgroundColor: transaction.color === 'green' ? '#F5FCE8' : '#FAF4F4',
                    borderRadius: 9999,
                    width: 48,
                    height: 48,
                    justifyContent: 'center',
                    alignItems: 'center',
                  })}
                >
                  {transaction.color === 'green' ? (
                    <MaterialIcons name="payments" size={24} color="green" />
                  ) : (
                    <MaterialIcons name="payments" size={24} color="red" />
                  )}
                </View>
                <View style={tailwind.style('justify-start items-start')}>
                  <CustomText style={tailwind.style('text-[#595959]', { fontFamily: 'nunitoSansBold', fontWeight: 600 })}>
                    {transaction.name}
                  </CustomText>
                  <CustomText style={tailwind.style('text-[#A4A6A6] mt-0.5', { fontSize: 14, lineHeight: 16, fontWeight: 500 })}>
                    {transaction.type}
                  </CustomText>
                </View>
              </View>
              <CustomText style={tailwind.style('text-[#595959]', { fontSize: 14, lineHeight: 20, fontWeight: 400 })}>
                {transaction.amount}
              </CustomText>
            </View>
          ))}
        </ScrollView>
      </View>

      {/* Include the Bottom Sheet */}
      <PaymentBottomSheet ref={bottomSheetRef} onSuccess={handlePaymentSuccess} />
      {isPaymentSuccessful && (
        <SuccessBottomSheet
          ref={successBottomSheetRef}
          onClose={() => {
            setIsPaymentSuccessful(false);
            successBottomSheetRef.current.close();
          }}
        />
      )}
    </View>
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
      <SafeAreaView style={tailwind.style('bg-white flex-1')} edges={['top']}>
        <View style={tailwind.style({ paddingTop: 16, paddingBottom: 8, paddingHorizontal: 16 })}>
          <TouchableOpacity onPress={() => router.push('/authenticated')}>
            <Entypo name="chevron-small-left" size={27} color="#242424" />
          </TouchableOpacity>
        </View>
        <Content />
      </SafeAreaView>
    ) : (
      <SafeAreaView style={tailwind.style('bg-white flex-1')} edges={['top']}>
        <View style={tailwind.style({ paddingTop: 16, paddingBottom: 8, paddingHorizontal: 16 })}>
          <TouchableOpacity onPress={() => router.push('/authenticated')}>
            <Entypo name="chevron-small-left" size={27} color="#242424" />
          </TouchableOpacity>
        </View>
        <Content />
      </SafeAreaView>
    )
  );
}
