import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery } from '@tanstack/react-query';
import { ArrowLeft, Package, Clock, CheckCircle, XCircle, Truck, MapPin } from 'lucide-react';
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

export default function MedicalOrders() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    base44.auth.me().then(setUser).catch(() => {});
  }, []);

  const { data: orders = [], isLoading, error } = useQuery({
    queryKey: ['medicineOrders'],
    queryFn: () => base44.entities.MedicineOrder.list('-created_date', 50),
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
            <h1 className="text-lg font-bold text-gray-900">Medicine Orders</h1>
            <p className="text-xs text-gray-500">Track your orders</p>
          </div>
        </div>
      </div>

      {/* Orders List */}
      <div className="px-4 py-4 space-y-3">
        {error ? (
          <div className="text-center py-12">
            <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <XCircle size={32} className="text-red-500" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-1">Error loading orders</h3>
            <p className="text-sm text-gray-500 mb-4">Please try again later</p>
            <button 
              onClick={() => window.location.reload()} 
              className="px-6 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors"
            >
              Retry
            </button>
          </div>
        ) : isLoading ? (
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
              <button className="px-6 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors">
                Order Medicines
              </button>
            </Link>
          </div>
        ) : (
          orders.filter(order => order && typeof order === 'object').map((order, index) => {
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
                  {Array.isArray(order.medicines) && order.medicines.slice(0, 3).map((med, i) => (
                    <div key={i} className="flex items-center justify-between text-sm">
                      <span className="text-gray-700">{med?.name || 'Unknown'} x{med?.quantity || 0}</span>
                      <span className="text-gray-900 font-medium">₹{(med?.price || 0) * (med?.quantity || 0)}</span>
                    </div>
                  ))}
                  {Array.isArray(order.medicines) && order.medicines.length > 3 && (
                    <p className="text-xs text-gray-500">+{order.medicines.length - 3} more items</p>
                  )}
                </div>

                {/* Total & Date */}
                <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                  <div>
                    <p className="text-xs text-gray-500">Total Amount</p>
                    <p className="text-lg font-bold text-gray-900">₹{order.total_amount || 0}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-gray-500">
                      {(() => {
                        try {
                          const date = order.order_date ? new Date(order.order_date) : new Date(order.created_date);
                          return isNaN(date.getTime()) ? 'Invalid date' : format(date, 'MMM d, yyyy');
                        } catch (e) {
                          return 'Invalid date';
                        }
                      })()}
                    </p>
                    {order.expected_delivery && order.status !== 'delivered' && (
                      <p className="text-xs text-blue-600 font-medium mt-1">
                        Expected: {(() => {
                          try {
                            const date = new Date(order.expected_delivery);
                            return isNaN(date.getTime()) ? 'Invalid date' : format(date, 'MMM d');
                          } catch (e) {
                            return 'Invalid date';
                          }
                        })()}
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

                {/* Order Tracker */}
                {order.status !== 'cancelled' && order.status !== 'delivered' && (
                  <div className="mt-3 pt-3 border-t border-gray-100">
                    <div className="flex items-center justify-between">
                      <div className={`flex items-center gap-2 ${order.status === 'pending' || order.status === 'confirmed' || order.status === 'dispatched' ? 'text-blue-600' : 'text-gray-400'}`}>
                        <div className={`w-2 h-2 rounded-full ${order.status === 'pending' || order.status === 'confirmed' || order.status === 'dispatched' ? 'bg-blue-600' : 'bg-gray-300'}`} />
                        <span className="text-xs font-medium">Confirmed</span>
                      </div>
                      <div className={`flex-1 h-0.5 mx-2 ${order.status === 'dispatched' ? 'bg-blue-600' : 'bg-gray-200'}`} />
                      <div className={`flex items-center gap-2 ${order.status === 'dispatched' ? 'text-blue-600' : 'text-gray-400'}`}>
                        <div className={`w-2 h-2 rounded-full ${order.status === 'dispatched' ? 'bg-blue-600' : 'bg-gray-300'}`} />
                        <span className="text-xs font-medium">Dispatched</span>
                      </div>
                      <div className={`flex-1 h-0.5 mx-2 bg-gray-200`} />
                      <div className="flex items-center gap-2 text-gray-400">
                        <div className="w-2 h-2 rounded-full bg-gray-300" />
                        <span className="text-xs font-medium">Delivered</span>
                      </div>
                    </div>
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