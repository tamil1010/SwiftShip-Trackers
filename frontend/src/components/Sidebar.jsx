import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Package, 
  PlusCircle, 
  Search, 
  Users, 
  Truck, 
  HelpCircle, 
  BarChart3, 
  Bell, 
  Settings, 
  User, 
  Headphones, 
  FileText,
  CheckSquare
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Sidebar = ({ mobileOpen, onCloseMobile }) => {
  const { user } = useAuth();
  const role = user?.role || 'CUSTOMER';

  const customerLinks = [
    { to: '/dashboard', label: 'Overview', icon: LayoutDashboard },
    { to: '/book-parcel', label: 'Book Parcel', icon: PlusCircle },
    { to: '/my-parcels', label: 'My Parcels', icon: Package },
    { to: '/track', label: 'Track Shipment', icon: Search },
    { to: '/notifications', label: 'Notifications', icon: Bell },
    { to: '/support', label: 'Support Tickets', icon: Headphones },
    { to: '/profile', label: 'Profile Settings', icon: User },
  ];

  const agentLinks = [
    { to: '/agent/dashboard', label: 'Agent Dashboard', icon: LayoutDashboard },
    { to: '/agent/assigned', label: 'Assigned Parcels', icon: Truck },
    { to: '/agent/history', label: 'Delivery History', icon: CheckSquare },
    { to: '/profile', label: 'Profile', icon: User },
  ];

  const supportLinks = [
    { to: '/support/dashboard', label: 'Support Overview', icon: LayoutDashboard },
    { to: '/support/search', label: 'Shipment Search', icon: Search },
    { to: '/support/tickets', label: 'Support Tickets', icon: Headphones },
    { to: '/profile', label: 'Profile', icon: User },
  ];

  const adminLinks = [
    { to: '/admin/dashboard', label: 'Admin Analytics', icon: LayoutDashboard },
    { to: '/admin/parcels', label: 'Manage Parcels', icon: Package },
    { to: '/admin/assign', label: 'Assign Agents', icon: Truck },
    { to: '/admin/users', label: 'User Management', icon: Users },
    { to: '/admin/reports', label: 'Operational Reports', icon: FileText },
    { to: '/admin/notifications', label: 'System Alerts', icon: Bell },
    { to: '/admin/settings', label: 'System Settings', icon: Settings },
  ];

  const links = role === 'ADMIN' 
    ? adminLinks 
    : role === 'DELIVERY_AGENT' 
    ? agentLinks 
    : role === 'SUPPORT' 
    ? supportLinks 
    : customerLinks;

  return (
    <>
      {/* Mobile Backdrop */}
      {mobileOpen && (
        <div 
          onClick={onCloseMobile}
          className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs z-30 md:hidden"
        />
      )}

      <aside
        className={`fixed md:sticky top-16 left-0 z-30 h-[calc(100vh-4rem)] w-64 bg-white border-r border-slate-200 flex flex-col justify-between transition-transform duration-300 ${
          mobileOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        }`}
      >
        <div className="p-4 overflow-y-auto flex-1">
          {/* User Role Card */}
          <div className="p-3 mb-4 rounded-xl bg-slate-50 border border-slate-200 flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-sky-600 text-white font-bold flex items-center justify-center text-sm shadow-xs">
              {user?.name?.charAt(0) || 'U'}
            </div>
            <div className="overflow-hidden">
              <div className="text-xs font-bold text-slate-900 truncate">{user?.name}</div>
              <div className="text-[10px] font-extrabold text-sky-600 uppercase tracking-wider">
                {role.replace(/_/g, ' ')}
              </div>
            </div>
          </div>

          <div className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 mb-2 px-3">
            Navigation Menu
          </div>

          <nav className="space-y-1">
            {links.map((link) => {
              const Icon = link.icon;
              return (
                <NavLink
                  key={link.to}
                  to={link.to}
                  onClick={onCloseMobile}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                      isActive
                        ? 'bg-sky-600 text-white shadow-sm font-bold'
                        : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                    }`
                  }
                >
                  <Icon className="w-4 h-4 shrink-0" />
                  <span>{link.label}</span>
                </NavLink>
              );
            })}
          </nav>
        </div>

        {/* Footer info inside sidebar */}
        <div className="p-4 border-t border-slate-100 bg-slate-50/50">
          <div className="text-[11px] text-slate-500 font-medium text-center">
            SwiftShip Logistics &copy; 2026
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
