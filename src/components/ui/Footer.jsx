import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Facebook,
  Instagram,
  Youtube,
  Mail,
  MapPin,
  Phone,
} from "lucide-react";
import { FaTiktok } from "react-icons/fa";

const Footer = () => {
  const currentYear = new Date().getFullYear();
  const navigate = useNavigate();
  const [clicks, setClicks] = useState(0);

  // Triple Click Logic — hidden admin access
  const handleAdminSecret = () => {
    setClicks((prev) => prev + 1);

    if (clicks + 1 === 3) {
      navigate("/htn-gate/login");
      setClicks(0);
    }

    setTimeout(() => setClicks(0), 1000);
  };

  return (
    <footer className="pt-20 pb-10 text-white bg-black border-t border-white/10">
      <div className="container px-6 mx-auto md:px-16">
        <div className="grid grid-cols-1 gap-12 mb-16 md:grid-cols-2 lg:grid-cols-4">
          {/* Column 1: Branding & Mission */}
          <div className="space-y-6">
            <img
              src="/img/logo-light.png"
              alt="Hilltop Nation Logo"
              className="w-auto h-12 transition-transform cursor-pointer select-none active:scale-95"
              onClick={handleAdminSecret}
            />
            <p className="font-light leading-relaxed text-gray-400 font-albert-sans">
              Hilltop Nation is a city of sanctified people commissioned to
              raise men whose desire is to be like Christ upon the earth. Join
              us in our impacting services with profound worship and word
              sessions.
            </p>
            <div className="flex gap-4">
              <a
                href="https://www.facebook.com/share/1CGgy44a3t/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Facebook"
                className="transition-colors hover:text-secondaryLight"
              >
                <Facebook size={20} />
              </a>
              <a
                href="https://www.instagram.com/htnwelfare"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
                className="transition-colors hover:text-secondaryLight"
              >
                <Instagram size={20} />
              </a>
              <a
                href="https://youtube.com/@hilltopnation"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="YouTube"
                className="transition-colors hover:text-secondaryLight"
              >
                <Youtube size={20} />
              </a>
              <a
                href="https://www.tiktok.com/@htnwelfare"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="TikTok"
                className="transition-colors hover:text-secondaryLight"
              >
                <FaTiktok size={20} />
              </a>
            </div>
          </div>

          {/* Column 2: Navigation */}
          <div className="space-y-6">
            <h4 className="text-sm font-black tracking-widest text-white uppercase">
              Navigation
            </h4>
            <ul className="space-y-4 text-sm font-light text-gray-400 font-albert-sans">
              <li>
                <a href="/" className="transition-colors hover:text-white">
                  Home
                </a>
              </li>
              <li>
                <a href="/about" className="transition-colors hover:text-white">
                  Our Vision
                </a>
              </li>
              <li>
                <a
                  href="/ministries"
                  className="transition-colors hover:text-white"
                >
                  Ministries
                </a>
              </li>
              <li>
                <a
                  href="/sermon"
                  className="transition-colors hover:text-white"
                >
                  Sermons
                </a>
              </li>
              <li>
                <a
                  href="/donation"
                  className="transition-colors hover:text-white"
                >
                  Give Online
                </a>
              </li>
            </ul>
          </div>

          {/* Column 3: Contact Info */}
          <div className="space-y-6">
            <h4 className="text-sm font-black tracking-widest text-white uppercase">
              Connect
            </h4>
            <ul className="space-y-4 text-sm font-light text-gray-400 font-albert-sans">
              <li className="flex items-start gap-3">
                <MapPin
                  size={18}
                  className="text-secondaryLight shrink-0 mt-0.5"
                />
                <span>
                  Sango Ota, <br />
                  Ogun State, Nigeria
                </span>
              </li>
              <li className="flex items-center gap-3">
                <Phone size={18} className="text-secondaryLight shrink-0" />
                <a
                  href="tel:+2348161942727"
                  className="transition-colors hover:text-white"
                >
                  +234 816 194 2727
                </a>
              </li>
              <li className="flex items-center gap-3">
                <Mail size={18} className="text-secondaryLight shrink-0" />
                <a
                  href="mailto:info@hilltopnation.org"
                  className="break-all transition-colors hover:text-white"
                >
                  info@hilltopnation.org
                </a>
              </li>
            </ul>
          </div>

          {/* Column 4: Newsletter */}
          <div className="space-y-6">
            <h4 className="text-sm font-black tracking-widest text-white uppercase">
              Stay Updated
            </h4>
            <p className="text-sm font-light text-gray-400">
              Join our mailing list for weekly devotionals and news.
            </p>
            <form
              className="flex flex-col gap-3"
              onSubmit={(e) => e.preventDefault()}
            >
              <input
                type="email"
                placeholder="Email Address"
                className="px-4 py-3 text-sm transition-colors border rounded-lg bg-white/5 border-white/10 focus:outline-none focus:border-secondaryLight"
              />
              <button className="py-3 text-xs font-bold tracking-widest text-black uppercase transition-all bg-white rounded-lg hover:bg-secondaryLight">
                Subscribe
              </button>
            </form>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4 text-[10px] font-medium uppercase tracking-[0.2em] text-gray-500">
          <p>© {currentYear} Hilltop Nation. ALL RIGHTS RESERVED.</p>
          <div className="flex gap-8">
            <span className="opacity-50">Sango Ota, Nigeria</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
