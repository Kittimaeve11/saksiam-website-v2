'use client';

import React, {
  createContext,
  useState,
  useContext,
  ReactNode,
  useEffect
} from "react";

import en from "../locales/en.json";
import th from "../locales/th.json";

/* ====================================================== */
type Locale = "th" | "en";
type Messages = typeof en;

interface LocaleContextType {
  locale: Locale;
  messages: Messages;
  switchLocale: (newLocale: Locale) => void;
}

/* ====================================================== */
const LocaleContext = createContext<LocaleContextType | undefined>(undefined);

/* ====================================================== */
export function LocaleProvider({ children }: { children: ReactNode }) {

  // ✅ server + client ต้องเริ่มเหมือนกัน
  const [locale, setLocale] = useState<Locale>("th");

  // ✅ อัปเดตหลัง mount (ไม่ทำให้ hydration พัง)
  useEffect(() => {
    const saved = localStorage.getItem("locale") as Locale | null;
    if (saved && saved !== locale) {
      setLocale(saved);
    }
  }, []);

  const messages: Messages = locale === "en" ? en : th;

  const switchLocale = (newLocale: Locale) => {
    setLocale(newLocale);
    localStorage.setItem("locale", newLocale);
  };

  return (
    <LocaleContext.Provider value={{ locale, messages, switchLocale }}>
      {children}
    </LocaleContext.Provider>
  );
}

/* ====================================================== */
export function useLocale() {
  const context = useContext(LocaleContext);

  if (!context) {
    throw new Error("useLocale must be used inside LocaleProvider");
  }

  return context;
}