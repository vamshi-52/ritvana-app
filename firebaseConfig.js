import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";  // ← ADD THIS

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDQXI0gBiRSABfDRID5tVfYxMWZozsodNg",
  authDomain: "ritvana-free.firebaseapp.com",
  projectId: "ritvana-free",
  storageBucket: "ritvana-free.appspot.com",  // ← FIXED!
  messagingSenderId: "518667502711",
  appId: "1:518667502711:web:fa8ec789770468889b7272"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firestore
export const db = getFirestore(app);  // ← ADD THIS LINE