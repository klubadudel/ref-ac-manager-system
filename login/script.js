import { initializeApp } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-analytics.js";
import { getAuth, signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-auth.js";

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
getAnalytics(app);
const auth = getAuth(app);

// Login Handler
document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('loginForm');
    const message = document.getElementById('message');

    if (loginForm) {
        loginForm.addEventListener('submit', (e) => {
            e.preventDefault();

            const email = document.getElementById('username').value;
            const password = document.getElementById('password').value;

            signInWithEmailAndPassword(auth, email, password)
                .then((userCredential) => {
                    const user = userCredential.user;
                    const userEmail = user.email;
                    let redirectPath;

                    // Route Based on User Email
                    switch (userEmail) {
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
                            redirectPath = '../register/index.html';
                    }

                    window.location.href = redirectPath;
                })
                .catch((error) => {
                    message.textContent = error.message;
                    message.className = 'message error';
                });
        });
    }
});
