import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyAQoUrZdT0kWlqebrZx1I9LAUwyk_aVqhU",
  authDomain: "studen-29eab.firebaseapp.com",
  projectId: "studen-29eab",
  storageBucket: "studen-29eab.appspot.com",
  messagingSenderId: "559517403763",
  appId: "1:559517403763:web:6cf4dc37133d3af2db7806",
  measurementId: "G-4EFZBLYZ10",
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const firestore = getFirestore(app);
