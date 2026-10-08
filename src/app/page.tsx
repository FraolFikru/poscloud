"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

const BRANCHES = [
  { id: "all", name: "All Branches" },
  { id: "bole", name: "Bole Branch" },
  { id: "kazanchis", name: "Kazanchis Branch" },
  { id: "piassa", name: "Piassa Branch" },
];

export default function OwnerDashboard() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [selectedBranch, setSelectedBranch] = useState("all");
  const [view, setView] = useState<"today" | "live">("today");

  // Check login
  useEffect(() => {
    const isLoggedIn = localStorage.getItem("owner-logged-in");
    if (!isLoggedIn) {
      router.push("/login");
    } else {
      setLoading(false);
    }
  }, [router]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50 dark:bg-zinc-950">
        <p className="text-slate-500">Loading...</p>
      </div>
    );
  }

  // Demo data per branch
  const branchData: Record<string, any> = {
    all: {
      revenue: 41400,
      orders: 97,
      tables: 11,
      unpaid: 6800,
      avgTicket: 427,
      topItems: [
        { name: "Doro Wat", sold: 89, revenue: 31150 },
        { name: "Kitfo", sold: 67, revenue: 21440 },
        { name: "Tibs", sold: 54, revenue: 15120 },
        { name: "Shiro", sold: 41, revenue: 7380 },
        { name: "Coffee Ceremony", sold: 38, revenue: 4560 },
      ],
    },
    bole: {
      revenue: 18400,
      orders: 42,
      tables: 5,
      unpaid: 2900,
      avgTicket: 438,
      topItems: [
        { name: "Doro Wat", sold: 41, revenue: 14350 },
        { name: "Kitfo", sold: 29, revenue: 9280 },
        { name: "Tibs", sold: 22, revenue: 6160 },
        { name: "Shiro", sold: 18, revenue: 3240 },
        { name: "Coffee Ceremony", sold: 15, revenue: 1800 },
      ],
    },
    kazanchis: {
      revenue: 13200,
      orders: 31,
      tables: 4,
      unpaid: 2100,
      avgTicket: 426,
      topItems: [
        { name: "Doro Wat", sold: 28, revenue: 9800 },
        { name: "Kitfo", sold: 22, revenue: 7040 },
        { name: "Tibs", sold: 19, revenue: 5320 },
        { name: "Shiro", sold: 14, revenue: 2520 },
        { name: "Coffee Ceremony", sold: 13, revenue: 1560 },
      ],
    },
    piassa: {
      revenue: 9800,
      orders: 24,
      tables: 2,
      unpaid: 1800,
      avgTicket: 408,
      topItems: [
        { name: "Doro Wat", sold: 20, revenue: 7000 },
        { name: "Kitfo", sold: 16, revenue: 5120 },
        { name: "Tibs", sold: 13, revenue: 3640 },
        { name: "Shiro", sold: 9, revenue: 1620 },
        { name: "Coffee Ceremony", sold: 10, revenue: 1200 },
      ],
    },
  };

  const data = branchData[selectedBranch];

  const handleLogout = () => {
    localStorage.removeItem("owner-logged-in");
    router.push("/login");
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-zinc-950">
      <div className="mx-auto max-w-7xl space-y-6 px-4 py-6">

        {/* Top Bar */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
              Good evening, Owner
            </h1>
            <p className="text-sm text-slate-500 dark:text-zinc-400">
              {selectedBranch === "all" ? "All Branches Overview" : BRANCHES.find(b => b.id === selectedBranch)?.name}
            </p>
          </div>

          <div className="flex items-center gap-3">
            {/* View Switch */}
            <div className="flex rounded-lg border border-slate-200 bg-white p-1 dark:border-zinc-700 dark:bg-zinc-900">
              <button
                onClick={() => setView("today")}
                className={`rounded-md px-3 py-1.5 text-sm font-medium transition ${
                  view === "today"
                    ? "bg-emerald-600 text-white"
                    : "text-slate-600 hover:bg-slate-100 dark:text-zinc-300 dark:hover:bg-zinc-800"
                }`}
              >
                Today
              </button>
              <button
                onClick={() => setView("live")}
                className={`rounded-md px-3 py-1.5 text-sm font-medium transition ${
                  view === "live"
                    ? "bg-emerald-600 text-white"
                    : "text-slate-600 hover:bg-slate-100 dark:text-zinc-300 dark:hover:bg-zinc-800"
                }`}
              >
                Live
              </button>
            </div>

            <button
              onClick={handleLogout}
              className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-sm text-slate-600 hover:bg-slate-50 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-300"
            >
              Logout
            </button>
          </div>
        </div>

        {/* Branch Switcher */}
        <div className="flex flex-wrap gap-2">
          {BRANCHES.map((branch) => (
            <button
              key={branch.id}
              onClick={() => setSelectedBranch(branch.id)}
              className={`rounded-full px-4 py-1.5 text-sm font-medium transition ${
                selectedBranch === branch.id
                  ? "bg-emerald-600 text-white"
                  : "bg-white text-slate-600 hover:bg-slate-100 dark:bg-zinc-900 dark:text-zinc-300 dark:hover:bg-zinc-800"
              }`}
            >
              {branch.name}
            </button>
          ))}
        </div>

        {/* TODAY VIEW */}
        {view === "today" && (
          <>
            {/* Big Revenue Card */}
            <div className="rounded-2xl border border-emerald-200 bg-gradient-to-br from-emerald-50 to-white p-6 dark:border-emerald-900/50 dark:from-emerald-950/40 dark:to-zinc-900">
              <p className="text-sm font-medium text-emerald-700 dark:text-emerald-400">
                Today&apos;s Total Revenue
              </p>
              <p className="mt-2 text-4xl font-bold tracking-tight text-emerald-700 dark:text-emerald-400 sm:text-5xl">
                {data.revenue.toLocaleString()} ETB
              </p>
              <p className="mt-2 text-sm text-slate-500 dark:text-zinc-400">
                {data.orders} orders • Avg ticket {data.avgTicket} ETB
              </p>
            </div>

            {/* Small Stats */}
            <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
              <StatCard label="Active Orders" value={data.orders} />
              <StatCard label="Open Tables" value={data.tables} />
              <StatCard label="Unpaid" value={`${data.unpaid.toLocaleString()} ETB`} danger />
              <StatCard label="Avg Ticket" value={`${data.avgTicket} ETB`} />
            </div>

            {/* Top Selling + Branch Comparison */}
            <div className="grid gap-6 lg:grid-cols-2">
              {/* Top Items */}
              <div className="rounded-2xl border border-slate-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900">
                <h2 className="mb-4 text-lg font-semibold text-slate-900 dark:text-white">
                  Top Selling Items Today
                </h2>
                <div className="space-y-4">
                  {data.topItems.map((item: any, i: number) => (
                    <div key={i} className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <span className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-100 text-sm font-medium dark:bg-zinc-800">
                          {i + 1}
                        </span>
                        <div>
                          <p className="font-medium text-slate-900 dark:text-white">{item.name}</p>
                          <p className="text-xs text-slate-500">{item.sold} sold</p>
                        </div>
                      </div>
                      <p className="font-semibold text-emerald-600 dark:text-emerald-400">
                        {item.revenue.toLocaleString()} ETB
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Branch Comparison (only on All) */}
              {selectedBranch === "all" ? (
                <div className="rounded-2xl border border-slate-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900">
                  <h2 className="mb-4 text-lg font-semibold text-slate-900 dark:text-white">
                    Branch Performance
                  </h2>
                  <div className="space-y-4">
                    {[
                      { name: "Bole Branch", revenue: 18400, percent: 44 },
                      { name: "Kazanchis Branch", revenue: 13200, percent: 32 },
                      { name: "Piassa Branch", revenue: 9800, percent: 24 },
                    ].map((b) => (
                      <div key={b.name}>
                        <div className="mb-1 flex justify-between text-sm">
                          <span className="font-medium text-slate-900 dark:text-white">{b.name}</span>
                          <span className="text-slate-600 dark:text-zinc-400">{b.revenue.toLocaleString()} ETB</span>
                        </div>
                        <div className="h-2 overflow-hidden rounded-full bg-slate-100 dark:bg-zinc-800">
                          <div
                            className="h-full rounded-full bg-emerald-500"
                            style={{ width: `${b.percent}%` }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="rounded-2xl border border-slate-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900">
                  <h2 className="mb-4 text-lg font-semibold text-slate-900 dark:text-white">
                    Quick Notes
                  </h2>
                  <ul className="space-y-3 text-sm text-slate-600 dark:text-zinc-400">
                    <li>• Unpaid bills need attention</li>
                    <li>• Doro Wat is the top seller today</li>
                    <li>• Average ticket is healthy</li>
                  </ul>
                </div>
              )}
            </div>
          </>
        )}

        {/* LIVE VIEW */}
        {view === "live" && (
          <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center dark:border-zinc-800 dark:bg-zinc-900">
            <p className="text-lg font-medium text-slate-900 dark:text-white">
              Live Sales View
            </p>
            <p className="mt-2 text-slate-500 dark:text-zinc-400">
              This will show real-time orders as they happen across branches.
            </p>
            <p className="mt-4 text-sm text-slate-400">
              (Will be connected when the Cashier & Waiter apps are ready)
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

function StatCard({ label, value, danger = false }: { label: string; value: string | number; danger?: boolean }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-900">
      <p className="text-sm text-slate-500 dark:text-zinc-400">{label}</p>
      <p className={`mt-1 text-2xl font-bold ${danger ? "text-red-600 dark:text-red-400" : "text-slate-900 dark:text-white"}`}>
        {value}
      </p>
    </div>
  );
}
