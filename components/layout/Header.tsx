"use client";

import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Search, Heart, ShoppingCart, User, MapPin, Menu, X } from "lucide-react";
import { STORE, NAV_LINKS } from "@/lib/constants";
import { useCartStore } from "@/store/cartStore";

export function Header() {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);
  const items = useCartStore((s) => s.items);
  const cartCount = items.reduce((sum, i) => sum + i.quantity, 0);

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    if (query.trim()) {
      router.push(`/products?q=${encodeURIComponent(query.trim())}`);
    }
  }

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-medex-border">
      {/* Top strip */}
      <div className="hidden md:flex items-center justify-between px-6 py-1.5 bg-medex-pista text-xs text-medex-primary-dark">
        <span className="flex items-center gap-1">
          <MapPin className="w-3.5 h-3.5" /> Delivering across {STORE.deliveryArea} · within {STORE.deliveryRadiusKm} km
        </span>
        <span>Call us: {STORE.phone}</span>
      </div>

      <div className="flex items-center gap-3 px-4 md:px-6 py-3 max-w-7xl mx-auto">
        <button className="md:hidden" onClick={() => setMenuOpen((o) => !o)} aria-label="Menu">
          {menuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>

        <Link href="/" className="flex items-center gap-2 shrink-0">
          <Image src={STORE.logo} alt={STORE.name} width={40} height={40} className="rounded-full object-cover" />
          <div className="hidden sm:block leading-tight">
            <p className="font-bold text-medex-primary-dark text-lg">{STORE.name}</p>
            <p className="text-[10px] text-gray-500">{STORE.tagline}</p>
          </div>
        </Link>

        <form onSubmit={handleSearch} className="flex-1 hidden md:flex items-center bg-medex-pista rounded-full px-4 py-2">
          <Search className="w-4 h-4 text-medex-primary mr-2" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search medicines, brands, categories..."
            className="bg-transparent outline-none text-sm flex-1"
          />
        </form>

        <div className="flex items-center gap-1 ml-auto">
          <Link href="/wishlist" className="p-2 hover:bg-medex-pista rounded-full" aria-label="Wishlist">
            <Heart className="w-5 h-5" />
          </Link>
          <Link href="/cart" className="relative p-2 hover:bg-medex-pista rounded-full" aria-label="Cart">
            <ShoppingCart className="w-5 h-5" />
            {cartCount > 0 && (
              <span className="absolute -top-0.5 -right-0.5 bg-medex-pink-dark text-white text-[10px] rounded-full w-4 h-4 flex items-center justify-center">
                {cartCount}
              </span>
            )}
          </Link>
          <Link href="/account" className="p-2 hover:bg-medex-pista rounded-full" aria-label="Account">
            <User className="w-5 h-5" />
          </Link>
        </div>
      </div>

      <form onSubmit={handleSearch} className="flex md:hidden items-center bg-medex-pista rounded-full px-4 py-2 mx-4 mb-3">
        <Search className="w-4 h-4 text-medex-primary mr-2" />
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search medicines..."
          className="bg-transparent outline-none text-sm flex-1"
        />
      </form>

      <nav className={`${menuOpen ? "block" : "hidden"} md:flex border-t border-medex-border px-4 md:px-6 max-w-7xl mx-auto`}>
        <ul className="flex flex-col md:flex-row md:items-center gap-1 md:gap-6 py-2 text-sm font-medium text-gray-700">
          {NAV_LINKS.map((link) => (
            <li key={link.href}>
              <Link href={link.href} className="block py-1.5 hover:text-medex-primary" onClick={() => setMenuOpen(false)}>
                {link.label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </header>
  );
}
