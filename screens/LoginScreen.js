import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Platform,
  StyleSheet,
  KeyboardAvoidingView,
  ScrollView,
  Alert
} from 'react-native';
import FormInput from '../components/FormInput';
import FormButton from '../components/FormButton';
import { auth } from '../firebase/config'; // Ensure you adjust this import path correctly
import { signInWithEmailAndPassword } from "firebase/auth"; // Import Firebase login method

const LoginScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [button, setButton] = useState('Sign In');

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'All fields are required');
      return;
    }
    try {
      setButton('Signing In..');
      await signInWithEmailAndPassword(auth, email, password); // Firebase login method
      Alert.alert('Success', 'Logged in successfully');
      navigation.navigate('Home'); // Navigate to Home screen on successful login
    } catch (error) {
      setButton('Sign In');
      Alert.alert('Login Error', error.message); // Show error if login fails
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.text}>Welcome Back</Text>

        <FormInput
          labelValue={email}
          onChangeText={(userEmail) => setEmail(userEmail)}
          placeholderText="Email"
          iconType="user"
          keyboardType="email-address"
          autoCapitalize="none"
          autoCorrect={false}
        />

        <FormInput
          labelValue={password}
          onChangeText={(userPassword) => setPassword(userPassword)}
          placeholderText="Password"
          iconType="lock"
          secureTextEntry={true}
        />

        <FormButton
          buttonTitle={button}
          onPress={handleLogin}
        />

        <View style={styles.textPrivate}>
          <Text style={styles.color_textPrivate}>
            By logging in, you agree to our{' '}
          </Text>
          <TouchableOpacity onPress={() => alert('Terms Clicked!')}>
            <Text style={[styles.color_textPrivate, { color: '#e88832' }]}>
              Terms of service
            </Text>
          </TouchableOpacity>
          <Text style={styles.color_textPrivate}> and </Text>
          <Text style={[styles.color_textPrivate, { color: '#e88832' }]}>
            Privacy Policy
          </Text>
        </View>

        <TouchableOpacity
          style={styles.navButton}
          onPress={() => navigation.navigate('Signup')}
        >
          <Text style={styles.navButtonText}>Don't have an account? Sign Up</Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default LoginScreen;

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#f9fafd',
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  text: {
    fontSize: 28,
    marginBottom: 10,
    color: '#051d5f',
  },
  navButton: {
    marginTop: 15,
  },
  navButtonText: {
    fontSize: 18,
    fontWeight: '500',
    color: '#2e64e5',
  },
  textPrivate: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginVertical: 35,
    justifyContent: 'center',
  },
  color_textPrivate: {
    fontSize: 13,
    fontWeight: '400',
    color: 'grey',
  },
});
