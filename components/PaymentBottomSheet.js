import React, { forwardRef, useEffect, useState, useCallback } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Keyboard, ActivityIndicator, ScrollView, TextInput } from 'react-native';
import BottomSheet, { BottomSheetBackdrop } from '@gorhom/bottom-sheet';
import Success from '@/assets/images/success-svg.svg';

const PaymentBottomSheet = forwardRef(({ onSuccess }, ref) => {
  const snapPoints = ['90%', '85%'];
  const [amount, setAmount] = useState('');
  const [cardNumber, setCardNumber] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [cvv, setCvv] = useState('');
  const [loading, setLoading] = useState(false);

  const renderBackdrop = useCallback(
    (props) => (
      <BottomSheetBackdrop
        disappearsOnIndex={-1}
        appearsOnIndex={0}
        {...props}
      />
    ),
    []
  );

  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', () => {
      ref.current?.snapToIndex(0);
    });

    return () => {
      keyboardDidShowListener.remove();
    };
  }, [ref]);

  const handlePayment = async () => {
    if (!amount || !cardNumber || !expiryDate || !cvv) {
      alert('Please fill in all fields.');
      return;
    }

    if (cardNumber.length !== 11) {
      alert('Card number must be 11 digits.');
      return;
    }

    if (cvv.length !== 3) {
      alert('CVV must be 3 digits.');
      return;
    }

    if (expiryDate.length !== 4) {
      alert('Expiry date must be 4 digits (MM/YY).');
      return;
    }

    setLoading(true);
    console.log('Processing payment...');

    // Simulate payment processing
    setTimeout(() => {
      setLoading(false);
      if (onSuccess) {
        onSuccess(amount);
        setAmount('');
        setCardNumber('');
        setExpiryDate('');
        setCvv('');
      }
      ref.current.close();
    }, 3000);
  };

  return (
    <BottomSheet
      ref={ref}
      index={-1}
      snapPoints={snapPoints}
      enablePanDownToClose
      backdropComponent={renderBackdrop}
      backgroundComponent={({ style }) => (
        <View style={[style, styles.background]} />
      )}
    >
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.sheetContent}>
          <Text style={styles.title}>Fund Your Wallet</Text>
          <Text style={styles.description}>
            Enter your card details and the amount you want to add:
          </Text>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Card Number</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter card number"
              keyboardType="numeric"
              maxLength={11}
              value={cardNumber}
              placeholderTextColor="#888888"
              onChangeText={setCardNumber}
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Expiry Date (MM/YY)</Text>
            <TextInput
              style={styles.input}
              placeholder="MM/YY"
              keyboardType="numeric"
              maxLength={4}
              value={expiryDate}
              placeholderTextColor="#888888"
              onChangeText={setExpiryDate}
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>CVV</Text>
            <TextInput
              style={styles.input}
              placeholder="***"
              keyboardType="numeric"
              secureTextEntry
              maxLength={3}
              value={cvv}
              placeholderTextColor="#888888"
              onChangeText={setCvv}
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Amount</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter amount"
              placeholderTextColor="#888888"
              keyboardType="numeric"
              value={amount}
              onChangeText={setAmount}
            />
          </View>

          <TouchableOpacity style={styles.button} onPress={handlePayment} disabled={loading}>
            {loading ? (
              <ActivityIndicator size="small" color="white" />
            ) : (
              <Text style={styles.buttonText}>Pay ₦ {amount.toLocaleString()}</Text>
            )}
          </TouchableOpacity>
        </View>
      </ScrollView>
    </BottomSheet>
  );
});

const SuccessBottomSheet = forwardRef(({ onClose }, ref) => {
  const renderBackdrop = useCallback(
    (props) => (
      <BottomSheetBackdrop
        disappearsOnIndex={-1}
        appearsOnIndex={0}
        {...props}
      />
    ),
    []
  );

  return (
    <BottomSheet
      ref={ref}
      index={0}
      snapPoints={['45%']}
      enablePanDownToClose
      backdropComponent={renderBackdrop}
      backgroundComponent={({ style }) => (
        <View style={[style, styles.background]} />
      )}
    >
      <View style={styles.successContent}>
        <Success />
        <Text style={styles.successMessage}>Funds have been added!</Text>
        <TouchableOpacity style={styles.successButton} onPress={onClose}>
          <Text style={styles.buttonText}>Close</Text>
        </TouchableOpacity>
      </View>
    </BottomSheet>
  );
});

const styles = StyleSheet.create({
  background: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
  },
  scrollContainer: {
    padding: 15,
  },
  sheetContent: {
    flexGrow: 1,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    fontFamily: 'nunitoSansExtraBold',
    color: '#1F1F1F',
  },
  description: {
    marginTop: 10,
    marginBottom: 20,
    fontSize: 16,
    color: '#555555',
    fontFamily: 'nunitoSansBold',
  },
  inputContainer: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '400',
    color: '#1F1F1F',
    marginBottom: 8,
  },
  input: {
    height: 40,
    borderColor: '#cccccc',
    borderWidth: 1,
    paddingHorizontal: 10,
    borderRadius: 10,
    backgroundColor: 'white',
    fontFamily: 'nunitoSansMedium',
    fontSize: 14,
  },
  button: {
    marginTop: 10,
    backgroundColor: '#193a69',
    padding: 15,
    borderRadius: 50,
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontFamily: 'nunitoSansBold',
    fontSize: 16,
  },
  successContent: {
    padding: 20,
    alignItems: 'center',
  },
  successMessage: {
    fontSize: 18,
    marginVertical: 30,
    color: '#1F1F1F',
  },
  successButton: {
    backgroundColor: '#193a69',
    padding: 15,
    alignItems: 'center',
    width: '100%',
    borderRadius: 20,
  },
});

export { PaymentBottomSheet, SuccessBottomSheet };
