import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Headphones, Search, AlertCircle, CheckCircle2, Clock, Package } from 'lucide-react';
import api from '../services/api';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import Footer from '../components/Footer';
import StatCard from '../components/StatCard';
import LoadingSpinner from '../components/LoadingSpinner';

const SupportDashboard = () => {
  const [sidebarMobile, setSidebarMobile] = useState(false);
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({ open: 0, inProgress: 0, resolved: 0 });

  useEffect(() => {
    fetchSupportData();
  }, []);

  const fetchSupportData = async () => {
    setLoading(true);
    try {
      const res = await api.get('/support');
      if (res.data.success) {
        const list = res.data.tickets;
        setTickets(list);
        setStats({
          open: list.filter((t) => t.status === 'OPEN').length,
          inProgress: list.filter((t) => t.status === 'IN_PROGRESS').length,
          resolved: list.filter((t) => t.status === 'RESOLVED' || t.status === 'CLOSED').length,
        });
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Navbar onToggleSidebar={() => setSidebarMobile(!sidebarMobile)} />

      <div className="flex-1 flex">
        <Sidebar mobileOpen={sidebarMobile} onCloseMobile={() => setSidebarMobile(false)} />

        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto w-full">
          
          <div className="bg-gradient-to-r from-amber-600 to-slate-900 text-white p-6 sm:p-8 rounded-3xl shadow-xl mb-8">
            <h1 className="text-2xl sm:text-3xl font-extrabold">Support Staff Console</h1>
            <p className="text-xs text-amber-200 mt-1">Customer inquiry management, shipment tracking verification, and ticket resolution desk.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
            <StatCard title="Open Inquiries" value={stats.open} icon={AlertCircle} color="amber" />
            <StatCard title="In Progress" value={stats.inProgress} icon={Clock} color="indigo" />
            <StatCard title="Resolved Tickets" value={stats.resolved} icon={CheckCircle2} color="emerald" />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-base font-extrabold text-slate-900">Recent Customer Tickets</h3>
                <Link to="/support/tickets" className="text-xs font-bold text-sky-600 hover:underline">View All</Link>
              </div>

              {loading ? (
                <LoadingSpinner text="Loading tickets..." />
              ) : tickets.length > 0 ? (
                <div className="space-y-3">
                  {tickets.slice(0, 4).map((t) => (
                    <div key={t.id} className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
                      <div className="flex justify-between items-start">
                        <h4 className="font-bold text-xs text-slate-900">{t.subject}</h4>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-amber-100 text-amber-800">{t.status}</span>
                      </div>
                      <p className="text-[11px] text-slate-600 mt-1">Customer: <strong>{t.user?.name || 'Customer'}</strong> ({t.user?.email || 'N/A'})</p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-slate-500">No support tickets found.</p>
              )}
            </div>

            <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-4">
              <h3 className="text-base font-extrabold text-slate-900">Quick Tools</h3>
              <Link
                to="/support/search"
                className="p-4 rounded-2xl bg-sky-50 border border-sky-100 flex items-center gap-3 hover:bg-sky-100 transition-colors"
              >
                <Search className="w-6 h-6 text-sky-600" />
                <div>
                  <h4 className="font-bold text-xs text-slate-900">Global Shipment & Customer Search</h4>
                  <p className="text-[11px] text-slate-500">Search parcels by tracking ID, phone, city, or customer name.</p>
                </div>
              </Link>
            </div>
          </div>

        </main>
      </div>

      <Footer />
    </div>
  );
};

export default SupportDashboard;
