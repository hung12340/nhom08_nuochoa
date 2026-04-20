"use client";

import { useEffect } from "react";
import { syncFirebaseAccount } from "@/lib/auth";

export default function AuthSessionSync() {
  useEffect(() => {
    const unsubscribe = syncFirebaseAccount();

    return unsubscribe;
  }, []);

  return null;
}