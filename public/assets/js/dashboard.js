import { initializeApp } from 'https://www.gstatic.com/firebasejs/11.6.0/firebase-app.js';
import { getAuth, signOut, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-auth.js";
import { getFirestore, doc, getDoc } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-firestore.js";

// Firebase configuration
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
const auth = getAuth();
const db = getFirestore(app);

// Function to fetch and display the current user's full name and check if they are HQ
async function fetchUserName(user) {
  try {
    // Get the user's document from Firestore using the UID
    const userDocRef = doc(db, "users", user.uid);  // Assuming the collection is "users"
    const userDoc = await getDoc(userDocRef);
    
    if (userDoc.exists()) {
      // Get the full name and role from the document
      const userData = userDoc.data();
      const fullName = userData.fullName;  // Assuming the field is called "fullName"
      const role = userData.role;  // Assuming the role is stored in Firestore
      
      // Display the full name in the HTML
      document.querySelector(".user-name").textContent = `Welcome, ${fullName}`;
      
      // Show the Create New User and Create New Branch buttons only if the user is HQ
      const createButton = document.getElementById('createButton');
      const createBranchButton = document.getElementById('createBranchButton');
      
      if (role === "head_office") {
        createButton.style.display = "inline-block";  // Show the Create New User button
        createBranchButton.style.display = "inline-block";  // Show the Create New Branch button
      } else {
        createButton.style.display = "none";  // Hide the Create New User button
        createBranchButton.style.display = "none";  // Hide the Create New Branch button
      }
    } else {
      console.log("No user data found in Firestore.");
    }
  } catch (error) {
    console.error("Error fetching user data:", error);
  }
}

// Logout functionality
document.addEventListener('DOMContentLoaded', () => {
  const logoutButton = document.getElementById('logoutButton');  // Get the logout button
  
  // Listen for authentication state changes
  onAuthStateChanged(auth, (user) => {
    if (user) {
      // If user is logged in, fetch user data
      fetchUserName(user);
    } else {
      // Handle the case where no user is signed in
      console.log("No user is logged in.");
    }
  });

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
