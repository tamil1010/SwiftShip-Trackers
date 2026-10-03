import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Package, Search, MapPin, Calendar, Weight, User, Truck, Phone, RefreshCw, AlertTriangle, ArrowLeft } from 'lucide-react';
import api from '../services/api';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import StatusBadge from '../components/StatusBadge';
import TrackingTimeline from '../components/TrackingTimeline';
import InteractiveMap from '../components/InteractiveMap';
import LoadingSpinner from '../components/LoadingSpinner';
import { useAuth } from '../context/AuthContext';

const TrackPublicPage = () => {
  const { trackingNumber: urlTracking } = useParams();
  const [inputTracking, setInputTracking] = useState(urlTracking || '');
  const [parcel, setParcel] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { socket } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (urlTracking) {
      fetchParcel(urlTracking);
    }
  }, [urlTracking]);

  useEffect(() => {
    if (socket && parcel?.trackingNumber) {
      socket.emit('join_tracking_room', parcel.trackingNumber);

      const handleStatusUpdate = (data) => {
        if (data.trackingNumber === parcel.trackingNumber) {
          fetchParcel(parcel.trackingNumber);
        }
      };

      socket.on('status_updated', handleStatusUpdate);

      return () => {
        socket.emit('leave_tracking_room', parcel.trackingNumber);
        socket.off('status_updated', handleStatusUpdate);
      };
    }
  }, [socket, parcel?.trackingNumber]);

  const fetchParcel = async (trackingNo) => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.get(`/parcels/track/${trackingNo.trim()}`);
      if (res.data.success) {
        setParcel(res.data.parcel);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Shipment not found. Please verify tracking number.');
      setParcel(null);
    } finally {
      setLoading(false);
    }
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (inputTracking.trim()) {
      navigate(`/track/${inputTracking.trim()}`);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Navbar />

      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Search Banner */}
        <div className="bg-slate-900 text-white p-6 sm:p-8 rounded-3xl shadow-xl mb-8">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-2xl sm:text-3xl font-extrabold mb-2">Shipment Tracking Center</h1>
            <p className="text-xs text-slate-400 mb-6">Enter your SwiftShip Tracking ID for live status & visual route monitoring</p>

            <form onSubmit={handleSearchSubmit} className="flex gap-2 max-w-xl mx-auto">
              <div className="relative flex-1">
                <input
                  type="text"
                  placeholder="e.g., SST-20261002-10001"
                  value={inputTracking}
                  onChange={(e) => setInputTracking(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 text-xs sm:text-sm bg-slate-800 text-white placeholder-slate-400 rounded-xl border border-slate-700 focus:outline-none focus:border-sky-500 font-mono"
                />
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
              </div>
              <button
                type="submit"
                className="px-5 py-3 bg-sky-600 hover:bg-sky-500 text-white font-extrabold text-xs sm:text-sm rounded-xl shadow-lg transition-all"
              >
                Track
              </button>
            </form>
          </div>
        </div>

        {loading && <LoadingSpinner text="Querying shipment tracking records..." />}

        {error && (
          <div className="max-w-2xl mx-auto p-6 bg-white rounded-2xl border border-rose-200 shadow-md text-center">
            <AlertTriangle className="w-10 h-10 text-rose-500 mx-auto mb-3" />
            <h3 className="text-lg font-bold text-slate-900 mb-1">Shipment Not Found</h3>
            <p className="text-xs text-slate-500 mb-4">{error}</p>
            <Link to="/" className="text-xs font-bold text-sky-600 hover:underline">
              Return to Landing Page
            </Link>
          </div>
        )}

        {parcel && !loading && (
          <div className="space-y-8 animate-in fade-in duration-300">
            
            {/* Header Summary Card */}
            <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <span className="font-mono font-bold text-xl sm:text-2xl text-slate-900">{parcel.trackingNumber}</span>
                  <StatusBadge status={parcel.status} size="lg" />
                </div>
                <p className="text-xs text-slate-500 flex items-center gap-2">
                  <span>Priority: <strong className="text-slate-800">{parcel.priority}</strong></span>
                  <span>•</span>
                  <span>Booked: <strong>{new Date(parcel.bookingDate).toLocaleDateString()}</strong></span>
                </p>
              </div>

              <div className="bg-sky-50 p-4 rounded-2xl border border-sky-100 flex items-center gap-4">
                <div className="p-3 bg-sky-600 text-white rounded-xl shadow-xs">
                  <Calendar className="w-6 h-6" />
                </div>
                <div>
                  <div className="text-[10px] font-extrabold uppercase tracking-wider text-sky-700">Estimated Delivery</div>
                  <div className="text-base font-extrabold text-slate-900">
                    {parcel.estimatedDeliveryDate
                      ? new Date(parcel.estimatedDeliveryDate).toLocaleDateString('en-US', {
                          weekday: 'short',
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric',
                        })
                      : 'N/A'}
                  </div>
                </div>
              </div>
            </div>

            {/* Split Grid: Details & Map */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              
              {/* Left Column: Specs & Addresses */}
              <div className="space-y-6">
                
                {/* Current Location & Agent Card */}
                <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
                  <h3 className="text-xs font-extrabold text-slate-400 uppercase tracking-wider mb-4 flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-sky-600" />
                    Current Status & Location
                  </h3>
                  <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 mb-4">
                    <div className="text-xs text-slate-500">Current Hub City:</div>
                    <div className="text-lg font-bold text-slate-900">{parcel.currentLocation}</div>
                  </div>

                  {parcel.assignedAgent ? (
                    <div className="p-4 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-indigo-600 text-white flex items-center justify-center font-bold">
                        <Truck className="w-5 h-5" />
                      </div>
                      <div>
                        <div className="text-[10px] font-bold text-indigo-700 uppercase">Assigned Delivery Agent</div>
                        <div className="text-xs font-extrabold text-slate-900">{parcel.assignedAgent?.name || 'Assigned Agent'}</div>
                        <div className="text-[11px] text-slate-600 flex items-center gap-1 mt-0.5">
                          <Phone className="w-3 h-3 text-slate-400" /> {parcel.assignedAgent.phone || 'N/A'}
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="p-3 rounded-xl bg-slate-100 text-slate-500 text-xs text-center">
                      Agent assignment pending dispatch
                    </div>
                  )}
                </div>

                {/* Package Specifications Card */}
                <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
                  <h3 className="text-xs font-extrabold text-slate-400 uppercase tracking-wider mb-4 flex items-center gap-2">
                    <Weight className="w-4 h-4 text-sky-600" />
                    Package Specifications
                  </h3>
                  <div className="space-y-3 text-xs">
                    <div className="flex justify-between border-b border-slate-100 pb-2">
                      <span className="text-slate-500">Description:</span>
                      <span className="font-bold text-slate-800 text-right">{parcel.packageDescription}</span>
                    </div>
                    <div className="flex justify-between border-b border-slate-100 pb-2">
                      <span className="text-slate-500">Weight:</span>
                      <span className="font-bold text-slate-800">{parcel.weight} kg</span>
                    </div>
                    <div className="flex justify-between border-b border-slate-100 pb-2">
                      <span className="text-slate-500">Dimensions:</span>
                      <span className="font-bold text-slate-800">
                        {parcel.length || 0} x {parcel.width || 0} x {parcel.height || 0} cm
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Shipping Cost:</span>
                      <span className="font-bold text-emerald-600">₹{parcel.shippingCost} (Paid)</span>
                    </div>
                  </div>
                </div>

                {/* Sender & Receiver Card */}
                <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
                  <h3 className="text-xs font-extrabold text-slate-400 uppercase tracking-wider mb-4 flex items-center gap-2">
                    <User className="w-4 h-4 text-sky-600" />
                    Route Contacts
                  </h3>
                  <div className="space-y-4 text-xs">
                    <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                      <span className="text-[10px] font-bold text-sky-700 uppercase block mb-1">Sender (Origin)</span>
                      <div className="font-bold text-slate-900">{parcel.sender?.name || 'Sender'}</div>
                      <div className="text-slate-500 mt-0.5">{parcel.sender?.city || ''}, {parcel.sender?.state || ''} ({parcel.sender?.pincode || ''})</div>
                    </div>
                    <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                      <span className="text-[10px] font-bold text-emerald-700 uppercase block mb-1">Receiver (Destination)</span>
                      <div className="font-bold text-slate-900">{parcel.receiver?.name || 'Receiver'}</div>
                      <div className="text-slate-500 mt-0.5">{parcel.receiver?.city || ''}, {parcel.receiver?.state || ''} ({parcel.receiver?.pincode || ''})</div>
                    </div>
                  </div>
                </div>

              </div>

              {/* Right Column: Leaflet Map & Lifecycle Timeline */}
              <div className="lg:col-span-2 space-y-6">
                
                {/* Leaflet Route Map */}
                <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs">
                  <h3 className="text-xs font-extrabold text-slate-400 uppercase tracking-wider mb-4">
                    Live Route Visualization Map
                  </h3>
                  <InteractiveMap
                    originCity={parcel.sender.city}
                    currentCity={parcel.currentLocation}
                    destinationCity={parcel.receiver.city}
                  />
                </div>

                {/* Visual Tracking Lifecycle Timeline */}
                <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-xs">
                  <TrackingTimeline
                    currentStatus={parcel.status}
                    trackingEvents={parcel.trackingEvents || []}
                  />
                </div>

              </div>

            </div>

          </div>
        )}

      </main>

      <Footer />
    </div>
  );
};

export default TrackPublicPage;
