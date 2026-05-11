// ============================================================
// KECH.GO — Firebase Configuration & Auth
// ============================================================

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getAuth, GoogleAuthProvider, signInWithPopup, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, onAuthStateChanged, updateProfile } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import { getFirestore, doc, setDoc, getDoc, serverTimestamp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyB2zvwR4-BQndNS1BhlGBB26jh7vHelK-M",
  authDomain: "fai-net.firebaseapp.com",
  projectId: "fai-net",
  storageBucket: "fai-net.firebasestorage.app",
  messagingSenderId: "735555032841",
  appId: "1:735555032841:web:41eb374e6b207d7b4da5d8",
  measurementId: "G-S81Y1MQCVC"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const googleProvider = new GoogleAuthProvider();

// ── Admin Email ──
export const ADMIN_EMAIL = "yahyakun87@gmail.com";

// ── Check if user is admin ──
export async function isAdmin(user) {
  if (!user) return false;
  try {
    const userDoc = await getDoc(doc(db, "users", user.uid));
    if (userDoc.exists()) return userDoc.data().role === "admin";
    return user.email === ADMIN_EMAIL;
  } catch { return false; }
}

// ── Create/update user profile in Firestore ──
export async function upsertUserProfile(user, extraData = {}) {
  const userRef = doc(db, "users", user.uid);
  const snap = await getDoc(userRef);
  const isAdminUser = user.email === ADMIN_EMAIL;
  if (!snap.exists()) {
    await setDoc(userRef, {
      uid: user.uid,
      name: user.displayName || extraData.name || "User",
      email: user.email,
      photoURL: user.photoURL || "",
      role: isAdminUser ? "admin" : "user",
      wishlist: [],
      createdAt: serverTimestamp(),
      ...extraData
    });
  } else if (isAdminUser && snap.data().role !== "admin") {
    await setDoc(userRef, { role: "admin" }, { merge: true });
  }
  return (await getDoc(userRef)).data();
}

// ── Auth Functions ──
export async function signUpWithEmail(name, email, password) {
  const cred = await createUserWithEmailAndPassword(auth, email, password);
  await updateProfile(cred.user, { displayName: name });
  await upsertUserProfile(cred.user, { name });
  return cred.user;
}

export async function loginWithEmail(email, password) {
  const cred = await signInWithEmailAndPassword(auth, email, password);
  await upsertUserProfile(cred.user);
  return cred.user;
}

export async function loginWithGoogle() {
  const result = await signInWithPopup(auth, googleProvider);
  await upsertUserProfile(result.user);
  return result.user;
}

export async function logout() {
  await signOut(auth);
}

export { onAuthStateChanged };
