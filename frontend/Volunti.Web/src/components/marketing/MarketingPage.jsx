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

export default function MarketingPage({ setView }) {
  return (
    <div className="marketing-page">
      <MarketingNavbar setView={setView} />
      <HeroSection setView={setView} />
      <FeaturesSection />
      <HowItWorksSection />
      <CommunitySection />
      <FeedPreviewSection />
      <StoriesSection />
      <CtaSection setView={setView} />
      <MarketingFooter />
    </div>
  );
}
