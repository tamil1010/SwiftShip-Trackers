import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Package, Search, Filter, PlusCircle, ArrowRight } from 'lucide-react';
import api from '../services/api';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import Footer from '../components/Footer';
import StatusBadge from '../components/StatusBadge';
import LoadingSpinner from '../components/LoadingSpinner';
import EmptyState from '../components/EmptyState';

const MyParcelsPage = () => {
  const [sidebarMobile, setSidebarMobile] = useState(false);
  const [parcels, setParcels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  useEffect(() => {
    fetchParcels();
  }, [search, statusFilter]);

  const fetchParcels = async () => {
    setLoading(true);
    try {
      let query = `/parcels?limit=50`;
      if (search) query += `&search=${encodeURIComponent(search)}`;
      if (statusFilter) query += `&status=${statusFilter}`;

      const res = await api.get(query);
      if (res.data.success) {
        setParcels(res.data.parcels);
      }
    } catch (err) {
      console.error('Failed to fetch user parcels:', err);
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
          
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
            <div>
              <h1 className="text-2xl font-extrabold text-slate-900">My Parcels</h1>
              <p className="text-xs text-slate-500 mt-0.5">Track and manage all shipments created by or sent to your account.</p>
            </div>
            <Link
              to="/book-parcel"
              className="px-4 py-2.5 bg-sky-600 hover:bg-sky-500 text-white font-bold text-xs rounded-xl shadow-sm transition-all flex items-center gap-1.5"
            >
              <PlusCircle className="w-4 h-4" /> Book New Parcel
            </Link>
          </div>

          {/* Search & Filter Bar */}
          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs mb-6 flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <input
                type="text"
                placeholder="Search by tracking number, city, recipient..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-9 pr-4 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-sky-500"
              />
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            </div>

            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-slate-400" />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-sky-500 font-semibold"
              >
                <option value="">All Statuses</option>
                <option value="BOOKED">Booked</option>
                <option value="PICKED_UP">Picked Up</option>
                <option value="IN_TRANSIT">In Transit</option>
                <option value="OUT_FOR_DELIVERY">Out for Delivery</option>
                <option value="DELIVERED">Delivered</option>
                <option value="DELIVERY_FAILED">Failed</option>
              </select>
            </div>
          </div>

          {/* Parcels List */}
          {loading ? (
            <LoadingSpinner text="Fetching your parcel records..." />
          ) : parcels.length > 0 ? (
            <div className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-slate-100 bg-slate-50/50 text-slate-400 font-bold uppercase tracking-wider">
                      <th className="py-3.5 px-4">Tracking ID</th>
                      <th className="py-3.5 px-4">Description</th>
                      <th className="py-3.5 px-4">Origin → Dest</th>
                      <th className="py-3.5 px-4">Status</th>
                      <th className="py-3.5 px-4">Booking Date</th>
                      <th className="py-3.5 px-4 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {parcels.map((p) => (
                      <tr key={p.id} className="hover:bg-slate-50/80 transition-colors">
                        <td className="py-3.5 px-4 font-mono font-bold text-slate-900">{p.trackingNumber}</td>
                        <td className="py-3.5 px-4 text-slate-700 font-medium">{p.packageDescription} ({p.weight} kg)</td>
                        <td className="py-3.5 px-4 text-slate-600">
                          {p.sender?.city || 'Origin'} → <strong>{p.receiver?.city || 'Destination'}</strong>
                        </td>
                        <td className="py-3.5 px-4"><StatusBadge status={p.status} size="sm" /></td>
                        <td className="py-3.5 px-4 text-slate-500">{new Date(p.bookingDate || p.createdAt || Date.now()).toLocaleDateString()}</td>
                        <td className="py-3.5 px-4 text-right">
                          <Link
                            to={`/track/${p.trackingNumber}`}
                            className="px-3.5 py-1.5 bg-sky-50 text-sky-700 hover:bg-sky-100 font-bold rounded-lg transition-colors inline-flex items-center gap-1"
                          >
                            Track <ArrowRight className="w-3 h-3" />
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ) : (
            <EmptyState
              title="No parcels found"
              description="No shipments matched your search criteria."
            />
          )}

        </main>
      </div>

      <Footer />
    </div>
  );
};

export default MyParcelsPage;
