import React, { forwardRef, useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Keyboard, ActivityIndicator, ScrollView } from 'react-native';
import BottomSheet, { BottomSheetTextInput } from '@gorhom/bottom-sheet';
import Success from '@/assets/images/success-svg.svg';

const PaymentBottomSheet = forwardRef(({ onSuccess }, ref) => {
  const snapPoints = ['100%', '95%'];
  const [amount, setAmount] = useState('');
  const [cardNumber, setCardNumber] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [cvv, setCvv] = useState('');
  const [loading, setLoading] = useState(false);

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
      index={0}
      snapPoints={snapPoints}
      enablePanDownToClose
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
            <BottomSheetTextInput
              style={styles.input}
              placeholder="Enter card number"
              keyboardType="numeric"
              maxLength={11}
              value={cardNumber}
              onChangeText={setCardNumber}
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Expiry Date (MM/YY)</Text>
            <BottomSheetTextInput
              style={styles.input}
              placeholder="MM/YY"
              keyboardType="numeric"
              maxLength={4}
              value={expiryDate}
              onChangeText={setExpiryDate}
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>CVV</Text>
            <BottomSheetTextInput
              style={styles.input}
              placeholder="***"
              keyboardType="numeric"
              secureTextEntry
              maxLength={3}
              value={cvv}
              onChangeText={setCvv}
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Amount</Text>
            <BottomSheetTextInput
              style={styles.input}
              placeholder="Enter amount"
              keyboardType="numeric"
              value={amount}
              onChangeText={setAmount}
            />
          </View>

          <TouchableOpacity style={styles.button} onPress={handlePayment} disabled={loading}>
            {loading ? (
              <ActivityIndicator size="small" color="white" />
            ) : (
              <Text style={styles.buttonText}>Pay ₦{amount}</Text>
            )}
          </TouchableOpacity>
        </View>
      </ScrollView>
    </BottomSheet>
  );
});

const SuccessBottomSheet = forwardRef(({ onClose }, ref) => (
  <BottomSheet
    ref={ref}
    index={0}
    snapPoints={['45%']}
    enablePanDownToClose
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
));

const styles = StyleSheet.create({
  background: {
    backgroundColor: '#ebebeb',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
  },
  scrollContainer: {
    padding: 20,
  },
  sheetContent: {
    flexGrow: 1,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1F1F1F',
  },
  description: {
    marginVertical: 20,
    fontSize: 16,
    color: '#555555',
  },
  inputContainer: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F1F1F',
    marginBottom: 5,
  },
  input: {
    height: 40,
    borderColor: '#cccccc',
    borderWidth: 1,
    paddingHorizontal: 10,
    borderRadius: 10,
    backgroundColor: '#ffffff',
    fontSize: 16,
  },
  button: {
    backgroundColor: '#193a69',
    padding: 15,
    borderRadius: 20,
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
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
