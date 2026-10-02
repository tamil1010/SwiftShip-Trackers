import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Package, Lock, Mail, ArrowRight, Shield, UserCheck, KeyRound } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const DEMO_ACCOUNTS = [
  { role: 'ADMIN', label: 'System Admin', email: 'admin@swiftship.demo', color: 'bg-slate-900 text-white' },
  { role: 'SUPPORT', label: 'Support Specialist', email: 'support@swiftship.demo', color: 'bg-amber-600 text-white' },
  { role: 'DELIVERY_AGENT', label: 'Delivery Agent', email: 'agent1@swiftship.demo', color: 'bg-indigo-600 text-white' },
  { role: 'CUSTOMER', label: 'Customer User', email: 'customer1@swiftship.demo', color: 'bg-sky-600 text-white' },
];

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!email || !password) return;

    setLoading(true);
    const res = await login(email, password);
    setLoading(false);

    if (res.success) {
      const userRole = res.user.role;
      if (userRole === 'ADMIN') navigate('/admin/dashboard');
      else if (userRole === 'DELIVERY_AGENT') navigate('/agent/dashboard');
      else if (userRole === 'SUPPORT') navigate('/support/dashboard');
      else navigate('/dashboard');
    }
  };

  const handleDemoClick = (demoEmail) => {
    setEmail(demoEmail);
    setPassword('password123');
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Navbar />

      <main className="flex-1 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          
          {/* Header */}
          <div className="text-center">
            <div className="w-12 h-12 rounded-2xl bg-sky-600 text-white flex items-center justify-center mx-auto mb-3 shadow-lg">
              <Package className="w-6 h-6" />
            </div>
            <h2 className="text-2xl font-extrabold text-slate-900">Sign in to SwiftShip</h2>
            <p className="text-xs text-slate-500 mt-1">Access parcel management and live tracking operations</p>
          </div>

          {/* One-Click Quick Demo Login Chips */}
          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
            <div className="text-xs font-bold text-slate-700 mb-2 flex items-center gap-1.5">
              <KeyRound className="w-4 h-4 text-amber-500" />
              One-Click Demo Accounts:
            </div>
            <div className="grid grid-cols-2 gap-2">
              {DEMO_ACCOUNTS.map((account) => (
                <button
                  key={account.role}
                  type="button"
                  onClick={() => handleDemoClick(account.email)}
                  className={`px-3 py-2 text-[11px] font-bold rounded-xl transition-all shadow-xs flex items-center justify-between ${account.color}`}
                >
                  <span>{account.label}</span>
                  <ArrowRight className="w-3 h-3 opacity-70" />
                </button>
              ))}
            </div>
            <p className="text-[10px] text-slate-400 mt-2 text-center">
              Password for all demo accounts: <code className="bg-slate-100 px-1 py-0.5 rounded text-slate-800">password123</code>
            </p>
          </div>

          {/* Form */}
          <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-xl">
            <form onSubmit={handleLogin} className="space-y-5">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">Email Address</label>
                <div className="relative">
                  <input
                    type="email"
                    required
                    placeholder="user@swiftship.demo"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-sky-500 focus:bg-white text-slate-900"
                  />
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">Password</label>
                <div className="relative">
                  <input
                    type="password"
                    required
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-sky-500 focus:bg-white text-slate-900"
                  />
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 bg-sky-600 hover:bg-sky-500 text-white font-extrabold text-sm rounded-xl shadow-lg transition-all flex items-center justify-center gap-2"
              >
                {loading ? 'Authenticating...' : 'Sign In'}
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>

            <div className="mt-6 pt-4 border-t border-slate-100 text-center text-xs text-slate-500">
              Don't have a customer account?{' '}
              <Link to="/register" className="font-bold text-sky-600 hover:underline">
                Register here
              </Link>
            </div>
          </div>

        </div>
      </main>

      <Footer />
    </div>
  );
};

export default LoginPage;
