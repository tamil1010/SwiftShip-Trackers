import React, { useState, useEffect } from 'react';
import { Package, Search, Filter, UserCheck, ArrowRight } from 'lucide-react';
import api from '../services/api';
import { useToast } from '../context/ToastContext';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import Footer from '../components/Footer';
import StatusBadge from '../components/StatusBadge';
import LoadingSpinner from '../components/LoadingSpinner';

const ParcelManagementPage = () => {
  const [sidebarMobile, setSidebarMobile] = useState(false);
  const [parcels, setParcels] = useState([]);
  const [agents, setAgents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [selectedParcel, setSelectedParcel] = useState(null);
  const [selectedAgentId, setSelectedAgentId] = useState('');
  const { addToast } = useToast();

  useEffect(() => {
    fetchParcels();
    fetchAgents();
  }, [search, statusFilter]);

  const fetchParcels = async () => {
    setLoading(true);
    try {
      let q = '/parcels?limit=50';
      if (search) q += `&search=${encodeURIComponent(search)}`;
      if (statusFilter) q += `&status=${statusFilter}`;
      const res = await api.get(q);
      if (res.data.success) {
        setParcels(res.data.parcels);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchAgents = async () => {
    try {
      const res = await api.get('/users/agents');
      if (res.data.success) {
        setAgents(res.data.agents);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleAssignAgent = async (e) => {
    e.preventDefault();
    if (!selectedParcel || !selectedAgentId) return;

    try {
      const res = await api.put(`/parcels/${selectedParcel.id}/assign`, { agentId: selectedAgentId });
      if (res.data.success) {
        addToast(`Agent assigned to parcel ${selectedParcel.trackingNumber}!`, 'success');
        setSelectedParcel(null);
        fetchParcels();
      }
    } catch (err) {
      addToast(err.response?.data?.message || 'Failed to assign agent.', 'error');
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Navbar onToggleSidebar={() => setSidebarMobile(!sidebarMobile)} />

      <div className="flex-1 flex">
        <Sidebar mobileOpen={sidebarMobile} onCloseMobile={() => setSidebarMobile(false)} />

        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto w-full">
          
          <div className="mb-6">
            <h1 className="text-2xl font-extrabold text-slate-900">Parcel Logistics Control Center</h1>
            <p className="text-xs text-slate-500 mt-0.5">Global overview of all registered shipments and agent dispatch assignments.</p>
          </div>

          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs mb-6 flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <input
                type="text"
                placeholder="Search tracking ID, sender, receiver, or city..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-9 pr-4 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none"
              />
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            </div>

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl font-bold"
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

          {loading ? (
            <LoadingSpinner text="Fetching parcel data..." />
          ) : (
            <div className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-slate-100 bg-slate-50/50 text-slate-400 font-bold uppercase">
                      <th className="py-3 px-4">Tracking ID</th>
                      <th className="py-3 px-4">Route (Origin → Dest)</th>
                      <th className="py-3 px-4">Assigned Agent</th>
                      <th className="py-3 px-4">Status</th>
                      <th className="py-3 px-4 text-right">Assign Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {parcels.map((p) => (
                      <tr key={p.id} className="hover:bg-slate-50/80">
                        <td className="py-3.5 px-4 font-mono font-bold text-slate-900">{p.trackingNumber}</td>
                        <td className="py-3.5 px-4 text-slate-700">{p.sender.city} → <strong>{p.receiver.city}</strong></td>
                        <td className="py-3.5 px-4 font-bold text-slate-800">
                          {p.assignedAgent ? p.assignedAgent.name : <span className="text-amber-600 font-normal italic">Unassigned</span>}
                        </td>
                        <td className="py-3.5 px-4"><StatusBadge status={p.status} size="sm" /></td>
                        <td className="py-3.5 px-4 text-right">
                          <button
                            onClick={() => { setSelectedParcel(p); setSelectedAgentId(p.assignedAgentId || ''); }}
                            className="px-3 py-1 bg-sky-50 text-sky-700 font-bold rounded-lg hover:bg-sky-100"
                          >
                            Assign Agent
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Assign Agent Modal */}
          {selectedParcel && (
            <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4 z-50">
              <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200 space-y-4">
                <h3 className="font-extrabold text-base text-slate-900">Assign Delivery Agent</h3>
                <p className="text-xs font-mono font-bold text-sky-600">{selectedParcel.trackingNumber}</p>

                <form onSubmit={handleAssignAgent} className="space-y-3 text-xs">
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Select Active Agent *</label>
                    <select
                      required
                      value={selectedAgentId}
                      onChange={(e) => setSelectedAgentId(e.target.value)}
                      className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-bold"
                    >
                      <option value="">-- Choose Delivery Agent --</option>
                      {agents.map((ag) => (
                        <option key={ag.id} value={ag.id}>
                          {ag.name} ({ag.city}) - {ag._count?.assignedParcels || 0} active parcels
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="flex justify-end gap-2 pt-2">
                    <button type="button" onClick={() => setSelectedParcel(null)} className="px-4 py-2 bg-slate-100 text-slate-700 font-bold rounded-xl">Cancel</button>
                    <button type="submit" className="px-5 py-2 bg-sky-600 hover:bg-sky-500 text-white font-bold rounded-xl shadow-md">Confirm Assignment</button>
                  </div>
                </form>
              </div>
            </div>
          )}

        </main>
      </div>

      <Footer />
    </div>
  );
};

export default ParcelManagementPage;
