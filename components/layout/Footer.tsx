import Link from "next/link";
import Image from "next/image";
import { Phone, Mail, MapPin, Clock } from "lucide-react";
import { STORE } from "@/lib/constants";

export function Footer() {
  return (
    <footer className="bg-medex-primary-dark text-white mt-16">
      <div className="max-w-7xl mx-auto px-6 py-12 grid grid-cols-1 md:grid-cols-4 gap-8">
        <div>
          <div className="flex items-center gap-2 mb-3">
            <Image src={STORE.logo} alt={STORE.name} width={36} height={36} className="rounded-full bg-white" />
            <span className="font-bold text-lg">{STORE.name}</span>
          </div>
          <p className="text-sm text-white/70">{STORE.tagline}</p>
          <p className="text-sm text-white/70 mt-3 flex items-start gap-2">
            <MapPin className="w-4 h-4 mt-0.5 shrink-0" /> {STORE.address} ({STORE.landmark})
          </p>
        </div>

        <div>
          <h4 className="font-semibold mb-3">Quick Links</h4>
          <ul className="space-y-2 text-sm text-white/70">
            <li><Link href="/about">About Us</Link></li>
            <li><Link href="/contact">Contact Us</Link></li>
            <li><Link href="/faq">FAQ</Link></li>
            <li><Link href="/prescriptions/upload">Upload Prescription</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="font-semibold mb-3">Policies</h4>
          <ul className="space-y-2 text-sm text-white/70">
            <li><Link href="/privacy-policy">Privacy Policy</Link></li>
            <li><Link href="/terms">Terms &amp; Conditions</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="font-semibold mb-3">Contact Us</h4>
          <ul className="space-y-2 text-sm text-white/70">
            <li className="flex items-center gap-2"><Phone className="w-4 h-4" /> {STORE.phone}</li>
            {STORE.email && (
              <li className="flex items-center gap-2"><Mail className="w-4 h-4" /> {STORE.email}</li>
            )}
            <li className="flex items-center gap-2"><Clock className="w-4 h-4" /> {STORE.openingHours}</li>
          </ul>
        </div>
      </div>
      <div className="border-t border-white/10 py-4 text-center text-xs text-white/60">
        © {new Date().getFullYear()} {STORE.name}. All rights reserved.
      </div>
    </footer>
  );
}
