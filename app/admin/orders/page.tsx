"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import toast from "react-hot-toast";
import { Badge } from "@/components/ui/Badge";
import { formatINR } from "@/lib/utils";
import { OrderStatus } from "@/types";

interface AdminOrder {
  _id: string;
  orderId: string;
  status: OrderStatus;
  paymentStatus: string;
  paymentMethod: string;
  total: number;
  createdAt: string;
  user: { name: string; phone?: string };
  items: { name: string; quantity: number }[];
}

const STATUSES: OrderStatus[] = [
  "Order Placed", "Payment Confirmed", "Prescription Verification", "Order Confirmed",
  "Preparing", "Out for Delivery", "Delivered", "Cancelled", "Returned",
];

const STATUS_VARIANT: Record<string, "default" | "warning" | "success" | "danger" | "outline"> = {
  "Order Placed": "outline", "Payment Confirmed": "default", "Prescription Verification": "warning",
  "Order Confirmed": "default", Preparing: "default", "Out for Delivery": "warning",
  Delivered: "success", Cancelled: "danger", Returned: "danger",
};

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<AdminOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("");

  async function load() {
    setLoading(true);
    const res = await fetch(`/api/orders${filter ? `?status=${encodeURIComponent(filter)}` : ""}`);
    const data = await res.json();
    setOrders(Array.isArray(data) ? data : []);
    setLoading(false);
  }

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filter]);

  async function updateStatus(orderId: string, status: string) {
    const res = await fetch(`/api/orders/${orderId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    if (res.ok) {
      toast.success("Order status updated");
      load();
    } else {
      toast.error("Failed to update status");
    }
  }

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <h1 className="text-xl font-bold text-gray-800">Orders</h1>
        <select value={filter} onChange={(e) => setFilter(e.target.value)} className="border border-medex-border rounded-lg px-3 py-1.5 text-sm">
          <option value="">All Statuses</option>
          {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
        </select>
      </div>

      {loading ? (
        <p className="text-sm text-gray-400">Loading...</p>
      ) : orders.length === 0 ? (
        <p className="text-sm text-gray-500 bg-medex-pista rounded-xl p-6 text-center">No orders found.</p>
      ) : (
        <div className="overflow-x-auto border border-medex-border rounded-xl">
          <table className="w-full text-sm">
            <thead className="bg-medex-pista text-left text-xs text-gray-600">
              <tr>
                <th className="p-3">Order ID</th>
                <th className="p-3">Customer</th>
                <th className="p-3">Items</th>
                <th className="p-3">Total</th>
                <th className="p-3">Payment</th>
                <th className="p-3">Status</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((o) => (
                <tr key={o._id} className="border-t border-medex-border align-top">
                  <td className="p-3">
                    <Link href={`/account/orders/${o.orderId}`} className="text-medex-primary font-medium hover:underline">{o.orderId}</Link>
                    <p className="text-xs text-gray-400">{new Date(o.createdAt).toLocaleDateString("en-IN")}</p>
                  </td>
                  <td className="p-3">{o.user?.name}<p className="text-xs text-gray-400">{o.user?.phone}</p></td>
                  <td className="p-3 text-xs text-gray-500 max-w-[180px]">{o.items.map((i) => `${i.name} ×${i.quantity}`).join(", ")}</td>
                  <td className="p-3 font-medium">{formatINR(o.total)}</td>
                  <td className="p-3">
                    <p className="capitalize">{o.paymentMethod.replace("_", " ")}</p>
                    <Badge variant={o.paymentStatus === "paid" ? "success" : "outline"}>{o.paymentStatus}</Badge>
                  </td>
                  <td className="p-3">
                    <select
                      value={o.status}
                      onChange={(e) => updateStatus(o.orderId, e.target.value)}
                      className="border border-medex-border rounded-lg px-2 py-1 text-xs"
                    >
                      {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
                    </select>
                    <div className="mt-1"><Badge variant={STATUS_VARIANT[o.status]}>{o.status}</Badge></div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
