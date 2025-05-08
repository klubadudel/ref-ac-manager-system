import { getAuth, createUserWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-auth.js";
import { getFirestore, doc, setDoc, collection, getDocs } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-firestore.js";

const auth = getAuth();
const db = getFirestore();

document.addEventListener('DOMContentLoaded', () => {
  const createUserForm = document.getElementById('createUserForm');
  const roleSelect = document.getElementById('userRole');
  const permissionsGroup = document.getElementById('permissionsGroup');
  const branchGroup = document.getElementById('branchGroup');
  const regionGroup = document.getElementById('regionGroup');
  const userBranchSelect = document.getElementById('userBranch');
  const userRegionSelect = document.getElementById('userRegion');

  async function fetchBranches() {
    try {
      const snapshot = await getDocs(collection(db, "branches"));
      userBranchSelect.innerHTML = '<option value="">Select a Branch</option>';
      snapshot.forEach(doc => {
        const option = document.createElement("option");
        option.value = doc.id;
        option.textContent = doc.data().branchName;
        userBranchSelect.appendChild(option);
      });
    } catch (err) {
      console.error("Failed to load branches", err);
    }
  }

  function generateRegionOptions() {
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

    const regionSelect = document.getElementById("userRegion");

    userRegionSelect.innerHTML = '<option value="">Select a Region</option>';
    regions.forEach(region => {
      const option = document.createElement("option");
      option.value = region.name;
      option.textContent = region.label;
      userRegionSelect.appendChild(option);
    });
  }

  roleSelect.addEventListener('change', (e) => {
    const userRole = e.target.value;
    if (userRole === 'branch') {
      // alert('branch');
      permissionsGroup.style.display = "block";
      branchGroup.style.display = "block";
      regionGroup.style.display = "none";
    } else if (userRole === 'regional') {
      // alert('regional');
      permissionsGroup.style.display = "block";
      branchGroup.style.display = "none";
      regionGroup.style.display = "block";
    } else {
      // alert('HO');
      permissionsGroup.style.display = "block";
      branchGroup.style.display = "none";
      regionGroup.style.display = "none";
    }
  });

  createUserForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const fullName = document.getElementById('fullName').value;
    const email = document.getElementById('newUserEmail').value;
    const password = document.getElementById('newUserPassword').value;
    const role = roleSelect.value;
    const permissions = Array.from(document.querySelectorAll('#permissionsContainer input[type="checkbox"]'))
      .filter(checkbox => checkbox.checked)
      .map(checkbox => checkbox.value);

    const branchId = userBranchSelect.value || null;
    const region = userRegionSelect.value || null;

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      await setDoc(doc(db, "users", user.uid), {
        fullName,
        email,
        role,
        permissions,
        branchId,
        region,
        createdAt: new Date()
      });
      alert("User created successfully!");
      createUserForm.reset();
      window.location.href = "../dashboards/head_office.html";
    } catch (error) {
      console.error("Error creating user:", error);
      alert(error.message);
    }
  });

  fetchBranches();
  generateRegionOptions();
});
