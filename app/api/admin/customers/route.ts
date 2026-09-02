import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import User from "@/models/User";
import Order from "@/models/Order";
import { auth } from "@/lib/auth";

export async function GET() {
  const session = await auth();
  if (!session?.user || (session.user as { role?: string }).role !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  await connectDB();
  // Password is excluded by default (select: false on the schema) — never returned here.
  const customers = await User.find({ role: "customer" }).sort({ createdAt: -1 }).lean();

  const orderStats = await Order.aggregate([
    { $match: { paymentStatus: "paid" } },
    { $group: { _id: "$user", totalOrders: { $sum: 1 }, totalSpending: { $sum: "$total" } } },
  ]);
  const statsMap = new Map(orderStats.map((s) => [s._id.toString(), s]));

  const result = customers.map((c) => ({
    _id: c._id,
    name: c.name,
    email: c.email,
    phone: c.phone,
    status: c.status,
    createdAt: c.createdAt,
    totalOrders: statsMap.get(c._id.toString())?.totalOrders ?? 0,
    totalSpending: statsMap.get(c._id.toString())?.totalSpending ?? 0,
  }));

  return NextResponse.json(result);
}
