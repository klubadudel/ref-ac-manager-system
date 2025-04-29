import { initializeApp } from 'https://www.gstatic.com/firebasejs/11.6.0/firebase-app.js';
import { getAuth, signOut, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-auth.js";
import { getFirestore, doc, setDoc, collection, getDocs, getDoc } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-firestore.js";

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
    const userDocRef = doc(db, "users", user.uid);  // Fetch the user's document from Firestore
    const userDoc = await getDoc(userDocRef);

    if (userDoc.exists()) {
      const userData = userDoc.data();
      const fullName = userData.fullName;
      const role = userData.role;

      // Display the user's full name in the HTML
      document.querySelector(".user-name").textContent = `Welcome, ${fullName}`;

      // Show/hide buttons based on the role (only HQ can create new users and branches)
      const createButton = document.getElementById('createButton');
      const createBranchButton = document.getElementById('createBranchButton');

      if (role === "head_office") {
        createButton.style.display = "inline-block";
        createBranchButton.style.display = "inline-block";
      } else {
        createButton.style.display = "none";
        createBranchButton.style.display = "none";
      }
    } else {
      console.log("No user data found in Firestore.");
    }
  } catch (error) {
    console.error("Error fetching user data:", error);
  }
}

// Function to fetch all users and populate the user selection dropdown
async function fetchUsers() {
  try {
    const usersSnapshot = await getDocs(collection(db, "users"));
    const userSelect = document.getElementById("users-container");

    usersSnapshot.forEach(doc => {
      const userData = doc.data();
      const option = document.createElement("option");
      option.value = doc.id;  // Use the document ID as user ID
      option.textContent = userData.fullName;
      option.setAttribute("data-role", userData.role);  // Add user role as an attribute
      userSelect.appendChild(option);
    });
  } catch (error) {
    console.error("Error fetching users:", error);
  }
}

// Function to create a new branch
async function createBranch(event) {
  event.preventDefault();

  const address = document.getElementById("branchAddress").value;
  const branchName = document.getElementById("branchName").value;
  const region = document.getElementById("region").value;

  // Gather selected users from the dropdown
  const userSelect = document.getElementById("users-container");
  const selectedUsers = Array.from(userSelect.selectedOptions).map(option => ({
    userId: option.value,
    role: option.getAttribute('data-role')  // Correct attribute for user role
  }));

  try {
    // Generate a new branch document in Firestore
    const branchRef = doc(collection(db, "branches"));
    
    await setDoc(branchRef, {
      address: address,
      branchName: branchName,
      region: region,
      users: selectedUsers,  // Array of user assignments
      createdAt: new Date()
    });

    console.log("Branch created successfully!");
    alert("Branch created successfully!");
    createBranchForm.reset();

  } catch (error) {
    console.error("Error creating branch:", error);
    alert("Error creating branch: " + error.message);
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
      console.log("No user is logged in.");
      // Optionally, redirect to login if no user is logged in
      window.location.href = "../login/index.html";
    }
  });

  if (logoutButton) {
    logoutButton.addEventListener('click', async () => {
      try {
        const user = auth.currentUser;
        if (user) {
          console.log("User is signed in, logging out...");
          await signOut(auth);
          console.log("User logged out successfully");
          window.location.href = "../login/index.html";
        }
      } catch (error) {
        console.error("Error logging out:", error);
        alert("Error logging out: " + error.message);
      }
    });
  }

  // Event listener for create branch form
  const createBranchButton = document.getElementById('createBranchButton');
  if (createBranchButton) {
    createBranchButton.addEventListener('click', createBranch);
  }

  // Fetch users and populate the user select dropdown
  fetchUsers();
});
