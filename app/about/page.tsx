import { STORE } from "@/lib/constants";

export const metadata = { title: "About Us — Medex Pharmacy" };

export default function AboutPage() {
  return (
    <div className="max-w-3xl mx-auto px-6 py-12 prose prose-sm">
      <h1 className="text-2xl font-bold text-gray-800 mb-4">About {STORE.name}</h1>
      <p className="text-gray-600 leading-relaxed">
        {STORE.name} is a local pharmacy serving {STORE.deliveryArea} with genuine medicines, healthcare products
        and wellness essentials. We're committed to fast, reliable local delivery and easy prescription handling,
        so you can get what you need without the wait.
      </p>
      <p className="text-gray-600 leading-relaxed mt-4">
        Visit us at {STORE.address} ({STORE.landmark}), or shop online and get your order delivered within our{" "}
        {STORE.deliveryRadiusKm} km service radius.
      </p>
    </div>
  );
}
