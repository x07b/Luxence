import { HeroSection } from "../components/HeroSection";
import { FeatureSection } from "../components/FeatureSection";
import { FeaturedProductsSection } from "../components/FeaturedProductsSection";
import { AboutSection } from "../components/AboutSection";
import { NewsletterSection } from "../components/NewsletterSection";

export default function Index() {
  return (
    <div className="w-full">
      <HeroSection />
      <FeatureSection />
      <FeaturedProductsSection />
      <AboutSection />
      <NewsletterSection />
    </div>
  );
}
