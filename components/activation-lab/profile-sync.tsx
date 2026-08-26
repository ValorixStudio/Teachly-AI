"use client";

import { useEffect } from "react";

const PROFILE_COOKIE = "teachly_ai_profile_data";
const STORAGE_KEY = "teachly-ai-user";

function getCookie(name: string): string | null {
  const match = document.cookie.match(new RegExp(`(?:^|; )${name}=([^;]*)`));
  return match ? decodeURIComponent(match[1]) : null;
}

function deleteCookie(name: string) {
  document.cookie = `${name}=; path=/; max-age=0`;
}

export function ProfileSync() {
  useEffect(() => {
    const raw = getCookie(PROFILE_COOKIE);
    if (!raw) return;

    try {
      window.localStorage.setItem(STORAGE_KEY, raw); // ← YE LINE STORE KARTI HAI
    } catch {
      // ignore
    } finally {
      deleteCookie(PROFILE_COOKIE);
    }
  }, []);

  return null;
}