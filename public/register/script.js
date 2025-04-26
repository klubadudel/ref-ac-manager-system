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

document.getElementById('registerForm').addEventListener('submit', function(e) {
    e.preventDefault(); // Prevent the default form submission
    
    const username = document.getElementById('username').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirmPassword').value;
    const message = document.getElementById('message');
    
    // Basic validation
    if (!validateEmail(email)) {
        message.textContent = 'Please enter a valid email address';
        message.className = 'message error';
        return;
    }

    if (password !== confirmPassword) {
        message.textContent = 'Passwords do not match';
        message.className = 'message error';
        return;
    }

    if (password.length < 6) {
        message.textContent = 'Password must be at least 6 characters long';
        message.className = 'message error';
        return;
    }

    // Registration successful
    message.textContent = 'Registration successful!';
    message.className = 'message success';
    
    // Reset the form fields
    document.getElementById('registerForm').reset();
    
    // Redirect to login page after a short delay
    setTimeout(() => {
        window.location.href = '../login/index.html';
    }, 2000);
});

// Function to validate email format
function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; // Simple regex for email validation
    return re.test(String(email).toLowerCase());
} 