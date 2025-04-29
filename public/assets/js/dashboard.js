import { initializeApp, getApps, getApp } from 'https://www.gstatic.com/firebasejs/11.6.0/firebase-app.js';
import { getAuth, signOut, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-auth.js";
import { getFirestore, doc, getDoc, setDoc, collection, getDocs, query, where } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-firestore.js";

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBqFSRcvrk74Ekg0qhnygt2RcD6_ODw8kQ",
  authDomain: "refrigiration-and-ac-manager.firebaseapp.com",
  projectId: "refrigiration-and-ac-manager",
  storageBucket: "refrigiration-and-ac-manager.appspot.com",
  messagingSenderId: "919498706120",
  appId: "1:919498706120:web:ab0a4a8efe987ca3bb69fd",
  measurementId: "G-VQJV78HWM7"
};

// Initialize Firebase only if it hasn't been initialized already
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const auth = getAuth(app);
const db = getFirestore(app);

// Helper: Create a device card
function createDeviceCard(deviceData) {
  const card = document.createElement('div');
  card.classList.add('unit-card');

  const deviceName = document.createElement('h3');
  deviceName.classList.add('deviceName');
  deviceName.textContent = deviceData.deviceName || "--";
  card.appendChild(deviceName);

  const unitDetails = document.createElement('div');
  unitDetails.classList.add('unit-details');

  const statusPara = document.createElement('p');
  statusPara.innerHTML = `Status: <span class="status-text">${deviceData.status || "--"}</span>`;

  const timestampPara = document.createElement('p');
  timestampPara.innerHTML = `Last Updated: <span class="timestamp">${deviceData.lastUpdated?.toDate().toLocaleString() || "--"}</span>`;

  unitDetails.appendChild(statusPara);
  unitDetails.appendChild(timestampPara);
  card.appendChild(unitDetails);

  const managementOptions = document.createElement('div');
  managementOptions.classList.add('management-options');

  const buttonGroup = document.createElement('div');
  buttonGroup.classList.add('button-group');

  const logsButton = document.createElement('button');
  logsButton.classList.add('option-btn');
  logsButton.textContent = "Logs";

  const removeButton = document.createElement('button');
  removeButton.classList.add('remove-btn');
  removeButton.textContent = "Remove";

  const editButton = document.createElement('button');
  editButton.classList.add('edit-btn');
  editButton.textContent = "Edit";

  buttonGroup.appendChild(logsButton);
  buttonGroup.appendChild(removeButton);
  buttonGroup.appendChild(editButton);

  managementOptions.appendChild(buttonGroup);
  card.appendChild(managementOptions);

  return card;
}

// Fetch and display the user's full name, branch info, and devices
async function fetchUserInfo(user) {
  try {
    console.log("Fetching user info for UID:", user.uid);

    const userDocRef = doc(db, "users", user.uid);
    const userDoc = await getDoc(userDocRef);

    if (!userDoc.exists()) {
      console.log("No user document found.");
      return;
    }

    const userData = userDoc.data();
    console.log("User data:", userData);

    // Set user name
    const userNameElement = document.querySelector(".user-name");
    if (userNameElement) {
      userNameElement.textContent = `Welcome, ${userData.fullName || "User"}`;
    }

    // Handle Create buttons visibility
    const createButton = document.getElementById('createButton');
    const createBranchButton = document.getElementById('createBranchButton');

    if (userData.role === "head_office") {
      createButton.style.display = "inline-block";
      createBranchButton.style.display = "inline-block";
    } else {
      createButton.style.display = "none";
      createBranchButton.style.display = "none";
    }

    // Fetch and display branch details and devices
    if (userData.branches) {
      console.log("Fetching branch info for branchId:", userData.branches);

      const branchDocRef = doc(db, "branches", userData.branches);
      const branchDoc = await getDoc(branchDocRef);

      if (branchDoc.exists()) {
        const branchData = branchDoc.data();
        console.log("Branch data:", branchData);

        const branchNameElement = document.getElementById('branchName');
        const branchAddressElement = document.getElementById('branchAddress');
        const branchRegionElement = document.getElementById('branchRegion');

        if (branchNameElement) branchNameElement.textContent = branchData.branchName || "--";
        if (branchAddressElement) branchAddressElement.textContent = branchData.address || "--";
        if (branchRegionElement) branchRegionElement.textContent = branchData.region || "--";

        // Fetch devices for this branch
        if (branchData.devices && Array.isArray(branchData.devices)) {
          displayDevices(branchData.devices);
        }
      }
    }
  } catch (error) {
    console.error("Error fetching user info:", error);
  }
}

