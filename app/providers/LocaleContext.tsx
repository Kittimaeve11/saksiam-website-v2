"use client";

import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";

import en from "../locales/en.json";
import th from "../locales/th.json";

type Locale = "th" | "en";
type Messages = typeof en;

interface LocaleContextType {
  locale: Locale;
  messages: Messages;
  switchLocale: (newLocale: Locale) => void;
}

const LocaleContext = createContext<LocaleContextType | undefined>(undefined);

const isLocale = (value: unknown): value is Locale =>
  value === "th" || value === "en";

const saveLocale = (newLocale: Locale) => {
  localStorage.setItem("locale", newLocale);
  document.cookie = `locale=${newLocale}; path=/; max-age=31536000; samesite=lax`;
  document.documentElement.lang = newLocale;
};

export function LocaleProvider({
  children,
  initialLocale = "th",
}: {
  children: ReactNode;
  initialLocale?: Locale;
}) {
  const [locale, setLocale] = useState<Locale>(() => {
    if (typeof window === "undefined") return initialLocale;

    const saved = localStorage.getItem("locale");
    return isLocale(saved) ? saved : initialLocale;
  });

  useEffect(() => {
    saveLocale(locale);
  }, [locale]);

  const messages: Messages = locale === "en" ? en : th;

  const switchLocale = (newLocale: Locale) => {
    setLocale(newLocale);
    saveLocale(newLocale);
  };

  return (
    <LocaleContext.Provider value={{ locale, messages, switchLocale }}>
      {children}
    </LocaleContext.Provider>
  );
}

export function useLocale() {
  const context = useContext(LocaleContext);

  if (!context) {
    throw new Error("useLocale must be used inside LocaleProvider");
  }

  return context;
}
