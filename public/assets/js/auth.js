import { getAuth, signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-auth.js";
import { getFirestore, doc, getDoc } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-firestore.js";

const auth = getAuth();
const db = getFirestore();

document.addEventListener('DOMContentLoaded', () => {
  const loginForm = document.getElementById('loginForm');
  
  loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    try {
      // Sign in the user with Firebase Authentication
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Fetch the user's data from Firestore (to get their role)
      const userDoc = await getDoc(doc(db, "users", user.uid));

      if (userDoc.exists()) {
        const userData = userDoc.data();
        const role = userData.role;

        // Redirect the user based on their role
        if (role === "head_office") {
          window.location.href = "../dashboards/head_office.html";  // Head office dashboard
        } else if (role === "branch") {
          window.location.href = "../dashboards/branch.html";  // Branch dashboard
        } else if (role === "regional") {
          window.location.href = "../dashboards/regional.html";  // Regional dashboard
        } else {
          alert("Unknown role");
        }
      } else {
        alert("User data not found.");
      }

    } catch (error) {
      console.error("Error signing in:", error);
      alert(error.message);  // Show an error message
    }
  });
});
