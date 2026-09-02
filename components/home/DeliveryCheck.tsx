"use client";

import { useState } from "react";
import { Truck, CheckCircle2, XCircle } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { STORE } from "@/lib/constants";

export function DeliveryCheck() {
  const [pin, setPin] = useState("");
  const [result, setResult] = useState<null | "checking" | "available" | "unavailable">(null);

  async function handleCheck(e: React.FormEvent) {
    e.preventDefault();
    if (pin.length !== 6) return;
    setResult("checking");
    try {
      const res = await fetch(`/api/delivery/check?pincode=${pin}`);
      const data = await res.json();
      setResult(data.available ? "available" : "unavailable");
    } catch {
      setResult("unavailable");
    }
  }

  return (
    <section className="max-w-4xl mx-auto px-6 py-12 text-center">
      <div className="bg-white border border-medex-border rounded-2xl p-8 card-shadow">
        <Truck className="w-8 h-8 text-medex-primary mx-auto mb-3" />
        <h2 className="text-lg md:text-xl font-bold text-gray-800 mb-1">Fast delivery within your service area</h2>
        <p className="text-sm text-gray-500 mb-5">
          We currently deliver across {STORE.deliveryArea}, within {STORE.deliveryRadiusKm} km of our store.
        </p>
        <form onSubmit={handleCheck} className="flex items-center justify-center gap-2 max-w-sm mx-auto">
          <input
            value={pin}
            onChange={(e) => setPin(e.target.value.replace(/\D/g, "").slice(0, 6))}
            placeholder="Enter PIN code"
            className="flex-1 border border-medex-border rounded-full px-4 py-2.5 text-sm outline-none focus:border-medex-primary"
          />
          <Button type="submit" disabled={pin.length !== 6}>
            Check
          </Button>
        </form>
        {result === "available" && (
          <p className="mt-4 flex items-center justify-center gap-2 text-green-600 text-sm font-medium">
            <CheckCircle2 className="w-4 h-4" /> Great news! We deliver to this area.
          </p>
        )}
        {result === "unavailable" && (
          <p className="mt-4 flex items-center justify-center gap-2 text-red-500 text-sm font-medium">
            <XCircle className="w-4 h-4" /> Sorry, we don&apos;t deliver here yet. Try store pickup instead.
          </p>
        )}
      </div>
    </section>
  );
}
