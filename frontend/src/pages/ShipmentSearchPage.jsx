import React, { useState } from 'react';
import { Search, Package, User, MapPin, ArrowRight } from 'lucide-react';
import api from '../services/api';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import Footer from '../components/Footer';
import StatusBadge from '../components/StatusBadge';
import LoadingSpinner from '../components/LoadingSpinner';
import EmptyState from '../components/EmptyState';
import { Link } from 'react-router-dom';

const ShipmentSearchPage = () => {
  const [sidebarMobile, setSidebarMobile] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    setLoading(true);
    setSearched(true);
    try {
      const res = await api.get(`/parcels?search=${encodeURIComponent(searchQuery.trim())}&limit=20`);
      if (res.data.success) {
        setResults(res.data.parcels);
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
            <h1 className="text-2xl font-extrabold text-slate-900">Global Shipment Search</h1>
            <p className="text-xs text-slate-500 mt-0.5">Search shipments by tracking number, customer name, phone, or city.</p>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs mb-8">
            <form onSubmit={handleSearch} className="flex gap-3">
              <div className="relative flex-1">
                <input
                  type="text"
                  placeholder="Enter tracking ID (SST-...), customer name, phone number, or city..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-sky-500"
                />
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
              </div>
              <button
                type="submit"
                className="px-6 py-3 bg-sky-600 hover:bg-sky-500 text-white font-bold text-xs sm:text-sm rounded-xl shadow-md"
              >
                Search Database
              </button>
            </form>
          </div>

          {loading ? (
            <LoadingSpinner text="Searching database..." />
          ) : searched && results.length > 0 ? (
            <div className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-slate-100 bg-slate-50/50 text-slate-400 font-bold uppercase">
                      <th className="py-3 px-4">Tracking ID</th>
                      <th className="py-3 px-4">Sender</th>
                      <th className="py-3 px-4">Receiver</th>
                      <th className="py-3 px-4">Status</th>
                      <th className="py-3 px-4 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {results.map((p) => (
                      <tr key={p.id} className="hover:bg-slate-50/80">
                        <td className="py-3.5 px-4 font-mono font-bold text-slate-900">{p.trackingNumber}</td>
                        <td className="py-3.5 px-4 text-slate-700">{p.sender.name} ({p.sender.city})</td>
                        <td className="py-3.5 px-4 text-slate-700">{p.receiver.name} ({p.receiver.city})</td>
                        <td className="py-3.5 px-4"><StatusBadge status={p.status} size="sm" /></td>
                        <td className="py-3.5 px-4 text-right">
                          <Link
                            to={`/track/${p.trackingNumber}`}
                            className="px-3 py-1.5 bg-sky-50 text-sky-700 font-bold rounded-lg"
                          >
                            Inspect
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ) : searched ? (
            <EmptyState title="No matching shipments" description="No parcels found matching your query." />
          ) : null}

        </main>
      </div>

      <Footer />
    </div>
  );
};

export default ShipmentSearchPage;
