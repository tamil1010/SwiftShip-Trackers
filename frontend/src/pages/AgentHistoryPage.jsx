import React, { useState, useEffect } from 'react';
import { CheckCircle2, Search } from 'lucide-react';
import api from '../services/api';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import Footer from '../components/Footer';
import StatusBadge from '../components/StatusBadge';
import LoadingSpinner from '../components/LoadingSpinner';
import EmptyState from '../components/EmptyState';

const AgentHistoryPage = () => {
  const [sidebarMobile, setSidebarMobile] = useState(false);
  const [parcels, setParcels] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    setLoading(true);
    try {
      const res = await api.get('/parcels?status=DELIVERED');
      if (res.data.success) {
        setParcels(res.data.parcels);
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
          
          <div className="mb-6">
            <h1 className="text-2xl font-extrabold text-slate-900">Completed Delivery History</h1>
            <p className="text-xs text-slate-500 mt-0.5">Archived log of parcels successfully delivered by your account.</p>
          </div>

          {loading ? (
            <LoadingSpinner text="Fetching delivery history..." />
          ) : parcels.length > 0 ? (
            <div className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-slate-100 bg-slate-50/50 text-slate-400 font-bold uppercase">
                      <th className="py-3 px-4">Tracking ID</th>
                      <th className="py-3 px-4">Recipient</th>
                      <th className="py-3 px-4">Destination</th>
                      <th className="py-3 px-4">Delivered Date</th>
                      <th className="py-3 px-4 text-right">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {parcels.map((p) => (
                      <tr key={p.id} className="hover:bg-slate-50/80">
                        <td className="py-3.5 px-4 font-mono font-bold text-slate-900">{p.trackingNumber}</td>
                        <td className="py-3.5 px-4 font-bold text-slate-800">{p.receiver.name}</td>
                        <td className="py-3.5 px-4 text-slate-600">{p.receiver.city}</td>
                        <td className="py-3.5 px-4 text-slate-500">
                          {p.deliveredAt ? new Date(p.deliveredAt).toLocaleString() : new Date(p.updatedAt).toLocaleDateString()}
                        </td>
                        <td className="py-3.5 px-4 text-right"><StatusBadge status={p.status} size="sm" /></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ) : (
            <EmptyState title="No completed deliveries yet" description="Delivered parcels will be listed here." />
          )}

        </main>
      </div>

      <Footer />
    </div>
  );
};

export default AgentHistoryPage;
