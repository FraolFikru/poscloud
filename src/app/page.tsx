"use client";

import { useTranslation } from "react-i18next";
import { useEffect, useState } from "react";
import { getStats, getOrders } from "@/lib/store";

export default function OwnerDashboard() {
  const { t } = useTranslation();
  const [stats, setStats] = useState({
    openTables: 0,
    activeOrders: 0,
    todaySales: 0,
    unpaid: 0,
  });
  const [recentOrders, setRecentOrders] = useState<any[]>([]);

  useEffect(() => {
    const update = () => {
      setStats(getStats());
      setRecentOrders(getOrders().slice(0, 8));
    };
    update();
    const interval = setInterval(update, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-zinc-50">
          {t("home.title")}
        </h1>
        <p className="mt-1 text-slate-600 dark:text-zinc-400">
          {t("home.subtitle")}
        </p>
      </div>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
          <p className="text-sm font-medium text-slate-500 dark:text-zinc-400">
            {t("home.stats.openTables")}
          </p>
          <p className="mt-1 text-3xl font-bold text-slate-900 dark:text-zinc-50">
            {stats.openTables}
          </p>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
          <p className="text-sm font-medium text-slate-500 dark:text-zinc-400">
            {t("home.stats.activeOrders")}
          </p>
          <p className="mt-1 text-3xl font-bold text-slate-900 dark:text-zinc-50">
            {stats.activeOrders}
          </p>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
          <p className="text-sm font-medium text-slate-500 dark:text-zinc-400">
            {t("home.stats.todaySales")}
          </p>
          <p className="mt-1 text-3xl font-bold text-emerald-600 dark:text-emerald-400">
            {stats.todaySales.toLocaleString()}{" "}
            <span className="text-base font-normal">{t("common.etb")}</span>
          </p>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
          <p className="text-sm font-medium text-slate-500 dark:text-zinc-400">
            {t("home.stats.unpaid")}
          </p>
          <p className="mt-1 text-3xl font-bold text-red-600 dark:text-red-400">
            {stats.unpaid.toLocaleString()}{" "}
            <span className="text-base font-normal">{t("common.etb")}</span>
          </p>
        </div>
      </div>

      {/* Recent Orders - View Only */}
      <div className="rounded-xl border border-slate-200 bg-white shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
        <div className="border-b border-slate-200 px-6 py-4 dark:border-zinc-800">
          <h2 className="text-lg font-semibold text-slate-900 dark:text-zinc-50">
            {t("orders.title")}
          </h2>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 text-slate-500 dark:bg-zinc-800/50 dark:text-zinc-400">
              <tr>
                <th className="px-6 py-3 font-medium">{t("orders.table")}</th>
                <th className="px-6 py-3 font-medium">{t("orders.items")}</th>
                <th className="px-6 py-3 font-medium">{t("orders.total")}</th>
                <th className="px-6 py-3 font-medium">{t("orders.status")}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-zinc-800">
              {recentOrders.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-6 py-8 text-center text-slate-500">
                    {t("orders.empty")}
                  </td>
                </tr>
              ) : (
                recentOrders.map((order) => (
                  <tr key={order.id} className="hover:bg-slate-50 dark:hover:bg-zinc-800/40">
                    <td className="px-6 py-4 font-medium text-slate-900 dark:text-zinc-100">
                      {t("orders.table")} {order.tableNumber}
                    </td>
                    <td className="px-6 py-4 text-slate-600 dark:text-zinc-400">
                      {order.items.length} {t("orders.items")}
                    </td>
                    <td className="px-6 py-4 font-medium">
                      {order.totalAmount.toLocaleString()} {t("common.etb")}
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ${
                          order.paymentStatus === "PAID"
                            ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-400"
                            : "bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-400"
                        }`}
                      >
                        {t(`orders.${order.paymentStatus.toLowerCase()}`)}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
