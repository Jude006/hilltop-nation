import React from "react";
import Banner from "../components/home/Banner";
import Section1 from "../components/home/Section1";
import MinistriesSection from "../components/home/MinistriesSection";
import AboutSection from "../components/home/About";
import PillarsSection from "../components/home/PillarsSection";
import Gallery from "../components/home/Gallery";
import UpcomingPrograms from "../components/home/UpcomingPrograms";
import SermonSanctuary from "../components/home/SermonSanctuary";
import WhatsAppNoteTaker from "../components/home/WhatsAppNoteTaker";
import SEO from "../components/common/SEO";
import ServiceSchedule from "../components/contact/ServiceSchedule";

const Home = () => {
  return (
    <>
      <SEO
        title="A City of Sanctified People Raising Christlike Men"
        description="Hilltop Nation is a city of sanctified people commissioned to raise men whose desire is to be like Christ upon the earth. Join us in our impacting services with profound worship and word sessions."
        keywords="Hilltop Nation, HTN church, Apostle Chisom Okechukwu, Christlike men, sanctified people, worship, word sessions, apostolic ministry"
        url="/"
        tags={[
          "church",
          "Hilltop Nation",
          "HTN",
          "Christlike men",
          "sanctified",
          "worship",
          "apostolic ministry",
        ]}
      />

      <div className="bg-[#f0f0f0] min-h-screen ">
        <div className="p-0 md:p-3 lg:p-4">
          <Banner />
        </div>
        <div className="mt-20 bg-white">
          <Section1 />

          <AboutSection />
          <PillarsSection />
          <Gallery />
          <SermonSanctuary />
          <MinistriesSection />
          <UpcomingPrograms />
          <ServiceSchedule />
        </div>
        <WhatsAppNoteTaker />
      </div>
    </>
  );
};

export default Home;