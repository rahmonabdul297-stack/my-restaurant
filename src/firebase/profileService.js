import { getApps, initializeApp } from "firebase/app";
import { doc, getDoc, getFirestore, setDoc } from "firebase/firestore";
import { loadSession, saveSession } from "../utils/authSession";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "demo-api-key",
  authDomain:
    import.meta.env.VITE_FIREBASE_AUTH_DOMAIN ||
    "restaurant-management-demo.firebaseapp.com",
  projectId:
    import.meta.env.VITE_FIREBASE_PROJECT_ID || "restaurant-management-demo",
  storageBucket:
    import.meta.env.VITE_FIREBASE_STORAGE_BUCKET ||
    "restaurant-management-demo.firebasestorage.app",
  messagingSenderId:
    import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "000000000000",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:000000000000:web:demo",
};

let firestoreInstance = null;
let isFirebaseReady = false;

const ensureFirebase = () => {
  if (typeof window === "undefined") return null;
  if (isFirebaseReady && firestoreInstance) return firestoreInstance;

  try {
    const app = getApps().length ? getApps()[0] : initializeApp(firebaseConfig);
    firestoreInstance = getFirestore(app);
    isFirebaseReady = true;
    return firestoreInstance;
  } catch (error) {
    console.warn("Firebase profile sync is unavailable right now.", error);
    return null;
  }
};

const normalizeProfile = (profile) => ({
  user_id: profile?.user_id || "",
  email: profile?.email || "",
  first_name: profile?.first_name || "",
  last_name: profile?.last_name || "",
  phone: profile?.phone || "",
  updated_at: profile?.updated_at || new Date().toISOString(),
});

const getProfileDocumentId = (profile) => {
  const fallbackId = profile?.user_id || profile?.email || "guest-profile";
  return fallbackId || "guest-profile";
};

export async function loadProfileFromFirebase(userId) {
  if (typeof window === "undefined") return loadSession();

  const session = loadSession();
  const fallbackId =
    userId || session?.user_id || session?.email || "guest-profile";

  if (!fallbackId) return session;

  const db = ensureFirebase();
  if (!db) return session;

  try {
    const snapshot = await getDoc(doc(db, "profiles", fallbackId));
    if (!snapshot.exists()) return session;

    const incoming = normalizeProfile({
      ...(session || {}),
      ...(snapshot.data() || {}),
      user_id: fallbackId,
    });

    saveSession(incoming);
    return incoming;
  } catch (error) {
    console.warn("Unable to fetch profile from Firebase.", error);
    return session;
  }
}

export async function saveProfileToFirebase(profile) {
  const normalized = normalizeProfile(profile);
  const docId = getProfileDocumentId(normalized);
  const db = ensureFirebase();

  saveSession(normalized);

  if (!db || !docId) return normalized;

  try {
    await setDoc(
      doc(db, "profiles", docId),
      { ...normalized, updated_at: new Date().toISOString() },
      { merge: true },
    );
    return normalized;
  } catch (error) {
    console.warn("Unable to save profile to Firebase.", error);
    return normalized;
  }
}
