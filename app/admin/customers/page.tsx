"use client";

import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { Badge } from "@/components/ui/Badge";
import { formatINR } from "@/lib/utils";

interface Customer {
  _id: string;
  name: string;
  email: string;
  phone?: string;
  status: string;
  createdAt: string;
  totalOrders: number;
  totalSpending: number;
}

export default function AdminCustomersPage() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);

  async function load() {
    setLoading(true);
    const res = await fetch("/api/admin/customers");
    const data = await res.json();
    setCustomers(Array.isArray(data) ? data : []);
    setLoading(false);
  }

  useEffect(() => { load(); }, []);

  async function toggleStatus(id: string, current: string) {
    const next = current === "active" ? "suspended" : "active";
    const res = await fetch(`/api/admin/customers/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: next }),
    });
    if (res.ok) {
      toast.success(`Customer ${next}`);
      load();
    } else {
      toast.error("Failed to update customer");
    }
  }

  return (
    <div className="space-y-5">
      <h1 className="text-xl font-bold text-gray-800">Customers</h1>

      {loading ? (
        <p className="text-sm text-gray-400">Loading...</p>
      ) : customers.length === 0 ? (
        <p className="text-sm text-gray-500 bg-medex-pista rounded-xl p-6 text-center">No customers yet.</p>
      ) : (
        <div className="overflow-x-auto border border-medex-border rounded-xl">
          <table className="w-full text-sm">
            <thead className="bg-medex-pista text-left text-xs text-gray-600">
              <tr>
                <th className="p-3">Name</th>
                <th className="p-3">Contact</th>
                <th className="p-3">Orders</th>
                <th className="p-3">Total Spending</th>
                <th className="p-3">Joined</th>
                <th className="p-3">Status</th>
              </tr>
            </thead>
            <tbody>
              {customers.map((c) => (
                <tr key={c._id} className="border-t border-medex-border">
                  <td className="p-3 font-medium text-gray-800">{c.name}</td>
                  <td className="p-3 text-gray-500">{c.email}<br />{c.phone}</td>
                  <td className="p-3">{c.totalOrders}</td>
                  <td className="p-3">{formatINR(c.totalSpending)}</td>
                  <td className="p-3 text-gray-500">{new Date(c.createdAt).toLocaleDateString("en-IN")}</td>
                  <td className="p-3">
                    <button onClick={() => toggleStatus(c._id, c.status)}>
                      <Badge variant={c.status === "active" ? "success" : "danger"}>{c.status}</Badge>
                    </button>
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
