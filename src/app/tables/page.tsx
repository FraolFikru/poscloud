"use client";

import { useTranslation } from "react-i18next";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getTables, startOrder, Table } from "@/lib/store";

export default function TablesPage() {
  const { t } = useTranslation();
  const router = useRouter();
  const [tables, setTables] = useState<Table[]>([]);

  useEffect(() => {
    setTables(getTables());
  }, []);

  const handleTableClick = (table: Table) => {
    const order = startOrder(table.number);
    setTables(getTables());
    router.push(`/orders?orderId=${order.id}`);
  };

  const statusColor = (status: string) => {
    if (status === "available") return "border-emerald-300 bg-emerald-50 text-emerald-800 dark:border-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300";
    if (status === "occupied") return "border-amber-300 bg-amber-50 text-amber-800 dark:border-amber-700 dark:bg-amber-950/40 dark:text-amber-300";
    return "border-slate-300 bg-slate-50 text-slate-600 dark:border-zinc-600 dark:bg-zinc-800 dark:text-zinc-300";
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-zinc-50">{t("tables.title")}</h1>
        <p className="mt-1 text-slate-600 dark:text-zinc-400">{t("tables.subtitle")}</p>
      </div>

      <div className="flex flex-wrap gap-4 text-sm">
        <span className="flex items-center gap-2">
          <span className="h-3 w-3 rounded-full bg-emerald-500" /> {t("tables.available")}
        </span>
        <span className="flex items-center gap-2">
          <span className="h-3 w-3 rounded-full bg-amber-500" /> {t("tables.occupied")}
        </span>
      </div>

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
        {tables.map((table) => (
          <button
            key={table.id}
            onClick={() => handleTableClick(table)}
            className={`flex flex-col items-center justify-center rounded-xl border-2 p-5 transition hover:scale-105 active:scale-95 ${statusColor(table.status)}`}
          >
            <span className="text-2xl font-bold">{table.number}</span>
            <span className="mt-1 text-xs opacity-80">{table.seats} {t("tables.guests")}</span>
            <span className="mt-2 text-xs font-medium capitalize">{t(`tables.${table.status}`)}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
