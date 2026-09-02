import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Settings from "@/models/Settings";
import { auth } from "@/lib/auth";
import { STORE } from "@/lib/constants";

export async function GET() {
  await connectDB();
  let settings = await Settings.findOne({ key: "store_settings" });
  if (!settings) {
    settings = await Settings.create({
      key: "store_settings",
      storeName: STORE.name,
      address: STORE.address,
      phone: STORE.phone,
      email: STORE.email,
      whatsapp: STORE.whatsapp,
      upiId: STORE.upiId,
      deliveryRadiusKm: STORE.deliveryRadiusKm,
      freeDeliveryThreshold: STORE.freeDeliveryThreshold,
      standardDeliveryCharge: STORE.standardDeliveryCharge,
      codAvailable: STORE.codAvailable,
      storePickupAvailable: true,
      openingHours: STORE.openingHours,
      servicablePincodes: [],
    });
  }
  return NextResponse.json(settings);
}

export async function PATCH(req: NextRequest) {
  const session = await auth();
  if (!session?.user || (session.user as { role?: string }).role !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  await connectDB();
  const body = await req.json();
  const settings = await Settings.findOneAndUpdate({ key: "store_settings" }, body, { new: true, upsert: true });
  return NextResponse.json(settings);
}
