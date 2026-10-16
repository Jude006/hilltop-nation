import React from "react";
import SEO from "../components/common/SEO";

import GivingWays from "../components/giving/GivingWays";
import GivingAccounts from "../components/giving/GivingAccounts";
import GivingHero from "../components/giving/GivingHero";

const Donation = () => {
  return (
    <>
      <SEO
        title="Give & Support The Ministry"
        description="Support the work of God at Hilltop Nation. Your giving helps us raise Christ ambassadors and illuminate the world with God's truth, love, power, and glory."
        keywords="give to ministry, tithes, offerings, support Hilltop Nation, kingdom giving, sow a seed"
        url="/donation"
        tags={[
          "donation",
          "giving",
          "tithes",
          "offering",
          "Radiant Illumination",
        ]}
      />

      <GivingHero />
      <GivingWays />
      <GivingAccounts />
    </>
  );
};

export default Donation;
