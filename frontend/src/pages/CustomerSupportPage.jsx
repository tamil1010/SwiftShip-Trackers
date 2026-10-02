import React, { useState, useEffect } from 'react';
import { Headphones, PlusCircle, AlertCircle, CheckCircle2, Clock, Send } from 'lucide-react';
import api from '../services/api';
import { useToast } from '../context/ToastContext';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import Footer from '../components/Footer';
import LoadingSpinner from '../components/LoadingSpinner';
import EmptyState from '../components/EmptyState';

const CustomerSupportPage = () => {
  const [sidebarMobile, setSidebarMobile] = useState(false);
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const { addToast } = useToast();

  const [formData, setFormData] = useState({
    trackingNumber: '',
    subject: '',
    description: '',
    priority: 'MEDIUM',
  });

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
      console.error('Error fetching support tickets:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateTicket = async (e) => {
    e.preventDefault();
    if (!formData.subject || !formData.description) return;

    try {
      const res = await api.post('/support', formData);
      if (res.data.success) {
        addToast('Support ticket created successfully!', 'success');
        setShowCreateModal(false);
        setFormData({ trackingNumber: '', subject: '', description: '', priority: 'MEDIUM' });
        fetchTickets();
      }
    } catch (err) {
      addToast(err.response?.data?.message || 'Failed to submit ticket.', 'error');
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Navbar onToggleSidebar={() => setSidebarMobile(!sidebarMobile)} />

      <div className="flex-1 flex">
        <Sidebar mobileOpen={sidebarMobile} onCloseMobile={() => setSidebarMobile(false)} />

        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-5xl mx-auto w-full">
          
          <div className="flex justify-between items-center mb-6">
            <div>
              <h1 className="text-2xl font-extrabold text-slate-900">Support Desk</h1>
              <p className="text-xs text-slate-500 mt-0.5">Raise delivery inquiries, address updates, or claim tickets.</p>
            </div>
            <button
              onClick={() => setShowCreateModal(true)}
              className="px-4 py-2.5 bg-sky-600 hover:bg-sky-500 text-white font-bold text-xs rounded-xl shadow-sm transition-all flex items-center gap-1.5"
            >
              <PlusCircle className="w-4 h-4" /> Raise Support Ticket
            </button>
          </div>

          {/* Tickets List */}
          {loading ? (
            <LoadingSpinner text="Fetching support tickets..." />
          ) : tickets.length > 0 ? (
            <div className="space-y-4">
              {tickets.map((t) => (
                <div key={t.id} className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-3">
                  <div className="flex flex-wrap justify-between items-start gap-2">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className={`px-2 py-0.5 text-[10px] font-bold rounded-md ${
                          t.status === 'OPEN' ? 'bg-amber-100 text-amber-800' :
                          t.status === 'IN_PROGRESS' ? 'bg-sky-100 text-sky-800' :
                          'bg-emerald-100 text-emerald-800'
                        }`}>
                          {t.status}
                        </span>
                        <h3 className="font-bold text-sm text-slate-900">{t.subject}</h3>
                      </div>
                      {t.parcel && (
                        <p className="text-xs text-sky-700 font-mono font-bold mt-1">
                          Parcel ID: {t.parcel.trackingNumber} ({t.parcel.status})
                        </p>
                      )}
                    </div>
                    <span className="text-[11px] text-slate-400 font-medium">
                      Submitted: {new Date(t.createdAt).toLocaleDateString()}
                    </span>
                  </div>

                  <p className="text-xs text-slate-600 bg-slate-50 p-3 rounded-xl border border-slate-100">
                    {t.description}
                  </p>

                  {t.resolution && (
                    <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200 text-xs">
                      <strong className="text-emerald-800 block mb-0.5">Support Staff Resolution:</strong>
                      <p className="text-emerald-700">{t.resolution}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <EmptyState
              title="No active support tickets"
              description="You have no open delivery tickets. Click below to submit a support request."
              actionLabel="Raise Ticket"
              onAction={() => setShowCreateModal(true)}
            />
          )}

          {/* Modal for Creating Ticket */}
          {showCreateModal && (
            <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4 z-50">
              <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200 space-y-4">
                <h3 className="font-extrabold text-base text-slate-900">Raise Support Ticket</h3>
                <form onSubmit={handleCreateTicket} className="space-y-3 text-xs">
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Related Tracking Number (Optional)</label>
                    <input
                      type="text"
                      placeholder="e.g. SST-20261002-10001"
                      value={formData.trackingNumber}
                      onChange={(e) => setFormData({ ...formData, trackingNumber: e.target.value })}
                      className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-mono"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Subject *</label>
                    <input
                      type="text"
                      required
                      placeholder="Address update request..."
                      value={formData.subject}
                      onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                      className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Description *</label>
                    <textarea
                      rows={3}
                      required
                      placeholder="Please explain the issue or question in detail..."
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Priority</label>
                    <select
                      value={formData.priority}
                      onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                      className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-bold"
                    >
                      <option value="LOW">Low Priority</option>
                      <option value="MEDIUM">Medium Priority</option>
                      <option value="HIGH">High Priority</option>
                    </select>
                  </div>

                  <div className="flex justify-end gap-2 pt-2">
                    <button
                      type="button"
                      onClick={() => setShowCreateModal(false)}
                      className="px-4 py-2 bg-slate-100 text-slate-700 font-bold rounded-xl"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-5 py-2 bg-sky-600 hover:bg-sky-500 text-white font-bold rounded-xl"
                    >
                      Submit Ticket
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

export default CustomerSupportPage;
