// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
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
const analytics = getAnalytics(app);

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

    // Function to toggle dropdown visibility
    function toggleDropdown(headerId, listId) {
        const header = document.getElementById(headerId);
        const list = document.getElementById(listId);

        header.addEventListener('click', function() {
            list.style.display = list.style.display === 'block' ? 'none' : 'block';
        });
    }

    // Add dropdown functionality for each region
    toggleDropdown('ncrBranches', 'ncrBranches');
    toggleDropdown('ilocosRegion', 'ilocosRegion');
    toggleDropdown('cagayanValley', 'cagayanValley');
    toggleDropdown('centralLuzon', 'centralLuzon');
    toggleDropdown('calabarzon', 'calabarzon');
    toggleDropdown('mimaropa', 'mimaropa');
    toggleDropdown('bicolRegion', 'bicolRegion');
    toggleDropdown('westernVisayas', 'westernVisayas');
    toggleDropdown('centralVisayas', 'centralVisayas');
    toggleDropdown('easternVisayas', 'easternVisayas');
    toggleDropdown('zamboangaPeninsula', 'zamboangaPeninsula');
    toggleDropdown('northernMindanao', 'northernMindanao');
    toggleDropdown('davaoRegion', 'davaoRegion');
    toggleDropdown('soccsksargen', 'soccsksargen');
    toggleDropdown('caraga', 'caraga');
    toggleDropdown('armm', 'armm');
    toggleDropdown('ncr', 'ncr');
    toggleDropdown('car', 'car');
});