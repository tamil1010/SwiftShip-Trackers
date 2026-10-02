import React, { useState } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { ChevronDown, HelpCircle } from 'lucide-react';

const FAQS = [
  {
    q: 'How do I book a new parcel?',
    a: 'Log in as a customer, click "Book Parcel" in your dashboard sidebar, fill out the sender, receiver, and package weight details, and click submit to receive a unique tracking ID.',
  },
  {
    q: 'Where do I find my parcel tracking number?',
    a: 'Your tracking number begins with "SST-" followed by the date and digits (e.g., SST-20261002-10001). It is shown on your booking confirmation page and listed in "My Parcels".',
  },
  {
    q: 'How does real-time tracking work?',
    a: 'When a delivery agent updates your parcel status (e.g. from IN_TRANSIT to OUT_FOR_DELIVERY), Socket.IO automatically pushes the update to your screen without requiring a refresh.',
  },
  {
    q: 'How do I ask the AI assistant about my shipment?',
    a: 'Click the floating "SwiftShip AI" button at the bottom-right of the screen and type a prompt containing your tracking number, such as "Where is parcel SST-20261002-10001?".',
  },
  {
    q: 'What happens if a delivery attempt fails?',
    a: 'The parcel status updates to "DELIVERY_FAILED". You can raise a support ticket in your customer dashboard to request a rescheduled delivery time slot.',
  },
];

const FAQPage = () => {
  const [openIdx, setOpenIdx] = useState(null);

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Navbar />

      <main className="flex-1 max-w-4xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <div className="w-12 h-12 rounded-2xl bg-sky-600 text-white flex items-center justify-center mx-auto mb-3 shadow-lg">
            <HelpCircle className="w-6 h-6" />
          </div>
          <h1 className="text-3xl font-extrabold text-slate-900 mb-2">Frequently Asked Questions</h1>
          <p className="text-slate-600 text-sm">Everything you need to know about SwiftShip Tracker logistics operations.</p>
        </div>

        <div className="space-y-4">
          {FAQS.map((faq, idx) => (
            <div key={idx} className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
              <button
                onClick={() => setOpenIdx(openIdx === idx ? null : idx)}
                className="w-full p-5 text-left flex items-center justify-between font-bold text-slate-900 text-sm hover:bg-slate-50 transition-colors"
              >
                <span>{faq.q}</span>
                <ChevronDown className={`w-5 h-5 text-slate-400 transition-transform ${openIdx === idx ? 'rotate-180 text-sky-600' : ''}`} />
              </button>
              {openIdx === idx && (
                <div className="p-5 pt-0 text-xs text-slate-600 border-t border-slate-100 bg-slate-50/50 leading-relaxed">
                  {faq.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default FAQPage;
