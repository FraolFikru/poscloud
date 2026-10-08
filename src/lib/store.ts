"use client";

export type TableStatus = "available" | "occupied" | "reserved";
export type PaymentStatus = "UNPAID" | "PENDING" | "PAID";
export type PaymentChannel = "CASH" | "ETHQR" | "USSD_PUSH" | null;

export interface MenuItem {
  id: string;
  name: string;
  price: number;
  category: string;
}

export interface OrderItem {
  id: string;
  menuItemId: string;
  name: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
}

export interface Order {
  id: string;
  tableNumber: number;
  items: OrderItem[];
  totalAmount: number;
  paymentStatus: PaymentStatus;
  paymentChannel: PaymentChannel;
  createdAt: string;
}

export interface Table {
  id: number;
  number: number;
  seats: number;
  status: TableStatus;
  orderId: string | null;
}

export const MENU: MenuItem[] = [
  { id: "1", name: "Doro Wat", price: 350, category: "Main" },
  { id: "2", name: "Kitfo", price: 320, category: "Main" },
  { id: "3", name: "Tibs", price: 280, category: "Main" },
  { id: "4", name: "Shiro", price: 180, category: "Main" },
  { id: "5", name: "Injera (Extra)", price: 40, category: "Side" },
  { id: "6", name: "Coca Cola", price: 50, category: "Drink" },
  { id: "7", name: "Ambo Water", price: 40, category: "Drink" },
  { id: "8", name: "Tea", price: 30, category: "Drink" },
  { id: "9", name: "Coffee Ceremony", price: 120, category: "Drink" },
  { id: "10", name: "Salad", price: 90, category: "Side" },
];

const INITIAL_TABLES: Table[] = Array.from({ length: 12 }, (_, i) => ({
  id: i + 1,
  number: i + 1,
  seats: i < 4 ? 2 : i < 8 ? 4 : 6,
  status: "available" as TableStatus,
  orderId: null,
}));

let tables: Table[] = JSON.parse(
  typeof window !== "undefined"
    ? localStorage.getItem("pos-tables") || JSON.stringify(INITIAL_TABLES)
    : JSON.stringify(INITIAL_TABLES)
);

let orders: Order[] = JSON.parse(
  typeof window !== "undefined"
    ? localStorage.getItem("pos-orders") || "[]"
    : "[]"
);

function save() {
  if (typeof window !== "undefined") {
    localStorage.setItem("pos-tables", JSON.stringify(tables));
    localStorage.setItem("pos-orders", JSON.stringify(orders));
  }
}

export function getTables(): Table[] {
  return [...tables];
}

export function getOrders(): Order[] {
  return [...orders].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );
}

export function getOrder(id: string): Order | undefined {
  return orders.find((o) => o.id === id);
}

export function getTableOrder(tableNumber: number): Order | undefined {
  const table = tables.find((t) => t.number === tableNumber);
  if (!table?.orderId) return undefined;
  return orders.find((o) => o.id === table.orderId && o.paymentStatus !== "PAID");
}

export function startOrder(tableNumber: number): Order {
  const table = tables.find((t) => t.number === tableNumber);
  if (!table) throw new Error("Table not found");

  const existing = getTableOrder(tableNumber);
  if (existing) return existing;

  const order: Order = {
    id: crypto.randomUUID(),
    tableNumber,
    items: [],
    totalAmount: 0,
    paymentStatus: "UNPAID",
    paymentChannel: null,
    createdAt: new Date().toISOString(),
  };

  orders.push(order);
  table.status = "occupied";
  table.orderId = order.id;
  save();
  return order;
}

export function addItemToOrder(orderId: string, menuItemId: string, qty = 1) {
  const order = orders.find((o) => o.id === orderId);
  if (!order || order.paymentStatus === "PAID") return;

  const menuItem = MENU.find((m) => m.id === menuItemId);
  if (!menuItem) return;

  const existing = order.items.find((i) => i.menuItemId === menuItemId);
  if (existing) {
    existing.quantity += qty;
    existing.totalPrice = existing.quantity * existing.unitPrice;
  } else {
    order.items.push({
      id: crypto.randomUUID(),
      menuItemId,
      name: menuItem.name,
      quantity: qty,
      unitPrice: menuItem.price,
      totalPrice: menuItem.price * qty,
    });
  }

  order.totalAmount = order.items.reduce((sum, i) => sum + i.totalPrice, 0);
  save();
}

export function removeItemFromOrder(orderId: string, itemId: string) {
  const order = orders.find((o) => o.id === orderId);
  if (!order || order.paymentStatus === "PAID") return;

  order.items = order.items.filter((i) => i.id !== itemId);
  order.totalAmount = order.items.reduce((sum, i) => sum + i.totalPrice, 0);
  save();
}

export function payOrder(orderId: string, channel: PaymentChannel): boolean {
  const order = orders.find((o) => o.id === orderId);
  if (!order || order.paymentStatus === "PAID") return false;

  order.paymentStatus = "PAID";
  order.paymentChannel = channel;

  const table = tables.find((t) => t.orderId === orderId);
  if (table) {
    table.status = "available";
    table.orderId = null;
  }

  save();
  return true;
}

export function getStats() {
  const openTables = tables.filter((t) => t.status === "occupied").length;
  const activeOrders = orders.filter((o) => o.paymentStatus !== "PAID").length;
  const today = new Date().toDateString();
  const todayOrders = orders.filter(
    (o) => new Date(o.createdAt).toDateString() === today && o.paymentStatus === "PAID"
  );
  const todaySales = todayOrders.reduce((sum, o) => sum + o.totalAmount, 0);
  const unpaid = orders
    .filter((o) => o.paymentStatus === "UNPAID")
    .reduce((sum, o) => sum + o.totalAmount, 0);

  return { openTables, activeOrders, todaySales, unpaid };
}
