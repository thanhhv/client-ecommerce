import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-plant-text text-white mt-16">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <div className="font-playfair text-xl font-bold mb-3">
              🌿 Thế giới cây xanh
            </div>
            <p className="text-gray-400 text-sm">
              Mang thiên nhiên vào ngôi nhà của bạn. Thế giới cây xanh tươi, giao hàng
              toàn quốc.
            </p>
          </div>
          <div>
            <h4 className="font-semibold mb-3 text-sm uppercase tracking-wide">
              Liên kết
            </h4>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/"
                  className="text-gray-400 text-sm hover:text-white transition-colors"
                >
                  Trang chủ
                </Link>
              </li>
              <li>
                <Link
                  href="/products"
                  className="text-gray-400 text-sm hover:text-white transition-colors"
                >
                  Sản phẩm
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-3 text-sm uppercase tracking-wide">
              Liên hệ
            </h4>
            <ul className="space-y-2 text-gray-400 text-sm">
              <li>📧 hello@cayxanh.vn</li>
              <li>📞 0909 123 456</li>
              <li>📍 TP. Hồ Chí Minh</li>
            </ul>
          </div>
        </div>
        <div className="border-t border-gray-700 mt-8 pt-6 text-center text-gray-500 text-xs">
          © 2026 Thế giới cây xanh. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
