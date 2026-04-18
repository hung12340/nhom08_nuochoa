import { getApp, getApps, initializeApp } from "firebase/app";
import {
  GithubAuthProvider,
  GoogleAuthProvider,
  browserLocalPersistence,
  getAuth,
  setPersistence,
} from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyAJ9flyIh82rk4RfK0P6XjvSBB4piH3uHs",
  authDomain: "nh08-e053c.firebaseapp.com",
  projectId: "nh08-e053c",
  storageBucket: "nh08-e053c.firebasestorage.app",
  messagingSenderId: "500926440815",
  appId: "1:500926440815:web:40ecf0c1dbf5100658f49a",
  measurementId: "G-2Z237Y3DX2",
};

const firebaseApp = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);

export const auth = getAuth(firebaseApp);

auth.languageCode = "vi";

let persistencePromise: Promise<void> | null = null;

export function ensureAuthPersistence() {
  if (!persistencePromise) {
    persistencePromise = setPersistence(auth, browserLocalPersistence).then(() => undefined);
  }

  return persistencePromise;
}

export function createGoogleProvider() {
  const provider = new GoogleAuthProvider();

  provider.setCustomParameters({
    prompt: "select_account",
  });

  return provider;
}

export function createGitHubProvider() {
  const provider = new GithubAuthProvider();

  provider.addScope("read:user");
  provider.setCustomParameters({
    allow_signup: "true",
  });

  return provider;
}