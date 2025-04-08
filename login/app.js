import { initializeApp } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-analytics.js";
import { getAuth, signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-auth.js";
import { getAuth, signOut } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-auth.js";

// Your web app's Firebase configuration
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
const analytics = getAnalytics(app);
const auth = getAuth(app);

// Add event listener for the login form
document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('loginForm');
    loginForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const email = document.getElementById('username').value;
        const password = document.getElementById('password').value;
        const message = document.getElementById('message');

        signInWithEmailAndPassword(auth, email, password)
            .then((userCredential) => {
                // Signed in 
                const user = userCredential.user;
                const email = user.email; // Get the signed-in user's email
                let redirectPath;

                // Determine the redirect path based on the user's email
                switch (email) {
                    case 'headoffice@softdes.io':
                        redirectPath = '../dashb_headoffice/index.html';
                        break;
                    case 'branchmanager@softdes.io':
                        redirectPath = '../dashb_branch_manager/index.html';
                        break;
                    case 'regionalmanager@softdes.io':
                        redirectPath = '../dashb_regional_manager/index.html';
                        break;
                    default:
                        redirectPath = '../register/register.html'; // Fallback path if needed
                }

                // Redirect to the appropriate dashboard
                window.location.href = redirectPath;
            })
            .catch((error) => {
                const errorMessage = error.message;
                message.textContent = errorMessage;
                message.className = 'message error';

                

                // Existing code...
                
                    // Add event listener for logout button
                const logoutButton = document.querySelector('.logout-btn');
                logoutButton.addEventListener('click', () => {
                    const auth = getAuth();
                    signOut(auth).then(() => {
                        // Sign-out successful, redirect to login page
                        window.location.href = '../login/login.html'; // Update with your login page path
                    }).catch((error) => {
                        // An error happened during sign out
                        console.error("Sign Out Error", error);
                    });
                });
        });
    });
});