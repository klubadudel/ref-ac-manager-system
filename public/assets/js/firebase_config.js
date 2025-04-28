// Import the functions you need from the SDKs you need
import { initializeApp } from 'https://www.gstatic.com/firebasejs/11.6.0/firebase-app.js';
import { getAuth } from 'https://www.gstatic.com/firebasejs/11.6.0/firebase-auth.js'

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBqFSRcvrk74Ekg0qhnygt2RcD6_ODw8kQ",
  authDomain: "refrigiration-and-ac-manager.firebaseapp.com",
  projectId: "refrigiration-and-ac-manager",
  storageBucket: "refrigiration-and-ac-manager.firebasestorage.app",
  messagingSenderId: "919498706120",
  appId: "1:919498706120:web:ab0a4a8efe987ca3bb69fd",
  measurementId: "G-VQJV78HWM7"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

export { auth };