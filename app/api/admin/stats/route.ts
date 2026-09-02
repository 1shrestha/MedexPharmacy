import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Order from "@/models/Order";
import Product from "@/models/Product";
import User from "@/models/User";
import Prescription from "@/models/Prescription";
import { auth } from "@/lib/auth";

export async function GET() {
  const session = await auth();
  if (!session?.user || (session.user as { role?: string }).role !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  await connectDB();

  const startOfToday = new Date();
  startOfToday.setHours(0, 0, 0, 0);

  const [
    totalSalesAgg,
    todaySalesAgg,
    totalOrders,
    pendingOrders,
    deliveredOrders,
    cancelledOrders,
    totalCustomers,
    lowStockProducts,
    pendingPrescriptions,
  ] = await Promise.all([
    Order.aggregate([{ $match: { paymentStatus: "paid" } }, { $group: { _id: null, sum: { $sum: "$total" } } }]),
    Order.aggregate([
      { $match: { paymentStatus: "paid", createdAt: { $gte: startOfToday } } },
      { $group: { _id: null, sum: { $sum: "$total" } } },
    ]),
    Order.countDocuments(),
    Order.countDocuments({ status: { $nin: ["Delivered", "Cancelled", "Returned"] } }),
    Order.countDocuments({ status: "Delivered" }),
    Order.countDocuments({ status: "Cancelled" }),
    User.countDocuments({ role: "customer" }),
    Product.find({ status: "active", stockQuantity: { $lte: 10 } }).select("name stockQuantity").limit(10),
    Prescription.countDocuments({ status: { $in: ["Pending", "Under Review"] } }),
  ]);

  // Last 7 days sales trend
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 6);
  sevenDaysAgo.setHours(0, 0, 0, 0);

  const dailySales = await Order.aggregate([
    { $match: { paymentStatus: "paid", createdAt: { $gte: sevenDaysAgo } } },
    {
      $group: {
        _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
        total: { $sum: "$total" },
        orders: { $sum: 1 },
      },
    },
    { $sort: { _id: 1 } },
  ]);

  const topProducts = await Order.aggregate([
    { $unwind: "$items" },
    { $group: { _id: "$items.name", qty: { $sum: "$items.quantity" }, revenue: { $sum: { $multiply: ["$items.price", "$items.quantity"] } } } },
    { $sort: { qty: -1 } },
    { $limit: 5 },
  ]);

  return NextResponse.json({
    totalSales: totalSalesAgg[0]?.sum ?? 0,
    todaySales: todaySalesAgg[0]?.sum ?? 0,
    totalOrders,
    pendingOrders,
    deliveredOrders,
    cancelledOrders,
    totalCustomers,
    lowStockProducts,
    pendingPrescriptions,
    dailySales,
    topProducts,
  });
}
