"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Search, ShoppingCart, User } from "lucide-react";
import { useCartStore } from "@/lib/stores/cartStore";
import { cn } from "@/lib/utils/cn";
import { useEffect, useState } from "react";

const navItems = [
  { href: "/", icon: Home, label: "Trang chủ" },
  { href: "/products", icon: Search, label: "Sản phẩm" },
  { href: "/cart", icon: ShoppingCart, label: "Giỏ hàng" },
  { href: "/profile", icon: User, label: "Tài khoản" },
];

export default function MobileNav() {
  const pathname = usePathname();
  const { itemCount } = useCartStore();
  const [mounted, setMounted] = useState(false);
  useEffect(() => { setMounted(true); }, []);

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-xl border-t border-plant-border/50">
      <div className="grid grid-cols-4 h-16 px-2">
        {navItems.map(({ href, icon: Icon, label }) => {
          const isCart = href === "/cart";
          const isActive = pathname === href;
          return (
            <Link
              key={href}
              href={href}
              className="flex flex-col items-center justify-center gap-0.5 relative"
            >
              <div className={cn(
                "relative p-1.5 rounded-full transition-all duration-200",
                isActive ? "bg-plant-primary" : ""
              )}>
                <Icon size={20} className={cn(
                  isActive ? "text-white" : "text-plant-muted"
                )} />
                {mounted && isCart && itemCount() > 0 && (
                  <span className="absolute -top-1.5 -right-1.5 bg-plant-accent text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-medium">
                    {itemCount()}
                  </span>
                )}
              </div>
              <span className={cn(
                "text-[10px] font-medium transition-colors",
                isActive ? "text-plant-primary" : "text-plant-muted"
              )}>
                {label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
