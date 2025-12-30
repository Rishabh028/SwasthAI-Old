import React, { useState, useEffect, useRef } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { 
  ArrowLeft, Upload, Camera, Pill, Search, MapPin, 
  Clock, Truck, ShoppingCart, Plus, Minus, Loader2, CheckCircle
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

const popularMedicines = [
  { name: 'Paracetamol 500mg', category: 'Pain Relief', price: 25 },
  { name: 'Cetirizine 10mg', category: 'Allergy', price: 35 },
  { name: 'ORS Sachets', category: 'Hydration', price: 15 },
  { name: 'Antacid Tablets', category: 'Digestion', price: 45 },
  { name: 'Vitamin C 1000mg', category: 'Immunity', price: 120 },
  { name: 'Band-Aid Pack', category: 'First Aid', price: 50 }
];

export default function Pharmacy() {
  const [searchQuery, setSearchQuery] = useState('');
  const [cart, setCart] = useState([]);
  const [isPrescriptionUploading, setIsPrescriptionUploading] = useState(false);
  const [prescriptionUploaded, setPrescriptionUploaded] = useState(false);
  const fileInputRef = useRef(null);
  const queryClient = useQueryClient();

  const { data: orders = [] } = useQuery({
    queryKey: ['medicineOrders'],
    queryFn: () => base44.entities.MedicineOrder.list('-created_date', 5)
  });

  const addToCart = (medicine) => {
    const existing = cart.find(item => item.name === medicine.name);
    if (existing) {
      setCart(cart.map(item => 
        item.name === medicine.name 
          ? { ...item, quantity: item.quantity + 1 }
          : item
      ));
    } else {
      setCart([...cart, { ...medicine, quantity: 1 }]);
    }
  };

  const removeFromCart = (medicineName) => {
    const existing = cart.find(item => item.name === medicineName);
    if (existing && existing.quantity > 1) {
      setCart(cart.map(item => 
        item.name === medicineName 
          ? { ...item, quantity: item.quantity - 1 }
          : item
      ));
    } else {
      setCart(cart.filter(item => item.name !== medicineName));
    }
  };

  const handlePrescriptionUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setIsPrescriptionUploading(true);
    try {
      const { file_url } = await base44.integrations.Core.UploadFile({ file });
      
      // Extract medicines from prescription using AI
      const extracted = await base44.integrations.Core.ExtractDataFromUploadedFile({
        file_url,
        json_schema: {
          type: "object",
          properties: {
            medicines: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  name: { type: "string" },
                  dosage: { type: "string" },
                  quantity: { type: "number" }
                }
              }
            }
          }
        }
      });

      if (extracted.output?.medicines) {
        const newCartItems = extracted.output.medicines.map(med => ({
          name: med.name,
          dosage: med.dosage,
          quantity: med.quantity || 1,
          price: 0 // Price would come from pharmacy partner
        }));
        setCart([...cart, ...newCartItems]);
      }
      setPrescriptionUploaded(true);
    } catch (error) {
      console.error('Upload error:', error);
    }
    setIsPrescriptionUploading(false);
  };

  const [showCheckout, setShowCheckout] = useState(false);
  const [deliveryAddress, setDeliveryAddress] = useState('');

  const totalAmount = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  const createOrder = useMutation({
    mutationFn: () => base44.entities.MedicineOrder.create({
      medicines: cart.map(item => ({
        name: item.name,
        quantity: item.quantity,
        price: item.price,
        dosage: item.dosage || ''
      })),
      total_amount: totalAmount,
      delivery_address: deliveryAddress,
      status: 'pending',
      order_date: new Date().toISOString().split('T')[0]
    }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['medicineOrders'] });
      setCart([]);
      setPrescriptionUploaded(false);
      setShowCheckout(false);
      alert('Order placed successfully!');
    }
  });

  return (
    <div className="min-h-screen bg-gray-50 pb-24 flex flex-col">
      {/* Header */}
      <div className="bg-white px-4 pt-4 pb-4">
        <div className="flex items-center gap-4 mb-4">
          <Link to={createPageUrl('Home')}>
            <button className="p-2 rounded-xl bg-gray-100 hover:bg-gray-200 transition-colors">
              <ArrowLeft size={20} className="text-gray-600" />
            </button>
          </Link>
          <div>
            <h1 className="text-lg font-bold text-gray-900">Order Medicines</h1>
            <p className="text-xs text-gray-500">Delivered to your doorstep</p>
          </div>
        </div>

        {/* Search */}
        <div className="relative">
          <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <Input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search medicines..."
            className="pl-10 rounded-xl border-gray-200"
          />
        </div>
      </div>

      {/* Upload Prescription */}
      <div className="px-4 py-4 flex-1">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-r from-orange-500 to-orange-600 rounded-2xl p-5 shadow-lg"
        >
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-white/20 rounded-xl flex items-center justify-center">
              {prescriptionUploaded ? (
                <CheckCircle className="text-white" size={28} />
              ) : (
                <Camera className="text-white" size={28} />
              )}
            </div>
            <div className="flex-1 text-white">
              <h3 className="font-bold">
                {prescriptionUploaded ? 'Prescription Uploaded!' : 'Upload Prescription'}
              </h3>
              <p className="text-orange-100 text-sm">
                {prescriptionUploaded 
                  ? 'Medicines added to cart' 
                  : 'We\'ll extract medicines automatically'
                }
              </p>
            </div>
            <Button
              onClick={() => fileInputRef.current?.click()}
              disabled={isPrescriptionUploading}
              className="bg-white text-orange-600 hover:bg-orange-50 rounded-xl"
            >
              {isPrescriptionUploading ? (
                <Loader2 size={18} className="animate-spin" />
              ) : (
                <Upload size={18} />
              )}
            </Button>
          </div>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*,.pdf"
            onChange={handlePrescriptionUpload}
            className="hidden"
          />
        </motion.div>
      </div>

      {/* Delivery Info */}
      <div className="px-4 pb-3">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Clock size={14} className="text-green-600" />
            <span>Delivery in 2-4 hours</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Truck size={14} className="text-blue-600" />
            <span>Free above ₹500</span>
          </div>
        </div>
      </div>

      {/* Recent Orders */}
      {orders.length > 0 && (
        <div className="px-4 py-4">
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-bold text-gray-900">Recent Orders</h2>
            <Link to={createPageUrl('MedicineOrderHistory')}>
              <button className="text-orange-600 text-sm font-medium hover:text-orange-700">
                View All
              </button>
            </Link>
          </div>
          <div className="space-y-2 mb-4">
            {orders.slice(0, 2).map((order, idx) => (
              <div key={idx} className="bg-white rounded-xl p-3 border border-gray-100">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">Order #{order.id.slice(0, 8)}</p>
                    <p className="text-xs text-gray-500 mt-1">
                      {order.medicines?.length || 0} item{order.medicines?.length !== 1 ? 's' : ''} • ₹{order.total_amount}
                    </p>
                  </div>
                  <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                    order.status === 'delivered' 
                      ? 'bg-green-50 text-green-600'
                      : order.status === 'cancelled'
                      ? 'bg-red-50 text-red-600'
                      : 'bg-blue-50 text-blue-600'
                  }`}>
                    {order.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Popular Medicines */}
      <div className="px-4">
        <h2 className="font-bold text-gray-900 mb-3">Popular Medicines</h2>
        <div className="grid grid-cols-2 gap-3">
          {popularMedicines.map((medicine, index) => {
            const cartItem = cart.find(item => item.name === medicine.name);
            return (
              <motion.div
                key={medicine.name}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="bg-white rounded-xl p-4 border border-gray-100"
              >
                <div className="w-12 h-12 bg-orange-50 rounded-xl flex items-center justify-center mb-3">
                  <Pill className="text-orange-500" size={24} />
                </div>
                <h3 className="font-medium text-gray-900 text-sm">{medicine.name}</h3>
                <p className="text-xs text-gray-500">{medicine.category}</p>
                <div className="flex items-center justify-between mt-3">
                  <span className="font-bold text-gray-900">₹{medicine.price}</span>
                  {cartItem ? (
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => removeFromCart(medicine.name)}
                        className="w-7 h-7 rounded-lg bg-gray-100 flex items-center justify-center"
                      >
                        <Minus size={14} />
                      </button>
                      <span className="text-sm font-medium w-4 text-center">{cartItem.quantity}</span>
                      <button
                        onClick={() => addToCart(medicine)}
                        className="w-7 h-7 rounded-lg bg-orange-100 flex items-center justify-center text-orange-600"
                      >
                        <Plus size={14} />
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => addToCart(medicine)}
                      className="px-3 py-1.5 bg-orange-50 text-orange-600 rounded-lg text-sm font-medium"
                    >
                      Add
                    </button>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Cart Footer */}
      <AnimatePresence>
        {cart.length > 0 && (
          <motion.div
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            className="fixed bottom-16 left-0 right-0 bg-white border-t border-gray-100 p-4 shadow-lg z-40"
          >
            <div className="flex items-center justify-between mb-3">
              <div>
                <p className="text-sm text-gray-500">{cart.reduce((sum, item) => sum + item.quantity, 0)} items</p>
                <p className="text-xl font-bold text-gray-900">₹{totalAmount}</p>
              </div>
              <Button 
                onClick={() => setShowCheckout(true)}
                className="h-12 px-8 rounded-xl bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700"
              >
                <ShoppingCart size={18} className="mr-2" />
                Checkout
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Checkout Modal */}
      <AnimatePresence>
        {showCheckout && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-50 flex items-end"
            onClick={() => setShowCheckout(false)}
          >
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              className="bg-white rounded-t-3xl p-6 w-full max-h-[80vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <h2 className="text-xl font-bold text-gray-900 mb-4">Delivery Details</h2>
              
              <div className="space-y-4 mb-6">
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-2 block">
                    Delivery Address
                  </label>
                  <textarea
                    value={deliveryAddress}
                    onChange={(e) => setDeliveryAddress(e.target.value)}
                    placeholder="Enter complete delivery address..."
                    className="w-full h-24 px-4 py-3 rounded-xl border border-gray-200 resize-none"
                  />
                </div>

                <div className="bg-gray-50 rounded-xl p-4">
                  <h3 className="font-semibold text-gray-900 mb-3">Order Summary</h3>
                  {cart.map((item, i) => (
                    <div key={i} className="flex justify-between text-sm mb-2">
                      <span className="text-gray-700">{item.name} x {item.quantity}</span>
                      <span className="font-medium">₹{item.price * item.quantity}</span>
                    </div>
                  ))}
                  <div className="border-t border-gray-200 pt-2 mt-2">
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-gray-600">Subtotal</span>
                      <span>₹{totalAmount}</span>
                    </div>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-gray-600">Delivery</span>
                      <span>{totalAmount >= 500 ? 'FREE' : '₹40'}</span>
                    </div>
                    <div className="flex justify-between text-lg font-bold pt-2 border-t border-gray-200">
                      <span>Total</span>
                      <span className="text-orange-600">₹{totalAmount + (totalAmount >= 500 ? 0 : 40)}</span>
                    </div>
                  </div>
                </div>
              </div>

              <Button
                onClick={() => createOrder.mutate()}
                disabled={!deliveryAddress || createOrder.isPending}
                className="w-full h-14 rounded-xl bg-gradient-to-r from-orange-500 to-orange-600 text-lg font-semibold"
              >
                {createOrder.isPending ? (
                  <>
                    <Loader2 className="animate-spin mr-2" size={20} />
                    Placing Order...
                  </>
                ) : (
                  <>
                    <CheckCircle size={20} className="mr-2" />
                    Place Order • ₹{totalAmount + (totalAmount >= 500 ? 0 : 40)}
                  </>
                )}
              </Button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}