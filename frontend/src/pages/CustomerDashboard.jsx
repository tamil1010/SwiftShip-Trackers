import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Package, PlusCircle, Clock, Navigation, Truck, CheckCircle2, Search, ArrowRight, Bell, Headphones } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import Footer from '../components/Footer';
import StatCard from '../components/StatCard';
import StatusBadge from '../components/StatusBadge';
import LoadingSpinner from '../components/LoadingSpinner';
import EmptyState from '../components/EmptyState';
import AIAssistantWidget from '../components/AIAssistantWidget';

const CustomerDashboard = () => {
  const { user } = useAuth();
  const [sidebarMobile, setSidebarMobile] = useState(false);
  const [parcels, setParcels] = useState([]);
  const [stats, setStats] = useState({ total: 0, booked: 0, inTransit: 0, outForDelivery: 0, delivered: 0 });
  const [loading, setLoading] = useState(true);
  const [quickSearch, setQuickSearch] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetchParcels();
  }, []);

  const fetchParcels = async () => {
    try {
      const res = await api.get('/parcels?limit=10');
      if (res.data.success) {
        const list = res.data.parcels;
        setParcels(list);

        const total = list.length;
        const booked = list.filter((p) => p.status === 'BOOKED').length;
        const inTransit = list.filter((p) => p.status === 'IN_TRANSIT' || p.status === 'PICKED_UP').length;
        const outForDelivery = list.filter((p) => p.status === 'OUT_FOR_DELIVERY').length;
        const delivered = list.filter((p) => p.status === 'DELIVERED').length;

        setStats({ total, booked, inTransit, outForDelivery, delivered });
      }
    } catch (err) {
      console.error('Error loading customer dashboard parcels:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleQuickSearchSubmit = (e) => {
    e.preventDefault();
    if (quickSearch.trim()) {
      navigate(`/track/${quickSearch.trim()}`);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Navbar onToggleSidebar={() => setSidebarMobile(!sidebarMobile)} />

      <div className="flex-1 flex">
        <Sidebar mobileOpen={sidebarMobile} onCloseMobile={() => setSidebarMobile(false)} />

        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto w-full">
          
          {/* Welcome Banner */}
          <div className="bg-gradient-to-r from-sky-600 to-indigo-700 text-white p-6 sm:p-8 rounded-3xl shadow-xl mb-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-extrabold">Welcome back, {user?.name}!</h1>
              <p className="text-xs text-sky-100 mt-1">Manage your active bookings and monitor live parcel dispatches.</p>
            </div>
            <Link
              to="/book-parcel"
              className="px-5 py-3 bg-white text-sky-700 hover:bg-sky-50 font-extrabold text-xs rounded-xl shadow-lg transition-all flex items-center gap-2 shrink-0"
            >
              <PlusCircle className="w-4 h-4" /> Book New Parcel
            </Link>
          </div>

          {/* Statistics Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
            <StatCard title="Total Parcels" value={stats.total} icon={Package} color="sky" />
            <StatCard title="Booked" value={stats.booked} icon={Clock} color="indigo" />
            <StatCard title="In Transit" value={stats.inTransit} icon={Navigation} color="amber" />
            <StatCard title="Out For Delivery" value={stats.outForDelivery} icon={Truck} color="amber" />
            <StatCard title="Delivered" value={stats.delivered} icon={CheckCircle2} color="emerald" />
          </div>

          {/* Quick Tracking Widget & Recent Parcels */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
            
            {/* Recent Shipments Table */}
            <div className="lg:col-span-2 bg-white p-6 rounded-3xl border border-slate-200 shadow-xs">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-base font-extrabold text-slate-900">Recent Shipments</h3>
                <Link to="/my-parcels" className="text-xs font-bold text-sky-600 hover:underline flex items-center gap-1">
                  View All <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>

              {loading ? (
                <LoadingSpinner text="Loading shipments..." />
              ) : parcels.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="border-b border-slate-100 text-slate-400 font-bold uppercase tracking-wider">
                        <th className="pb-3 px-2">Tracking ID</th>
                        <th className="pb-3 px-2">Destination</th>
                        <th className="pb-3 px-2">Status</th>
                        <th className="pb-3 px-2">Date</th>
                        <th className="pb-3 px-2 text-right">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {parcels.slice(0, 5).map((p) => (
                        <tr key={p.id} className="hover:bg-slate-50/80 transition-colors">
                          <td className="py-3 px-2 font-mono font-bold text-slate-900">{p.trackingNumber}</td>
                          <td className="py-3 px-2 text-slate-700 font-medium">{p.receiver?.city || 'Destination'}</td>
                          <td className="py-3 px-2"><StatusBadge status={p.status} size="sm" /></td>
                          <td className="py-3 px-2 text-slate-500">{new Date(p.bookingDate || p.createdAt || Date.now()).toLocaleDateString()}</td>
                          <td className="py-3 px-2 text-right">
                            <Link
                              to={`/track/${p.trackingNumber}`}
                              className="px-3 py-1 bg-sky-50 text-sky-700 hover:bg-sky-100 font-bold rounded-lg transition-colors"
                            >
                              Track
                            </Link>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <EmptyState
                  title="No parcels booked yet"
                  description="You haven't placed any parcel orders. Click below to create your first booking."
                  actionLabel="Book a Parcel"
                  onAction={() => navigate('/book-parcel')}
                />
              )}
            </div>

            {/* Quick Track & Shortcuts */}
            <div className="space-y-6">
              <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs">
                <h3 className="text-sm font-extrabold text-slate-900 mb-3">Quick Parcel Tracking</h3>
                <form onSubmit={handleQuickSearchSubmit} className="space-y-3">
                  <input
                    type="text"
                    placeholder="Enter Tracking SST-..."
                    value={quickSearch}
                    onChange={(e) => setQuickSearch(e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-sky-500 font-mono"
                  />
                  <button
                    type="submit"
                    className="w-full py-2 bg-sky-600 hover:bg-sky-500 text-white font-bold text-xs rounded-xl shadow-xs transition-all flex items-center justify-center gap-1.5"
                  >
                    <Search className="w-3.5 h-3.5" /> Track Now
                  </button>
                </form>
              </div>

              <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-3">
                <h3 className="text-sm font-extrabold text-slate-900">Need Help?</h3>
                <p className="text-xs text-slate-500">
                  Have questions about delivery delays or address updates? Open a support ticket or chat with our AI assistant.
                </p>
                <div className="flex gap-2 pt-1">
                  <Link
                    to="/support"
                    className="flex-1 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs rounded-xl text-center transition-colors flex items-center justify-center gap-1"
                  >
                    <Headphones className="w-3.5 h-3.5" /> Support
                  </Link>
                </div>
              </div>
            </div>

          </div>

        </main>
      </div>

      <AIAssistantWidget />
      <Footer />
    </div>
  );
};

export default CustomerDashboard;
