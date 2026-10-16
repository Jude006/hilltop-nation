import React from "react";
import AboutHero from "../components/about/AboutHero";
import OurStory from "../components/about/OurStory";
import VisionMission from "../components/about/VisionMission";
import SEO from "../components/common/SEO";
import PillarsSection from "../components/home/PillarsSection";

const About = () => {
  return (
    <>
      <SEO
        title="About Our Ministry & Vision"
        description="Hilltop Nation is a city of sanctified people commissioned to raise men whose desire is to be like Christ upon the earth. Led by Apostle Chisom Okechukwu, we are raising Christlike men and establishing the Kingdom of God."
        keywords="about Hilltop Nation, Apostle Chisom Okechukwu, HTN church, Christlike men, sanctified people, apostolic ministry, Sango Ota church"
        url="/about"
        tags={[
          "about",
          "vision",
          "mission",
          "Apostle Chisom Okechukwu",
          "Hilltop Nation",
          "Christlike men",
        ]}
      />

      <main className="bg-[#f0f0f0] overflow-hidden p-0 md:p-3 lg:p-4 mb-10">
        {/* 1. Hero */}
        <AboutHero />

        {/* 2. Story */}
        <section className="px-6 py-24 mx-auto max-w-7xl">
          <OurStory />
        </section>

        {/* 3. Vision */}
        <section id="vision-mission" className="px-6 py-24 bg-gray-50">
          <div className="mx-auto max-w-7xl">
            <VisionMission />
          </div>
        </section>

        {/* 4. Pillars / Core Values */}
        <PillarsSection />
      </main>
    </>
  );
};

export default About;