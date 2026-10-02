import React, { useState } from 'react';
import { Settings, Shield, Server, Database } from 'lucide-react';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import Footer from '../components/Footer';

const SystemSettingsPage = () => {
  const [sidebarMobile, setSidebarMobile] = useState(false);

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Navbar onToggleSidebar={() => setSidebarMobile(!sidebarMobile)} />

      <div className="flex-1 flex">
        <Sidebar mobileOpen={sidebarMobile} onCloseMobile={() => setSidebarMobile(false)} />

        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-4xl mx-auto w-full">
          <div className="mb-6">
            <h1 className="text-2xl font-extrabold text-slate-900">System Configuration</h1>
            <p className="text-xs text-slate-500 mt-0.5">Platform parameters and database status.</p>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-4 text-xs">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <span className="font-bold text-slate-700">Database Engine:</span>
              <span className="font-mono text-sky-700 font-bold">SQLite (Prisma ORM)</span>
            </div>
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <span className="font-bold text-slate-700">Real-Time Server:</span>
              <span className="font-mono text-emerald-700 font-bold">Socket.IO WebSockets Active</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="font-bold text-slate-700">AI Assistant Query Mode:</span>
              <span className="font-mono text-indigo-700 font-bold">Live Database Intent Parser Engine</span>
            </div>
          </div>
        </main>
      </div>

      <Footer />
    </div>
  );
};

export default SystemSettingsPage;
