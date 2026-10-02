import React, { useState, useEffect } from 'react';
import { Bell, CheckCheck, Package, AlertCircle, Headphones } from 'lucide-react';
import api from '../services/api';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import Footer from '../components/Footer';
import LoadingSpinner from '../components/LoadingSpinner';
import EmptyState from '../components/EmptyState';

const CustomerNotificationsPage = () => {
  const [sidebarMobile, setSidebarMobile] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    setLoading(true);
    try {
      const res = await api.get('/notifications');
      if (res.data.success) {
        setNotifications(res.data.notifications);
      }
    } catch (err) {
      console.error('Failed to fetch notifications:', err);
    } finally {
      setLoading(false);
    }
  };

  const markAllRead = async () => {
    try {
      await api.put('/notifications/read-all');
      setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
    } catch (err) {
      console.error('Failed to mark read:', err);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Navbar onToggleSidebar={() => setSidebarMobile(!sidebarMobile)} />

      <div className="flex-1 flex">
        <Sidebar mobileOpen={sidebarMobile} onCloseMobile={() => setSidebarMobile(false)} />

        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-4xl mx-auto w-full">
          
          <div className="flex justify-between items-center mb-6">
            <div>
              <h1 className="text-2xl font-extrabold text-slate-900">Notifications</h1>
              <p className="text-xs text-slate-500 mt-0.5">Automated updates for your shipment dispatches and tickets.</p>
            </div>

            {notifications.some((n) => !n.isRead) && (
              <button
                onClick={markAllRead}
                className="px-3.5 py-1.5 bg-sky-50 text-sky-700 hover:bg-sky-100 font-bold text-xs rounded-xl flex items-center gap-1.5 transition-colors"
              >
                <CheckCheck className="w-4 h-4" /> Mark all read
              </button>
            )}
          </div>

          {loading ? (
            <LoadingSpinner text="Fetching notifications..." />
          ) : notifications.length > 0 ? (
            <div className="bg-white rounded-3xl border border-slate-200 shadow-xs divide-y divide-slate-100 overflow-hidden">
              {notifications.map((n) => (
                <div key={n.id} className={`p-4 sm:p-5 flex items-start gap-4 ${n.isRead ? 'bg-white' : 'bg-sky-50/40'}`}>
                  <div className={`p-2.5 rounded-xl shrink-0 ${
                    n.type === 'SUPPORT' ? 'bg-purple-100 text-purple-600' : 'bg-sky-100 text-sky-600'
                  }`}>
                    {n.type === 'SUPPORT' ? <Headphones className="w-5 h-5" /> : <Bell className="w-5 h-5" />}
                  </div>

                  <div className="flex-1">
                    <div className="flex justify-between items-start gap-2">
                      <h4 className="text-xs font-bold text-slate-900">{n.title}</h4>
                      <span className="text-[10px] text-slate-400 font-medium">
                        {new Date(n.createdAt).toLocaleString([], { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                    <p className="text-xs text-slate-600 mt-1">{n.message}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <EmptyState title="No notifications" description="You have no unread or archived notification alerts." />
          )}

        </main>
      </div>

      <Footer />
    </div>
  );
};

export default CustomerNotificationsPage;
