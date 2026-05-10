import React from "react";
import MarketingNavbar from "./MarketingNavbar";
import HeroSection from "./HeroSection";
import FeaturesSection from "./FeaturesSection";
import HowItWorksSection from "./HowItWorksSection";
import CommunitySection from "./CommunitySection";
import FeedPreviewSection from "./FeedPreviewSection";
import StoriesSection from "./StoriesSection";
import CtaSection from "./CtaSection";
import MarketingFooter from "./MarketingFooter";

export default function MarketingPage() {
  return (
    <div className="marketing-page">
      <MarketingNavbar />
      <HeroSection />
      <FeaturesSection />
      <HowItWorksSection />
      <CommunitySection />
      <FeedPreviewSection />
      <StoriesSection />
      <CtaSection />
      <MarketingFooter />
    </div>
  );
}
