import { initializeApp } from "firebase/app";
import { getAuth, initializeAuth, getReactNativePersistence } from "firebase/auth";
import { getFirestore } from 'firebase/firestore'
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
    apiKey: "AIzaSyA4cl5sLy2bqYXlDO5NlaPKo7048UFJoBg",
    authDomain: "idear-b7939.firebaseapp.com",
    projectId: "idear-b7939",
    storageBucket: "idear-b7939.firebasestorage.app",
    messagingSenderId: "483514862570",
    appId: "1:483514862570:web:423e536680f92428820093",
    measurementId: "G-TJ3RN18N6J"
  };

const app = initializeApp(firebaseConfig);

const persistence = getReactNativePersistence(AsyncStorage);

const auth = initializeAuth(app, { persistence });

const db = getFirestore(app);

const storage = getStorage(app);

export { auth, db, storage };