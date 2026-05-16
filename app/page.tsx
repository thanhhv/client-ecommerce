import PromoStrip from "@/components/home/PromoStrip";
import HeroBanner from "@/components/home/HeroBanner";
import CategoryGrid from "@/components/home/CategoryGrid";
import FeaturedProducts from "@/components/home/FeaturedProducts";
import TrustStrip from "@/components/home/TrustStrip";

export default function HomePage() {
  return (
    <>
      <PromoStrip />
      <HeroBanner />
      <CategoryGrid />
      <FeaturedProducts />
      <TrustStrip />
    </>
  );
}
