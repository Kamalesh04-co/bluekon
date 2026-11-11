// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyB27WVbmU-EjelkqOUdnABEhyvhM7li4ag",
  authDomain: "bluekon-kk26.firebaseapp.com",
  projectId: "bluekon-kk26",
  storageBucket: "bluekon-kk26.firebasestorage.app",
  messagingSenderId: "1088791010733",
  appId: "1:1088791010733:web:11f621bd99db52eef51524"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
