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
    const userDocRef = doc(db, "users", user.uid);
    const userDoc = await getDoc(userDocRef);

    if (userDoc.exists()) {
      const userData = userDoc.data();
      const fullName = userData.fullName;
      const role = userData.role;

      // Update the user's name on the page if the element exists
      const userNameElement = document.querySelector(".user-name");
      if (userNameElement) {
        userNameElement.textContent = `Welcome, ${fullName}`;
      }

      // Safely check for the create buttons
      const createButton = document.getElementById('createButton');
      const createBranchButton = document.getElementById('createBranchButton');

      if (createButton && createBranchButton) {
        if (role === "head_office") {
          createButton.style.display = "inline-block";
          createBranchButton.style.display = "inline-block";
        } else {
          createButton.style.display = "none";
          createBranchButton.style.display = "none";
        }
      } else {
        console.error("Create buttons not found in DOM.");
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

    if (!userSelect) {
      console.error("User select container not found.");
      return;
    }

    usersSnapshot.forEach(docSnap => {
      const userData = docSnap.data();
      const option = document.createElement("option");
      option.value = docSnap.id; // User UID
      option.textContent = userData.fullName;
      option.setAttribute("data-role", userData.role);
      userSelect.appendChild(option);
    });
  } catch (error) {
    console.error("Error fetching users:", error);
    alert("Error fetching users. Please check your permissions.");
  }
}

// Function to create a new branch
async function createBranch(event) {
  event.preventDefault();

  const addressInput = document.getElementById("address");  // <-- fixed this
  const branchNameInput = document.getElementById("branchName");
  const regionInput = document.getElementById("region");
  const userSelect = document.getElementById("users-container");
  
  if (!addressInput || !branchNameInput || !regionInput || !userSelect) {
      console.error("Form fields missing.");
      return;
  }

  const address = addressInput.value.trim();
  const branchName = branchNameInput.value.trim();
  const region = regionInput.value.trim();

  const selectedUsers = Array.from(userSelect.selectedOptions).map(option => ({
    userId: option.value,
    role: option.getAttribute('data-role')
  }));

  try {
    const branchRef = doc(collection(db, "branches"));

    await setDoc(branchRef, {
      address: address,
      branchName: branchName,
      region: region,
      users: selectedUsers,
      createdAt: new Date()
    });

    console.log("Branch created successfully!");
    alert("Branch created successfully!");

    // Optionally, reset form here
    addressInput.value = "";
    branchNameInput.value = "";
    regionInput.value = "";
    userSelect.selectedIndex = -1;
  } catch (error) {
    console.error("Error creating branch:", error);
    alert("Error creating branch: " + error.message);
  }
}

// Logout functionality + setup after DOM loaded
document.addEventListener('DOMContentLoaded', () => {
  const logoutButton = document.getElementById('logoutButton');
  const createBranchButton = document.getElementById('createBranchButton');

  onAuthStateChanged(auth, (user) => {
    if (user) {
      fetchUserName(user);
      fetchUsers();
    } else {
      console.log("No user is logged in.");
      window.location.href = "../login/index.html";
    }
  });

  if (logoutButton) {
    logoutButton.addEventListener('click', async () => {
      try {
        await signOut(auth);
        console.log("User logged out successfully");
        window.location.href = "../login/index.html";
      } catch (error) {
        console.error("Error logging out:", error);
        alert("Error logging out: " + error.message);
      }
    });
  } else {
    console.error("Logout button not found.");
  }

  if (createBranchButton) {
    createBranchButton.addEventListener('click', createBranch);
  } else {
    console.error("Create Branch button not found.");
  }
});
