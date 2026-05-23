import Link from "next/link";
import { Globe, Rss, Share2, Leaf, MapPin, Phone, Mail } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-plant-text text-white">
      {/* Main footer */}
      <div className="max-w-7xl mx-auto px-4 pt-16 pb-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          {/* Brand */}
          <div className="md:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-full bg-plant-primary flex items-center justify-center">
                <Leaf size={16} className="text-white" />
              </div>
              <span className="font-playfair text-lg font-bold">Thế giới cây xanh</span>
            </div>
            <p className="text-white/45 text-sm leading-relaxed max-w-sm mb-6">
              Mang thiên nhiên vào ngôi nhà của bạn. Hơn 500 loại cây, hoa và dụng cụ làm vườn — giao toàn quốc.
            </p>
            <div className="flex gap-3">
              {[
                { Icon: Share2, href: "#", label: "Instagram" },
                { Icon: Globe, href: "#", label: "Facebook" },
                { Icon: Rss, href: "#", label: "YouTube" },
              ].map(({ Icon, href, label }) => (
                <a
                  key={label}
                  href={href}
                  aria-label={label}
                  className="w-9 h-9 rounded-full bg-white/8 hover:bg-white/16 flex items-center justify-center transition-colors border border-white/10"
                >
                  <Icon size={15} className="text-white/60" />
                </a>
              ))}
            </div>
          </div>

          {/* Links */}
          <div>
            <h4 className="font-semibold text-xs uppercase tracking-widest text-white/40 mb-5">
              Khám phá
            </h4>
            <ul className="space-y-3">
              {[
                { label: "Trang chủ", href: "/" },
                { label: "Sản phẩm", href: "/products" },
                { label: "Đơn hàng", href: "/orders" },
                { label: "Hồ sơ", href: "/profile" },
              ].map(({ label, href }) => (
                <li key={href}>
                  <Link href={href} className="text-white/50 text-sm hover:text-white transition-colors">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-semibold text-xs uppercase tracking-widest text-white/40 mb-5">
              Liên hệ
            </h4>
            <ul className="space-y-3">
              <li className="flex items-start gap-2.5 text-white/50 text-sm">
                <Mail size={14} className="shrink-0 mt-0.5" />
                hello@cayxanh.vn
              </li>
              <li className="flex items-start gap-2.5 text-white/50 text-sm">
                <Phone size={14} className="shrink-0 mt-0.5" />
                0909 123 456
              </li>
              <li className="flex items-start gap-2.5 text-white/50 text-sm">
                <MapPin size={14} className="shrink-0 mt-0.5" />
                TP. Hồ Chí Minh
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-white/8">
        <div className="max-w-7xl mx-auto px-4 py-5 flex flex-col sm:flex-row items-center justify-between gap-2">
          <p className="text-white/30 text-xs">© 2026 Thế giới cây xanh. All rights reserved.</p>
          <p className="text-white/20 text-xs">Thiết kế với ♥ tại Việt Nam</p>
        </div>
      </div>
    </footer>
  );
}
