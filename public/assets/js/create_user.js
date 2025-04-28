import { getAuth, createUserWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-auth.js";
import { getFirestore, doc, setDoc, collection, getDocs } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-firestore.js";

// Firebase services
const auth = getAuth();
const db = getFirestore();

document.addEventListener('DOMContentLoaded', function() {
  const createUserForm = document.getElementById('createUserForm');
  const roleSelect = document.getElementById('userRole');
  const permissionsGroup = document.getElementById('permissionsGroup');
  const branchGroup = document.getElementById('branchGroup');
  const userBranchSelect = document.getElementById('userBranch');
  
  // Fetch all branches to populate the branch select
  async function fetchBranches() {
    try {
        const branchesSnapshot = await getDocs(collection(db, "branches"));
        const branches = branchesSnapshot.docs.map(doc => doc.data());
        
        // Clear the existing options first (in case of repeated fetches)
        userBranchSelect.innerHTML = '';
        
        // Add a default "Select a Branch" option
        const defaultOption = document.createElement("option");
        defaultOption.value = '';
        defaultOption.textContent = 'Select a Branch';
        userBranchSelect.appendChild(defaultOption);
        
        // Populate the dropdown with branches
        branches.forEach(branch => {
            const option = document.createElement("option");
            option.value = branch.id;  // Use branch id or name (depending on your collection structure)
            option.textContent = branch.name; // Assuming the branch object has a 'name' field
            userBranchSelect.appendChild(option);
        });
    } catch (error) {
        console.error("Error fetching branches:", error);
    }
}

  
  
  // Show/hide permissions and branch based on user role
  roleSelect.addEventListener('change', (e) => {
    const role = e.target.value;
    if (role === 'branch' || role === 'regional') {
      permissionsGroup.style.display = "block";
      branchGroup.style.display = "block";
      // Set default permission for branch and regional managers
      document.getElementById('permissions').value = 'view'; // default permission for these roles
    } else {
      permissionsGroup.style.display = "none";
      branchGroup.style.display = "none";
    }
  });

  // Handle form submission to create user
  createUserForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const fullName = document.getElementById('fullName').value;
    const email = document.getElementById('newUserEmail').value;
    const password = document.getElementById('newUserPassword').value;
    const role = document.getElementById('userRole').value;
    const permissions = document.getElementById('permissions').value;
    const branchId = document.getElementById('userBranch') ? document.getElementById('userBranch').value : null;

    try {
      // Create user in Firebase Authentication
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user; // Get the created user

      // Create Firestore document in "users" collection with role-based data
      await setDoc(doc(db, "users", user.uid), {
        fullName: fullName,
        email: email,
        role: role,
        permissions: permissions,
        branchId: branchId,  // Store branchId as a reference
        createdAt: new Date()
      });

      alert("User created successfully!");
      createUserForm.reset();

    } catch (error) {
      console.error("Error creating user:", error);
      alert(error.message);  // Display error message to the user
    }
  });

  // Fetch branches for the dropdown
  fetchBranches();
});
