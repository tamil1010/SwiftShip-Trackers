import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { BarChart3, Users, Package, Truck, CheckCircle2, AlertTriangle, ArrowRight, Download } from 'lucide-react';
import { ResponsiveContainer, PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip, Legend } from 'recharts';
import api from '../services/api';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import Footer from '../components/Footer';
import StatCard from '../components/StatCard';
import StatusBadge from '../components/StatusBadge';
import LoadingSpinner from '../components/LoadingSpinner';

const COLORS = ['#3b82f6', '#8b5cf6', '#eab308', '#f97316', '#22c55e', '#ef4444', '#64748b'];

const AdminDashboard = () => {
  const [sidebarMobile, setSidebarMobile] = useState(false);
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      const res = await api.get('/reports/dashboard-stats');
      if (res.data.success) {
        setData(res.data);
      }
    } catch (err) {
      console.error('Error fetching admin dashboard stats:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleExportCSV = () => {
    window.open('/api/reports/export', '_blank');
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Navbar onToggleSidebar={() => setSidebarMobile(!sidebarMobile)} />

      <div className="flex-1 flex">
        <Sidebar mobileOpen={sidebarMobile} onCloseMobile={() => setSidebarMobile(false)} />

        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto w-full">
          
          <div className="bg-slate-900 text-white p-6 sm:p-8 rounded-3xl shadow-xl mb-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-extrabold">Executive Operational Dashboard</h1>
              <p className="text-xs text-slate-400 mt-1">Real-time parcel logistics analytics, agent performance, and city volume metrics.</p>
            </div>
            <button
              onClick={handleExportCSV}
              className="px-5 py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs rounded-xl shadow-lg transition-all flex items-center gap-2"
            >
              <Download className="w-4 h-4" /> Export CSV Report
            </button>
          </div>

          {loading ? (
            <LoadingSpinner text="Computing operational analytics & metrics..." />
          ) : data ? (
            <div className="space-y-8">
              
              {/* Stat Cards */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <StatCard title="Total Parcels" value={data.stats?.totalParcels ?? 0} icon={Package} color="sky" />
                <StatCard title="Active In-Transit" value={data.stats?.activeParcels ?? 0} icon={Truck} color="amber" />
                <StatCard title="Delivered Rate" value={data.stats?.successRate ?? '100%'} icon={CheckCircle2} color="emerald" />
                <StatCard title="Active Delivery Agents" value={data.stats?.activeAgents ?? 0} icon={Users} color="indigo" />
              </div>

              {/* Recharts Analytics Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                
                {/* Status Distribution Pie Chart */}
                <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs">
                  <h3 className="text-sm font-extrabold text-slate-900 mb-4">Shipment Status Distribution</h3>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={data.statusDistribution || []}
                          cx="50%"
                          cy="50%"
                          innerRadius={60}
                          outerRadius={90}
                          paddingAngle={3}
                          dataKey="value"
                        >
                          {(data.statusDistribution || []).map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip />
                        <Legend />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                {/* City-wise Shipments Bar Chart */}
                <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs">
                  <h3 className="text-sm font-extrabold text-slate-900 mb-4">City-wise Shipment Volume</h3>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={data.cityStats || []}>
                        <XAxis dataKey="city" stroke="#64748b" fontSize={11} />
                        <YAxis stroke="#64748b" fontSize={11} />
                        <Tooltip />
                        <Bar dataKey="count" fill="#0284c7" radius={[6, 6, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>

              </div>

              {/* Agent Performance Table */}
              <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs">
                <h3 className="text-sm font-extrabold text-slate-900 mb-4">Delivery Agent Performance Metrics</h3>
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="border-b border-slate-100 bg-slate-50/50 text-slate-400 font-bold uppercase">
                        <th className="py-3 px-4">Agent Name</th>
                        <th className="py-3 px-4">Hub City</th>
                        <th className="py-3 px-4">Total Assigned</th>
                        <th className="py-3 px-4">In Progress</th>
                        <th className="py-3 px-4">Delivered</th>
                        <th className="py-3 px-4 text-right">Completion %</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {(data.agentPerformance || []).map((agent) => (
                        <tr key={agent.id} className="hover:bg-slate-50/80">
                          <td className="py-3.5 px-4 font-bold text-slate-900">{agent.name}</td>
                          <td className="py-3.5 px-4 text-slate-600">{agent.city}</td>
                          <td className="py-3.5 px-4 font-bold">{agent.totalAssigned}</td>
                          <td className="py-3.5 px-4 text-amber-600 font-bold">{agent.inProgress}</td>
                          <td className="py-3.5 px-4 text-emerald-600 font-bold">{agent.delivered}</td>
                          <td className="py-3.5 px-4 text-right font-bold text-sky-700">{agent.completionRate}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

            </div>
          ) : null}

        </main>
      </div>

      <Footer />
    </div>
  );
};

export default AdminDashboard;
