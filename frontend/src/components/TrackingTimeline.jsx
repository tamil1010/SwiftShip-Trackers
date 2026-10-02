import React from 'react';
import { Check, Clock, Truck, Package, MapPin, AlertCircle } from 'lucide-react';

const LIFECYCLE_STEPS = [
  { key: 'BOOKED', label: 'Parcel Booked', description: 'Order registered' },
  { key: 'PICKED_UP', label: 'Picked Up', description: 'Received from sender' },
  { key: 'IN_TRANSIT', label: 'In Transit', description: 'Hub sorting & transport' },
  { key: 'OUT_FOR_DELIVERY', label: 'Out for Delivery', description: 'Agent assigned & loaded' },
  { key: 'DELIVERED', label: 'Delivered', description: 'Received & verified' },
];

const TrackingTimeline = ({ currentStatus, trackingEvents = [] }) => {
  const isFailed = currentStatus === 'DELIVERY_FAILED';
  const isCancelled = currentStatus === 'CANCELLED';
  const isReturned = currentStatus === 'RETURNED';

  const getStepIndex = (status) => {
    switch (status) {
      case 'BOOKED': return 0;
      case 'PICKED_UP': return 1;
      case 'IN_TRANSIT': return 2;
      case 'OUT_FOR_DELIVERY': return 3;
      case 'DELIVERED': return 4;
      default: return 0;
    }
  };

  const currentStepIdx = getStepIndex(currentStatus);

  return (
    <div className="w-full py-4">
      {/* Progress Bar Header */}
      <div className="relative mb-8">
        <div className="absolute top-5 left-0 right-0 h-1 bg-slate-200 -z-0 rounded-full overflow-hidden">
          <div
            className={`h-full transition-all duration-700 ease-out ${
              isFailed || isCancelled ? 'bg-rose-500' : 'bg-sky-600'
            }`}
            style={{
              width: `${(currentStepIdx / (LIFECYCLE_STEPS.length - 1)) * 100}%`,
            }}
          />
        </div>

        <div className="flex justify-between items-center relative z-10">
          {LIFECYCLE_STEPS.map((step, index) => {
            const isCompleted = index < currentStepIdx || (currentStatus === 'DELIVERED' && index === 4);
            const isCurrent = index === currentStepIdx && !isFailed && !isCancelled;
            
            return (
              <div key={step.key} className="flex flex-col items-center group">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition-all duration-300 shadow-md ${
                    isCompleted
                      ? 'bg-sky-600 text-white border-2 border-sky-600 ring-4 ring-sky-100'
                      : isCurrent
                      ? 'bg-amber-500 text-white border-2 border-amber-500 ring-4 ring-amber-100 animate-pulse'
                      : isFailed && index === currentStepIdx
                      ? 'bg-rose-600 text-white border-2 border-rose-600 ring-4 ring-rose-100'
                      : 'bg-white text-slate-400 border-2 border-slate-300'
                  }`}
                >
                  {isCompleted ? (
                    <Check className="w-5 h-5" />
                  ) : isCurrent ? (
                    <Clock className="w-5 h-5 animate-spin" />
                  ) : isFailed && index === currentStepIdx ? (
                    <AlertCircle className="w-5 h-5" />
                  ) : (
                    <span>{index + 1}</span>
                  )}
                </div>
                <span className={`text-xs font-semibold mt-2.5 text-center ${
                  isCurrent ? 'text-amber-600 font-bold' : isCompleted ? 'text-slate-800' : 'text-slate-400'
                }`}>
                  {step.label}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Exceptional Status Banner */}
      {(isFailed || isCancelled || isReturned) && (
        <div className={`p-4 rounded-xl mb-6 flex items-start gap-3 border ${
          isFailed ? 'bg-rose-50 border-rose-200 text-rose-800' : 'bg-slate-100 border-slate-300 text-slate-800'
        }`}>
          <AlertCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
          <div>
            <h4 className="font-semibold text-sm">
              {isFailed ? 'Delivery Exception / Delayed' : isCancelled ? 'Shipment Cancelled' : 'Shipment Returned'}
            </h4>
            <p className="text-xs mt-0.5">
              {isFailed
                ? 'Delivery attempt could not be completed. Support staff and agent will reschedule delivery.'
                : 'This shipment has been flagged with an exception status.'}
            </p>
          </div>
        </div>
      )}

      {/* Detailed Tracking Events History List */}
      <div className="mt-6">
        <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-4 flex items-center gap-2">
          <MapPin className="w-4 h-4 text-sky-600" />
          Tracking Event History
        </h3>

        <div className="space-y-4 relative before:absolute before:left-3.5 before:top-3 before:bottom-3 before:w-0.5 before:bg-slate-200">
          {trackingEvents.length > 0 ? (
            trackingEvents.map((evt, idx) => (
              <div key={evt.id || idx} className="relative flex items-start gap-4 pl-9">
                <div className="absolute left-1.5 top-1.5 w-4 h-4 rounded-full bg-white border-2 border-sky-600 flex items-center justify-center">
                  <div className="w-1.5 h-1.5 rounded-full bg-sky-600" />
                </div>
                <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-xs flex-1 hover:border-slate-300 transition-colors">
                  <div className="flex flex-wrap justify-between items-start gap-2">
                    <span className="inline-block px-2.5 py-0.5 text-xs font-bold rounded-md bg-slate-100 text-slate-800 border border-slate-200">
                      {evt.status.replace(/_/g, ' ')}
                    </span>
                    <span className="text-xs font-medium text-slate-500">
                      {new Date(evt.timestamp).toLocaleString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </span>
                  </div>
                  <p className="text-sm font-medium text-slate-800 mt-2">{evt.message}</p>
                  <p className="text-xs text-slate-500 mt-1 flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-slate-400" />
                    <span>Location: <strong>{evt.location}</strong></span>
                  </p>
                </div>
              </div>
            ))
          ) : (
            <p className="text-sm text-slate-500 pl-9">No detailed tracking events logged yet.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default TrackingTimeline;
