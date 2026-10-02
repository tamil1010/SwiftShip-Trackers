import React from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { Shield, Zap, Database, Cpu, Truck, CheckCircle2 } from 'lucide-react';

const AboutPage = () => {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Navbar />

      <main className="flex-1 max-w-5xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <h1 className="text-3xl font-extrabold text-slate-900 mb-3">About SwiftShip Tracker</h1>
          <p className="text-slate-600 text-sm">
            Centralized logistics, real-time parcel tracking, and intelligent DB-aware assistance platform.
          </p>
        </div>

        <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm mb-10 space-y-6 text-sm text-slate-700 leading-relaxed">
          <h2 className="text-xl font-bold text-slate-900">Project Mission & Architecture</h2>
          <p>
            SwiftShip Tracker is designed to eliminate fragmented parcel tracking, manual status updates, and customer support bottlenecks. Built on modern Node.js, Express, Prisma ORM with SQLite, React, Socket.IO, and Leaflet Maps, it provides end-to-end operational visibility.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4">
            <div className="p-4 rounded-2xl bg-sky-50 border border-sky-100">
              <Database className="w-6 h-6 text-sky-600 mb-2" />
              <h3 className="font-bold text-slate-900 text-sm mb-1">Relational Integrity</h3>
              <p className="text-xs text-slate-600">Prisma schema with foreign keys, unique tracking index, and full event audit logging.</p>
            </div>
            <div className="p-4 rounded-2xl bg-indigo-50 border border-indigo-100">
              <Zap className="w-6 h-6 text-indigo-600 mb-2" />
              <h3 className="font-bold text-slate-900 text-sm mb-1">Real-Time WebSockets</h3>
              <p className="text-xs text-slate-600">Socket.IO rooms push instantaneous tracking updates to customers when status changes.</p>
            </div>
            <div className="p-4 rounded-2xl bg-amber-50 border border-amber-100">
              <Cpu className="w-6 h-6 text-amber-600 mb-2" />
              <h3 className="font-bold text-slate-900 text-sm mb-1">DB-Aware AI Assistant</h3>
              <p className="text-xs text-slate-600">Conversational AI engine queries real database records to answer tracking and ETA inquiries.</p>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default AboutPage;
