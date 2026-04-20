import { getApp, getApps, initializeApp } from "firebase/app";
import {
  GithubAuthProvider,
  GoogleAuthProvider,
  browserLocalPersistence,
  getAuth,
  setPersistence,
} from "firebase/auth";

type FirebaseEnvKey =
  | "NEXT_PUBLIC_FIREBASE_API_KEY"
  | "NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN"
  | "NEXT_PUBLIC_FIREBASE_PROJECT_ID"
  | "NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET"
  | "NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID"
  | "NEXT_PUBLIC_FIREBASE_APP_ID"
  | "NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID";

const firebaseEnv = {
  NEXT_PUBLIC_FIREBASE_API_KEY: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  NEXT_PUBLIC_FIREBASE_PROJECT_ID: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  NEXT_PUBLIC_FIREBASE_APP_ID: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
} satisfies Record<FirebaseEnvKey, string | undefined>;

function readFirebaseEnv(key: FirebaseEnvKey) {
  const value = firebaseEnv[key];

  if (!value) {
    throw new Error(`Missing Firebase environment variable: ${key}`);
  }

  return value;
}

const firebaseConfig = {
  apiKey: readFirebaseEnv("NEXT_PUBLIC_FIREBASE_API_KEY"),
  authDomain: readFirebaseEnv("NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN"),
  projectId: readFirebaseEnv("NEXT_PUBLIC_FIREBASE_PROJECT_ID"),
  storageBucket: readFirebaseEnv("NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET"),
  messagingSenderId: readFirebaseEnv("NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID"),
  appId: readFirebaseEnv("NEXT_PUBLIC_FIREBASE_APP_ID"),
  measurementId: readFirebaseEnv("NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID"),
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