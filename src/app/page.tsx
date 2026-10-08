"use client";

import { useTranslation } from "react-i18next";
import { useEffect, useState } from "react";
import { getStats, getOrders, MENU } from "@/lib/store";

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
      setRecentOrders(getOrders().slice(0, 10));
    };
    update();
    const interval = setInterval(update, 3000);
    return () => clearInterval(interval);
  }, []);

  // Fake 7-day sales for demo (later we will use real data)
  const weekSales = [4200, 5800, 3900, 7100, 6400, 8200, stats.todaySales || 5100];
  const maxSale = Math.max(...weekSales, 1);
  const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

  // Top items (demo)
  const topItems = [
    { name: "Doro Wat", sold: 48, revenue: 16800 },
    { name: "Kitfo", sold: 36, revenue: 11520 },
    { name: "Tibs", sold: 29, revenue: 8120 },
    { name: "Shiro", sold: 22, revenue: 3960 },
    { name: "Coffee Ceremony", sold: 18, revenue: 2160 },
  ];

  return (
    <div className="space-y-8">
      {/* Page Title */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-zinc-50">
          {t("home.title")}
        </h1>
        <p className="mt-1 text-slate-600 dark:text-zinc-400">
          Owner Executive Dashboard
        </p>
      </div>

      {/* Main Stats */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          label={t("home.stats.todaySales")}
          value={`${stats.todaySales.toLocaleString()} ${t("common.etb")}`}
          color="emerald"
        />
        <StatCard
          label={t("home.stats.activeOrders")}
          value={stats.activeOrders}
          color="blue"
        />
        <StatCard
          label={t("home.stats.openTables")}
          value={stats.openTables}
          color="amber"
        />
        <StatCard
          label={t("home.stats.unpaid")}
          value={`${stats.unpaid.toLocaleString()} ${t("common.etb")}`}
          color="red"
        />
      </div>

      {/* Charts + Top Items */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Sales Chart */}
        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900 lg:col-span-2">
          <h2 className="mb-6 text-lg font-semibold text-slate-900 dark:text-zinc-50">
            Sales - Last 7 Days
          </h2>
          <div className="flex h-48 items-end gap-3">
            {weekSales.map((sale, i) => (
              <div key={i} className="flex flex-1 flex-col items-center gap-2">
                <div
                  className="w-full rounded-t-md bg-emerald-500 transition-all dark:bg-emerald-600"
                  style={{ height: `${(sale / maxSale) * 100}%` }}
                />
                <span className="text-xs text-slate-500 dark:text-zinc-400">
                  {days[i]}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Top Selling Items */}
        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
          <h2 className="mb-4 text-lg font-semibold text-slate-900 dark:text-zinc-50">
            Top Selling Items
          </h2>
          <div className="space-y-4">
            {topItems.map((item, i) => (
              <div key={i} className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-slate-900 dark:text-zinc-100">
                    {item.name}
                  </p>
                  <p className="text-xs text-slate-500">{item.sold} sold</p>
                </div>
                <p className="font-semibold text-emerald-600 dark:text-emerald-400">
                  {item.revenue.toLocaleString()}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Transactions */}
      <div className="rounded-xl border border-slate-200 bg-white shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
        <div className="border-b border-slate-200 px-6 py-4 dark:border-zinc-800">
          <h2 className="text-lg font-semibold text-slate-900 dark:text-zinc-50">
            Recent Transactions
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
                <th className="px-6 py-3 font-medium">Channel</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-zinc-800">
              {recentOrders.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-10 text-center text-slate-500">
                    {t("orders.empty")}
                  </td>
                </tr>
              ) : (
                recentOrders.map((order) => (
                  <tr key={order.id} className="hover:bg-slate-50 dark:hover:bg-zinc-800/40">
                    <td className="px-6 py-4 font-medium">
                      Table {order.tableNumber}
                    </td>
                    <td className="px-6 py-4 text-slate-600 dark:text-zinc-400">
                      {order.items.length} items
                    </td>
                    <td className="px-6 py-4 font-medium">
                      {order.totalAmount.toLocaleString()} ETB
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ${
                          order.paymentStatus === "PAID"
                            ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-400"
                            : "bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-400"
                        }`}
                      >
                        {order.paymentStatus}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-slate-600 dark:text-zinc-400">
                      {order.paymentChannel || "—"}
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

// Small helper component
function StatCard({
  label,
  value,
  color,
}: {
  label: string;
  value: string | number;
  color: "emerald" | "blue" | "amber" | "red";
}) {
  const colors = {
    emerald: "text-emerald-600 dark:text-emerald-400",
    blue: "text-blue-600 dark:text-blue-400",
    amber: "text-amber-600 dark:text-amber-400",
    red: "text-red-600 dark:text-red-400",
  };

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
      <p className="text-sm font-medium text-slate-500 dark:text-zinc-400">{label}</p>
      <p className={`mt-1 text-2xl font-bold ${colors[color]}`}>{value}</p>
    </div>
  );
}
