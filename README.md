
# Refrigeration and AC Branch Manager Dashboard

This is a web-based dashboard for managing 7-11 branches, including user creation, branch assignment, and real-time updates on equipment like AC and refrigerators. It uses **Firebase Authentication**, **Cloud Firestore**, and **Firebase Hosting**.

---

##  Features

- User authentication (login/logout)
- Role-based access (Head Office, Regional Manager, Branch Manager)
- Create new branches and assign users
- Region-based branch mapping
- Modular JavaScript and clean folder structure
- Firebase integration for hosting and real-time Firestore database
- GitHub Actions CI for Firebase Hosting deployment

---

## Getting Started

### Prerequisites

- Node.js and npm
- Firebase CLI (`npm install -g firebase-tools`)
- Firebase project with Authentication and Firestore enabled

### Clone the Repository

```bash
git clone https://github.com/klubadudel/ref-ac-manager-system.git
cd ref-ac-manager-system
```

### Install Dependencies

```bash
npm install
```

---

## Firebase Setup

1. Login to Firebase:

```bash
firebase login
```

2. Initialize Firebase (if not already):

```bash
firebase init
```

3. Set up `.firebaserc` with your project ID:

```json
{
  "projects": {
    "default": "your-firebase-project-id"
  }
}
```

4. Update `firebase.json` and `firestore.rules` as needed.

---

## Folder Structure

```
.github/                        → GitHub Actions CI/CD workflows for Firebase Hosting
public/                         → Static frontend files served by Firebase Hosting
│
├── assets/                    → CSS, JS, and images
│   ├── css/                   → Stylesheets (login and main UI)
│   ├── js/                    → JavaScript modules (auth, dashboard logic, Firebase config)
│   └── images/                → Logo and other assets
│
├── dashboards/                → Dashboard views for different roles
│   ├── head_office.html
│   ├── regional.html
│   └── branch.html
│
├── login/                     → Login screen
│   └── index.html
│
├── register/                  → Forms to create users and branches
│   ├── create_user.html
│   └── create_branch.html
│
.firebaserc                    → Firebase project ID configuration
firebase.json                  → Firebase Hosting configuration
firestore.rules                → Firestore security rules
package.json                   → Node dependencies
```

---

## Deployment

Deploy to Firebase Hosting:

```bash
firebase deploy
```

GitHub Actions will also automatically deploy on merge to `main`.

---

## Security Rules (Firestore)

Make sure your Firestore rules support authentication:

```js
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{userId} {
      allow read, write: if request.auth.uid == userId;
    }
    match /branches/{branchId} {
      allow read, write: if request.auth != null;
    }
  }
}
```

---

## Future Improvements

- Add device monitoring per branch (AC/refrigerators)
- Real-time dashboards with Firebase listeners
- Region filters or maps
- Role management UI

---

## License

This project is licensed under the MIT License.
