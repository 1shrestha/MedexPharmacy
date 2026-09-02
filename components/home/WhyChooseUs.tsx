import { ShieldCheck, Truck, Lock, Award, FileUp, Headset } from "lucide-react";

const ITEMS = [
  { icon: ShieldCheck, title: "Genuine Medicines", desc: "100% authentic products, sourced responsibly." },
  { icon: Truck, title: "Fast Local Delivery", desc: "Quick delivery within our service area." },
  { icon: Lock, title: "Secure Payments", desc: "UPI, cards, net banking or cash on delivery." },
  { icon: Award, title: "Trusted Pharmacy", desc: "Serving the local community with care." },
  { icon: FileUp, title: "Easy Prescription Upload", desc: "Upload and track prescription status online." },
  { icon: Headset, title: "Customer Support", desc: "We're a call or WhatsApp message away." },
];

export function WhyChooseUs() {
  return (
    <section className="bg-medex-pista/60 py-14">
      <div className="max-w-7xl mx-auto px-6">
        <h2 className="text-xl md:text-2xl font-bold text-gray-800 mb-8 text-center">Why Choose Medex</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {ITEMS.map((item) => (
            <div key={item.title} className="bg-white rounded-2xl p-5 card-shadow flex items-start gap-4">
              <div className="w-11 h-11 rounded-full bg-medex-pink flex items-center justify-center text-medex-pink-dark shrink-0">
                <item.icon className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-800">{item.title}</h3>
                <p className="text-sm text-gray-500">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
