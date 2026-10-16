import React from "react";
import { Phone, Mail, MapPin, Clock, ArrowUpRight } from "lucide-react";
import { motion } from "framer-motion";

const contacts = [
  {
    icon: Phone,
    title: "Call Us",
    details: ["+234 816 194 2727"],
    sub: "Available for calls & WhatsApp",
    href: "tel:+2348161942727",
    iconWrap: "bg-secondary/10 text-secondary group-hover:bg-secondary group-hover:text-white",
    subText: "text-secondary/70",
  },
  {
    icon: Mail,
    title: "Email Us",
    details: ["Illuminationradiant@gmail.com"],
    sub: "Response within 24 hours",
    href: "mailto:Illuminationradiant@gmail.com",
    iconWrap: "bg-accent/10 text-accent group-hover:bg-accent group-hover:text-white",
    subText: "text-accent/80",
  },
  {
    icon: MapPin,
    title: "Visit Us",
    details: ["5b Tarmac Road, Dalemo", "Sango Ota, Ogun State"],
    sub: "Get Directions",
    href: "https://www.google.com/maps/search/?api=1&query=5b+Tarmac+Road+Dalemo+Sango+Ota+Ogun+State",
    iconWrap: "bg-secondaryLight/15 text-secondaryLight group-hover:bg-secondaryLight group-hover:text-primary",
    subText: "text-secondaryLight/80",
  },
  {
    icon: Clock,
    title: "Service Times",
    details: ["Wednesdays — 5:30 PM", "Deep Unto Deep"],
    sub: "View Full Schedule",
    href: "#service-schedule",
    iconWrap: "bg-secondary/10 text-secondary group-hover:bg-secondary group-hover:text-white",
    subText: "text-secondary/70",
  },
];

const ContactInfoHub = () => {
  return (
    <section className="px-4 py-16 md:py-24 md:px-8 lg:px-16 bg-background">
      <div className="container max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="mb-10 md:mb-14"
        >
          <div className="inline-flex items-center gap-2.5 px-4 py-1.5 bg-lightBackground border border-black/5 rounded-full mb-5">
            <span className="w-1.5 h-1.5 rounded-full bg-secondaryLight" />
            <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-primary/50 font-albert-sans">
              Get In Touch
            </span>
          </div>

          <h2 className="max-w-2xl text-3xl font-black tracking-tight md:text-4xl lg:text-5xl font-heading-sans text-primary leading-[1.1]">
            We'd love to <span className="text-secondaryLight">hear from you.</span>
          </h2>
        </motion.div>

        {/* Grid */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 md:gap-5">
          {contacts.map((item, index) => {
            const Icon = item.icon;
            const isExternal = item.href.startsWith("http");
            return (
              <motion.a
                key={item.title}
                href={item.href}
                target={isExternal ? "_blank" : undefined}
                rel={isExternal ? "noopener noreferrer" : undefined}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.08 }}
                className="relative block p-6 transition-all duration-500 border bg-lightBackground border-black/5 group md:p-7 rounded-2xl hover:shadow-lg hover:shadow-primary/5 hover:-translate-y-1"
              >
                <div
                  className={`flex items-center justify-center w-10 h-10 mb-5 transition-all duration-500 md:w-11 md:h-11 rounded-xl ${item.iconWrap}`}
                >
                  <Icon size={20} />
                </div>

                <h3 className="text-[11px] font-bold uppercase tracking-[0.15em] text-primary/40 mb-3 font-albert-sans">
                  {item.title}
                </h3>

                <div className="mb-4 space-y-1">
                  {item.details.map((line) => (
                    <p
                      key={line}
                      className="text-sm md:text-[15px] font-semibold text-primary font-albert-sans leading-snug break-all"
                    >
                      {line}
                    </p>
                  ))}
                </div>

                <div
                  className={`flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-wider ${item.subText}`}
                >
                  <span>{item.sub}</span>
                  <ArrowUpRight
                    size={11}
                    className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                  />
                </div>
              </motion.a>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default ContactInfoHub;