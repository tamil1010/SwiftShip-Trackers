import React, { useState, useEffect } from 'react';
import { Truck, UserCheck, Shield } from 'lucide-react';
import api from '../services/api';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import Footer from '../components/Footer';
import LoadingSpinner from '../components/LoadingSpinner';

const AgentAssignmentPage = () => {
  const [sidebarMobile, setSidebarMobile] = useState(false);
  const [agents, setAgents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAgents();
  }, []);

  const fetchAgents = async () => {
    setLoading(true);
    try {
      const res = await api.get('/users/agents');
      if (res.data.success) {
        setAgents(res.data.agents);
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
            <h1 className="text-2xl font-extrabold text-slate-900">Agent Workload & Dispatch Workspace</h1>
            <p className="text-xs text-slate-500 mt-0.5">Monitor active delivery agent capacity and regional hub assignments.</p>
          </div>

          {loading ? (
            <LoadingSpinner text="Fetching agent capacity..." />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {agents.map((ag) => (
                <div key={ag.id} className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-2xl bg-indigo-600 text-white font-extrabold flex items-center justify-center text-base shadow-md">
                      <Truck className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="font-extrabold text-slate-900 text-base">{ag.name}</h3>
                      <p className="text-xs text-slate-500">{ag.email}</p>
                    </div>
                  </div>

                  <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100 text-xs space-y-2">
                    <div className="flex justify-between">
                      <span className="text-slate-500">Hub City:</span>
                      <strong className="text-slate-900">{ag.city || 'Regional Depot'}</strong>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Contact Phone:</span>
                      <strong className="text-slate-900">{ag.phone || 'N/A'}</strong>
                    </div>
                    <div className="flex justify-between border-t border-slate-200 pt-2">
                      <span className="text-slate-500 font-bold">Assigned Workload:</span>
                      <strong className="text-indigo-600 font-extrabold text-sm">{ag._count?.assignedParcels || 0} Parcels</strong>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

        </main>
      </div>

      <Footer />
    </div>
  );
};

export default AgentAssignmentPage;
