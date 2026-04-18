"use client";

import { useMemo, useSyncExternalStore } from "react";
import { getCurrentAccount, subscribeToAuthStore, type CurrentAccount } from "@/lib/auth";

export function useCurrentAccount() {
  const snapshot = useSyncExternalStore(
    subscribeToAuthStore,
    () => JSON.stringify(getCurrentAccount()),
    () => "null"
  );

  return useMemo(() => {
    if (snapshot === "null") {
      return null;
    }

    return JSON.parse(snapshot) as CurrentAccount;
  }, [snapshot]);
}