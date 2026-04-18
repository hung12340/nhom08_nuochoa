export type SocialProvider = "google" | "github";
export type AuthProvider = "credentials" | SocialProvider;

export type StoredUser = {
  email: string;
  password: string;
  createdAt: string;
  provider?: AuthProvider;
};

const socialAuthAccounts: Record<SocialProvider, { email: string; password: string }> = {
  google: {
    email: "google.member@aromis.local",
    password: "google-oauth",
  },
  github: {
    email: "github.member@aromis.local",
    password: "github-oauth",
  },
};

export const STORAGE_EVENT_NAME = "aromis-storage";

export const LOCAL_STORAGE_KEYS = {
  users: "aromis_users",
  rememberedEmail: "aromis_remembered_email",
  currentUser: "aromis_current_user",
} as const;

function isBrowser() {
  return typeof window !== "undefined";
}

function emitStorageChange() {
  if (!isBrowser()) {
    return;
  }

  window.dispatchEvent(new Event(STORAGE_EVENT_NAME));
}

function normalizeEmail(email: string) {
  return email.trim().toLowerCase();
}

function readStorage<T>(key: string, fallback: T): T {
  if (!isBrowser()) {
    return fallback;
  }

  try {
    const rawValue = window.localStorage.getItem(key);

    if (!rawValue) {
      return fallback;
    }

    return JSON.parse(rawValue) as T;
  } catch {
    return fallback;
  }
}

function writeStorage<T>(key: string, value: T) {
  if (!isBrowser()) {
    return;
  }

  window.localStorage.setItem(key, JSON.stringify(value));
  emitStorageChange();
}

export function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizeEmail(email));
}

export function getStoredUsers() {
  return readStorage<StoredUser[]>(LOCAL_STORAGE_KEYS.users, []);
}

export function registerStoredUser(email: string, password: string) {
  const normalizedEmail = normalizeEmail(email);
  const users = getStoredUsers();

  const isDuplicate = users.some((user) => user.email === normalizedEmail);

  if (isDuplicate) {
    return { success: false as const, message: "Email này đã được đăng ký." };
  }

  const nextUsers = [
    ...users,
    {
      email: normalizedEmail,
      password,
      createdAt: new Date().toISOString(),
      provider: "credentials",
    },
  ];

  writeStorage(LOCAL_STORAGE_KEYS.users, nextUsers);

  return { success: true as const };
}

export function authenticateStoredUser(email: string, password: string) {
  const normalizedEmail = normalizeEmail(email);
  const users = getStoredUsers();
  const matchedUser = users.find(
    (user) => user.email === normalizedEmail && user.password === password
  );

  if (!matchedUser) {
    return null;
  }

  return matchedUser;
}

export function signInWithSocialProvider(provider: SocialProvider) {
  const account = socialAuthAccounts[provider];
  const users = getStoredUsers();
  const existingUser = users.find((user) => user.email === account.email);

  if (!existingUser) {
    writeStorage(LOCAL_STORAGE_KEYS.users, [
      ...users,
      {
        email: account.email,
        password: account.password,
        createdAt: new Date().toISOString(),
        provider,
      },
    ]);
  }

  setCurrentUserEmail(account.email);

  return account.email;
}

export function setRememberedEmail(email: string | null) {
  if (!isBrowser()) {
    return;
  }

  if (!email) {
    window.localStorage.removeItem(LOCAL_STORAGE_KEYS.rememberedEmail);
    emitStorageChange();
    return;
  }

  window.localStorage.setItem(LOCAL_STORAGE_KEYS.rememberedEmail, normalizeEmail(email));
  emitStorageChange();
}

export function getRememberedEmail() {
  if (!isBrowser()) {
    return "";
  }

  return window.localStorage.getItem(LOCAL_STORAGE_KEYS.rememberedEmail) ?? "";
}

export function setCurrentUserEmail(email: string) {
  if (!isBrowser()) {
    return;
  }

  window.localStorage.setItem(LOCAL_STORAGE_KEYS.currentUser, normalizeEmail(email));
  emitStorageChange();
}

export function getCurrentUserEmail() {
  if (!isBrowser()) {
    return "";
  }

  return window.localStorage.getItem(LOCAL_STORAGE_KEYS.currentUser) ?? "";
}

export function clearCurrentUserEmail() {
  if (!isBrowser()) {
    return;
  }

  window.localStorage.removeItem(LOCAL_STORAGE_KEYS.currentUser);
  emitStorageChange();
}
