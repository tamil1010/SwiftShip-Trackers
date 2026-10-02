import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Package, Search, ShieldCheck, ArrowRight, Clock, MapPin, Sparkles, CheckCircle2, Users, BarChart2, Headphones, Truck, Zap } from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const LandingPage = () => {
  const [trackingNumber, setTrackingNumber] = useState('');
  const navigate = useNavigate();

  const handleTrackSubmit = (e) => {
    e.preventDefault();
    if (trackingNumber.trim()) {
      navigate(`/track/${trackingNumber.trim()}`);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Navbar />

      {/* Hero Section */}
      <section className="relative overflow-hidden gradient-hero text-white pt-20 pb-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto text-center relative z-10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 border border-white/20 text-sky-300 text-xs font-semibold mb-6 backdrop-blur-md">
            <Sparkles className="w-4 h-4 text-amber-400" /> Next-Gen AI-Powered Logistics System
          </div>
          
          <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight leading-tight mb-6">
            Track Every Shipment. <br />
            <span className="bg-gradient-to-r from-sky-400 via-indigo-300 to-emerald-400 bg-clip-text text-transparent">
              Deliver With Confidence.
            </span>
          </h1>

          <p className="text-slate-300 text-base sm:text-lg max-w-2xl mx-auto mb-10 leading-relaxed font-normal">
            SwiftShip Tracker delivers automated parcel lifecycle management, live GPS location mapping, agent dispatching, real-time customer notifications, and DB-integrated AI support.
          </p>

          {/* Quick Tracking Search Box */}
          <div className="max-w-2xl mx-auto bg-white/10 p-2 sm:p-3 rounded-2xl border border-white/20 backdrop-blur-md shadow-2xl">
            <form onSubmit={handleTrackSubmit} className="flex flex-col sm:flex-row gap-2">
              <div className="relative flex-1">
                <input
                  type="text"
                  placeholder="Enter Tracking Number (e.g., SST-20261002-10001)..."
                  value={trackingNumber}
                  onChange={(e) => setTrackingNumber(e.target.value)}
                  className="w-full pl-11 pr-4 py-3.5 text-sm bg-slate-900/80 text-white placeholder-slate-400 rounded-xl border border-slate-700 focus:outline-none focus:border-sky-400"
                />
                <Search className="w-5 h-5 text-slate-400 absolute left-3.5 top-4" />
              </div>
              <button
                type="submit"
                className="px-6 py-3.5 bg-gradient-to-r from-sky-500 to-indigo-600 hover:from-sky-400 hover:to-indigo-500 text-white font-extrabold text-sm rounded-xl shadow-lg transition-all flex items-center justify-center gap-2"
              >
                <span>TRACK SHIPMENT</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          </div>

          {/* Direct Demo Tracking Link Chip */}
          <div className="mt-4 text-xs text-slate-400 flex items-center justify-center gap-2">
            <span>Try demo tracking number:</span>
            <button
              onClick={() => navigate('/track/SST-20261002-10001')}
              className="text-sky-400 underline font-mono font-bold hover:text-sky-300"
            >
              SST-20261002-10001
            </button>
          </div>
        </div>
      </section>

      {/* Live Operational Metrics Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-10 relative z-20">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white p-6 rounded-2xl shadow-lg border border-slate-200 text-center">
            <div className="text-3xl font-extrabold text-slate-900 mb-1">99.4%</div>
            <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider">On-Time Deliveries</div>
          </div>
          <div className="bg-white p-6 rounded-2xl shadow-lg border border-slate-200 text-center">
            <div className="text-3xl font-extrabold text-sky-600 mb-1">15,000+</div>
            <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Parcels Handled</div>
          </div>
          <div className="bg-white p-6 rounded-2xl shadow-lg border border-slate-200 text-center">
            <div className="text-3xl font-extrabold text-emerald-600 mb-1">7 Hubs</div>
            <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Regional Coverage</div>
          </div>
          <div className="bg-white p-6 rounded-2xl shadow-lg border border-slate-200 text-center">
            <div className="text-3xl font-extrabold text-indigo-600 mb-1">&lt; 3 Sec</div>
            <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Real-Time Sync</div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-xs font-bold text-sky-600 uppercase tracking-widest mb-2">End-to-End Workflow</h2>
          <h3 className="text-3xl font-extrabold text-slate-900">How SwiftShip Tracker Works</h3>
          <p className="text-slate-600 text-sm mt-3">
            From instant online booking to final recipient signature, every step is audited and updated in real time.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm text-center relative">
            <div className="w-12 h-12 rounded-xl bg-sky-100 text-sky-600 font-bold text-lg flex items-center justify-center mx-auto mb-4">
              1
            </div>
            <h4 className="font-bold text-slate-900 mb-2">Book Parcel</h4>
            <p className="text-xs text-slate-500 leading-relaxed">
              Customer fills sender/receiver details, weight, and package dimensions to generate a unique tracking ID.
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm text-center relative">
            <div className="w-12 h-12 rounded-xl bg-indigo-100 text-indigo-600 font-bold text-lg flex items-center justify-center mx-auto mb-4">
              2
            </div>
            <h4 className="font-bold text-slate-900 mb-2">Dispatch & Pickup</h4>
            <p className="text-xs text-slate-500 leading-relaxed">
              Admin assigns a local delivery agent who confirms pickup and scans parcel into the hub.
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm text-center relative">
            <div className="w-12 h-12 rounded-xl bg-amber-100 text-amber-600 font-bold text-lg flex items-center justify-center mx-auto mb-4">
              3
            </div>
            <h4 className="font-bold text-slate-900 mb-2">Live Tracking</h4>
            <p className="text-xs text-slate-500 leading-relaxed">
              Customer and agent monitor live route milestones, status updates, and interactive map locations.
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm text-center relative">
            <div className="w-12 h-12 rounded-xl bg-emerald-100 text-emerald-600 font-bold text-lg flex items-center justify-center mx-auto mb-4">
              4
            </div>
            <h4 className="font-bold text-slate-900 mb-2">Delivery & AI Assist</h4>
            <p className="text-xs text-slate-500 leading-relaxed">
              Agent completes delivery confirmation, notifications trigger, and AI assistant provides details.
            </p>
          </div>
        </div>
      </section>

      {/* Role-Based Features Matrix */}
      <section className="bg-slate-100 py-20 border-t border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-xs font-bold text-sky-600 uppercase tracking-widest mb-2">Multi-Role Architecture</h2>
            <h3 className="text-3xl font-extrabold text-slate-900">Tailored Dashboards for Every Stakeholder</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
              <div className="w-10 h-10 rounded-xl bg-sky-600 text-white flex items-center justify-center mb-4">
                <Users className="w-5 h-5" />
              </div>
              <h4 className="font-bold text-slate-900 text-base mb-2">Customer</h4>
              <ul className="text-xs text-slate-600 space-y-2">
                <li className="flex items-center gap-1.5"><CheckCircle2 className="w-4 h-4 text-emerald-500" /> Book & manage parcels</li>
                <li className="flex items-center gap-1.5"><CheckCircle2 className="w-4 h-4 text-emerald-500" /> Live map & timeline</li>
                <li className="flex items-center gap-1.5"><CheckCircle2 className="w-4 h-4 text-emerald-500" /> DB-aware AI Assistant</li>
                <li className="flex items-center gap-1.5"><CheckCircle2 className="w-4 h-4 text-emerald-500" /> Raise support tickets</li>
              </ul>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
              <div className="w-10 h-10 rounded-xl bg-indigo-600 text-white flex items-center justify-center mb-4">
                <Truck className="w-5 h-5" />
              </div>
              <h4 className="font-bold text-slate-900 text-base mb-2">Delivery Agent</h4>
              <ul className="text-xs text-slate-600 space-y-2">
                <li className="flex items-center gap-1.5"><CheckCircle2 className="w-4 h-4 text-emerald-500" /> Assigned parcel view</li>
                <li className="flex items-center gap-1.5"><CheckCircle2 className="w-4 h-4 text-emerald-500" /> Update location & status</li>
                <li className="flex items-center gap-1.5"><CheckCircle2 className="w-4 h-4 text-emerald-500" /> Delivery note logging</li>
                <li className="flex items-center gap-1.5"><CheckCircle2 className="w-4 h-4 text-emerald-500" /> Daily performance stats</li>
              </ul>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
              <div className="w-10 h-10 rounded-xl bg-amber-600 text-white flex items-center justify-center mb-4">
                <Headphones className="w-5 h-5" />
              </div>
              <h4 className="font-bold text-slate-900 text-base mb-2">Support Staff</h4>
              <ul className="text-xs text-slate-600 space-y-2">
                <li className="flex items-center gap-1.5"><CheckCircle2 className="w-4 h-4 text-emerald-500" /> Global shipment search</li>
                <li className="flex items-center gap-1.5"><CheckCircle2 className="w-4 h-4 text-emerald-500" /> Customer lookup</li>
                <li className="flex items-center gap-1.5"><CheckCircle2 className="w-4 h-4 text-emerald-500" /> Handle delivery tickets</li>
                <li className="flex items-center gap-1.5"><CheckCircle2 className="w-4 h-4 text-emerald-500" /> Log resolution notes</li>
              </ul>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
              <div className="w-10 h-10 rounded-xl bg-slate-900 text-white flex items-center justify-center mb-4">
                <BarChart2 className="w-5 h-5" />
              </div>
              <h4 className="font-bold text-slate-900 text-base mb-2">System Admin</h4>
              <ul className="text-xs text-slate-600 space-y-2">
                <li className="flex items-center gap-1.5"><CheckCircle2 className="w-4 h-4 text-emerald-500" /> Full user management</li>
                <li className="flex items-center gap-1.5"><CheckCircle2 className="w-4 h-4 text-emerald-500" /> Agent assignment workspace</li>
                <li className="flex items-center gap-1.5"><CheckCircle2 className="w-4 h-4 text-emerald-500" /> Analytics charts & metrics</li>
                <li className="flex items-center gap-1.5"><CheckCircle2 className="w-4 h-4 text-emerald-500" /> CSV export reports</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-slate-900 text-white text-center px-4">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl font-extrabold mb-4">Ready to Experience SwiftShip Tracker?</h2>
          <p className="text-slate-400 text-sm mb-8">
            Log in with pre-configured demo credentials or register a new customer account to test parcel booking and live tracking!
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              to="/login"
              className="px-6 py-3 bg-sky-500 hover:bg-sky-400 text-white font-extrabold text-sm rounded-xl shadow-lg transition-all"
            >
              Sign In to Demo Accounts
            </Link>
            <Link
              to="/register"
              className="px-6 py-3 bg-slate-800 hover:bg-slate-700 text-slate-200 font-extrabold text-sm rounded-xl border border-slate-700 transition-all"
            >
              Create New Customer Account
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default LandingPage;
