// ─── Footer Component ─────────────────────────────────────────────────────────

import React from "react";
import Link from "next/link";
import { Instagram, Twitter, Facebook, Youtube, Mail, Phone, MapPin } from "lucide-react";

const footerLinks = {
  Vendors: ["Venues", "Photographers", "Caterers", "Decorators", "DJs & Music", "Cake Artists", "Makeup Artists"],
  Company: ["About Us", "How It Works", "Press", "Blog", "Careers"],
  Support: ["Help Center", "Trust & Safety", "Contact Us", "Vendor Guidelines"],
  Legal: ["Privacy Policy", "Terms of Service", "Cookie Policy", "Accessibility"],
};

export function Footer() {
  return (
    <footer className="bg-obsidian text-white">
      {/* Main Footer */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-2 md:grid-cols-6 gap-8">
          {/* Brand Column */}
          <div className="col-span-2">
            <Link href="/" className="flex items-center gap-2.5 mb-4">
              <div className="w-8 h-8 bg-brand-600 rounded-lg flex items-center justify-center">
                <span className="text-white text-sm font-bold font-display italic">E</span>
              </div>
              <span className="font-display text-xl font-semibold">
                Event<span className="text-brand-400">Space</span>
              </span>
            </Link>
            <p className="text-slate-400 text-sm font-body leading-relaxed mb-6 max-w-xs">
              India's most trusted marketplace for event vendors. Making every celebration extraordinary.
            </p>

            {/* Contact */}
            <div className="space-y-2 text-sm text-slate-400 font-body">
              <a href="tel:+918000000000" className="flex items-center gap-2 hover:text-white transition-colors">
                <Phone className="w-4 h-4 shrink-0" />
                +91 80000 00000
              </a>
              <a href="mailto:hello@eventspace.in" className="flex items-center gap-2 hover:text-white transition-colors">
                <Mail className="w-4 h-4 shrink-0" />
                hello@eventspace.in
              </a>
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 shrink-0" />
                Bangalore, India
              </div>
            </div>

            {/* Social */}
            <div className="flex items-center gap-3 mt-6">
              {[Instagram, Twitter, Facebook, Youtube].map((Icon, i) => (
                <a
                  key={i}
                  href="#"
                  className="w-9 h-9 rounded-lg bg-white/10 hover:bg-brand-600 flex items-center justify-center transition-all duration-200"
                >
                  <Icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Link Columns */}
          {Object.entries(footerLinks).map(([group, links]) => (
            <div key={group}>
              <h4 className="font-semibold text-sm text-white mb-4 font-body">{group}</h4>
              <ul className="space-y-2.5">
                {links.map((link) => (
                  <li key={link}>
                    <a
                      href="#"
                      className="text-sm text-slate-400 hover:text-white transition-colors font-body"
                    >
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-sm text-slate-500 font-body">
            © 2024 EventSpace Technologies Pvt. Ltd. All rights reserved.
          </p>
          <div className="flex items-center gap-1 text-sm text-slate-500 font-body">
            <span>Made with</span>
            <span className="text-brand-500 text-base">♥</span>
            <span>in India</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
