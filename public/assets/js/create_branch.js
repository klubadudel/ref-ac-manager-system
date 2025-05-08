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

// Function to generate region options dynamically
export function generateRegionOptions() {
  console.log("Generating region options...");
  const regions = [
    { name: "NCR", label: "NCR: National Capital Region" },
    { name: "Region 1: Ilocos Region", label: "Region 1: Ilocos Region" },
    { name: "Region II: Cagayan Valley", label: "Region II: Cagayan Valley" },
    { name: "Region III: Central Luzon", label: "Region III: Central Luzon" },
    { name: "Region IV-A: CALABARZON", label: "Region IV-A: CALABARZON" },
    { name: "Region IV-B: MIMAROPA", label: "Region IV-B: MIMAROPA" },
    { name: "Region V: Bicol Region", label: "Region V: Bicol Region" },
    { name: "Region VI: Western Visayas", label: "Region VI: Western Visayas" },
    { name: "Region VII: Central Visayas", label: "Region VII: Central Visayas" },
    { name: "Region VIII: Eastern Visayas", label: "Region VIII: Eastern Visayas" },
    { name: "Region IX: Zamboanga Peninsula", label: "Region IX: Zamboanga Peninsula" },
    { name: "Region X: Northern Mindanao", label: "Region X: Northern Mindanao" },
    { name: "Region XI: Davao Region", label: "Region XI: Davao Region" },
    { name: "Region XII: SOCCSKSARGEN", label: "Region XII: SOCCSKSARGEN" },
    { name: "Region XIII: Caraga", label: "Region XIII: Caraga" },
    { name: "ARMM: Autonomous Region in Muslim Mindanao", label: "ARMM: Autonomous Region in Muslim Mindanao" },
    { name: "CAR: Cordillera Administrative Region", label: "CAR: Cordillera Administrative Region" }
  ];

  const regionSelect = document.getElementById("region");

  regions.forEach(region => {
    const option = document.createElement("option");
    option.value = region.name; // Store the region name as the value
    option.textContent = region.label; // Display the region label
    regionSelect.appendChild(option);

    console.log(`Added region: ${region.name}`);
  });
  // Add change listener to detect changes in the region dropdown
  regionSelect.addEventListener("change", (e) => {
    console.log("Region changed to:", e.target.value);
  });
}

// Function to create a new branch
async function createBranch(event) {
  event.preventDefault();

  console.log("Create Branch function triggered");

  const addressElement = document.getElementById("branchAddress");
  const branchNameElement = document.getElementById("branchName");
  const regionElement = document.getElementById("region");

  if (!addressElement || !branchNameElement || !regionElement) {
    console.error("Error: One or more required form elements are missing.");
    alert("Error: Please ensure all required fields are filled in.");
    return;
  }

  const address = addressElement.value;
  const branchName = branchNameElement.value;
  const region = regionElement.value;

  console.log("Selected region:", region);  // ✅ Log selected region

  const userSelect = document.getElementById("users-container");
  const selectedUsers = Array.from(userSelect.selectedOptions).map(option => ({
    userId: option.value,
    role: option.getAttribute('data-role')
  }));

  console.log("Branch Data:", { address, branchName, region, selectedUsers });  // ✅ Log all data

  try {
    const branchRef = doc(collection(db, "branches"));

    await setDoc(branchRef, {
      address,
      branchName,
      region,
      users: selectedUsers,
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
  const createBranchForm = document.getElementById('createBranchForm');
  if (createBranchForm) {
    createBranchForm.addEventListener('submit', createBranch);
  }

  // Fetch users and populate the user select dropdown
  fetchUsers();

  // Generate region options on page load
  generateRegionOptions();
});
