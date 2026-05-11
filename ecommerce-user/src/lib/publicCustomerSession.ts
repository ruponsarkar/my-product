"use client";

import { ClientProfile } from "@/types/product";

const STORAGE_KEY = "public-customer-session";

export interface PublicCustomerSession {
  token: string;
  client: ClientProfile;
}

export const loadPublicCustomerSession = (): PublicCustomerSession | null => {
  if (typeof window === "undefined") return null;

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;

    const parsed = JSON.parse(raw);
    if (!parsed?.token) return null;

    return parsed;
  } catch {
    return null;
  }
};

export const savePublicCustomerSession = (session: PublicCustomerSession) => {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(session));
};

export const clearPublicCustomerSession = () => {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(STORAGE_KEY);
};
