"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import toast from "react-hot-toast";
import { FileText } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";

interface AdminPrescription {
  _id: string;
  fileUrl: string;
  fileType: string;
  notes?: string;
  status: string;
  adminNotes?: string;
  createdAt: string;
  user: { name: string; email: string; phone?: string };
}

const STATUS_VARIANT: Record<string, "default" | "warning" | "success" | "danger" | "outline"> = {
  Pending: "warning", "Under Review": "warning", Approved: "success", Rejected: "danger", Expired: "outline",
};

export default function AdminPrescriptionsPage() {
  const [items, setItems] = useState<AdminPrescription[]>([]);
  const [loading, setLoading] = useState(true);
  const [notes, setNotes] = useState<Record<string, string>>({});

  async function load() {
    setLoading(true);
    const res = await fetch("/api/prescriptions");
    const data = await res.json();
    setItems(Array.isArray(data) ? data : []);
    setLoading(false);
  }

  useEffect(() => { load(); }, []);

  async function updateStatus(id: string, status: string) {
    const res = await fetch(`/api/prescriptions/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status, adminNotes: notes[id] }),
    });
    if (res.ok) {
      toast.success(`Prescription ${status.toLowerCase()}`);
      load();
    } else {
      toast.error("Failed to update prescription");
    }
  }

  return (
    <div className="space-y-5">
      <h1 className="text-xl font-bold text-gray-800">Prescriptions</h1>

      {loading ? (
        <p className="text-sm text-gray-400">Loading...</p>
      ) : items.length === 0 ? (
        <p className="text-sm text-gray-500 bg-medex-pista rounded-xl p-6 text-center">
          <FileText className="w-6 h-6 mx-auto mb-2" /> No prescriptions submitted yet.
        </p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {items.map((p) => (
            <div key={p._id} className="border border-medex-border rounded-xl p-4">
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm font-medium text-gray-800">{p.user?.name}</p>
                <Badge variant={STATUS_VARIANT[p.status] ?? "outline"}>{p.status}</Badge>
              </div>
              <p className="text-xs text-gray-400 mb-2">{new Date(p.createdAt).toLocaleString("en-IN")}</p>

              {p.fileType === "pdf" ? (
                <a href={p.fileUrl} target="_blank" rel="noopener noreferrer" className="text-sm text-medex-primary underline">
                  View PDF
                </a>
              ) : (
                <a href={p.fileUrl} target="_blank" rel="noopener noreferrer">
                  <div className="relative w-full h-40 rounded-lg overflow-hidden bg-medex-pista mb-2">
                    <Image src={p.fileUrl} alt="Prescription" fill className="object-cover" sizes="300px" />
                  </div>
                </a>
              )}

              {p.notes && <p className="text-xs text-gray-500 mb-2">Customer note: {p.notes}</p>}

              <textarea
                placeholder="Add a note (optional)"
                value={notes[p._id] ?? p.adminNotes ?? ""}
                onChange={(e) => setNotes({ ...notes, [p._id]: e.target.value })}
                rows={2}
                className="w-full border border-medex-border rounded-lg px-2 py-1.5 text-xs mb-2"
              />

              <div className="flex gap-2">
                <Button size="sm" onClick={() => updateStatus(p._id, "Approved")}>Approve</Button>
                <Button size="sm" variant="danger" onClick={() => updateStatus(p._id, "Rejected")}>Reject</Button>
                <Button size="sm" variant="outline" onClick={() => updateStatus(p._id, "Under Review")}>Review</Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
