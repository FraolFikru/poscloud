"use client";

import React, { useState, useRef, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useTheme } from "next-themes";
import Link from "next/link";
import { Sun, Moon, ChevronDown, Globe } from "lucide-react";

type LanguageCode = "en" | "am" | "om";

const LANGUAGES = [
  { code: "en" as LanguageCode, native: "English" },
  { code: "am" as LanguageCode, native: "አማርኛ" },
  { code: "om" as LanguageCode, native: "Afaan Oromoo" },
];

export default function Header() {
  const { t, i18n } = useTranslation();
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [langOpen, setLangOpen] = useState(false);
  const langRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

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

  const currentLang = LANGUAGES.find((l) => l.code === i18n.language) ?? LANGUAGES[0];

  if (!mounted) {
    return (
      <header className="sticky top-0 z-50 flex h-14 items-center justify-between border-b border-slate-200 bg-white px-4 dark:border-zinc-800 dark:bg-zinc-950">
        <div className="h-8 w-32 animate-pulse rounded bg-slate-200 dark:bg-zinc-800" />
        <div className="h-10 w-32 animate-pulse rounded bg-slate-200 dark:bg-zinc-800" />
      </header>
    );
  }

  return (
    <header className="sticky top-0 z-50 flex h-14 items-center justify-between border-b border-slate-200 bg-white/95 px-4 backdrop-blur dark:border-zinc-800 dark:bg-zinc-950/95">
      {/* Brand */}
      <Link href="/" className="flex items-center gap-2.5">
        <div className="flex h-8 w-8 items-center justify-center rounded-md bg-emerald-600 text-sm font-bold text-white">
          POS
        </div>
        <span className="text-sm font-semibold text-slate-900 dark:text-zinc-100">
          {t("header.appName")}
        </span>
        <span className="ml-2 hidden rounded-full bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-600 dark:bg-zinc-800 dark:text-zinc-400 sm:inline">
          Owner
        </span>
      </Link>

      {/* Right controls */}
      <div className="flex items-center gap-2">
        {/* Language */}
        <div className="relative" ref={langRef}>
          <button
            onClick={() => setLangOpen(!langOpen)}
            className="flex h-10 min-w-[7rem] items-center justify-between gap-2 rounded-md border border-slate-200 bg-slate-50 px-3 text-sm font-medium dark:border-zinc-700 dark:bg-zinc-900"
          >
            <span className="flex items-center gap-1.5">
              <Globe className="h-4 w-4 opacity-70" />
              {currentLang.native}
            </span>
            <ChevronDown className={`h-4 w-4 opacity-60 transition ${langOpen ? "rotate-180" : ""}`} />
          </button>

          {langOpen && (
            <ul className="absolute right-0 mt-1 w-44 rounded-md border border-slate-200 bg-white py-1 shadow-lg dark:border-zinc-700 dark:bg-zinc-900">
              {LANGUAGES.map((lang) => (
                <li key={lang.code}>
                  <button
                    onClick={() => changeLanguage(lang.code)}
                    className={`flex w-full items-center justify-between px-3 py-2.5 text-left text-sm ${
                      lang.code === currentLang.code
                        ? "bg-emerald-50 font-medium text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400"
                        : "hover:bg-slate-50 dark:hover:bg-zinc-800"
                    }`}
                  >
                    {lang.native}
                    {lang.code === currentLang.code && <span>✓</span>}
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Theme */}
        <button
          onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          className="flex h-10 w-10 items-center justify-center rounded-md border border-slate-200 bg-slate-50 dark:border-zinc-700 dark:bg-zinc-900"
        >
          {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
        </button>
      </div>
    </header>
  );
}
