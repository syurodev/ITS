// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCkrxP04AeofnKoC0l1fpolQA0bVd32sNc",
  authDomain: "itsocial-8a1f3.firebaseapp.com",
  projectId: "itsocial-8a1f3",
  storageBucket: "itsocial-8a1f3.appspot.com",
  messagingSenderId: "935792276149",
  appId: "1:935792276149:web:06b35fbcaee2b9afcd04fc",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth();
const provider = new GoogleAuthProvider();

export { auth, provider };
