import React from 'react';
import { Package, Truck, Navigation, CheckCircle2, XCircle, RefreshCw, Clock } from 'lucide-react';

const statusConfig = {
  BOOKED: {
    label: 'Booked',
    bg: 'bg-blue-50 text-blue-700 border-blue-200',
    icon: Package,
    dot: 'bg-blue-500',
  },
  PICKED_UP: {
    label: 'Picked Up',
    bg: 'bg-indigo-50 text-indigo-700 border-indigo-200',
    icon: Clock,
    dot: 'bg-indigo-500',
  },
  IN_TRANSIT: {
    label: 'In Transit',
    bg: 'bg-amber-50 text-amber-800 border-amber-200',
    icon: Navigation,
    dot: 'bg-amber-500',
  },
  OUT_FOR_DELIVERY: {
    label: 'Out for Delivery',
    bg: 'bg-orange-50 text-orange-800 border-orange-200',
    icon: Truck,
    dot: 'bg-orange-500 pulse-glow',
  },
  DELIVERED: {
    label: 'Delivered',
    bg: 'bg-emerald-50 text-emerald-800 border-emerald-200',
    icon: CheckCircle2,
    dot: 'bg-emerald-500',
  },
  DELIVERY_FAILED: {
    label: 'Delivery Failed',
    bg: 'bg-rose-50 text-rose-800 border-rose-200',
    icon: XCircle,
    dot: 'bg-rose-500',
  },
  CANCELLED: {
    label: 'Cancelled',
    bg: 'bg-slate-100 text-slate-700 border-slate-300',
    icon: XCircle,
    dot: 'bg-slate-400',
  },
  RETURNED: {
    label: 'Returned',
    bg: 'bg-purple-50 text-purple-800 border-purple-200',
    icon: RefreshCw,
    dot: 'bg-purple-500',
  },
};

const StatusBadge = ({ status, size = 'md' }) => {
  const config = statusConfig[status] || {
    label: status ? status.replace(/_/g, ' ') : 'Unknown',
    bg: 'bg-slate-100 text-slate-800 border-slate-200',
    icon: Package,
    dot: 'bg-slate-400',
  };

  const IconComponent = config.icon;

  const sizeClasses = size === 'sm' 
    ? 'px-2 py-0.5 text-xs gap-1' 
    : size === 'lg'
    ? 'px-3.5 py-1.5 text-sm font-semibold gap-2'
    : 'px-2.5 py-1 text-xs font-medium gap-1.5';

  return (
    <span className={`inline-flex items-center rounded-full border shadow-xs ${config.bg} ${sizeClasses}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${config.dot}`} />
      <IconComponent className="w-3.5 h-3.5" />
      <span>{config.label}</span>
    </span>
  );
};

export default StatusBadge;
