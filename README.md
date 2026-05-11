# Kech.go — Setup & Deployment Guide

## Folder Structure
```
kech-go/
├── index.html              ← Homepage
├── css/
│   ├── main.css            ← Main styles
│   └── admin.css           ← Admin styles
├── js/
│   ├── firebase-config.js  ← Firebase + Auth
│   └── tours-service.js    ← All data logic
├── pages/
│   ├── tours.html          ← Tours listing
│   └── tour-detail.html    ← Tour detail + booking
└── admin/
    ├── login.html          ← Admin login
    └── index.html          ← Admin dashboard
```

## Firebase Console — Required Steps

### 1. Authentication
- Go to: Authentication → Sign-in method
- Enable: ✅ Email/Password
- Enable: ✅ Google

### 2. Firestore Rules
Go to: Firestore Database → Rules → Paste:

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    function isAuth() { return request.auth != null; }
    function isAdmin() {
      return isAuth() && get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin';
    }
    function isOwner(uid) { return isAuth() && request.auth.uid == uid; }

    match /tours/{id} {
      allow read: if true;
      allow write: if isAdmin();
    }
    match /bookings/{id} {
      allow read: if isAdmin() || isOwner(resource.data.userId);
      allow create: if isAuth();
      allow update, delete: if isAdmin();
    }
    match /users/{userId} {
      allow read: if isOwner(userId) || isAdmin();
      allow create: if isAuth() && isOwner(userId);
      allow update: if isOwner(userId) || isAdmin();
      allow delete: if isAdmin();
    }
    match /reviews/{id} {
      allow read: if true;
      allow create: if isAuth();
      allow delete: if isAdmin();
    }
  }
}
```

## How to Run Locally

```bash
# Option 1: Python
python -m http.server 8080
# Then open: http://localhost:8080

# Option 2: VS Code Live Server
# Install Live Server extension → Right click index.html → Open with Live Server

# Option 3: Node.js
npx serve .
```

## Admin Access
1. Open: http://localhost:8080/admin/login.html
2. Sign in with: yahyakun87@gmail.com
3. You'll be automatically recognized as admin

## Deploy to Firebase Hosting
```bash
npm install -g firebase-tools
firebase login
firebase init hosting
# Public directory: . (current folder)
# Single page app: No
firebase deploy
```
