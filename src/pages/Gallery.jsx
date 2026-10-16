import React, { useState } from "react";
import GalleryHero from "../components/gallery/GalleryHero";
import GalleryFilters from "../components/gallery/GalleryFilters";
import GalleryGrid from "../components/gallery/GalleryGrid";
import SEO from "../components/common/SEO";

const Gallery = () => {
  const [activeCategory, setActiveCategory] = useState("All");

  return (
    <>
      <SEO
        title="Photo Gallery"
        description="Explore moments of worship, fellowship, and community at Hilltop Nation. Captured moments of glory from our services and events."
        keywords="Hilltop Nation gallery, church photos, worship photos, church events, Sango Ota church"
        url="/gallery"
        tags={["gallery", "photos", "worship", "fellowship"]}
      />
      <div className="bg-[#f0f0f0] min-h-screen">
        {/* 1. The Dynamic Banner */}
        <div className="p-0 mb-10 md:p-3 lg:p-4">
          <GalleryHero />
        </div>

        {/* 2. Category Selector (Floating) */}
        <GalleryFilters
          activeCategory={activeCategory}
          setActiveCategory={setActiveCategory}
        />

        {/* 3. The Responsive Image Grid */}
        <div className="max-w-[1600px] mx-auto px-6 py-16">
          <div className="flex flex-col items-end justify-between gap-4 mb-12 md:flex-row">
            <h2 className="text-4xl leading-none tracking-tighter text-black uppercase md:text-5xl font-heading-sans">
              Captured <span className="text-secondaryLight">Moments</span>
            </h2>
            <p className="text-black/40 font-albert-sans text-xs uppercase tracking-[0.3em] font-bold">
              // Explore our journey
            </p>
          </div>

          <GalleryGrid activeCategory={activeCategory} />
        </div>
      </div>
    </>
  );
};

export default Gallery;
