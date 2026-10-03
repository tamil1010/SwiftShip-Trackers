import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Truck, Clock, Navigation, CheckCircle2, AlertTriangle, ArrowRight, MapPin } from 'lucide-react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import Footer from '../components/Footer';
import StatCard from '../components/StatCard';
import StatusBadge from '../components/StatusBadge';
import LoadingSpinner from '../components/LoadingSpinner';
import EmptyState from '../components/EmptyState';

const AgentDashboard = () => {
  const { user } = useAuth();
  const { addToast } = useToast();
  const [sidebarMobile, setSidebarMobile] = useState(false);
  const [parcels, setParcels] = useState([]);
  const [stats, setStats] = useState({ assigned: 0, pendingPickup: 0, inTransit: 0, outForDelivery: 0, deliveredToday: 0 });
  const [loading, setLoading] = useState(true);

  // Status update modal state
  const [selectedParcel, setSelectedParcel] = useState(null);
  const [newStatus, setNewStatus] = useState('');
  const [newLocation, setNewLocation] = useState('');
  const [notes, setNotes] = useState('');
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    fetchAgentParcels();
  }, []);

  const fetchAgentParcels = async () => {
    setLoading(true);
    try {
      const res = await api.get('/parcels?limit=50');
      if (res.data.success) {
        const list = res.data.parcels;
        setParcels(list);

        const assigned = list.length;
        const pendingPickup = list.filter((p) => p.status === 'BOOKED').length;
        const inTransit = list.filter((p) => p.status === 'IN_TRANSIT' || p.status === 'PICKED_UP').length;
        const outForDelivery = list.filter((p) => p.status === 'OUT_FOR_DELIVERY').length;
        const deliveredToday = list.filter((p) => p.status === 'DELIVERED').length;

        setStats({ assigned, pendingPickup, inTransit, outForDelivery, deliveredToday });
      }
    } catch (err) {
      console.error('Failed to load agent parcels:', err);
    } finally {
      setLoading(false);
    }
  };

  const openUpdateModal = (parcel) => {
    setSelectedParcel(parcel);
    setNewStatus(parcel.status);
    setNewLocation(parcel.currentLocation);
    setNotes('');
  };

  const handleStatusSubmit = async (e) => {
    e.preventDefault();
    if (!selectedParcel || !newStatus) return;

    setUpdating(true);
    try {
      const res = await api.put(`/parcels/${selectedParcel.id}/status`, {
        status: newStatus,
        currentLocation: newLocation,
        notes,
      });

      if (res.data.success) {
        addToast(`Shipment ${selectedParcel.trackingNumber} status updated to ${newStatus.replace(/_/g, ' ')}!`, 'success');
        setSelectedParcel(null);
        fetchAgentParcels();
      }
    } catch (err) {
      addToast(err.response?.data?.message || 'Status transition error.', 'error');
    } finally {
      setUpdating(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Navbar onToggleSidebar={() => setSidebarMobile(!sidebarMobile)} />

      <div className="flex-1 flex">
        <Sidebar mobileOpen={sidebarMobile} onCloseMobile={() => setSidebarMobile(false)} />

        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto w-full">
          
          <div className="bg-gradient-to-r from-indigo-700 to-slate-900 text-white p-6 sm:p-8 rounded-3xl shadow-xl mb-8">
            <h1 className="text-2xl sm:text-3xl font-extrabold">Delivery Agent Workstation</h1>
            <p className="text-xs text-indigo-200 mt-1">Agent: <strong>{user?.name}</strong> | Operating Hub: <strong>{user?.city || 'Regional Depot'}</strong></p>
          </div>

          {/* Stat Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
            <StatCard title="Assigned Parcels" value={stats.assigned} icon={Truck} color="indigo" />
            <StatCard title="Pending Pickup" value={stats.pendingPickup} icon={Clock} color="sky" />
            <StatCard title="In Transit" value={stats.inTransit} icon={Navigation} color="amber" />
            <StatCard title="Out for Delivery" value={stats.outForDelivery} icon={Truck} color="amber" />
            <StatCard title="Delivered Today" value={stats.deliveredToday} icon={CheckCircle2} color="emerald" />
          </div>

          {/* Assigned Parcels Table */}
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs mb-8">
            <h3 className="text-base font-extrabold text-slate-900 mb-4">Assigned Deliveries Queue</h3>

            {loading ? (
              <LoadingSpinner text="Fetching assigned deliveries..." />
            ) : parcels.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-slate-100 bg-slate-50/50 text-slate-400 font-bold uppercase tracking-wider">
                      <th className="py-3 px-3">Tracking ID</th>
                      <th className="py-3 px-3">Receiver & Address</th>
                      <th className="py-3 px-3">Current Location</th>
                      <th className="py-3 px-3">Status</th>
                      <th className="py-3 px-3 text-right">Update Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {parcels.map((p) => (
                      <tr key={p.id} className="hover:bg-slate-50/80 transition-colors">
                        <td className="py-3.5 px-3 font-mono font-bold text-slate-900">{p.trackingNumber}</td>
                        <td className="py-3.5 px-3">
                          <div className="font-bold text-slate-800">{p.receiver?.name || 'Recipient'}</div>
                          <div className="text-slate-500 text-[11px]">{p.receiver?.address || ''}, {p.receiver?.city || ''}</div>
                        </td>
                        <td className="py-3.5 px-3 text-slate-700 font-semibold">{p.currentLocation}</td>
                        <td className="py-3.5 px-3"><StatusBadge status={p.status} size="sm" /></td>
                        <td className="py-3.5 px-3 text-right">
                          <button
                            onClick={() => openUpdateModal(p)}
                            className="px-3.5 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl transition-all shadow-xs"
                          >
                            Update Status
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <EmptyState title="No assigned parcels" description="You currently have no active deliveries assigned." />
            )}
          </div>

          {/* Quick Status Update Modal */}
          {selectedParcel && (
            <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4 z-50">
              <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200 space-y-4">
                <div>
                  <h3 className="font-extrabold text-base text-slate-900">Update Delivery Status</h3>
                  <p className="text-xs font-mono font-bold text-sky-600 mt-0.5">{selectedParcel.trackingNumber}</p>
                </div>

                <form onSubmit={handleStatusSubmit} className="space-y-3 text-xs">
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">New Status *</label>
                    <select
                      value={newStatus}
                      onChange={(e) => setNewStatus(e.target.value)}
                      className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-900"
                    >
                      <option value="BOOKED">BOOKED (Awaiting Pickup)</option>
                      <option value="PICKED_UP">PICKED_UP (Received from Sender)</option>
                      <option value="IN_TRANSIT">IN_TRANSIT (Sorting Yard / Transit)</option>
                      <option value="OUT_FOR_DELIVERY">OUT_FOR_DELIVERY (Loaded in Vehicle)</option>
                      <option value="DELIVERED">DELIVERED (Handed to Receiver)</option>
                      <option value="DELIVERY_FAILED">DELIVERY_FAILED (Attempt Failed / Locked)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Current Hub / Location *</label>
                    <input
                      type="text"
                      required
                      value={newLocation}
                      onChange={(e) => setNewLocation(e.target.value)}
                      className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Delivery Notes / Remarks</label>
                    <textarea
                      rows={2}
                      placeholder="e.g., Handed over to security desk / Received by customer..."
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                    />
                  </div>

                  <div className="flex justify-end gap-2 pt-2">
                    <button
                      type="button"
                      onClick={() => setSelectedParcel(null)}
                      className="px-4 py-2 bg-slate-100 text-slate-700 font-bold rounded-xl"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={updating}
                      className="px-5 py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl shadow-md"
                    >
                      {updating ? 'Saving...' : 'Save & Trigger Notification'}
                    </button>
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

export default AgentDashboard;
