import React, { useState, useEffect } from 'react';
import { Headphones, CheckCircle2, Clock, MessageSquare, Save } from 'lucide-react';
import api from '../services/api';
import { useToast } from '../context/ToastContext';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import Footer from '../components/Footer';
import LoadingSpinner from '../components/LoadingSpinner';
import EmptyState from '../components/EmptyState';

const SupportTicketsPage = () => {
  const [sidebarMobile, setSidebarMobile] = useState(false);
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [status, setStatus] = useState('');
  const [resolution, setResolution] = useState('');
  const [saving, setSaving] = useState(false);
  const { addToast } = useToast();

  useEffect(() => {
    fetchTickets();
  }, []);

  const fetchTickets = async () => {
    setLoading(true);
    try {
      const res = await api.get('/support');
      if (res.data.success) {
        setTickets(res.data.tickets);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const openManageModal = (ticket) => {
    setSelectedTicket(ticket);
    setStatus(ticket.status);
    setResolution(ticket.resolution || '');
  };

  const handleSaveResolution = async (e) => {
    e.preventDefault();
    if (!selectedTicket) return;

    setSaving(true);
    try {
      const res = await api.put(`/support/${selectedTicket.id}`, { status, resolution });
      if (res.data.success) {
        addToast('Ticket updated successfully!', 'success');
        setSelectedTicket(null);
        fetchTickets();
      }
    } catch (err) {
      addToast(err.response?.data?.message || 'Failed to update ticket.', 'error');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Navbar onToggleSidebar={() => setSidebarMobile(!sidebarMobile)} />

      <div className="flex-1 flex">
        <Sidebar mobileOpen={sidebarMobile} onCloseMobile={() => setSidebarMobile(false)} />

        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto w-full">
          
          <div className="mb-6">
            <h1 className="text-2xl font-extrabold text-slate-900">Support Ticket Workspace</h1>
            <p className="text-xs text-slate-500 mt-0.5">Manage, process, and resolve customer support inquiries.</p>
          </div>

          {loading ? (
            <LoadingSpinner text="Fetching tickets..." />
          ) : tickets.length > 0 ? (
            <div className="space-y-4">
              {tickets.map((t) => (
                <div key={t.id} className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-3">
                  <div className="flex flex-wrap justify-between items-start gap-2">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className={`px-2.5 py-0.5 text-[10px] font-bold rounded-md uppercase ${
                          t.status === 'OPEN' ? 'bg-amber-100 text-amber-800' :
                          t.status === 'IN_PROGRESS' ? 'bg-sky-100 text-sky-800' :
                          'bg-emerald-100 text-emerald-800'
                        }`}>
                          {t.status}
                        </span>
                        <h3 className="font-bold text-sm text-slate-900">{t.subject}</h3>
                      </div>
                      <p className="text-xs text-slate-500 mt-1">
                        Customer: <strong>{t.user?.name || 'Customer'}</strong> ({t.user?.email || 'N/A'} | {t.user?.phone || 'N/A'})
                      </p>
                    </div>

                    <button
                      onClick={() => openManageModal(t)}
                      className="px-4 py-2 bg-amber-600 hover:bg-amber-500 text-white font-bold text-xs rounded-xl shadow-xs"
                    >
                      Update Resolution
                    </button>
                  </div>

                  <p className="text-xs text-slate-700 bg-slate-50 p-3 rounded-xl border border-slate-100">
                    {t.description}
                  </p>

                  {t.resolution && (
                    <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200 text-xs">
                      <strong className="text-emerald-800 block mb-0.5">Logged Resolution:</strong>
                      <p className="text-emerald-700">{t.resolution}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <EmptyState title="No support tickets" description="There are no tickets logged in the system." />
          )}

          {/* Manage Modal */}
          {selectedTicket && (
            <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4 z-50">
              <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200 space-y-4">
                <h3 className="font-extrabold text-base text-slate-900">Process Support Ticket</h3>

                <form onSubmit={handleSaveResolution} className="space-y-3 text-xs">
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Status</label>
                    <select
                      value={status}
                      onChange={(e) => setStatus(e.target.value)}
                      className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-bold"
                    >
                      <option value="OPEN">OPEN</option>
                      <option value="IN_PROGRESS">IN_PROGRESS</option>
                      <option value="RESOLVED">RESOLVED</option>
                      <option value="CLOSED">CLOSED</option>
                    </select>
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Resolution Details / Staff Notes</label>
                    <textarea
                      rows={4}
                      required
                      placeholder="Enter the resolution provided to customer..."
                      value={resolution}
                      onChange={(e) => setResolution(e.target.value)}
                      className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                    />
                  </div>

                  <div className="flex justify-end gap-2 pt-2">
                    <button
                      type="button"
                      onClick={() => setSelectedTicket(null)}
                      className="px-4 py-2 bg-slate-100 text-slate-700 font-bold rounded-xl"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={saving}
                      className="px-5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl shadow-md"
                    >
                      {saving ? 'Saving...' : 'Save Resolution'}
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

export default SupportTicketsPage;
