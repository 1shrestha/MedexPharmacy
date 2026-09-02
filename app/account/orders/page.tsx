"use client";

import { useEffect, useState } from "react";
import { useSession, signIn } from "next-auth/react";
import Link from "next/link";
import { Package } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { formatINR } from "@/lib/utils";

interface OrderRow {
  orderId: string;
  status: string;
  total: number;
  createdAt: string;
  items: { name: string; quantity: number }[];
}

const STATUS_VARIANT: Record<string, "default" | "warning" | "success" | "danger" | "outline"> = {
  "Order Placed": "outline",
  "Payment Confirmed": "default",
  "Prescription Verification": "warning",
  "Order Confirmed": "default",
  Preparing: "default",
  "Out for Delivery": "warning",
  Delivered: "success",
  Cancelled: "danger",
  Returned: "danger",
};

export default function MyOrdersPage() {
  const { status } = useSession();
  const [orders, setOrders] = useState<OrderRow[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status !== "authenticated") {
      setLoading(false);
      return;
    }
    fetch("/api/orders")
      .then((r) => r.json())
      .then((data) => setOrders(Array.isArray(data) ? data : []))
      .finally(() => setLoading(false));
  }, [status]);

  if (status === "unauthenticated") {
    return (
      <div className="max-w-md mx-auto px-6 py-20 text-center">
        <Package className="w-12 h-12 text-medex-primary mx-auto mb-4" />
        <h1 className="text-xl font-bold text-gray-800 mb-2">Log in to view your orders</h1>
        <Button onClick={() => signIn(undefined, { callbackUrl: "/account/orders" })}>Log In</Button>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-6 py-8">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">My Orders</h1>
      {loading ? (
        <p className="text-sm text-gray-400">Loading...</p>
      ) : orders.length === 0 ? (
        <div className="bg-medex-pista rounded-xl p-8 text-center text-sm text-gray-500">
          You haven&apos;t placed any orders yet.
          <div className="mt-3">
            <Link href="/products"><Button size="sm">Shop Now</Button></Link>
          </div>
        </div>
      ) : (
        <div className="space-y-3">
          {orders.map((o) => (
            <Link
              key={o.orderId}
              href={`/account/orders/${o.orderId}`}
              className="flex items-center justify-between border border-medex-border rounded-xl p-4 hover:bg-medex-pista transition-colors"
            >
              <div>
                <p className="font-medium text-sm text-gray-800">{o.orderId}</p>
                <p className="text-xs text-gray-500">
                  {o.items.length} item{o.items.length !== 1 ? "s" : ""} · {new Date(o.createdAt).toLocaleDateString("en-IN")}
                </p>
              </div>
              <div className="text-right">
                <p className="font-semibold text-sm text-gray-800">{formatINR(o.total)}</p>
                <Badge variant={STATUS_VARIANT[o.status] ?? "outline"}>{o.status}</Badge>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
