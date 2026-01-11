import React, { useState, useEffect, useRef } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { 
  User, Mail, Phone, MapPin, Heart, AlertCircle, 
  Shield, Bell, HelpCircle, LogOut, ChevronRight,
  Edit2, Check, X, Loader2, Globe, Languages, Camera,
  Package, TestTube, BookOpen
} from 'lucide-react';
import { motion } from 'framer-motion';
import { Button } from '@/Components/ui/button';
import { Input } from '@/Components/ui/input';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import SwasthAILogo from '@/Components/ui/SwasthAILogo';

const menuItems = [
  { icon: Heart, label: 'Medical History', description: 'Conditions, allergies, medications', page: 'MedicalHistory' },
  { icon: Shield, label: 'ABHA Health ID', description: 'Link your national health ID', page: 'ABHALink' },
  { icon: Bell, label: 'Notifications', description: 'Reminders and alerts', page: 'Notifications' },
  { icon: Languages, label: 'Language', description: 'Choose your preferred language', page: 'LanguageSettings' },
  { icon: HelpCircle, label: 'Help & Support', description: 'FAQs and contact us', page: 'HelpSupport' },
];

export default function Profile() {
  const [user, setUser] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [uploadingPhoto, setUploadingPhoto] = useState(false);
  const photoInputRef = useRef(null);
  const queryClient = useQueryClient();

  useEffect(() => {
    base44.auth.me().then(setUser).catch(() => {});
  }, []);

  const { data: profile, isLoading } = useQuery({
    queryKey: ['healthProfile'],
    queryFn: async () => {
      const profiles = await base44.entities.HealthProfile.filter(
        { created_by: user?.email }, 
        '-created_date', 
        1
      );
      return profiles[0];
    },
    enabled: !!user
  });

  const updateProfile = useMutation({
    mutationFn: async (data) => {
      if (profile?.id) {
        return base44.entities.HealthProfile.update(profile.id, data);
      } else {
        return base44.entities.HealthProfile.create({ ...data, phone: user?.email });
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['healthProfile'] });
      setIsEditing(false);
    }
  });

  const [editForm, setEditForm] = useState({
    age: '',
    gender: '',
    city: '',
    blood_group: '',
    emergency_contact: ''
  });

  useEffect(() => {
    if (profile) {
      setEditForm({
        age: profile.age || '',
        gender: profile.gender || '',
        city: profile.city || '',
        blood_group: profile.blood_group || '',
        emergency_contact: profile.emergency_contact || ''
      });
    }
  }, [profile]);

  const handleLogout = () => {
    base44.auth.logout();
  };

  const handlePhotoUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploadingPhoto(true);
    try {
      const { file_url } = await base44.integrations.Core.UploadFile({ file });
      await base44.auth.updateMe({ profile_photo_url: file_url });
      const updatedUser = await base44.auth.me();
      setUser(updatedUser);
    } catch (error) {
      console.error('Photo upload error:', error);
      alert('Failed to upload photo');
    }
    setUploadingPhoto(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-24 flex flex-col">
      {/* Header */}
      <div className="bg-gradient-to-br from-blue-500 to-blue-700 px-4 pt-6 pb-12">
        <div className="flex items-center justify-between mb-6">
          <SwasthAILogo size="small" showText={false} />
          <button 
            onClick={() => setIsEditing(!isEditing)}
            className="p-2 rounded-xl bg-white/20 backdrop-blur-sm hover:bg-white/30 transition-colors"
          >
            {isEditing ? (
              <X size={20} className="text-white" />
            ) : (
              <Edit2 size={20} className="text-white" />
            )}
          </button>
        </div>

        {/* Profile Card */}
        <div className="flex items-center gap-4">
          <div className="relative">
            <div className="w-20 h-20 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center overflow-hidden">
              {user?.profile_photo_url ? (
                <img src={user.profile_photo_url} alt="Profile" className="w-full h-full object-cover" />
              ) : (
                <User size={40} className="text-white" />
              )}
            </div>
            <button
              onClick={() => photoInputRef.current?.click()}
              disabled={uploadingPhoto}
              className="absolute -bottom-2 -right-2 p-1.5 bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
            >
              {uploadingPhoto ? (
                <Loader2 size={14} className="text-white animate-spin" />
              ) : (
                <Camera size={14} className="text-white" />
              )}
            </button>
            <input
              ref={photoInputRef}
              type="file"
              accept="image/*"
              onChange={handlePhotoUpload}
              className="hidden"
            />
          </div>
          <div className="text-white">
            <h1 className="text-xl font-bold">{user?.full_name || 'User'}</h1>
            <p className="text-blue-100 text-sm">{user?.email}</p>
            {profile?.abha_id && (
              <div className="flex items-center gap-1 mt-1 text-green-300 text-xs">
                <Shield size={12} />
                <span>ABHA: {profile.abha_id}</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Profile Details Card */}
      <div className="px-4 -mt-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl p-5 shadow-lg"
        >
          <h2 className="font-bold text-gray-900 mb-4">Personal Details</h2>
          
          {isEditing ? (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-gray-500 mb-1 block">Age</label>
                  <Input
                    type="number"
                    value={editForm.age}
                    onChange={(e) => setEditForm({...editForm, age: e.target.value})}
                    placeholder="Age"
                    className="rounded-xl"
                  />
                </div>
                <div>
                  <label className="text-xs text-gray-500 mb-1 block">Gender</label>
                  <select
                    value={editForm.gender}
                    onChange={(e) => setEditForm({...editForm, gender: e.target.value})}
                    className="w-full h-10 px-3 rounded-xl border border-gray-200 text-sm"
                  >
                    <option value="">Select</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="text-xs text-gray-500 mb-1 block">City</label>
                <Input
                  value={editForm.city}
                  onChange={(e) => setEditForm({...editForm, city: e.target.value})}
                  placeholder="City"
                  className="rounded-xl"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-gray-500 mb-1 block">Blood Group</label>
                  <select
                    value={editForm.blood_group}
                    onChange={(e) => setEditForm({...editForm, blood_group: e.target.value})}
                    className="w-full h-10 px-3 rounded-xl border border-gray-200 text-sm"
                  >
                    <option value="">Select</option>
                    <option value="A+">A+</option>
                    <option value="A-">A-</option>
                    <option value="B+">B+</option>
                    <option value="B-">B-</option>
                    <option value="AB+">AB+</option>
                    <option value="AB-">AB-</option>
                    <option value="O+">O+</option>
                    <option value="O-">O-</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs text-gray-500 mb-1 block">Emergency Contact</label>
                  <Input
                    value={editForm.emergency_contact}
                    onChange={(e) => setEditForm({...editForm, emergency_contact: e.target.value})}
                    placeholder="Phone"
                    className="rounded-xl"
                  />
                </div>
              </div>
              <Button
                onClick={() => updateProfile.mutate({
                  ...editForm,
                  age: parseInt(editForm.age) || null,
                  onboarding_completed: true
                })}
                disabled={updateProfile.isPending}
                className="w-full rounded-xl bg-blue-600 hover:bg-blue-700"
              >
                {updateProfile.isPending ? (
                  <Loader2 size={18} className="animate-spin mr-2" />
                ) : (
                  <Check size={18} className="mr-2" />
                )}
                Save Changes
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex items-center gap-3 py-2">
                <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center">
                  <User size={18} className="text-blue-600" />
                </div>
                <div className="flex-1">
                  <p className="text-xs text-gray-500">Age & Gender</p>
                  <p className="font-medium text-gray-900">
                    {profile?.age ? `${profile.age} years` : '-'} • {profile?.gender ? profile.gender.charAt(0).toUpperCase() + profile.gender.slice(1) : '-'}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3 py-2">
                <div className="w-10 h-10 rounded-xl bg-green-50 flex items-center justify-center">
                  <MapPin size={18} className="text-green-600" />
                </div>
                <div className="flex-1">
                  <p className="text-xs text-gray-500">Location</p>
                  <p className="font-medium text-gray-900">{profile?.city || 'Not set'}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 py-2">
                <div className="w-10 h-10 rounded-xl bg-red-50 flex items-center justify-center">
                  <Heart size={18} className="text-red-600" />
                </div>
                <div className="flex-1">
                  <p className="text-xs text-gray-500">Blood Group</p>
                  <p className="font-medium text-gray-900">{profile?.blood_group || 'Not set'}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 py-2">
                <div className="w-10 h-10 rounded-xl bg-orange-50 flex items-center justify-center">
                  <Phone size={18} className="text-orange-600" />
                </div>
                <div className="flex-1">
                  <p className="text-xs text-gray-500">Emergency Contact</p>
                  <p className="font-medium text-gray-900">{profile?.emergency_contact || 'Not set'}</p>
                </div>
              </div>
            </div>
          )}
        </motion.div>
      </div>

      {/* Order History Section */}
      <div className="px-4 mt-6">
        <h2 className="text-sm font-semibold text-gray-500 mb-3 px-1">MY ORDERS</h2>
        <div className="bg-white rounded-2xl overflow-hidden shadow-sm">
          <Link
            to={createPageUrl('MedicalOrders')}
            className="flex items-center gap-3 p-4 hover:bg-gray-50 transition-colors border-b border-gray-100"
          >
            <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center">
              <Package size={18} className="text-blue-600" />
            </div>
            <div className="flex-1 text-left">
              <p className="font-medium text-gray-900">Medicine Orders</p>
              <p className="text-xs text-gray-500">Track your medicine deliveries</p>
            </div>
            <ChevronRight size={18} className="text-gray-400" />
          </Link>
          <Link
            to={createPageUrl('LabBookingHistory')}
            className="flex items-center gap-3 p-4 hover:bg-gray-50 transition-colors"
          >
            <div className="w-10 h-10 rounded-xl bg-purple-100 flex items-center justify-center">
              <TestTube size={18} className="text-purple-600" />
            </div>
            <div className="flex-1 text-left">
              <p className="font-medium text-gray-900">Lab Test Bookings</p>
              <p className="text-xs text-gray-500">View your lab test history</p>
            </div>
            <ChevronRight size={18} className="text-gray-400" />
          </Link>
        </div>
      </div>

      {/* Menu Items */}
      <div className="px-4 mt-6">
        <h2 className="text-sm font-semibold text-gray-500 mb-3 px-1">SETTINGS</h2>
        <div className="bg-white rounded-2xl overflow-hidden shadow-sm">
          {menuItems.map((item, index) => {
            const Element = item.page ? Link : 'button';
            const props = item.page ? { to: createPageUrl(item.page) } : {};
            
            return (
              <Element
                key={item.label}
                {...props}
                className={`w-full flex items-center gap-3 p-4 hover:bg-gray-50 transition-colors ${
                  index !== menuItems.length - 1 ? 'border-b border-gray-100' : ''
                }`}
              >
                <div className="w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center">
                  <item.icon size={18} className="text-gray-600" />
                </div>
                <div className="flex-1 text-left">
                  <p className="font-medium text-gray-900">{item.label}</p>
                  <p className="text-xs text-gray-500">{item.description}</p>
                </div>
                <ChevronRight size={18} className="text-gray-400" />
              </Element>
            );
          })}
        </div>
      </div>

      {/* Logout Button */}
      <div className="px-4 mt-6">
        <Button
          variant="outline"
          onClick={handleLogout}
          className="w-full h-12 rounded-xl border-red-200 text-red-600 hover:bg-red-50"
        >
          <LogOut size={18} className="mr-2" />
          Logout
        </Button>
      </div>

      {/* App Version */}
      <div className="text-center mt-6 pb-4">
        <p className="text-xs text-gray-400">SwasthAI v1.0.0</p>
        <p className="text-xs text-gray-400">Made with ❤️ for India</p>
      </div>
    </div>
  );
}