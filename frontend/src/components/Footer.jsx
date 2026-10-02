import React from 'react';
import { Package, Mail, Phone, MapPin, ShieldCheck, Heart } from 'lucide-react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-slate-900 text-slate-400 text-xs border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          
          {/* Brand info */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-white font-extrabold text-lg">
              <div className="w-8 h-8 rounded-lg bg-sky-500 flex items-center justify-center text-white">
                <Package className="w-4 h-4" />
              </div>
              <span>SWIFTSHIP TRACKER</span>
            </div>
            <p className="text-slate-400 text-xs leading-relaxed">
              Centralized parcel management & real-time tracking platform. Empowering logistics operations with automated updates and AI intelligence.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white font-bold text-sm mb-3">Quick Navigation</h4>
            <ul className="space-y-2">
              <li><Link to="/track" className="hover:text-white transition-colors">Public Shipment Tracking</Link></li>
              <li><Link to="/book-parcel" className="hover:text-white transition-colors">Book a Parcel</Link></li>
              <li><Link to="/about" className="hover:text-white transition-colors">About SwiftShip</Link></li>
              <li><Link to="/faq" className="hover:text-white transition-colors">Frequently Asked Questions</Link></li>
              <li><Link to="/contact" className="hover:text-white transition-colors">Contact Support</Link></li>
            </ul>
          </div>

          {/* Operational Hubs */}
          <div>
            <h4 className="text-white font-bold text-sm mb-3">Regional Hubs</h4>
            <ul className="space-y-1.5 text-slate-400">
              <li className="flex items-center gap-2"><MapPin className="w-3.5 h-3.5 text-sky-400" /> Chennai Central Sorting Yard</li>
              <li className="flex items-center gap-2"><MapPin className="w-3.5 h-3.5 text-sky-400" /> Coimbatore Logistics Hub</li>
              <li className="flex items-center gap-2"><MapPin className="w-3.5 h-3.5 text-sky-400" /> Tirunelveli Express Hub</li>
              <li className="flex items-center gap-2"><MapPin className="w-3.5 h-3.5 text-sky-400" /> Bengaluru & Hyderabad Depots</li>
            </ul>
          </div>

          {/* Contact & Support */}
          <div>
            <h4 className="text-white font-bold text-sm mb-3">24/7 Support</h4>
            <div className="space-y-2 text-slate-400">
              <div className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-sky-400" />
                <span>+91 1800-SWIFTSHIP</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-sky-400" />
                <span>support@swiftship.demo</span>
              </div>
              <div className="mt-4 p-2.5 rounded-xl bg-slate-800/80 border border-slate-700 text-[11px]">
                <ShieldCheck className="w-4 h-4 text-emerald-400 inline mr-1" />
                256-bit Encrypted Parcel Lifecycle Security
              </div>
            </div>
          </div>

        </div>

        <div className="mt-8 pt-6 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between text-slate-500 text-[11px]">
          <div>&copy; {new Date().getFullYear()} SwiftShip Tracker Platform. All Rights Reserved.</div>
          <div className="mt-2 sm:mt-0 flex items-center gap-1">
            Built with React, Express, Prisma & Socket.IO
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
