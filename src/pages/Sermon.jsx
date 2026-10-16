import React, { useState } from "react";
import SermonHero from "../components/sermon/SermonHero";
import SermonFilters from "../components/sermon/SermonFilters";
import SermonGrid from "../components/sermon/SermonGrid";
import SEO from "../components/common/SEO";

const Sermon = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDate, setSelectedDate] = useState(null);

  return (
    <>
      <SEO
        title="Sermons & Messages"
        description="Listen to Spirit-filled messages from Hilltop Nation. Powerful teachings on revelation, revival, transformation, and the Christ-life message."
        keywords="sermons, Hilltop Nation sermons, Evangelist Moses Adetola messages, Christ-life teachings, revival messages"
        url="/sermon"
        tags={[
          "sermons",
          "teachings",
          "messages",
          "revelation",
          "revival",
          "Radiant Illumination",
        ]}
      />

      <div className="min-h-screen bg-[#f0f0f0]">
        <div className="p-0 md:p-3 lg:p-4">
          <SermonHero />
        </div>

        <SermonFilters
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          selectedDate={selectedDate}
          setSelectedDate={setSelectedDate}
        />

        <div className="max-w-6xl px-6 py-12 mx-auto">
          <div className="mb-10">
            <p className="text-secondary font-albert-sans text-xs uppercase tracking-[0.4em] mb-3">
              Message Library
            </p>
            <h2 className="text-4xl font-black tracking-tighter text-black uppercase md:text-5xl font-heading-sans">
              All Sermons
            </h2>
          </div>

          <SermonGrid searchQuery={searchQuery} selectedDate={selectedDate} />
        </div>
      </div>
    </>
  );
};

export default Sermon;
