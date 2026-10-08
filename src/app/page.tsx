"use client";

import { useTranslation } from "react-i18next";
import { useEffect, useState } from "react";
import Link from "next/link";
import { getStats } from "@/lib/store";

export default function HomePage() {
  const { t } = useTranslation();
  const [stats, setStats] = useState({ openTables: 0, activeOrders: 0, todaySales: 0, unpaid: 0 });

  useEffect(() => {
    setStats(getStats());
    const interval = setInterval(() => setStats(getStats()), 2000);
    return () => clearInterval(interval);
  }, []);

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

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
          <p className="text-sm font-medium text-slate-500 dark:text-zinc-400">{t("home.stats.openTables")}</p>
          <p className="mt-1 text-3xl font-bold text-slate-900 dark:text-zinc-50">{stats.openTables}</p>
        </div>
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
          <p className="text-sm font-medium text-slate-500 dark:text-zinc-400">{t("home.stats.activeOrders")}</p>
          <p className="mt-1 text-3xl font-bold text-slate-900 dark:text-zinc-50">{stats.activeOrders}</p>
        </div>
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
          <p className="text-sm font-medium text-slate-500 dark:text-zinc-400">{t("home.stats.todaySales")}</p>
          <p className="mt-1 text-3xl font-bold text-emerald-600 dark:text-emerald-400">
            {stats.todaySales.toLocaleString()} <span className="text-base font-normal">{t("common.etb")}</span>
          </p>
        </div>
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
          <p className="text-sm font-medium text-slate-500 dark:text-zinc-400">{t("home.stats.unpaid")}</p>
          <p className="mt-1 text-3xl font-bold text-red-600 dark:text-red-400">
            {stats.unpaid.toLocaleString()} <span className="text-base font-normal">{t("common.etb")}</span>
          </p>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <Link href="/tables" className="flex flex-col items-center justify-center rounded-xl border border-slate-200 bg-white p-8 text-center shadow-sm transition hover:border-emerald-300 hover:bg-emerald-50 dark:border-zinc-800 dark:bg-zinc-900 dark:hover:border-emerald-700 dark:hover:bg-emerald-950/30">
          <span className="text-4xl">🪑</span>
          <span className="mt-3 text-lg font-semibold text-slate-900 dark:text-zinc-100">{t("nav.tables")}</span>
        </Link>
        <Link href="/orders" className="flex flex-col items-center justify-center rounded-xl border border-slate-200 bg-white p-8 text-center shadow-sm transition hover:border-emerald-300 hover:bg-emerald-50 dark:border-zinc-800 dark:bg-zinc-900 dark:hover:border-emerald-700 dark:hover:bg-emerald-950/30">
          <span className="text-4xl">📋</span>
          <span className="mt-3 text-lg font-semibold text-slate-900 dark:text-zinc-100">{t("nav.orders")}</span>
        </Link>
        <Link href="/menu" className="flex flex-col items-center justify-center rounded-xl border border-slate-200 bg-white p-8 text-center shadow-sm transition hover:border-emerald-300 hover:bg-emerald-50 dark:border-zinc-800 dark:bg-zinc-900 dark:hover:border-emerald-700 dark:hover:bg-emerald-950/30">
          <span className="text-4xl">🍽️</span>
          <span className="mt-3 text-lg font-semibold text-slate-900 dark:text-zinc-100">{t("nav.menu")}</span>
        </Link>
      </div>
    </div>
  );
}
