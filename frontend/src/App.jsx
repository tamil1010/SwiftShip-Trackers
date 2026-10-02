import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import ProtectedRoute from './components/ProtectedRoute';
import { useAuth } from './context/AuthContext';

// Public Pages
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import TrackPublicPage from './pages/TrackPublicPage';
import AboutPage from './pages/AboutPage';
import ContactPage from './pages/ContactPage';
import FAQPage from './pages/FAQPage';

// Customer Pages
import CustomerDashboard from './pages/CustomerDashboard';
import BookParcelPage from './pages/BookParcelPage';
import MyParcelsPage from './pages/MyParcelsPage';
import CustomerNotificationsPage from './pages/CustomerNotificationsPage';
import CustomerSupportPage from './pages/CustomerSupportPage';
import ProfilePage from './pages/ProfilePage';

// Agent Pages
import AgentDashboard from './pages/AgentDashboard';
import AssignedParcelsPage from './pages/AssignedParcelsPage';
import AgentHistoryPage from './pages/AgentHistoryPage';

// Support Pages
import SupportDashboard from './pages/SupportDashboard';
import ShipmentSearchPage from './pages/ShipmentSearchPage';
import SupportTicketsPage from './pages/SupportTicketsPage';

// Admin Pages
import AdminDashboard from './pages/AdminDashboard';
import UserManagementPage from './pages/UserManagementPage';
import ParcelManagementPage from './pages/ParcelManagementPage';
import AgentAssignmentPage from './pages/AgentAssignmentPage';
import AdminReportsPage from './pages/AdminReportsPage';
import AdminNotificationsPage from './pages/AdminNotificationsPage';
import SystemSettingsPage from './pages/SystemSettingsPage';

// Smart Dashboard Redirect Component
const DashboardRedirect = () => {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" replace />;

  if (user.role === 'ADMIN') return <Navigate to="/admin/dashboard" replace />;
  if (user.role === 'DELIVERY_AGENT') return <Navigate to="/agent/dashboard" replace />;
  if (user.role === 'SUPPORT') return <Navigate to="/support/dashboard" replace />;
  return <CustomerDashboard />;
};

function App() {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/track" element={<TrackPublicPage />} />
      <Route path="/track/:trackingNumber" element={<TrackPublicPage />} />
      <Route path="/about" element={<AboutPage />} />
      <Route path="/contact" element={<ContactPage />} />
      <Route path="/faq" element={<FAQPage />} />

      {/* Role Scoped Dashboard Route */}
      <Route path="/dashboard" element={<ProtectedRoute><DashboardRedirect /></ProtectedRoute>} />
      <Route path="/profile" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
      <Route path="/notifications" element={<ProtectedRoute><CustomerNotificationsPage /></ProtectedRoute>} />

      {/* Customer Routes */}
      <Route path="/book-parcel" element={<ProtectedRoute allowedRoles={['CUSTOMER', 'ADMIN']}><BookParcelPage /></ProtectedRoute>} />
      <Route path="/my-parcels" element={<ProtectedRoute allowedRoles={['CUSTOMER', 'ADMIN']}><MyParcelsPage /></ProtectedRoute>} />
      <Route path="/support" element={<ProtectedRoute allowedRoles={['CUSTOMER', 'ADMIN']}><CustomerSupportPage /></ProtectedRoute>} />

      {/* Delivery Agent Routes */}
      <Route path="/agent/dashboard" element={<ProtectedRoute allowedRoles={['DELIVERY_AGENT', 'ADMIN']}><AgentDashboard /></ProtectedRoute>} />
      <Route path="/agent/assigned" element={<ProtectedRoute allowedRoles={['DELIVERY_AGENT', 'ADMIN']}><AssignedParcelsPage /></ProtectedRoute>} />
      <Route path="/agent/history" element={<ProtectedRoute allowedRoles={['DELIVERY_AGENT', 'ADMIN']}><AgentHistoryPage /></ProtectedRoute>} />

      {/* Support Staff Routes */}
      <Route path="/support/dashboard" element={<ProtectedRoute allowedRoles={['SUPPORT', 'ADMIN']}><SupportDashboard /></ProtectedRoute>} />
      <Route path="/support/search" element={<ProtectedRoute allowedRoles={['SUPPORT', 'ADMIN']}><ShipmentSearchPage /></ProtectedRoute>} />
      <Route path="/support/tickets" element={<ProtectedRoute allowedRoles={['SUPPORT', 'ADMIN']}><SupportTicketsPage /></ProtectedRoute>} />

      {/* Admin Routes */}
      <Route path="/admin/dashboard" element={<ProtectedRoute allowedRoles={['ADMIN']}><AdminDashboard /></ProtectedRoute>} />
      <Route path="/admin/users" element={<ProtectedRoute allowedRoles={['ADMIN']}><UserManagementPage /></ProtectedRoute>} />
      <Route path="/admin/parcels" element={<ProtectedRoute allowedRoles={['ADMIN']}><ParcelManagementPage /></ProtectedRoute>} />
      <Route path="/admin/assign" element={<ProtectedRoute allowedRoles={['ADMIN']}><AgentAssignmentPage /></ProtectedRoute>} />
      <Route path="/admin/reports" element={<ProtectedRoute allowedRoles={['ADMIN']}><AdminReportsPage /></ProtectedRoute>} />
      <Route path="/admin/notifications" element={<ProtectedRoute allowedRoles={['ADMIN']}><AdminNotificationsPage /></ProtectedRoute>} />
      <Route path="/admin/settings" element={<ProtectedRoute allowedRoles={['ADMIN']}><SystemSettingsPage /></ProtectedRoute>} />

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;
