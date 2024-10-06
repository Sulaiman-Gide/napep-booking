import React, { useState } from 'react';
import { 
  View, 
  Text, 
  TouchableWithoutFeedback, 
  Keyboard,
  ActivityIndicator, 
  Image, 
  TextInput, 
  TouchableOpacity, 
  Alert, 
  StatusBar,
  useColorScheme, 
  Platform,
  KeyboardAvoidingView
} from 'react-native';
import { router } from 'expo-router';
import tw from 'twrnc';
import { COLORS } from '@/constants/theme';
import Ionicons from '@expo/vector-icons/Ionicons';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function ResetPassword() {
  const colorScheme = useColorScheme();  
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false); 
  const [isLoading, setIsLoading] = useState(false);

  const toggleShowNewPassword = () => { 
    setShowNewPassword(!showNewPassword); 
  };

  const toggleShowConfirmPassword = () => { 
    setShowConfirmPassword(!showConfirmPassword); 
  };

  const isFormValid = () => {
    return email && newPassword && confirmPassword && (newPassword === confirmPassword);
  };

  const handleResetPassword = async () => {
    if (!isFormValid()) {
      Alert.alert("Please fill all fields correctly!");
      return;
    }
  
    setIsLoading(true);
    
    // Simulating a network request
    setTimeout(async () => {
      try {
        const storedUser = await AsyncStorage.getItem(email);
        const user = JSON.parse(storedUser);
  
        if (user) {
          user.password = newPassword;
          await AsyncStorage.setItem(email, JSON.stringify(user));
          Alert.alert("Password Reset Successful", "Your password has been reset successfully.");
          router.push('/auth/login');
        } else {
          Alert.alert("Reset Failed", "Incorrect email.");
        }
      } catch (error) {
        Alert.alert("Error", "An error occurred while resetting the password.");
      } finally {
        setIsLoading(false);
      }
    }, 2000);
  };
  

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={{ flex: 1, alignItems: 'center', backgroundColor: "#003b6f", padding: 0 }}>
          <StatusBar barStyle={colorScheme === 'dark' ? 'light-content' : 'light-content'} />
          <Image 
            source={require('@/assets/images/background.jpg')}
            style={tw.style('w-full', { flex: 0.35 })} 
          />
          <TouchableOpacity style={tw.style('', {position: "absolute", top: 55, left: 20})} onPress={() => router.push('/auth/login')}>
            <Ionicons name="arrow-back-sharp" size={27} color="white" />
          </TouchableOpacity>
          <View style={tw.style('w-full rounded-t-[20px] bg-white flex-1 pt-8', { flex: 1, paddingHorizontal: 16, gap: 32 })}>
            <View style={{ gap: 4}}>
              <Text style={tw.style({ lineHeight: 24, fontSize: 20, fontWeight: 700, color: COLORS.title })}>
                Reset Password
              </Text>
              <Text style={tw.style({ color: "#aaa", fontSize: 14, fontWeight: 400})}>
                Please fill in the details below to reset your password.
              </Text>
            </View>

            <View style={{ gap: 18 }}>
              <TextInput
                style={tw.style({ backgroundColor: '#f9fafb', borderRadius: 12, paddingTop: 12, paddingBottom: 14, paddingHorizontal: 8, fontSize: 12 })}
                placeholder="Enter your email"
                onChangeText={setEmail}
                keyboardType='email-address'
                placeholderTextColor="#aaa"
                underlineColorAndroid="transparent"
              />

              <View style={tw.style('flex-row justify-between items-center', { backgroundColor: '#f9fafb', borderRadius: 12, paddingTop: 12, paddingBottom: 14, paddingHorizontal: 8 })}>
                <TextInput
                  style={tw.style('flex-1 h-full mb-1', { backgroundColor: 'transparent', fontSize: 12 })}
                  secureTextEntry={!showNewPassword} 
                  value={newPassword} 
                  onChangeText={setNewPassword} 
                  placeholder="New Password"
                  placeholderTextColor="#aaa"
                  underlineColorAndroid="transparent"
                />
                <MaterialCommunityIcons 
                  name={showNewPassword ? 'eye-off' : 'eye'} 
                  size={20} 
                  color="#aaa"
                  onPress={toggleShowNewPassword} 
                /> 
              </View>

              <View style={tw.style('flex-row justify-between items-center', { backgroundColor: '#f9fafb', borderRadius: 12, paddingTop: 12, paddingBottom: 14, paddingHorizontal: 8 })}>
                <TextInput
                  style={tw.style('flex-1 h-full mb-1', { backgroundColor: 'transparent', fontSize: 12 })}
                  secureTextEntry={!showConfirmPassword} 
                  value={confirmPassword} 
                  onChangeText={setConfirmPassword} 
                  placeholder="Confirm New Password"
                  placeholderTextColor="#aaa"
                  underlineColorAndroid="transparent"
                />
                <MaterialCommunityIcons 
                  name={showConfirmPassword ? 'eye-off' : 'eye'} 
                  size={20} 
                  color="#aaa"
                  onPress={toggleShowConfirmPassword} 
                /> 
              </View>
            </View>

            <View style={tw.style('flex-1 justify-end', { gap: 14 })}>
              <View style={tw.style('w-full')}>
                <TouchableOpacity
                  style={tw.style('w-full rounded-2xl', { backgroundColor: COLORS.title, paddingVertical: 16, borderRadius: 100 })}
                  onPress={handleResetPassword}
                >
                  {isLoading ? (
                    <ActivityIndicator size={20} color="#FFF" />
                  ) : (
                    <Text style={tw.style('font-semibold text-center', { color: 'white', letterSpacing: 0.8 })}>Reset Password</Text>
                  )}
                </TouchableOpacity>
              </View>
              <TouchableOpacity 
                onPress={() => router.push('/auth/login')}
                style={tw.style('w-full pb-14 flex-row items-center justify-center ')}>
                <Text 
                  style={tw.style('text-center mr-2', {color: "#aaa", letterSpacing: 0.6, fontSize: 14 })}>
                  Remembered your password? 
                </Text>
                <Text style={tw.style('text-center', {color: COLORS.title, fontSize: 14 })}>Login</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
}
