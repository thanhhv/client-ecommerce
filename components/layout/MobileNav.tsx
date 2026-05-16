"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Search, ShoppingCart, User } from "lucide-react";
import { useCartStore } from "@/lib/stores/cartStore";
import { cn } from "@/lib/utils/cn";

const navItems = [
  { href: "/", icon: Home, label: "Trang chủ" },
  { href: "/products", icon: Search, label: "Tìm kiếm" },
  { href: "/cart", icon: ShoppingCart, label: "Giỏ hàng" },
  { href: "/profile", icon: User, label: "Tài khoản" },
];

export default function MobileNav() {
  const pathname = usePathname();
  const { itemCount } = useCartStore();

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-plant-border">
      <div className="grid grid-cols-4 h-16">
        {navItems.map(({ href, icon: Icon, label }) => {
          const isCart = href === "/cart";
          const isActive = pathname === href;
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                "flex flex-col items-center justify-center gap-0.5 relative",
                isActive ? "text-plant-primary" : "text-plant-muted"
              )}
            >
              <div className="relative">
                <Icon size={22} />
                {isCart && itemCount() > 0 && (
                  <span className="absolute -top-2 -right-2 bg-plant-accent text-white text-xs w-4 h-4 rounded-full flex items-center justify-center">
                    {itemCount()}
                  </span>
                )}
              </div>
              <span className="text-xs">{label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
