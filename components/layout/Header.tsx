"use client";

import Link from "next/link";
import { ShoppingCart, User, Menu, UserCircle, PackageSearch, LogOut, LogIn } from "lucide-react";
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
  DropdownMenuSeparator,
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
    <header className="sticky top-0 z-50 bg-white/85 backdrop-blur-xl border-b border-plant-border/50">
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
              className="flex items-center gap-1.5 px-2 py-1.5 hover:bg-plant-surface rounded-lg transition-colors"
              aria-label="Tài khoản"
            >
              {mounted && user ? (
                <>
                  {user.avatar ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={user.avatar} alt={user.name} className="w-7 h-7 rounded-full object-cover ring-2 ring-plant-primary/30" />
                  ) : (
                    <span className="w-7 h-7 rounded-full bg-plant-primary text-white text-xs font-semibold flex items-center justify-center shrink-0">
                      {user.name?.charAt(0).toUpperCase() ?? "U"}
                    </span>
                  )}
                  <span className="hidden md:block text-sm font-medium text-plant-text max-w-[96px] truncate">
                    {user.name?.split(" ").at(-1)}
                  </span>
                </>
              ) : (
                <User size={20} className="text-plant-text" />
              )}
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56 p-1.5">
              {user ? (
                <>
                  {/* User info header */}
                  <div className="flex items-center gap-3 px-2 py-2.5 mb-1">
                    <div className="w-9 h-9 rounded-full bg-plant-primary/10 flex items-center justify-center shrink-0 overflow-hidden">
                      {user.avatar ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
                      ) : (
                        <span className="text-plant-primary font-semibold text-sm">
                          {user.name?.charAt(0).toUpperCase() ?? "U"}
                        </span>
                      )}
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-plant-text truncate">{user.name}</p>
                      <p className="text-xs text-plant-muted truncate">{user.email}</p>
                    </div>
                  </div>
                  <DropdownMenuSeparator className="mx-1 mb-1" />
                  <DropdownMenuItem className="gap-2.5 px-2 py-2 cursor-pointer rounded-md p-0">
                    <Link href="/profile" className="flex items-center gap-2.5 w-full px-2 py-2">
                      <UserCircle size={16} className="text-plant-muted shrink-0" />
                      <span>Hồ sơ của tôi</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem className="gap-2.5 px-2 py-2 cursor-pointer rounded-md p-0">
                    <Link href="/orders" className="flex items-center gap-2.5 w-full px-2 py-2">
                      <PackageSearch size={16} className="text-plant-muted shrink-0" />
                      <span>Đơn hàng của tôi</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator className="mx-1 mt-1" />
                  <DropdownMenuItem
                    variant="destructive"
                    className="gap-2.5 px-2 py-2 cursor-pointer rounded-md mt-0.5"
                    onClick={handleLogout}
                  >
                    <LogOut size={16} className="shrink-0" />
                    <span>Đăng xuất</span>
                  </DropdownMenuItem>
                </>
              ) : (
                <DropdownMenuItem className="gap-2.5 cursor-pointer rounded-md p-0">
                  <Link href="/auth/login" className="flex items-center gap-2.5 w-full px-2 py-2">
                    <LogIn size={16} className="text-plant-muted shrink-0" />
                    <span>Đăng nhập</span>
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
