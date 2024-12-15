import React from 'react';
import { SafeAreaView, StyleSheet, Text, View, TouchableOpacity, Alert, Dimensions } from 'react-native';
import { auth,db } from '../../firebase/config';
import { collection, getDocs, setDoc, doc, updateDoc } from 'firebase/firestore';
import { signOut,getAuth } from 'firebase/auth'; // Import the signOut function from Firebase
import AsyncStorage from '@react-native-async-storage/async-storage';

const { width, height } = Dimensions.get('window');

const Settings = ({ navigation }) => {

  const serialize = (dataArray) => {
    return dataArray.map(item => {
      if (item instanceof YourCustomClass) {
        // Convert your custom class instance to a plain object
        return item.toPlainObject(); // Assuming you have a method to convert to a plain object
      }
      return item; // Return the item as is if it's already a plain object
    });
  }
  
  const handlePushData = async (dataArray) => {
    const userId = auth.currentUser.uid;
  
    // Serialize the dataArray before storing
    const serializedData = await AsyncStorage.getItem('ideaList'); // Retrieve serialized array as a JSON string
  
    // Reference to the user's 'todos' collection (based on userId)
    const todosRef = collection(db, "users", userId, "ideas"); // User's unique 'todos' subcollection
  
    try {
      // Check if the user already has any document in the 'todos' subcollection
      const querySnapshot = await getDocs(todosRef);
  
      if (querySnapshot.empty) {
        // No documents in the collection, create a new one
        console.log('No ideas found, creating new collection.');
  
        // Create a new document in the 'todos' subcollection (e.g., 'todoDoc')
        const docRef = doc(todosRef, 'ideas'); // You can name the document as needed
        await setDoc(docRef, { todos: JSON.parse(serializedData) }); // Store the serialized data array in the document
  
        console.log('Collection created and data added.');
      } else {
        // The collection exists and has data, so update it
        console.log('Todos found, updating data.');
  
        // Get the reference of the first document in the collection
        const docRef = querySnapshot.docs[0].ref;
        await updateDoc(docRef, { todos: JSON.parse(serializedData) }); // Update the data
  
        console.log('Data updated.');
      }
    } catch (error) {
      console.error('Error handling collection:', error);
    }
  };
  

  const handleSignOut = () => {
    Alert.alert(
      "Sign Out",
      "Are you sure you want to sign out?",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Yes",
          onPress: async () => {
            try {
              await signOut(auth); // Sign out using Firebase auth
              Alert.alert('Signed Out', 'You have been signed out.');
              navigation.navigate('Login'); // Navigate to the Login screen after sign-out
            } catch (error) {
              Alert.alert('Error', 'Something went wrong during sign out.');
            }
          },
        },
      ]
    );
  };

  const handleSync = () => {
    // Add sync logic here (e.g., sync data with a server or cloud)
    Alert.alert('Sync', 'Data has been synchronized.');
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.section}>
        <Text style={styles.sectionHeader}>Account</Text>
        <TouchableOpacity style={styles.button} onPress={handleSignOut}>
          <Text style={styles.buttonText}>Sign Out</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionHeader}>Sync</Text>
        <TouchableOpacity style={styles.button} onPress={handlePushData}>
          <Text style={styles.buttonText}>Sync Data</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default Settings;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: width * 0.05, // 5% horizontal padding
    paddingVertical: height * 0.05,  // 5% vertical padding
    backgroundColor: '#f9fafd',
    justifyContent: 'center',
    alignItems: 'center',
  },
  section: {
    marginVertical: height * 0.025, // 2.5% margin between sections
    alignItems: 'center',
    width: '100%',
  },
  sectionHeader: {
    fontSize: width * 0.065,   // Font size 6.5% of screen width
    fontWeight: '500',
    color: '#333',
    marginBottom: height * 0.02, // Margin between section title and button
  },
  button: {
    backgroundColor: '#80ad92',  // New color #80ad92 for buttons
    width: 180,  // Fixed width of 180
    height: 60,  // Fixed height of 60
    borderRadius: 8, // Smaller border radius for buttons
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: height * 0.015, // Margin below each button (1.5% of screen height)
  },
  buttonText: {
    color: '#fff',
    fontSize: width * 0.04, // Font size 4% of screen width for the button text
    fontWeight: '500',
  },
});
