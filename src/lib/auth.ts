import { onAuthStateChanged, signInWithPopup, signOut, type User } from "firebase/auth";
import { createGitHubProvider, createGoogleProvider, auth, ensureAuthPersistence } from "@/lib/firebase";
import { normalizeUsername, seedAccounts, type SeedAccount } from "@/lib/mockAccounts";

export type AuthProvider = "credentials" | "google" | "github";
export type AccountSource = "seed" | "registered" | "social";

export type RegisteredAccount = {
  id: string;
  username: string;
  displayName: string;
  password: string;
  createdAt: string;
  avatarUrl: string | null;
  email: string | null;
};

export type CurrentAccount = {
  id: string;
  username: string;
  displayName: string;
  provider: AuthProvider;
  source: AccountSource;
  avatarUrl: string | null;
  email: string | null;
};

type CredentialsAccount = SeedAccount | RegisteredAccount;

const STORAGE_EVENT_NAME = "aromis-auth";

const LOCAL_STORAGE_KEYS = {
  currentAccount: "aromis_current_account_v2",
  registeredAccounts: "aromis_registered_accounts_v2",
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

function readStorage<T>(key: string, fallback: T) {
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

function removeStorage(key: string) {
  if (!isBrowser()) {
    return;
  }

  window.localStorage.removeItem(key);
  emitStorageChange();
}

function buildCredentialsSession(account: CredentialsAccount, source: Extract<AccountSource, "seed" | "registered">): CurrentAccount {
  return {
    id: account.id,
    username: account.username,
    displayName: account.displayName,
    provider: "credentials",
    source,
    avatarUrl: account.avatarUrl,
    email: account.email,
  };
}

function buildSocialSession(user: User, provider: Extract<AuthProvider, "google" | "github">): CurrentAccount {
  const displayName = user.displayName?.trim() || user.email?.split("@")[0] || provider;

  return {
    id: `social-${provider}-${user.uid}`,
    username: normalizeUsername(displayName),
    displayName,
    provider,
    source: "social",
    avatarUrl: user.photoURL,
    email: user.email,
  };
}

function persistCurrentAccount(account: CurrentAccount | null) {
  if (!account) {
    removeStorage(LOCAL_STORAGE_KEYS.currentAccount);
    return;
  }

  writeStorage(LOCAL_STORAGE_KEYS.currentAccount, account);
}

function createRegisteredAccountId() {
  if (typeof window !== "undefined" && window.crypto && "randomUUID" in window.crypto) {
    return `registered-${window.crypto.randomUUID()}`;
  }

  return `registered-${Date.now()}`;
}

export function subscribeToAuthStore(onStoreChange: () => void) {
  if (!isBrowser()) {
    return () => {};
  }

  window.addEventListener("storage", onStoreChange);
  window.addEventListener(STORAGE_EVENT_NAME, onStoreChange);

  return () => {
    window.removeEventListener("storage", onStoreChange);
    window.removeEventListener(STORAGE_EVENT_NAME, onStoreChange);
  };
}

export function getCurrentAccount() {
  return readStorage<CurrentAccount | null>(LOCAL_STORAGE_KEYS.currentAccount, null);
}

export function getRegisteredAccounts() {
  return readStorage<RegisteredAccount[]>(LOCAL_STORAGE_KEYS.registeredAccounts, []);
}

export function getAllCredentialAccounts() {
  return [...seedAccounts, ...getRegisteredAccounts()];
}

export function registerAccount(displayName: string, password: string) {
  const normalizedUsername = normalizeUsername(displayName);
  const trimmedDisplayName = displayName.trim();

  if (!trimmedDisplayName) {
    return {
      success: false as const,
      message: "Vui lòng nhập tên tài khoản.",
    };
  }

  const isDuplicate = getAllCredentialAccounts().some((account) => account.username === normalizedUsername);

  if (isDuplicate) {
    return {
      success: false as const,
      message: "Tên tài khoản này đã tồn tại.",
    };
  }

  const nextAccount: RegisteredAccount = {
    id: createRegisteredAccountId(),
    username: normalizedUsername,
    displayName: trimmedDisplayName,
    password,
    createdAt: new Date().toISOString(),
    avatarUrl: null,
    email: null,
  };

  writeStorage(LOCAL_STORAGE_KEYS.registeredAccounts, [...getRegisteredAccounts(), nextAccount]);

  return {
    success: true as const,
    account: nextAccount,
  };
}

export async function loginWithCredentials(username: string, password: string) {
  const normalizedUsername = normalizeUsername(username);
  const seedAccount = seedAccounts.find(
    (account) => account.username === normalizedUsername && account.password === password
  );
  const registeredAccount = getRegisteredAccounts().find(
    (account) => account.username === normalizedUsername && account.password === password
  );

  if (!seedAccount && !registeredAccount) {
    return {
      success: false as const,
      message: "Ten tai khoan hoac mat khau chua dung.",
    };
  }

  await signOut(auth).catch(() => undefined);

  const nextAccount = seedAccount
    ? buildCredentialsSession(seedAccount, "seed")
    : buildCredentialsSession(registeredAccount as RegisteredAccount, "registered");

  persistCurrentAccount(nextAccount);

  return {
    success: true as const,
    account: nextAccount,
  };
}

export async function signInWithGoogle() {
  await ensureAuthPersistence();

  const result = await signInWithPopup(auth, createGoogleProvider());
  const nextAccount = buildSocialSession(result.user, "google");

  persistCurrentAccount(nextAccount);

  return nextAccount;
}

export async function signInWithGitHub() {
  await ensureAuthPersistence();

  const result = await signInWithPopup(auth, createGitHubProvider());
  const nextAccount = buildSocialSession(result.user, "github");

  persistCurrentAccount(nextAccount);

  return nextAccount;
}

export async function logoutCurrentAccount() {
  await signOut(auth).catch(() => undefined);
  persistCurrentAccount(null);
}

export function syncFirebaseAccount() {
  if (!isBrowser()) {
    return () => {};
  }

  return onAuthStateChanged(auth, (user) => {
    if (!user) {
      const currentAccount = getCurrentAccount();

      if (currentAccount?.source === "social") {
        persistCurrentAccount(null);
      }

      return;
    }

    const providerId = user.providerData.find((entry) => entry.providerId !== "firebase")?.providerId;
    const provider = providerId === "github.com" ? "github" : "google";

    persistCurrentAccount(buildSocialSession(user, provider));
  });
}

export function getAuthErrorMessage(error: unknown, providerLabel?: string) {
  if (typeof error !== "object" || error === null || !("code" in error)) {
    return providerLabel
      ? `Không thể đăng nhập với ${providerLabel}. Vui lòng thử lại.`
      : "Không thể xử lý yêu cầu lúc này.";
  }

  const code = String(error.code);

  switch (code) {
    case "auth/popup-closed-by-user":
      return "Bạn đã đóng cửa sổ đăng nhập trước khi hoàn tất.";
    case "auth/popup-blocked":
      return "Trình duyệt đang chặn popup. Hãy cho phép popup rồi thử lại.";
    case "auth/unauthorized-domain":
      return "Domain hiện tại chưa được phép trong Firebase Authentication.";
    case "auth/account-exists-with-different-credential":
      return "Tài khoản này đã tồn tại với cách đăng nhập khác.";
    case "auth/network-request-failed":
      return "Không thể kết nối đến Firebase. Hãy kiểm tra mạng rồi thử lại.";
    default:
      return providerLabel
        ? `Không thể đăng nhập với ${providerLabel}. Vui lòng thử lại.`
        : "Không thể xử lý yêu cầu lúc này.";
  }
}