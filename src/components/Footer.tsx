import React from "react";
import { Instagram, Facebook, Twitter } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-black text-white py-6">
      <div className="container mx-auto px-4 flex flex-col md:flex-row justify-between items-center gap-6">
        
        {/* Left Section: Social + Nav */}
        <div className="flex flex-col md:flex-row items-center gap-6">
          {/* Social Media Icons */}
          <div className="flex gap-6">
            <a
              href="https://instagram.com"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-pink-500 transition"
            >
              <Instagram className="w-6 h-6" />
            </a>
            <a
              href="https://facebook.com"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-blue-500 transition"
            >
              <Facebook className="w-6 h-6" />
            </a>
            <a
              href="https://twitter.com"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-sky-400 transition"
            >
              <Twitter className="w-6 h-6" />
            </a>
          </div>

          {/* Navigation Links */}
          <div className="flex gap-6 text-sm md:text-base">
            <a href="/policy" className="hover:underline">
              Policy
            </a>
            <a href="/contact" className="hover:underline">
              Contact Us
            </a>
            <a href="/about" className="hover:underline">
              About Us
            </a>
          </div>
        </div>

        {/* Right Section: Copyright */}
        <div className="text-xs md:text-sm opacity-70 text-center md:text-right">
          © {new Date().getFullYear()} Your Company. All rights reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