// Fetch and display devices based on device IDs
async function displayDevices(deviceIds) {
    try {
      const refrigeratorUnitsContainer = document.getElementById('refrigeratorUnits');
      const airConditioningUnitsContainer = document.getElementById('airConditioningUnits');
  
      // Clear existing units first
      refrigeratorUnitsContainer.innerHTML = '';
      airConditioningUnitsContainer.innerHTML = '';
  
      for (const deviceIdOrRef of deviceIds) {
        let deviceId;
  
        // If deviceIdOrRef is a Firestore reference, extract its ID
        if (typeof deviceIdOrRef === 'object' && deviceIdOrRef.id) {
          deviceId = deviceIdOrRef.id;
        } else if (typeof deviceIdOrRef === 'string') {
          deviceId = deviceIdOrRef;
        } else {
          console.warn("Unknown device format:", deviceIdOrRef);
          continue;
        }
  
        const deviceDocRef = doc(db, "devices", deviceId);
        const deviceDoc = await getDoc(deviceDocRef);
  
        if (deviceDoc.exists()) {
          const deviceData = deviceDoc.data();
          const deviceCard = createDeviceCard(deviceData);
  
          // Sort device into the correct container
          if (deviceData.type === "Refrigerator") {
            refrigeratorUnitsContainer.appendChild(deviceCard);
          } else if (deviceData.type === "AC Unit") {
            airConditioningUnitsContainer.appendChild(deviceCard);
          } else {
            console.warn("Unknown device type:", deviceData.type);
          }
        }
      }
    } catch (error) {
      console.error("Error displaying devices:", error);
    }
  }
  document.addEventListener('DOMContentLoaded', () => {
    const logoutButton = document.getElementById('logoutButton');
  
    // Get modal elements
    const logsModal = document.getElementById('logsModal');
    const removeModal = document.getElementById('removeModal');
    const editModal = document.getElementById('editModal');
    const addDeviceModal = document.getElementById('addDeviceModal');
  
    // Get the button elements in each device card
    const logsButtons = document.querySelectorAll('.unit-card .option-btn');
    const removeButtons = document.querySelectorAll('.unit-card .remove-btn');
    const editButtons = document.querySelectorAll('.unit-card .edit-btn');
  
    // Get the close elements for modals
    const closeLogsModal = document.getElementById('closeLogsModal');
    const closeRemoveModal = document.getElementById('closeRemoveModal');
    const closeEditModal = document.getElementById('closeEditModal');
    const closeAddDeviceModalBtn = document.getElementById('closeModalBtn');
  
    // Add event listeners for device card buttons (logs, remove, edit)
    logsButtons.forEach((button, index) => {
      button.addEventListener('click', () => {
        openLogsModal(index); // Pass device index
      });
    });
  
    removeButtons.forEach((button, index) => {
      button.addEventListener('click', () => {
        openRemoveModal(index); // Pass device index
      });
    });
  
    editButtons.forEach((button, index) => {
      button.addEventListener('click', () => {
        openEditModal(index); // Pass device index
      });
    });
  
    // Modal open functions
    function openLogsModal(index) {
      document.getElementById('logsContent').innerHTML = `Logs for device ${index + 1} will be here.`;
      logsModal.style.display = 'block';
    }
  
    function openRemoveModal(index) {
      document.getElementById('confirmRemove').onclick = () => {
        removeDevice(index); // Call remove device function
      };
      removeModal.style.display = 'block';
    }
  
    function openEditModal(index) {
      // Populate form fields with current device details
      document.getElementById('deviceName').value = `Device Name ${index + 1}`;
      document.getElementById('deviceStatus').value = 'on'; // Default status
      editModal.style.display = 'block';
    }
  
    // Modal close functions
    closeLogsModal.onclick = () => {
      logsModal.style.display = 'none';
    };
  
    closeRemoveModal.onclick = () => {
      removeModal.style.display = 'none';
    };
  
    closeEditModal.onclick = () => {
      editModal.style.display = 'none';
    };
  
    closeAddDeviceModalBtn.addEventListener('click', () => {
      addDeviceModal.style.display = 'none';
    });
  
    // Close modals if clicked outside
    window.onclick = (event) => {
      if (event.target === logsModal) {
        logsModal.style.display = 'none';
      }
      if (event.target === removeModal) {
        removeModal.style.display = 'none';
      }
      if (event.target === editModal) {
        editModal.style.display = 'none';
      }
      if (event.target === addDeviceModal) {
        addDeviceModal.style.display = 'none';
      }
    };
  
    // Handle Edit form submission
    document.getElementById('editDeviceForm')?.addEventListener('submit', (event) => {
      event.preventDefault();
      console.log("Device info edited:", {
        name: document.getElementById('deviceName').value,
        status: document.getElementById('deviceStatus').value
      });
      editModal.style.display = 'none'; // Close the modal after saving
    });
  
    // Handle device removal
    function removeDevice(index) {
      console.log("Device removed:", index + 1);
      removeModal.style.display = 'none'; // Close the modal after removing
    }
  
    // Function to show the Add Device modal with selected device type
    window.showAddUnitModal = function(deviceType) {
      addDeviceModal.style.display = 'block';
      document.getElementById('deviceType').value = deviceType;
    };
  
    // Handle Add Device form submission
    const addDeviceForm = document.getElementById('addDeviceForm');
    addDeviceForm.addEventListener('submit', async (event) => {
      event.preventDefault();
  
      const deviceName = document.getElementById('deviceName').value;
      const deviceStatus = document.getElementById('deviceStatus').value;
      const deviceType = document.getElementById('deviceType').value;
      const user = auth.currentUser;
  
      if (user) {
        try {
          const newDeviceRef = doc(collection(db, "devices"));
          await setDoc(newDeviceRef, {
            deviceName,
            status: deviceStatus,
            type: deviceType,
            lastUpdated: new Date()
          });
  
          console.log("New device added:", deviceName);
  
          const userDocRef = doc(db, "users", user.uid);
          const userDoc = await getDoc(userDocRef);
  
          if (userDoc.exists()) {
            const userData = userDoc.data();
            if (userData.branches) {
              const branchDocRef = doc(db, "branches", userData.branches);
              const branchDoc = await getDoc(branchDocRef);
  
              if (branchDoc.exists()) {
                const branchData = branchDoc.data();
                const updatedDeviceList = Array.isArray(branchData.devices)
                  ? [...branchData.devices, newDeviceRef.id]
                  : [newDeviceRef.id];
  
                await setDoc(branchDocRef, { devices: updatedDeviceList }, { merge: true });
  
                console.log("Branch updated with new device:", newDeviceRef.id);
                alert("New device added successfully!");
                location.reload(); // Refresh the page to show the new device
              }
            }
          }
  
          addDeviceModal.style.display = 'none';
          addDeviceForm.reset();
  
        } catch (error) {
          console.error("Error adding device:", error);
          alert("Failed to add device: " + error.message);
        }
      } else {
        console.log("No user logged in.");
      }
    });
  
    // Firebase auth state
    onAuthStateChanged(auth, (user) => {
      if (user) {
        fetchUserInfo(user); // Fetch user-specific data if logged in
      } else {
        console.log("No user logged in.");
      }
    });
  
    // Logout functionality
    if (logoutButton) {
      logoutButton.addEventListener('click', async () => {
        try {
          await signOut(auth);
          console.log("User logged out.");
          window.location.href = "../login/index.html"; // Redirect to login page after logout
        } catch (error) {
          console.error("Logout error:", error);
          alert("Logout failed: " + error.message);
        }
      });
    }
  });
  

