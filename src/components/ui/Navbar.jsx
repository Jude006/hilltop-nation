import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, ArrowUpRight } from "lucide-react";
import { Link } from "react-router-dom";

const Navbar = () => {
  const [isSticky, setIsSticky] = useState(false);
  const [mobileMenu, setMobileMenu] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsSticky(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { name: "Home", href: "/" },
    { name: "About", href: "/about" },
    { name: "Gallery", href: "/gallery" },
    { name: "Giving", href: "/donation" },
    { name: "Sermons", href: "/sermon" },
    { name: "Contact", href: "/contact" },
  ];

  return (
    <nav
      className={`fixed top-0 left-0 w-full z-[100]  transition-all duration-500 ${
        isSticky ? "bg-black/90 backdrop-blur-lg py-3" : "bg-transparent py-6"
      }`}
    >
      <div className="container flex items-center justify-between px-6 mx-auto md:px-12">
        {/* Logo */}
        <div className="flex-shrink-0">
          <img
            src="/img/logo-light.png"
            alt="Logo"
            className="object-contain h-10 md:h-12"
          />
        </div>

        {/* Desktop Links */}
        <div className="items-center hidden gap-10 lg:flex">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              to={link.href}
              className="text-white/80 hover:text-secondaryLight text-[13px] font-bold uppercase tracking-[0.15em] transition-colors font-albert-sans"
            >
              {link.name}
            </Link>
          ))}
        </div>

        {/* Right Action */}
        <div className="flex items-center gap-6">
          <Link to="/contact">
            <button className="hidden md:flex items-center gap-2 bg-secondaryLight text-primary px-6 py-2.5 rounded-full text-[12px] font-black uppercase tracking-wider hover:brightness-110 transition-all group">
              Get In Touch
              <ArrowUpRight
                size={16}
                className="transition-transform group-hover:rotate-45"
              />
            </button>
          </Link>
          <button
            className="text-white lg:hidden"
            onClick={() => setMobileMenu(!mobileMenu)}
          >
            {mobileMenu ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>
      </div>

      {/* Thin Divider Line (Matches Image) */}
      <div className="absolute bottom-0 left-0 w-full h-[1px] bg-white/10" />

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenu && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="absolute left-0 flex flex-col w-full gap-6 p-8 bg-black border-t top-full border-white/10 lg:hidden"
          >
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                onClick={() => setMobileMenu(false)}
                className="text-xl tracking-tight text-white font-heading-serif"
              >
                {link.name}
              </a>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
