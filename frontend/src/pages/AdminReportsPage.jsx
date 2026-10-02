import React, { useState } from 'react';
import { Download, FileText, BarChart2 } from 'lucide-react';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import Footer from '../components/Footer';

const AdminReportsPage = () => {
  const [sidebarMobile, setSidebarMobile] = useState(false);

  const handleDownloadCSV = () => {
    window.open('/api/reports/export', '_blank');
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Navbar onToggleSidebar={() => setSidebarMobile(!sidebarMobile)} />

      <div className="flex-1 flex">
        <Sidebar mobileOpen={sidebarMobile} onCloseMobile={() => setSidebarMobile(false)} />

        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-4xl mx-auto w-full">
          
          <div className="mb-6">
            <h1 className="text-2xl font-extrabold text-slate-900">Operational Logistics Reports</h1>
            <p className="text-xs text-slate-500 mt-0.5">Export structured database reports for audit and performance analysis.</p>
          </div>

          <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm space-y-6">
            <div className="flex items-center gap-4 p-4 rounded-2xl bg-sky-50 border border-sky-100">
              <FileText className="w-8 h-8 text-sky-600 shrink-0" />
              <div className="flex-1">
                <h3 className="font-extrabold text-slate-900 text-sm">Full Parcel Lifecycle CSV Export</h3>
                <p className="text-xs text-slate-600 mt-0.5">
                  Includes tracking IDs, statuses, sender/receiver details, weight, shipping fee, agent assignments, and booking dates.
                </p>
              </div>
              <button
                onClick={handleDownloadCSV}
                className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs rounded-xl shadow-md flex items-center gap-1.5 shrink-0"
              >
                <Download className="w-4 h-4" /> Download CSV
              </button>
            </div>
          </div>

        </main>
      </div>

      <Footer />
    </div>
  );
};

export default AdminReportsPage;
