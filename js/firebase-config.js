import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getAuth, GoogleAuthProvider, signInWithRedirect, getRedirectResult, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, onAuthStateChanged, updateProfile } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
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
export const ADMIN_EMAIL = "yahyakun87@gmail.com";

export async function isAdmin(user) {
  if (!user) return false;
  if (user.email === ADMIN_EMAIL) return true;
  try {
    const snap = await getDoc(doc(db, "users", user.uid));
    return snap.exists() && snap.data().role === "admin";
  } catch { return false; }
}

export async function upsertUserProfile(user, extraData = {}) {
  try {
    const userRef = doc(db, "users", user.uid);
    const snap = await getDoc(userRef);
    if (!snap.exists()) {
      await setDoc(userRef, {
        uid: user.uid,
        name: user.displayName || extraData.name || "User",
        email: user.email,
        photoURL: user.photoURL || "",
        role: user.email === ADMIN_EMAIL ? "admin" : "user",
        wishlist: [],
        createdAt: serverTimestamp()
      });
    }
  } catch(e) { console.warn("upsertUserProfile failed:", e.message); }
}

export async function signUpWithEmail(name, email, password) {
  const cred = await createUserWithEmailAndPassword(auth, email, password);
  await updateProfile(cred.user, { displayName: name });
  // Save to Firestore immediately
  const userRef = doc(db, "users", cred.user.uid);
  await setDoc(userRef, {
    uid: cred.user.uid,
    name: name,
    email: email,
    photoURL: "",
    role: email === ADMIN_EMAIL ? "admin" : "user",
    wishlist: [],
    createdAt: serverTimestamp()
  });
  return cred.user;
}

export async function loginWithEmail(email, password) {
  const cred = await signInWithEmailAndPassword(auth, email, password);
  await upsertUserProfile(cred.user);
  return cred.user;
}

export async function loginWithGoogle() {
  await signInWithRedirect(auth, googleProvider);
}

export async function handleGoogleRedirect() {
  try {
    const result = await getRedirectResult(auth);
    if (result && result.user) {
      await upsertUserProfile(result.user);
      return result.user;
    }
    return null;
  } catch(e) { console.error("Redirect error:", e); return null; }
}

export async function logout() { await signOut(auth); }
export { onAuthStateChanged };
