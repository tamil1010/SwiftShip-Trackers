import React, { useState, useEffect } from 'react';
import { Truck, Search, ArrowRight } from 'lucide-react';
import api from '../services/api';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import Footer from '../components/Footer';
import StatusBadge from '../components/StatusBadge';
import LoadingSpinner from '../components/LoadingSpinner';
import EmptyState from '../components/EmptyState';
import { Link } from 'react-router-dom';

const AssignedParcelsPage = () => {
  const [sidebarMobile, setSidebarMobile] = useState(false);
  const [parcels, setParcels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    fetchParcels();
  }, [search]);

  const fetchParcels = async () => {
    setLoading(true);
    try {
      let query = `/parcels?limit=50`;
      if (search) query += `&search=${encodeURIComponent(search)}`;
      const res = await api.get(query);
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
            <h1 className="text-2xl font-extrabold text-slate-900">Assigned Parcel Worklist</h1>
            <p className="text-xs text-slate-500 mt-0.5">View and update dispatches assigned to your delivery account.</p>
          </div>

          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs mb-6">
            <div className="relative">
              <input
                type="text"
                placeholder="Search assigned parcels..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-9 pr-4 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none"
              />
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            </div>
          </div>

          {loading ? (
            <LoadingSpinner text="Fetching assigned parcels..." />
          ) : parcels.length > 0 ? (
            <div className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-slate-100 bg-slate-50/50 text-slate-400 font-bold uppercase">
                      <th className="py-3 px-4">Tracking ID</th>
                      <th className="py-3 px-4">Recipient</th>
                      <th className="py-3 px-4">Destination</th>
                      <th className="py-3 px-4">Status</th>
                      <th className="py-3 px-4 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {parcels.map((p) => (
                      <tr key={p.id} className="hover:bg-slate-50/80">
                        <td className="py-3.5 px-4 font-mono font-bold text-slate-900">{p.trackingNumber}</td>
                        <td className="py-3.5 px-4 font-bold text-slate-800">{p.receiver.name} ({p.receiver.phone})</td>
                        <td className="py-3.5 px-4 text-slate-600">{p.receiver.address}, {p.receiver.city}</td>
                        <td className="py-3.5 px-4"><StatusBadge status={p.status} size="sm" /></td>
                        <td className="py-3.5 px-4 text-right">
                          <Link
                            to={`/track/${p.trackingNumber}`}
                            className="px-3.5 py-1.5 bg-indigo-50 text-indigo-700 font-bold rounded-lg"
                          >
                            Details
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ) : (
            <EmptyState title="No assigned parcels found" description="You have no active parcels assigned." />
          )}

        </main>
      </div>

      <Footer />
    </div>
  );
};

export default AssignedParcelsPage;
