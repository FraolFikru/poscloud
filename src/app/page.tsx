"use client";

import { useTranslation } from "react-i18next";

export default function HomePage() {
  const { t } = useTranslation();

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-zinc-50">
          {t("home.title")}
        </h1>
        <p className="mt-2 text-lg text-slate-600 dark:text-zinc-400">
          {t("home.subtitle")}
        </p>
      </div>

      <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
        <p className="text-slate-700 dark:text-zinc-300">
          {t("home.welcome")}
        </p>

        <ul className="mt-6 grid gap-3 sm:grid-cols-2">
          <li className="flex items-start gap-3 rounded-lg bg-slate-50 p-4 dark:bg-zinc-800/50">
            <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-sm text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-400">
              ✓
            </span>
            <span className="text-sm text-slate-700 dark:text-zinc-300">
              {t("home.features.offline")}
            </span>
          </li>
          <li className="flex items-start gap-3 rounded-lg bg-slate-50 p-4 dark:bg-zinc-800/50">
            <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-sm text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-400">
              ✓
            </span>
            <span className="text-sm text-slate-700 dark:text-zinc-300">
              {t("home.features.multiLang")}
            </span>
          </li>
          <li className="flex items-start gap-3 rounded-lg bg-slate-50 p-4 dark:bg-zinc-800/50">
            <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-sm text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-400">
              ✓
            </span>
            <span className="text-sm text-slate-700 dark:text-zinc-300">
              {t("home.features.darkMode")}
            </span>
          </li>
          <li className="flex items-start gap-3 rounded-lg bg-slate-50 p-4 dark:bg-zinc-800/50">
            <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-sm text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-400">
              ✓
            </span>
            <span className="text-sm text-slate-700 dark:text-zinc-300">
              {t("home.features.payments")}
            </span>
          </li>
        </ul>
      </div>

      <div className="rounded-xl border border-dashed border-slate-300 bg-slate-50 p-8 text-center dark:border-zinc-700 dark:bg-zinc-900/50">
        <p className="text-sm text-slate-500 dark:text-zinc-400">
          This is the starter dashboard. Next steps: Orders, Tables, Payments,
          Kitchen display, etc.
        </p>
      </div>
    </div>
  );
}
