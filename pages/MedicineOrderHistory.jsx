import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery } from '@tanstack/react-query';
import { ArrowLeft, Package, Clock, CheckCircle, XCircle, Truck, MapPin, RotateCcw } from 'lucide-react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { motion } from 'framer-motion';
import { format } from 'date-fns';
import { Skeleton } from '@/components/ui/skeleton';

const statusConfig = {
  pending: { icon: Clock, color: 'text-yellow-600', bg: 'bg-yellow-50', label: 'Pending' },
  confirmed: { icon: CheckCircle, color: 'text-blue-600', bg: 'bg-blue-50', label: 'Confirmed' },
  dispatched: { icon: Truck, color: 'text-purple-600', bg: 'bg-purple-50', label: 'Dispatched' },
  delivered: { icon: CheckCircle, color: 'text-green-600', bg: 'bg-green-50', label: 'Delivered' },
  cancelled: { icon: XCircle, color: 'text-red-600', bg: 'bg-red-50', label: 'Cancelled' }
};

export default function MedicineOrderHistory() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    base44.auth.me().then(setUser).catch(() => {});
  }, []);

  const { data: orders = [], isLoading } = useQuery({
    queryKey: ['medicineOrderHistory'],
    queryFn: () => base44.entities.MedicineOrder.list('-created_date', 100),
    enabled: !!user
  });

  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      {/* Header */}
      <div className="bg-white px-4 py-4 border-b border-gray-100">
        <div className="flex items-center gap-4">
          <Link to={createPageUrl('Pharmacy')}>
            <button className="p-2 rounded-xl bg-gray-100 hover:bg-gray-200 transition-colors">
              <ArrowLeft size={20} className="text-gray-600" />
            </button>
          </Link>
          <div>
            <h1 className="text-lg font-bold text-gray-900">Order History</h1>
            <p className="text-xs text-gray-500">All your medicine orders</p>
          </div>
        </div>
      </div>

      {/* Orders List */}
      <div className="px-4 py-4 space-y-3">
        {isLoading ? (
          Array(3).fill(0).map((_, i) => (
            <div key={i} className="bg-white rounded-2xl p-4 space-y-3">
              <Skeleton className="h-5 w-3/4" />
              <Skeleton className="h-4 w-1/2" />
              <Skeleton className="h-4 w-full" />
            </div>
          ))
        ) : orders.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Package size={32} className="text-gray-400" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-1">No orders yet</h3>
            <p className="text-sm text-gray-500 mb-4">Your medicine orders will appear here</p>
            <Link to={createPageUrl('Pharmacy')}>
              <button className="px-6 py-2 bg-orange-600 text-white rounded-xl hover:bg-orange-700 transition-colors">
                Order Medicines
              </button>
            </Link>
          </div>
        ) : (
          orders.map((order, index) => {
            const config = statusConfig[order.status] || statusConfig.pending;
            const Icon = config.icon;
            
            return (
              <motion.div
                key={order.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="bg-white rounded-2xl p-4 border border-gray-100"
              >
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold text-gray-900">{order.pharmacy_name || 'Pharmacy'}</h3>
                      <span className={`text-xs px-2 py-1 rounded-full ${config.bg} ${config.color} font-medium`}>
                        {config.label}
                      </span>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                      Order #{order.id.slice(0, 8)}
                    </p>
                  </div>
                  <Icon size={20} className={config.color} />
                </div>

                {/* Medicines */}
                <div className="space-y-2 mb-3">
                  {order.medicines?.slice(0, 3).map((med, i) => (
                    <div key={i} className="flex items-center justify-between text-sm">
                      <span className="text-gray-700">{med.name} x{med.quantity}</span>
                      <span className="text-gray-900 font-medium">₹{med.price * med.quantity}</span>
                    </div>
                  ))}
                  {order.medicines?.length > 3 && (
                    <p className="text-xs text-gray-500">+{order.medicines.length - 3} more items</p>
                  )}
                </div>

                {/* Total & Date */}
                <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                  <div>
                    <p className="text-xs text-gray-500">Total Amount</p>
                    <p className="text-lg font-bold text-gray-900">₹{order.total_amount}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-gray-500">
                      {order.order_date ? format(new Date(order.order_date), 'MMM d, yyyy') : format(new Date(order.created_date), 'MMM d, yyyy')}
                    </p>
                    {order.expected_delivery && order.status !== 'delivered' && (
                      <p className="text-xs text-blue-600 font-medium mt-1">
                        Expected: {format(new Date(order.expected_delivery), 'MMM d')}
                      </p>
                    )}
                  </div>
                </div>

                {/* Delivery Address */}
                {order.delivery_address && (
                  <div className="mt-3 pt-3 border-t border-gray-100 flex items-start gap-2">
                    <MapPin size={14} className="text-gray-400 mt-0.5 flex-shrink-0" />
                    <p className="text-xs text-gray-600">{order.delivery_address}</p>
                  </div>
                )}

                {/* Reorder Button */}
                {order.status === 'delivered' && (
                  <div className="mt-3 pt-3 border-t border-gray-100">
                    <button className="w-full py-2 px-4 rounded-lg bg-orange-50 text-orange-600 text-sm font-medium hover:bg-orange-100 transition-colors flex items-center justify-center gap-2">
                      <RotateCcw size={14} />
                      Reorder
                    </button>
                  </div>
                )}
              </motion.div>
            );
          })
        )}
      </div>
    </div>
  );
}
