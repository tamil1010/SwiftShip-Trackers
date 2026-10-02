import React, { useState } from 'react';
import { Bell, Send } from 'lucide-react';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import Footer from '../components/Footer';

const AdminNotificationsPage = () => {
  const [sidebarMobile, setSidebarMobile] = useState(false);

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Navbar onToggleSidebar={() => setSidebarMobile(!sidebarMobile)} />

      <div className="flex-1 flex">
        <Sidebar mobileOpen={sidebarMobile} onCloseMobile={() => setSidebarMobile(false)} />

        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-4xl mx-auto w-full">
          <div className="mb-6">
            <h1 className="text-2xl font-extrabold text-slate-900">System Notification Alerts</h1>
            <p className="text-xs text-slate-500 mt-0.5">Automated and broadcast notifications triggers.</p>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs">
            <p className="text-xs text-slate-600">Notifications are automatically generated on parcel booking, agent assignment, and status updates.</p>
          </div>
        </main>
      </div>

      <Footer />
    </div>
  );
};

export default AdminNotificationsPage;
