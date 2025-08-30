// Import the functions you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

// Your Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCdtJBz4_PcbYgEsDM4ib3WBq-6mSdBxwA",
  authDomain: "quickjobwebapp.firebaseapp.com",
  projectId: "quickjobwebapp",
  storageBucket: "quickjobwebapp.appspot.com", // ✅ fix here (.app → .appspot.com)
  messagingSenderId: "320266323421",
  appId: "1:320266323421:web:76dcf28a61f4100e5de234",
  measurementId: "G-3ZYK787XM5",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication
export const auth = getAuth(app);
export default app;

