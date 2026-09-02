"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { CheckCircle2, Circle, XCircle } from "lucide-react";
import { formatINR } from "@/lib/utils";

interface OrderDetail {
  orderId: string;
  status: string;
  items: { name: string; quantity: number; price: number; image?: string }[];
  address: { name: string; mobile: string; house: string; street: string; locality: string; city: string; state: string; pincode: string };
  subtotal: number;
  discount: number;
  deliveryCharge: number;
  total: number;
  paymentMethod: string;
  paymentStatus: string;
  estimatedDelivery?: string;
  createdAt: string;
}

const TIMELINE = ["Order Placed", "Order Confirmed", "Preparing", "Out for Delivery", "Delivered"];

export default function OrderDetailPage() {
  const params = useParams();
  const orderId = params.id as string;
  const [order, setOrder] = useState<OrderDetail | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/orders/${orderId}`)
      .then((r) => r.json())
      .then((data) => setOrder(data.error ? null : data))
      .finally(() => setLoading(false));
  }, [orderId]);

  if (loading) return <p className="text-center py-20 text-sm text-gray-400">Loading order...</p>;
  if (!order) return <p className="text-center py-20 text-sm text-gray-500">Order not found.</p>;

  const isCancelled = order.status === "Cancelled" || order.status === "Returned";
  const currentIdx = TIMELINE.indexOf(order.status);

  return (
    <div className="max-w-2xl mx-auto px-6 py-8">
      <h1 className="text-xl font-bold text-gray-800">Order {order.orderId}</h1>
      <p className="text-sm text-gray-500 mb-6">Placed on {new Date(order.createdAt).toLocaleString("en-IN")}</p>

      {isCancelled ? (
        <div className="flex items-center gap-2 text-red-500 bg-red-50 border border-red-200 rounded-xl p-4 mb-6 text-sm font-medium">
          <XCircle className="w-5 h-5" /> This order was {order.status.toLowerCase()}.
        </div>
      ) : (
        <div className="mb-8">
          {TIMELINE.map((step, idx) => (
            <div key={step} className="flex items-start gap-3">
              <div className="flex flex-col items-center">
                {idx <= currentIdx ? (
                  <CheckCircle2 className="w-6 h-6 text-medex-primary" />
                ) : (
                  <Circle className="w-6 h-6 text-gray-300" />
                )}
                {idx < TIMELINE.length - 1 && (
                  <div className={`w-0.5 h-8 ${idx < currentIdx ? "bg-medex-primary" : "bg-gray-200"}`} />
                )}
              </div>
              <p className={`text-sm pt-0.5 ${idx <= currentIdx ? "text-gray-800 font-medium" : "text-gray-400"}`}>
                {step}
              </p>
            </div>
          ))}
          {order.estimatedDelivery && (
            <p className="text-xs text-gray-500 mt-2 ml-9">Estimated: {order.estimatedDelivery}</p>
          )}
        </div>
      )}

      <div className="border border-medex-border rounded-xl p-4 mb-4">
        <h2 className="font-semibold text-gray-800 mb-3 text-sm">Items</h2>
        <div className="space-y-2">
          {order.items.map((item, i) => (
            <div key={i} className="flex justify-between text-sm">
              <span className="text-gray-600">{item.name} × {item.quantity}</span>
              <span className="text-gray-800">{formatINR(item.price * item.quantity)}</span>
            </div>
          ))}
        </div>
        <div className="border-t border-medex-border mt-3 pt-3 space-y-1 text-sm">
          <div className="flex justify-between text-gray-600"><span>Subtotal</span><span>{formatINR(order.subtotal)}</span></div>
          {order.discount > 0 && <div className="flex justify-between text-green-600"><span>Discount</span><span>-{formatINR(order.discount)}</span></div>}
          <div className="flex justify-between text-gray-600"><span>Delivery</span><span>{order.deliveryCharge === 0 ? "Free" : formatINR(order.deliveryCharge)}</span></div>
          <div className="flex justify-between font-semibold text-gray-800"><span>Total</span><span>{formatINR(order.total)}</span></div>
        </div>
      </div>

      <div className="border border-medex-border rounded-xl p-4 mb-4 text-sm">
        <h2 className="font-semibold text-gray-800 mb-2">Delivery Address</h2>
        <p className="text-gray-600">
          {order.address.name}, {order.address.house}, {order.address.street}, {order.address.locality},{" "}
          {order.address.city}, {order.address.state} - {order.address.pincode}
        </p>
        <p className="text-gray-500 mt-1">{order.address.mobile}</p>
      </div>

      <div className="border border-medex-border rounded-xl p-4 text-sm flex justify-between">
        <span className="text-gray-600">Payment Method</span>
        <span className="text-gray-800 font-medium capitalize">
          {order.paymentMethod.replace("_", " ")} · {order.paymentStatus}
        </span>
      </div>
    </div>
  );
}
