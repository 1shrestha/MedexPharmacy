"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession, signIn } from "next-auth/react";

import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  FileText,
  Users,
  Tag,
  Settings,
  ShieldAlert,
} from "lucide-react";

import { STORE } from "@/lib/constants";

const NAV = [
  {
    href: "/admin",
    label: "Dashboard",
    icon: LayoutDashboard,
  },
  {
    href: "/admin/products",
    label: "Products",
    icon: Package,
  },
  {
    href: "/admin/categories",
    label: "Categories",
    icon: Tag,
  },
  {
    href: "/admin/orders",
    label: "Orders",
    icon: ShoppingCart,
  },
  {
    href: "/admin/prescriptions",
    label: "Prescriptions",
    icon: FileText,
  },
  {
    href: "/admin/customers",
    label: "Customers",
    icon: Users,
  },
  {
    href: "/admin/coupons",
    label: "Coupons",
    icon: Tag,
  },
  {
    href: "/admin/settings",
    label: "Settings",
    icon: Settings,
  },
];

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { data: session, status } = useSession();
  const pathname = usePathname();

  const role = (
    session?.user as { role?: string } | undefined
  )?.role;

  // Loading
  if (status === "loading") {
    return (
      <div className="p-10 text-sm text-gray-400">
        Loading...
      </div>
    );
  }

  // Not authenticated
  if (status === "unauthenticated") {
    return (
      <div className="max-w-sm mx-auto px-6 py-24 text-center">
        <ShieldAlert className="w-12 h-12 text-medex-primary mx-auto mb-4" />

        <h1 className="text-xl font-bold text-gray-800 mb-2">
          Admin Login Required
        </h1>

        <p className="text-sm text-gray-500 mb-4">
          Please log in with an admin account to continue.
        </p>

        <button
          onClick={() =>
            signIn(undefined, {
              callbackUrl: "/admin",
            })
          }
          className="bg-medex-primary text-white rounded-full px-5 py-2 text-sm font-medium"
        >
          Log In
        </button>
      </div>
    );
  }

  // Logged in but not admin
  if (role !== "admin") {
    return (
      <div className="max-w-sm mx-auto px-6 py-24 text-center">
        <ShieldAlert className="w-12 h-12 text-red-500 mx-auto mb-4" />

        <h1 className="text-xl font-bold text-gray-800 mb-2">
          Access Denied
        </h1>

        <p className="text-sm text-gray-500">
          This account doesn&apos;t have admin access.
          Ask a store owner to set your role to &quot;admin&quot;
          in the database.
        </p>
      </div>
    );
  }

  // Admin dashboard
  return (
    <div className="flex flex-col md:flex-row max-w-7xl mx-auto">

      {/* Sidebar */}
      <aside className="md:w-56 shrink-0 border-b md:border-b-0 md:border-r border-medex-border p-4">

        <p className="font-bold text-medex-primary-dark text-sm mb-4 px-2">
          {STORE.name} Admin
        </p>

        <nav className="flex md:flex-col gap-1 overflow-x-auto scrollbar-hide">

          {NAV.map((item) => {
            const Icon = item.icon;

            const active =
              pathname === item.href ||
              pathname.startsWith(`${item.href}/`);

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm whitespace-nowrap ${
                  active
                    ? "bg-medex-pista text-medex-primary-dark font-medium"
                    : "text-gray-600 hover:bg-medex-pista"
                }`}
              >
                <Icon className="w-4 h-4" />

                {item.label}
              </Link>
            );
          })}

        </nav>
      </aside>

      {/* Main content */}
      <main className="flex-1 p-4 md:p-6 min-w-0">
        {children}
      </main>

    </div>
  );
}
