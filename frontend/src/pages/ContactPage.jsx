import React from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { Mail, Phone, MapPin, Send } from 'lucide-react';

const ContactPage = () => {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Navbar />

      <main className="flex-1 max-w-5xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <h1 className="text-3xl font-extrabold text-slate-900 mb-3">Contact SwiftShip Logistics</h1>
          <p className="text-slate-600 text-sm">Have questions about parcel dispatching or support services? Reach out to our team.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-6">
            <h3 className="font-bold text-slate-900 text-base">Support Channels</h3>
            
            <div className="space-y-4 text-xs text-slate-600">
              <div className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-sky-600 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-slate-900 block">Central Hub Headquarters</strong>
                  SwiftShip Logistics Center, OMR Tech Corridor, Chennai 600096
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Phone className="w-5 h-5 text-sky-600 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-slate-900 block">Toll-Free Hotline</strong>
                  +91 1800-SWIFTSHIP (+91 1800 794 3874)
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Mail className="w-5 h-5 text-sky-600 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-slate-900 block">Email Inquiries</strong>
                  support@swiftship.demo
                </div>
              </div>
            </div>
          </div>

          <div className="md:col-span-2 bg-white p-8 rounded-3xl border border-slate-200 shadow-sm">
            <h3 className="font-bold text-slate-900 text-base mb-4">Send a Message</h3>
            <form onSubmit={(e) => { e.preventDefault(); alert('Message sent! Our support team will contact you shortly.'); }} className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Your Name</label>
                  <input type="text" required placeholder="Arun Kumar" className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl" />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Email Address</label>
                  <input type="email" required placeholder="arun@example.com" className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl" />
                </div>
              </div>
              <div>
                <label className="block font-bold text-slate-700 mb-1">Subject</label>
                <input type="text" required placeholder="Inquiry regarding express shipping..." className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl" />
              </div>
              <div>
                <label className="block font-bold text-slate-700 mb-1">Message</label>
                <textarea rows={4} required placeholder="Describe your inquiry..." className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl" />
              </div>
              <button type="submit" className="px-6 py-3 bg-sky-600 hover:bg-sky-500 text-white font-bold rounded-xl flex items-center gap-2">
                <Send className="w-4 h-4" /> Send Message
              </button>
            </form>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default ContactPage;
