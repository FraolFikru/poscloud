"use client";

import { useTranslation } from "react-i18next";
import { useEffect, useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import {
  getOrders, getOrder, addItemToOrder, removeItemFromOrder,
  payOrder, MENU, Order, PaymentChannel,
} from "@/lib/store";

function OrdersContent() {
  const { t } = useTranslation();
  const searchParams = useSearchParams();
  const router = useRouter();
  const orderIdParam = searchParams.get("orderId");

  const [orders, setOrders] = useState<Order[]>([]);
  const [selected, setSelected] = useState<Order | null>(null);
  const [showMenu, setShowMenu] = useState(false);
  const [message, setMessage] = useState("");

  const refresh = () => {
    setOrders(getOrders());
    if (orderIdParam) {
      const o = getOrder(orderIdParam);
      setSelected(o || null);
    }
  };

  useEffect(() => {
    refresh();
  }, [orderIdParam]);

  const handleAddItem = (menuItemId: string) => {
    if (!selected) return;
    addItemToOrder(selected.id, menuItemId);
    refresh();
  };

  const handleRemove = (itemId: string) => {
    if (!selected) return;
    removeItemFromOrder(selected.id, itemId);
    refresh();
  };

  const handlePay = (channel: PaymentChannel) => {
    if (!selected) return;
    const ok = payOrder(selected.id, channel);
    if (ok) {
      setMessage(t("orders.paymentSuccess"));
      setTimeout(() => {
        setMessage("");
        setSelected(null);
        router.push("/tables");
      }, 1500);
      refresh();
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-zinc-50">{t("orders.title")}</h1>
        <p className="mt-1 text-slate-600 dark:text-zinc-400">{t("orders.subtitle")}</p>
      </div>

      {message && (
        <div className="rounded-lg bg-emerald-100 px-4 py-3 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300">
          {message}
        </div>
      )}

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="space-y-3 lg:col-span-1">
          {orders.length === 0 ? (
            <p className="text-sm text-slate-500">{t("orders.empty")}</p>
          ) : (
            orders.map((order) => (
              <button
                key={order.id}
                onClick={() => {
                  setSelected(order);
                  router.push(`/orders?orderId=${order.id}`);
                }}
                className={`w-full rounded-lg border p-4 text-left transition ${
                  selected?.id === order.id
                    ? "border-emerald-500 bg-emerald-50 dark:border-emerald-600 dark:bg-emerald-950/30"
                    : "border-slate-200 bg-white hover:border-slate-300 dark:border-zinc-800 dark:bg-zinc-900"
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-semibold">{t("orders.table")} {order.tableNumber}</span>
                  <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                    order.paymentStatus === "PAID"
                      ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-400"
                      : "bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-400"
                  }`}>
                    {t(`orders.${order.paymentStatus.toLowerCase()}`)}
                  </span>
                </div>
                <p className="mt-1 text-sm text-slate-600 dark:text-zinc-400">
                  {order.totalAmount.toLocaleString()} {t("common.etb")} · {order.items.length} {t("orders.items")}
                </p>
              </button>
            ))
          )}
        </div>

        <div className="lg:col-span-2">
          {selected ? (
            <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold">{t("orders.table")} {selected.tableNumber}</h2>
                <span className="text-2xl font-bold">{selected.totalAmount.toLocaleString()} {t("common.etb")}</span>
              </div>

              <ul className="mt-6 space-y-3">
                {selected.items.length === 0 ? (
                  <li className="text-sm text-slate-500">{t("orders.empty")}</li>
                ) : (
                  selected.items.map((item) => (
                    <li key={item.id} className="flex items-center justify-between rounded-lg bg-slate-50 px-4 py-3 dark:bg-zinc-800/50">
                      <div>
                        <span className="font-medium">{item.quantity}× {item.name}</span>
                        <span className="ml-2 text-sm text-slate-500">@ {item.unitPrice}</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="font-medium">{item.totalPrice.toLocaleString()}</span>
                        {selected.paymentStatus !== "PAID" && (
                          <button onClick={() => handleRemove(item.id)} className="text-sm text-red-600 hover:underline">
                            {t("orders.remove")}
                          </button>
                        )}
                      </div>
                    </li>
                  ))
                )}
              </ul>

              {selected.paymentStatus !== "PAID" && (
                <div className="mt-6 space-y-4 border-t border-slate-200 pt-6 dark:border-zinc-700">
                  <button
                    onClick={() => setShowMenu(!showMenu)}
                    className="w-full rounded-lg border border-slate-300 bg-white py-2.5 text-sm font-medium hover:bg-slate-50 dark:border-zinc-600 dark:bg-zinc-800"
                  >
                    {t("orders.addItem")}
                  </button>

                  {showMenu && (
                    <div className="grid max-h-60 grid-cols-2 gap-2 overflow-y-auto rounded-lg border border-slate-200 p-3 dark:border-zinc-700">
                      {MENU.map((item) => (
                        <button
                          key={item.id}
                          onClick={() => handleAddItem(item.id)}
                          className="rounded-md bg-slate-50 px-3 py-2 text-left text-sm hover:bg-emerald-50 dark:bg-zinc-800 dark:hover:bg-emerald-950/40"
                        >
                          <span className="font-medium">{item.name}</span>
                          <span className="ml-1 text-slate-500">{item.price}</span>
                        </button>
                      ))}
                    </div>
                  )}

                  <div className="grid grid-cols-3 gap-3">
                    <button onClick={() => handlePay("CASH")} className="rounded-lg bg-slate-800 py-3 text-sm font-semibold text-white hover:bg-slate-700">
                      {t("orders.cash")}
                    </button>
                    <button onClick={() => handlePay("ETHQR")} className="rounded-lg bg-emerald-600 py-3 text-sm font-semibold text-white hover:bg-emerald-500">
                      {t("orders.ethqr")}
                    </button>
                    <button onClick={() => handlePay("USSD_PUSH")} className="rounded-lg bg-blue-600 py-3 text-sm font-semibold text-white hover:bg-blue-500">
                      {t("orders.ussd")}
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="flex h-64 items-center justify-center rounded-xl border border-dashed border-slate-300 text-slate-500 dark:border-zinc-700">
              {t("orders.empty")}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function OrdersPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center">Loading...</div>}>
      <OrdersContent />
    </Suspense>
  );
}
