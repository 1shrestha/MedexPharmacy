import Link from "next/link";
import { FileText, ShoppingBag } from "lucide-react";
import { Button } from "@/components/ui/Button";

export function Hero() {
  return (
    <section className="bg-gradient-to-br from-medex-pista via-white to-medex-pink px-6 py-14 md:py-20">
      <div className="max-w-7xl mx-auto text-center">
        <h1 className="text-3xl md:text-5xl font-bold text-medex-primary-dark mb-4">
          Your Trusted Local Pharmacy
        </h1>
        <p className="text-gray-600 max-w-xl mx-auto mb-8">
          Medicines, healthcare products and wellness essentials delivered to your doorstep.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link href="/products">
            <Button size="lg">
              <ShoppingBag className="w-5 h-5" /> Shop Medicines
            </Button>
          </Link>
          <Link href="/prescriptions/upload">
            <Button size="lg" variant="secondary">
              <FileText className="w-5 h-5" /> Upload Prescription
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
