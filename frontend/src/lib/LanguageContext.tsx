"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { translations } from "./translations";
import { cn } from "./utils";

type Language = "id" | "en";

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string, variables?: Record<string, string | number>) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<Language>("id");
  const [isMounted, setIsMounted] = useState(false);

  // Sync state with localStorage once mounted on client side to avoid hydration mismatch
  useEffect(() => {
    const saved = localStorage.getItem("ews_lang") as Language;
    if (saved === "id" || saved === "en") {
      setLanguageState(saved);
    }
    setIsMounted(true);
  }, []);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    if (typeof window !== "undefined") {
      localStorage.setItem("ews_lang", lang);
      // Trigger a custom event to sync other contexts/components if necessary
      window.dispatchEvent(new Event("languageChanged"));
    }
  };

  const t = (key: string, variables?: Record<string, string | number>): string => {
    const langDict = translations[language] || translations.id;
    const parts = key.split(".");
    let current: any = langDict;

    for (const part of parts) {
      if (current == null) {
        // Fallback to Indonesian if key not found in English
        let idCurrent: any = translations.id;
        for (const idPart of parts) {
          if (idCurrent == null) return key;
          idCurrent = idCurrent[idPart];
        }
        current = idCurrent;
        break;
      }
      current = current[part];
    }

    if (typeof current !== "string") {
      return key;
    }

    let result = current;
    if (variables) {
      Object.entries(variables).forEach(([k, v]) => {
        result = result.replace(`{${k}}`, String(v));
      });
    }

    return result;
  };

  // If not mounted yet, render provider with default 'id' but hide potential flash
  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
}

interface LanguageToggleProps {
  className?: string;
  isHeroMode?: boolean;
}

export function LanguageToggle({ className, isHeroMode }: LanguageToggleProps) {
  const { language, setLanguage } = useLanguage();

  return (
    <div
      className={cn(
        "inline-flex rounded-full p-0.5 border transition-all duration-300 shadow-2xs",
        isHeroMode
          ? "bg-white/10 border-white/20 text-white"
          : "bg-slate-100 border-slate-200 text-slate-700",
        className
      )}
    >
      <button
        type="button"
        onClick={() => setLanguage("id")}
        className={cn(
          "rounded-full px-2.5 py-1 text-[11px] font-extrabold uppercase tracking-wide transition-all duration-200 cursor-pointer focus:outline-none",
          language === "id"
            ? isHeroMode
              ? "bg-white text-blue-900 shadow-xs"
              : "bg-white text-blue-700 shadow-xs"
            : isHeroMode
            ? "text-blue-100/90 hover:text-white"
            : "text-slate-500 hover:text-slate-800"
        )}
      >
        ID
      </button>
      <button
        type="button"
        onClick={() => setLanguage("en")}
        className={cn(
          "rounded-full px-2.5 py-1 text-[11px] font-extrabold uppercase tracking-wide transition-all duration-200 cursor-pointer focus:outline-none",
          language === "en"
            ? isHeroMode
              ? "bg-white text-blue-900 shadow-xs"
              : "bg-white text-blue-700 shadow-xs"
            : isHeroMode
            ? "text-blue-100/90 hover:text-white"
            : "text-slate-500 hover:text-slate-800"
        )}
      >
        EN
      </button>
    </div>
  );
}
