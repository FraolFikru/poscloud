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
  const [orders, setOrders] = useState<any[]>([]);

  useEffect(() => {
    const update = () => {
      setStats(getStats());
      setOrders(getOrders());
    };
    update();
    const interval = setInterval(update, 3000);
    return () => clearInterval(interval);
  }, []);

  const paidOrders = orders.filter((o) => o.paymentStatus === "PAID");
  const avgTicket = paidOrders.length
    ? Math.round(paidOrders.reduce((s, o) => s + o.totalAmount, 0) / paidOrders.length)
    : 0;

  const weekData = [12500, 14200, 11800, 15600, 13900, 16800, stats.todaySales || 9800];
  const max = Math.max(...weekData);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-zinc-950">
      <div className="mx-auto max-w-7xl space-y-8 px-4 py-8">
        {/* Header */}
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white sm:text-3xl">
              Owner Dashboard
            </h1>
            <p className="text-sm text-slate-500 dark:text-zinc-400">
              Real-time overview of your restaurant
            </p>
          </div>
          <div className="text-sm text-slate-500 dark:text-zinc-400">
            Last updated: just now
          </div>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          <KPI
            title="Today's Revenue"
            value={`${stats.todaySales.toLocaleString()} ETB`}
            subtitle="All paid orders"
            accent="emerald"
          />
          <KPI
            title="Active Orders"
            value={stats.activeOrders}
            subtitle="Currently open"
            accent="blue"
          />
          <KPI
            title="Open Tables"
            value={stats.openTables}
            subtitle="Occupied right now"
            accent="amber"
          />
          <KPI
            title="Unpaid Amount"
            value={`${stats.unpaid.toLocaleString()} ETB`}
            subtitle="Needs attention"
            accent="red"
          />
        </div>

        {/* Second row */}
        <div className="grid gap-6 lg:grid-cols-3">
          {/* Sales Chart */}
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900 lg:col-span-2">
            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
                Revenue - Last 7 Days
              </h2>
              <span className="text-sm text-slate-500">ETB</span>
            </div>
            <div className="flex h-56 items-end gap-2 sm:gap-4">
              {weekData.map((value, i) => (
                <div key={i} className="flex flex-1 flex-col items-center gap-2">
                  <div className="relative w-full">
                    <div
                      className="w-full rounded-t-lg bg-emerald-500 dark:bg-emerald-600"
                      style={{ height: `${(value / max) * 180}px` }}
                    />
                  </div>
                  <span className="text-xs font-medium text-slate-500 dark:text-zinc-400">
                    {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"][i]}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Stats */}
          <div className="space-y-4">
            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
              <p className="text-sm text-slate-500 dark:text-zinc-400">Average Ticket</p>
              <p className="mt-1 text-2xl font-bold text-slate-900 dark:text-white">
                {avgTicket.toLocaleString()} ETB
              </p>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
              <p className="text-sm text-slate-500 dark:text-zinc-400">Paid Orders Today</p>
              <p className="mt-1 text-2xl font-bold text-slate-900 dark:text-white">
                {paidOrders.length}
              </p>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
              <p className="text-sm text-slate-500 dark:text-zinc-400">Payment Mix</p>
              <div className="mt-3 space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-slate-600 dark:text-zinc-400">Cash</span>
                  <span className="font-medium">42%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600 dark:text-zinc-400">ETHQR</span>
                  <span className="font-medium">38%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600 dark:text-zinc-400">USSD</span>
                  <span className="font-medium">20%</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Orders Table */}
        <div className="rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
          <div className="flex items-center justify-between border-b border-slate-200 px-6 py-4 dark:border-zinc-800">
            <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
              Recent Transactions
            </h2>
            <span className="text-sm text-slate-500">{orders.length} total</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50 text-xs uppercase text-slate-500 dark:bg-zinc-800/60 dark:text-zinc-400">
                <tr>
                  <th className="px-6 py-3 font-medium">Table</th>
                  <th className="px-6 py-3 font-medium">Items</th>
                  <th className="px-6 py-3 font-medium">Amount</th>
                  <th className="px-6 py-3 font-medium">Status</th>
                  <th className="px-6 py-3 font-medium">Channel</th>
                  <th className="px-6 py-3 font-medium">Time</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-zinc-800">
                {orders.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-12 text-center text-slate-500">
                      No transactions yet
                    </td>
                  </tr>
                ) : (
                  orders.slice(0, 12).map((order) => (
                    <tr key={order.id} className="hover:bg-slate-50 dark:hover:bg-zinc-800/40">
                      <td className="px-6 py-4 font-medium text-slate-900 dark:text-white">
                        Table {order.tableNumber}
                      </td>
                      <td className="px-6 py-4 text-slate-600 dark:text-zinc-400">
                        {order.items.length}
                      </td>
                      <td className="px-6 py-4 font-semibold">
                        {order.totalAmount.toLocaleString()} ETB
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${
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
                      <td className="px-6 py-4 text-slate-500 dark:text-zinc-500">
                        {new Date(order.createdAt).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

function KPI({
  title,
  value,
  subtitle,
  accent,
}: {
  title: string;
  value: string | number;
  subtitle: string;
  accent: "emerald" | "blue" | "amber" | "red";
}) {
  const colors = {
    emerald: "border-emerald-200 dark:border-emerald-900/50",
    blue: "border-blue-200 dark:border-blue-900/50",
    amber: "border-amber-200 dark:border-amber-900/50",
    red: "border-red-200 dark:border-red-900/50",
  };

  const text = {
    emerald: "text-emerald-600 dark:text-emerald-400",
    blue: "text-blue-600 dark:text-blue-400",
    amber: "text-amber-600 dark:text-amber-400",
    red: "text-red-600 dark:text-red-400",
  };

  return (
    <div className={`rounded-2xl border bg-white p-5 shadow-sm dark:bg-zinc-900 ${colors[accent]}`}>
      <p className="text-sm font-medium text-slate-500 dark:text-zinc-400">{title}</p>
      <p className={`mt-2 text-2xl font-bold ${text[accent]}`}>{value}</p>
      <p className="mt-1 text-xs text-slate-400 dark:text-zinc-500">{subtitle}</p>
    </div>
  );
}
