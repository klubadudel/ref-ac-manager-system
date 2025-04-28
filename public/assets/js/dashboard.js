import { initializeApp } from 'https://www.gstatic.com/firebasejs/11.6.0/firebase-app.js';
import { getAuth, signOut } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-auth.js";

const firebaseConfig = {
    apiKey: "AIzaSyBqFSRcvrk74Ekg0qhnygt2RcD6_ODw8kQ",
    authDomain: "refrigiration-and-ac-manager.firebaseapp.com",
    projectId: "refrigiration-and-ac-manager",
    storageBucket: "refrigiration-and-ac-manager.firebasestorage.app",
    messagingSenderId: "919498706120",
    appId: "1:919498706120:web:ab0a4a8efe987ca3bb69fd",
    measurementId: "G-VQJV78HWM7"
  };

const app = initializeApp(firebaseConfig);
const auth = getAuth();

document.addEventListener('DOMContentLoaded', () => {
  const logoutButton = document.getElementById('logoutButton');  // Get the logout button

  // Logout functionality
  if (logoutButton) {
    logoutButton.addEventListener('click', async () => {
      try {
        // Check if the user is signed in
        const user = auth.currentUser;
        if (user) {
          console.log("User is signed in, logging out...");

          // Sign out the user
          await signOut(auth);
          console.log("User logged out successfully");

          // Redirect to login page
          window.location.href = "../login/index.html";  // Adjust the path to your login page
        } else {
          console.log("No user is signed in.");
        }
      } catch (error) {
        console.error("Error logging out:", error);
        alert("Error logging out: " + error.message);
      }
    });
  }
});

