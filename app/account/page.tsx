"use client";

import { useSession, signIn, signOut } from "next-auth/react";
import Link from "next/link";
import { User, Package, FileText, Heart, LogOut } from "lucide-react";
import { Button } from "@/components/ui/Button";

export default function AccountPage() {
  const { data: session, status } = useSession();

  if (status === "unauthenticated") {
    return (
      <div className="max-w-md mx-auto px-6 py-20 text-center">
        <User className="w-12 h-12 text-medex-primary mx-auto mb-4" />
        <h1 className="text-xl font-bold text-gray-800 mb-2">Log in to your account</h1>
        <div className="flex gap-3 justify-center mt-4">
          <Button onClick={() => signIn(undefined, { callbackUrl: "/account" })}>Log In</Button>
          <Link href="/register"><Button variant="outline">Register</Button></Link>
        </div>
      </div>
    );
  }

  const links = [
    { href: "/account/orders", label: "My Orders", icon: Package, desc: "Track and view your order history" },
    { href: "/prescriptions/upload", label: "Prescriptions", icon: FileText, desc: "Upload and check prescription status" },
    { href: "/wishlist", label: "Wishlist", icon: Heart, desc: "Products you've saved for later" },
  ];

  return (
    <div className="max-w-3xl mx-auto px-6 py-8">
      <div className="flex items-center gap-4 mb-8">
        <div className="w-16 h-16 rounded-full bg-medex-pista flex items-center justify-center text-medex-primary text-xl font-bold">
          {session?.user?.name?.[0]?.toUpperCase() ?? "U"}
        </div>
        <div>
          <h1 className="text-xl font-bold text-gray-800">{session?.user?.name}</h1>
          <p className="text-sm text-gray-500">{session?.user?.email}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        {links.map((l) => (
          <Link key={l.href} href={l.href} className="border border-medex-border rounded-xl p-4 hover:bg-medex-pista transition-colors">
            <l.icon className="w-6 h-6 text-medex-primary mb-2" />
            <p className="font-medium text-sm text-gray-800">{l.label}</p>
            <p className="text-xs text-gray-500">{l.desc}</p>
          </Link>
        ))}
      </div>

      <Button variant="outline" onClick={() => signOut({ callbackUrl: "/" })}>
        <LogOut className="w-4 h-4" /> Log Out
      </Button>
    </div>
  );
}
