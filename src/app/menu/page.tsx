"use client";

import { useTranslation } from "react-i18next";
import { MENU } from "@/lib/store";

export default function MenuPage() {
  const { t } = useTranslation();
  const categories = Array.from(new Set(MENU.map((m) => m.category)));

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-zinc-50">
          {t("menu.title")}
        </h1>
        <p className="mt-1 text-slate-600 dark:text-zinc-400">{t("menu.subtitle")}</p>
      </div>

      {categories.map((cat) => (
        <div key={cat}>
          <h2 className="mb-3 text-lg font-semibold text-slate-800 dark:text-zinc-200">{cat}</h2>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {MENU.filter((m) => m.category === cat).map((item) => (
              <div
                key={item.id}
                className="flex items-center justify-between rounded-xl border border-slate-200 bg-white px-5 py-4 shadow-sm dark:border-zinc-800 dark:bg-zinc-900"
              >
                <div>
                  <p className="font-medium text-slate-900 dark:text-zinc-100">{item.name}</p>
                  <p className="text-sm text-slate-500 dark:text-zinc-400">{item.category}</p>
                </div>
                <p className="text-lg font-bold text-emerald-600 dark:text-emerald-400">
                  {item.price} <span className="text-sm font-normal">{t("common.etb")}</span>
                </p>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
