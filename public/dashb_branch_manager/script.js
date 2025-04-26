import { initializeApp } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-app.js";
import { getAuth, signOut } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-auth.js";

// Firebase Configuration
const firebaseConfig = {
    apiKey: "AIzaSyD6gu4V0uXpaRu5xsTz22FIPTzTgOFpdiM",
    authDomain: "refrigrator-and-ac-management.firebaseapp.com",
    databaseURL: "https://refrigrator-and-ac-management-default-rtdb.asia-southeast1.firebasedatabase.app",
    projectId: "refrigrator-and-ac-management",
    storageBucket: "refrigrator-and-ac-management.firebasestorage.app",
    messagingSenderId: "1011812537168",
    appId: "1:1011812537168:web:2a83cd7baefeef911c9255",
    measurementId: "G-N95LJ1VWBL"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app); // Ensure you have the auth instance

document.addEventListener('DOMContentLoaded', function() {
    // Function to open the modal and populate data
    window.openModal = function(unitName) {
        const modal = document.getElementById("detailsModal");
        const updateLogs = document.getElementById("updateLogs");
        
        // Example data for the chart and logs
        const labels = ['2024-03-19 14:00', 
                        '2024-03-19 14:10', 
                        '2024-03-19 14:20', 
                        '2024-03-19 14:30', 
                        '2024-03-19 14:40'];

        // Populate update logs (example)
        updateLogs.innerHTML = `<p>Last maintenance: 2024-03-18</p><p>Issues reported: None</p>`;

        modal.style.display = "block"; // Show the modal
    };

    // Function to close the modal
    window.closeModal = function() {
        const modal = document.getElementById("detailsModal");
        modal.style.display = "none"; // Hide the modal
    };

    // Close modal when clicking outside of it
    window.onclick = function(event) {
        const modal = document.getElementById("detailsModal");
        if (event.target === modal) {
            modal.style.display = "none";
        }
    };

    // Function to edit a unit
    window.editUnit = function(button) {
        const unitCard = button.closest('.unit-card'); // Get the parent unit card
        const unitName = unitCard.querySelector('h3').innerText; // Get the unit name
        const statusText = unitCard.querySelector('.status-text').innerText; // Get the current status

        // Populate the form with current values (you can create a modal for editing)
        document.getElementById('unitName').value = unitName;
        document.getElementById('unitStatus').value = statusText;
    };

    // Function to show the add unit modal
    window.showAddUnitModal = function(unitType) {
        // Logic to open a modal or prompt for adding a new unit
        alert(`Add a new ${unitType} unit!`); // Placeholder for actual modal logic
    };

    // Add event listener for the logout button
    const logoutButton = document.querySelector('.logout-btn');
    logoutButton.addEventListener('click', () => {
        console.log("Logout button clicked"); // Check if the click event is triggered
        signOut(auth).then(() => {
            console.log("Sign-out successful"); // Check if sign-out is successful
            window.location.href = '../login/index.html'; // Redirect to login page
        }).catch((error) => {
            console.error("Logout failed:", error); // Log any errors
        });
    });
});