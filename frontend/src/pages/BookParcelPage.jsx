import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Package, User, MapPin, Scale, Truck, CheckCircle2, ArrowRight, ArrowLeft } from 'lucide-react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import Footer from '../components/Footer';

const BookParcelPage = () => {
  const { user } = useAuth();
  const { addToast } = useToast();
  const navigate = useNavigate();
  const [sidebarMobile, setSidebarMobile] = useState(false);
  const [step, setStep] = useState(1);
  const [submitting, setSubmitting] = useState(false);
  const [createdParcel, setCreatedParcel] = useState(null);

  const [formData, setFormData] = useState({
    // Sender
    senderName: user?.name || '',
    senderPhone: user?.phone || '',
    senderEmail: user?.email || '',
    senderAddress: user?.address || '42 High Road, Palayamkottai',
    senderCity: user?.city || 'Tirunelveli',
    senderState: 'Tamil Nadu',
    senderPincode: user?.pincode || '627002',

    // Receiver
    receiverName: '',
    receiverPhone: '',
    receiverEmail: '',
    receiverAddress: '',
    receiverCity: 'Chennai',
    receiverState: 'Tamil Nadu',
    receiverPincode: '600017',

    // Package Specs
    packageDescription: '',
    weight: '1.5',
    length: '20',
    width: '15',
    height: '10',
    priority: 'STANDARD',

    // Payment
    paymentMethod: 'UPI_ONLINE',
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const calculateCost = () => {
    const w = parseFloat(formData.weight) || 0;
    const base = 120;
    const mult = formData.priority === 'EXPRESS' ? 1.5 : formData.priority === 'PRIORITY' ? 2.0 : 1.0;
    return Math.round((base + w * 45) * mult);
  };

  const handleNextStep = (e) => {
    e.preventDefault();

    if (step === 1) {
      if (!formData.senderName || !formData.senderPhone || !formData.senderAddress || !formData.senderCity) {
        addToast('Please fill out all required sender details.', 'error');
        return;
      }
    } else if (step === 2) {
      if (!formData.receiverName || !formData.receiverPhone || !formData.receiverAddress || !formData.receiverCity) {
        addToast('Please fill out all required receiver details.', 'error');
        return;
      }
    } else if (step === 3) {
      const w = parseFloat(formData.weight);
      if (!formData.packageDescription || isNaN(w) || w <= 0) {
        addToast('Please provide a valid package description and positive weight.', 'error');
        return;
      }
    }

    setStep(step + 1);
  };

  const handleSubmitBooking = async () => {
    setSubmitting(true);
    try {
      const payload = {
        sender: {
          name: formData.senderName,
          phone: formData.senderPhone,
          email: formData.senderEmail,
          address: formData.senderAddress,
          city: formData.senderCity,
          state: formData.senderState,
          pincode: formData.senderPincode,
        },
        receiver: {
          name: formData.receiverName,
          phone: formData.receiverPhone,
          email: formData.receiverEmail,
          address: formData.receiverAddress,
          city: formData.receiverCity,
          state: formData.receiverState,
          pincode: formData.receiverPincode,
        },
        packageDescription: formData.packageDescription,
        weight: parseFloat(formData.weight),
        length: parseFloat(formData.length) || null,
        width: parseFloat(formData.width) || null,
        height: parseFloat(formData.height) || null,
        priority: formData.priority,
      };

      const res = await api.post('/parcels', payload);
      if (res.data.success) {
        setCreatedParcel(res.data.parcel);
        setStep(5);
        addToast('Parcel booked successfully!', 'success');
      }
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to book parcel. Please try again.';
      addToast(msg, 'error');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Navbar onToggleSidebar={() => setSidebarMobile(!sidebarMobile)} />

      <div className="flex-1 flex">
        <Sidebar mobileOpen={sidebarMobile} onCloseMobile={() => setSidebarMobile(false)} />

        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-4xl mx-auto w-full">
          
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-2xl font-extrabold text-slate-900">Book a Parcel Shipment</h1>
            <p className="text-xs text-slate-500 mt-1">Multi-step dispatch registration with automated tracking number generation</p>
          </div>

          {/* Step Stepper Header */}
          {step < 5 && (
            <div className="flex items-center justify-between mb-8 bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
              {[
                { num: 1, label: 'Sender' },
                { num: 2, label: 'Receiver' },
                { num: 3, label: 'Package' },
                { num: 4, label: 'Confirm & Pay' },
              ].map((s) => (
                <div key={s.num} className="flex items-center gap-2">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs ${
                    step === s.num
                      ? 'bg-sky-600 text-white ring-4 ring-sky-100'
                      : step > s.num
                      ? 'bg-emerald-500 text-white'
                      : 'bg-slate-100 text-slate-400'
                  }`}>
                    {step > s.num ? '✓' : s.num}
                  </div>
                  <span className={`text-xs font-semibold hidden sm:inline ${
                    step === s.num ? 'text-sky-700 font-bold' : 'text-slate-500'
                  }`}>
                    {s.label}
                  </span>
                </div>
              ))}
            </div>
          )}

          {/* Form Wizard Container */}
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-xl">
            
            {/* STEP 1: SENDER INFO */}
            {step === 1 && (
              <form onSubmit={handleNextStep} className="space-y-4">
                <h3 className="text-sm font-extrabold text-slate-900 uppercase tracking-wider mb-2 flex items-center gap-2">
                  <User className="w-4 h-4 text-sky-600" /> Step 1: Sender Information
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Sender Name *</label>
                    <input type="text" name="senderName" required value={formData.senderName} onChange={handleChange} className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl" />
                  </div>
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Sender Phone *</label>
                    <input type="tel" name="senderPhone" required value={formData.senderPhone} onChange={handleChange} className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl" />
                  </div>
                </div>

                <div className="text-xs">
                  <label className="block font-bold text-slate-700 mb-1">Sender Email</label>
                  <input type="email" name="senderEmail" value={formData.senderEmail} onChange={handleChange} className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl" />
                </div>

                <div className="text-xs">
                  <label className="block font-bold text-slate-700 mb-1">Pickup Street Address *</label>
                  <input type="text" name="senderAddress" required value={formData.senderAddress} onChange={handleChange} className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl" />
                </div>

                <div className="grid grid-cols-3 gap-3 text-xs">
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">City *</label>
                    <input type="text" name="senderCity" required value={formData.senderCity} onChange={handleChange} className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl" />
                  </div>
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">State *</label>
                    <input type="text" name="senderState" required value={formData.senderState} onChange={handleChange} className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl" />
                  </div>
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Pincode *</label>
                    <input type="text" name="senderPincode" required value={formData.senderPincode} onChange={handleChange} className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl" />
                  </div>
                </div>

                <div className="flex justify-end pt-4">
                  <button type="submit" className="px-6 py-2.5 bg-sky-600 hover:bg-sky-500 text-white font-bold text-xs rounded-xl flex items-center gap-1.5 shadow-md">
                    Next: Receiver Details <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </form>
            )}

            {/* STEP 2: RECEIVER INFO */}
            {step === 2 && (
              <form onSubmit={handleNextStep} className="space-y-4">
                <h3 className="text-sm font-extrabold text-slate-900 uppercase tracking-wider mb-2 flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-emerald-600" /> Step 2: Receiver Information
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Receiver Name *</label>
                    <input type="text" name="receiverName" required placeholder="Lakshmi Narayanan" value={formData.receiverName} onChange={handleChange} className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl" />
                  </div>
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Receiver Phone *</label>
                    <input type="tel" name="receiverPhone" required placeholder="+91 98940 99881" value={formData.receiverPhone} onChange={handleChange} className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl" />
                  </div>
                </div>

                <div className="text-xs">
                  <label className="block font-bold text-slate-700 mb-1">Receiver Email</label>
                  <input type="email" name="receiverEmail" placeholder="receiver@example.com" value={formData.receiverEmail} onChange={handleChange} className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl" />
                </div>

                <div className="text-xs">
                  <label className="block font-bold text-slate-700 mb-1">Destination Street Address *</label>
                  <input type="text" name="receiverAddress" required placeholder="12 T Nagar Main Road" value={formData.receiverAddress} onChange={handleChange} className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl" />
                </div>

                <div className="grid grid-cols-3 gap-3 text-xs">
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">City *</label>
                    <input type="text" name="receiverCity" required value={formData.receiverCity} onChange={handleChange} className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl" />
                  </div>
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">State *</label>
                    <input type="text" name="receiverState" required value={formData.receiverState} onChange={handleChange} className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl" />
                  </div>
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Pincode *</label>
                    <input type="text" name="receiverPincode" required value={formData.receiverPincode} onChange={handleChange} className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl" />
                  </div>
                </div>

                <div className="flex justify-between pt-4">
                  <button type="button" onClick={() => setStep(1)} className="px-5 py-2.5 bg-slate-100 text-slate-700 font-bold text-xs rounded-xl flex items-center gap-1">
                    <ArrowLeft className="w-4 h-4" /> Back
                  </button>
                  <button type="submit" className="px-6 py-2.5 bg-sky-600 hover:bg-sky-500 text-white font-bold text-xs rounded-xl flex items-center gap-1.5 shadow-md">
                    Next: Package Specs <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </form>
            )}

            {/* STEP 3: PACKAGE SPECS */}
            {step === 3 && (
              <form onSubmit={handleNextStep} className="space-y-4">
                <h3 className="text-sm font-extrabold text-slate-900 uppercase tracking-wider mb-2 flex items-center gap-2">
                  <Scale className="w-4 h-4 text-amber-600" /> Step 3: Package Specifications
                </h3>

                <div className="text-xs">
                  <label className="block font-bold text-slate-700 mb-1">Package Contents / Description *</label>
                  <input type="text" name="packageDescription" required placeholder="Laptop & accessories box" value={formData.packageDescription} onChange={handleChange} className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl" />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Package Weight (kg) *</label>
                    <input type="number" step="0.1" min="0.1" name="weight" required value={formData.weight} onChange={handleChange} className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-bold" />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Shipping Priority *</label>
                    <select name="priority" value={formData.priority} onChange={handleChange} className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-bold">
                      <option value="STANDARD">Standard Delivery (3 Days)</option>
                      <option value="EXPRESS">Express Priority (1 Day)</option>
                      <option value="PRIORITY">Same-Day Priority</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-3 text-xs">
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Length (cm)</label>
                    <input type="number" min="0" name="length" value={formData.length} onChange={handleChange} className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl" />
                  </div>
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Width (cm)</label>
                    <input type="number" min="0" name="width" value={formData.width} onChange={handleChange} className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl" />
                  </div>
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Height (cm)</label>
                    <input type="number" min="0" name="height" value={formData.height} onChange={handleChange} className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl" />
                  </div>
                </div>

                <div className="flex justify-between pt-4">
                  <button type="button" onClick={() => setStep(2)} className="px-5 py-2.5 bg-slate-100 text-slate-700 font-bold text-xs rounded-xl flex items-center gap-1">
                    <ArrowLeft className="w-4 h-4" /> Back
                  </button>
                  <button type="submit" className="px-6 py-2.5 bg-sky-600 hover:bg-sky-500 text-white font-bold text-xs rounded-xl flex items-center gap-1.5 shadow-md">
                    Next: Review & Pay <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </form>
            )}

            {/* STEP 4: REVIEW & PAYMENT */}
            {step === 4 && (
              <div className="space-y-6">
                <h3 className="text-sm font-extrabold text-slate-900 uppercase tracking-wider flex items-center gap-2">
                  <Truck className="w-4 h-4 text-indigo-600" /> Step 4: Booking Summary & Payment
                </h3>

                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 text-xs space-y-3">
                  <div className="flex justify-between">
                    <span className="text-slate-500">Route:</span>
                    <strong className="text-slate-900">{formData.senderCity} → {formData.receiverCity}</strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Package Description:</span>
                    <strong className="text-slate-900">{formData.packageDescription} ({formData.weight} kg)</strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Shipping Mode:</span>
                    <strong className="text-sky-700">{formData.priority} Delivery</strong>
                  </div>
                  <div className="flex justify-between border-t border-slate-200 pt-2 text-sm">
                    <span className="font-bold text-slate-900">Total Shipping Fee:</span>
                    <strong className="text-emerald-600 text-lg">₹{calculateCost()} (GST Incl.)</strong>
                  </div>
                </div>

                <div className="flex justify-between pt-4">
                  <button type="button" onClick={() => setStep(3)} className="px-5 py-2.5 bg-slate-100 text-slate-700 font-bold text-xs rounded-xl flex items-center gap-1">
                    <ArrowLeft className="w-4 h-4" /> Back
                  </button>
                  <button
                    onClick={handleSubmitBooking}
                    disabled={submitting}
                    className="px-8 py-3 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-extrabold text-xs rounded-xl shadow-lg transition-all flex items-center gap-2"
                  >
                    {submitting ? 'Generating Booking...' : 'Confirm & Generate Tracking ID'}
                  </button>
                </div>
              </div>
            )}

            {/* STEP 5: SUCCESS CONFIRMATION */}
            {step === 5 && createdParcel && (
              <div className="text-center py-6 space-y-6 animate-in zoom-in-95 duration-300">
                <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-lg">
                  <CheckCircle2 className="w-10 h-10" />
                </div>

                <div>
                  <h2 className="text-2xl font-extrabold text-slate-900">Shipment Booked Successfully!</h2>
                  <p className="text-xs text-slate-500 mt-1">Your tracking number has been generated and registered in system database.</p>
                </div>

                <div className="bg-slate-900 text-white p-6 rounded-2xl max-w-sm mx-auto shadow-xl">
                  <div className="text-[10px] uppercase font-bold text-sky-400">Tracking Number</div>
                  <div className="text-xl font-mono font-bold text-amber-300 mt-1">{createdParcel.trackingNumber}</div>
                  <div className="text-[11px] text-slate-400 mt-2">
                    Origin: {createdParcel.sender.city} | Dest: {createdParcel.receiver.city}
                  </div>
                </div>

                <div className="flex flex-wrap justify-center gap-3 pt-4">
                  <button
                    onClick={() => navigate(`/track/${createdParcel.trackingNumber}`)}
                    className="px-5 py-2.5 bg-sky-600 hover:bg-sky-500 text-white font-bold text-xs rounded-xl shadow-md"
                  >
                    Track Shipment Live
                  </button>
                  <button
                    onClick={() => navigate('/dashboard')}
                    className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs rounded-xl"
                  >
                    Go to Dashboard
                  </button>
                </div>
              </div>
            )}

          </div>

        </main>
      </div>

      <Footer />
    </div>
  );
};

export default BookParcelPage;
