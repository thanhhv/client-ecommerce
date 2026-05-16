"use client";

import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import {
  LayoutDashboard,
  Package,
  Tag,
  ShoppingBag,
  Users,
  Boxes,
} from "lucide-react";
import { useAuthStore } from "@/lib/stores/authStore";

const navLinks = [
  { href: "/admin/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/products", label: "Sản phẩm", icon: Package },
  { href: "/admin/categories", label: "Danh mục", icon: Tag },
  { href: "/admin/orders", label: "Đơn hàng", icon: ShoppingBag },
  { href: "/admin/users", label: "Người dùng", icon: Users },
  { href: "/admin/inventory", label: "Kho hàng", icon: Boxes },
];

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const { user } = useAuthStore();

  useEffect(() => {
    if (user?.role !== "admin") {
      router.replace("/");
    }
  }, [user, router]);

  if (user?.role !== "admin") {
    return null;
  }

  return (
    <div className="min-h-screen flex bg-plant-surface">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-plant-border flex flex-col shrink-0">
        <div className="p-6 border-b border-plant-border">
          <h2 className="font-playfair text-lg font-bold text-plant-primary">
            Admin Panel
          </h2>
          <p className="text-sm text-plant-muted mt-1">{user?.name}</p>
        </div>
        <nav className="flex-1 p-4 space-y-1">
          {navLinks.map(({ href, label, icon: Icon }) => {
            const isActive = pathname === href || pathname.startsWith(href + "/");
            return (
              <Link
                key={href}
                href={href}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  isActive
                    ? "bg-plant-primary text-white"
                    : "text-plant-text hover:bg-plant-surface"
                }`}
              >
                <Icon className="w-4 h-4 shrink-0" />
                {label}
              </Link>
            );
          })}
        </nav>
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top bar */}
        <header className="bg-white border-b border-plant-border px-6 py-4 flex items-center justify-between">
          <h1 className="font-playfair text-xl font-bold text-plant-text">
            Admin Panel
          </h1>
          <span className="text-sm text-plant-muted">{user?.name}</span>
        </header>

        {/* Page content */}
        <main className="flex-1 p-6 overflow-auto">{children}</main>
      </div>
    </div>
  );
}
