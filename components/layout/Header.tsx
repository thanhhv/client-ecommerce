"use client";

import Link from "next/link";
import { ShoppingCart, User, Menu } from "lucide-react";
import { useRouter } from "next/navigation";
import { useCartStore } from "@/lib/stores/cartStore";
import { useAuthStore } from "@/lib/stores/authStore";
import { authApi } from "@/lib/api/auth";
import { toast } from "sonner";
import { useEffect, useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function Header() {
  const { itemCount, setDrawerOpen } = useCartStore();
  const { user, logout } = useAuthStore();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  useEffect(() => { setMounted(true); }, []);

  async function handleLogout() {
    try {
      await authApi.logout();
    } catch {
      // ignore errors
    }
    logout();
    router.push("/");
    toast.success("Đã đăng xuất");
  }

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-plant-border shadow-sm">
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
        <Link
          href="/"
          className="font-playfair text-xl font-bold text-plant-primary"
        >
          🌿 Thế giới cây xanh
        </Link>

        <nav className="hidden md:flex items-center gap-6">
          <Link
            href="/"
            className="text-sm text-plant-text hover:text-plant-primary transition-colors"
          >
            Trang chủ
          </Link>
          <Link
            href="/products"
            className="text-sm text-plant-text hover:text-plant-primary transition-colors"
          >
            Sản phẩm
          </Link>
        </nav>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setDrawerOpen(true)}
            className="relative p-2 hover:bg-plant-surface rounded-lg transition-colors"
            aria-label="Giỏ hàng"
          >
            <ShoppingCart size={20} className="text-plant-text" />
            {mounted && itemCount() > 0 && (
              <span className="absolute -top-1 -right-1 bg-plant-accent text-white text-xs w-5 h-5 rounded-full flex items-center justify-center font-medium">
                {itemCount() > 99 ? "99+" : itemCount()}
              </span>
            )}
          </button>

          <DropdownMenu>
            <DropdownMenuTrigger
              className="p-2 hover:bg-plant-surface rounded-lg transition-colors"
              aria-label="Tài khoản"
            >
              <User size={20} className="text-plant-text" />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              {user ? (
                <>
                  <DropdownMenuItem>
                    <Link href="/profile" className="w-full">
                      Hồ sơ của tôi
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Link href="/orders" className="w-full">
                      Đơn hàng của tôi
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    variant="destructive"
                    className="cursor-pointer"
                    onClick={handleLogout}
                  >
                    Đăng xuất
                  </DropdownMenuItem>
                </>
              ) : (
                <DropdownMenuItem>
                  <Link href="/auth/login" className="w-full">
                    Đăng nhập
                  </Link>
                </DropdownMenuItem>
              )}
            </DropdownMenuContent>
          </DropdownMenu>

          <button className="md:hidden p-2 hover:bg-plant-surface rounded-lg transition-colors">
            <Menu size={20} className="text-plant-text" />
          </button>
        </div>
      </div>
    </header>
  );
}
