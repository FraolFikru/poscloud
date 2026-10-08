"use client";

import React, { useState, useRef, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useTheme } from "next-themes";
import { Sun, Moon, ChevronDown, Globe } from "lucide-react";

type LanguageCode = "en" | "am" | "om";

interface LanguageOption {
  code: LanguageCode;
  native: string;
}

const LANGUAGES: LanguageOption[] = [
  { code: "en", native: "English" },
  { code: "am", native: "አማርኛ" },
  { code: "om", native: "Afaan Oromoo" },
];

export default function Header() {
  const { t, i18n } = useTranslation();
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [langOpen, setLangOpen] = useState(false);
  const langRef = useRef<HTMLDivElement>(null);

  // Avoid hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);

  // Close language dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (langRef.current && !langRef.current.contains(e.target as Node)) {
        setLangOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const changeLanguage = (code: LanguageCode) => {
    i18n.changeLanguage(code);
    localStorage.setItem("pos-lang", code);
    setLangOpen(false);
  };

  const currentLang =
    LANGUAGES.find((l) => l.code === i18n.language) ?? LANGUAGES[0];

  if (!mounted) {
    return (
      <header className="sticky top-0 z-50 flex h-14 items-center justify-between border-b border-slate-200 bg-white px-4 dark:border-zinc-800 dark:bg-zinc-950">
        <div className="h-8 w-24 animate-pulse rounded bg-slate-200 dark:bg-zinc-800" />
        <div className="flex gap-2">
          <div className="h-10 w-28 animate-pulse rounded bg-slate-200 dark:bg-zinc-800" />
          <div className="h-10 w-10 animate-pulse rounded bg-slate-200 dark:bg-zinc-800" />
        </div>
      </header>
    );
  }

  return (
    <header
      className="
        sticky top-0 z-50
        flex h-14 items-center justify-between
        border-b border-slate-200 bg-white/95 px-4
        backdrop-blur supports-[backdrop-filter]:bg-white/80
        dark:border-zinc-800 dark:bg-zinc-950/95
        dark:supports-[backdrop-filter]:bg-zinc-950/80
      "
    >
      {/* Left – Brand */}
      <div className="flex items-center gap-3">
        <div className="flex h-8 w-8 items-center justify-center rounded-md bg-emerald-600 text-sm font-bold text-white">
          POS
        </div>
        <span className="hidden text-sm font-semibold tracking-tight text-slate-900 dark:text-zinc-100 sm:inline">
          {t("header.appName")}
        </span>
      </div>

      {/* Right – Controls */}
      <div className="flex items-center gap-2">
        {/* Language Selector */}
        <div className="relative" ref={langRef}>
          <button
            type="button"
            onClick={() => setLangOpen((o) => !o)}
            aria-haspopup="listbox"
            aria-expanded={langOpen}
            aria-label={t("header.language")}
            className="
              flex h-10 min-w-[7.5rem] items-center justify-between gap-2
              rounded-md border border-slate-200 bg-slate-50 px-3
              text-sm font-medium text-slate-800
              transition-colors hover:bg-slate-100
              focus:outline-none focus:ring-2 focus:ring-emerald-500/40
              dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100
              dark:hover:bg-zinc-800
            "
          >
            <span className="flex items-center gap-1.5">
              <Globe className="h-4 w-4 shrink-0 opacity-70" />
              <span className="truncate">{currentLang.native}</span>
            </span>
            <ChevronDown
              className={`h-4 w-4 shrink-0 opacity-60 transition-transform ${
                langOpen ? "rotate-180" : ""
              }`}
            />
          </button>

          {langOpen && (
            <ul
              role="listbox"
              className="
                absolute right-0 mt-1 w-44 overflow-hidden rounded-md
                border border-slate-200 bg-white py-1 shadow-lg
                dark:border-zinc-700 dark:bg-zinc-900
              "
            >
              {LANGUAGES.map((lang) => (
                <li key={lang.code}>
                  <button
                    type="button"
                    role="option"
                    aria-selected={lang.code === currentLang.code}
                    onClick={() => changeLanguage(lang.code)}
                    className={`
                      flex w-full items-center justify-between px-3 py-2.5 text-left text-sm
                      transition-colors
                      ${
                        lang.code === currentLang.code
                          ? "bg-emerald-50 font-medium text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400"
                          : "text-slate-700 hover:bg-slate-50 dark:text-zinc-200 dark:hover:bg-zinc-800"
                      }
                    `}
                  >
                    <span>{lang.native}</span>
                    {lang.code === currentLang.code && (
                      <span className="text-xs text-emerald-600 dark:text-emerald-400">
                        ✓
                      </span>
                    )}
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Theme Toggle */}
        <button
          type="button"
          onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          aria-label={
            theme === "light"
              ? t("header.switchToDark")
              : t("header.switchToLight")
          }
          className="
            flex h-10 w-10 items-center justify-center rounded-md
            border border-slate-200 bg-slate-50 text-slate-700
            transition-colors hover:bg-slate-100
            focus:outline-none focus:ring-2 focus:ring-emerald-500/40
            dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-200
            dark:hover:bg-zinc-800
          "
        >
          {theme === "dark" ? (
            <Sun className="h-4 w-4" />
          ) : (
            <Moon className="h-4 w-4" />
          )}
        </button>
      </div>
    </header>
  );
}
