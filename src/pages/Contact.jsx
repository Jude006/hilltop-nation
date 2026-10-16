import React from "react";
import ContactBanner from "../components/contact/ContactBanner";
import ContactInfoHub from "../components/contact/ContactInfoHub";
import ContactForm from "../components/contact/ContactForm";
import ChurchMap from "../components/contact/ChurchMap";
import ServiceSchedule from "../components/contact/ServiceSchedule";
import SEO from "../components/common/SEO";

const Contact = () => {
  return (
    /* Mirroring the Home page "frame" style */
    <div className="bg-[#f0f0f0] min-h-screen">
      <SEO
        title="Contact Us"
        description="Get in touch with Hilltop Nation. Visit us at 5b Tarmac Road, Dalemo, Sango Ota, Ogun State. Call or send us a message."
        keywords="contact Hilltop Nation, ministry address Sango Ota, church phone number, visit our ministry"
        url="/contact"
        tags={[
          "contact",
          "location",
          "address",
          "Sango Ota",
          "Radiant Illumination",
        ]}
      />

      {/* Framed Banner: Matches Home Banner padding */}
      <div className="p-0 md:p-3 lg:p-4">
        <ContactBanner />
      </div>

      {/* Main Content Area */}
      <div className="mt-20 bg-white">
        {/* 1. Quick Info: Phone, Email, Address cards */}
        <ContactInfoHub />

        {/* 2. Form & Map: Side-by-side on desktop, stacked on mobile */}
        <div className="grid grid-cols-1 border-t border-gray-100 lg:grid-cols-2">
          <div className="p-6 md:p-12 lg:p-20">
            <ContactForm />
          </div>

          <div className="h-[400px] lg:h-auto min-h-[500px] bg-gray-50">
            <ChurchMap />
          </div>
        </div>

        <ServiceSchedule />
      </div>
    </div>
  );
};

export default Contact;
