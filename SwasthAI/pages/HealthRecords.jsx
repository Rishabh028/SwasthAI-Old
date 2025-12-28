import React, { useState, useEffect, useRef } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { 
  Plus, Upload, FileText, Pill, TestTube, Search, 
  Filter, Calendar, ChevronDown, X, Loader2
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import RecordCard from '@/components/records/RecordCard';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

const recordTypes = [
  { key: 'all', label: 'All Records', icon: FileText },
  { key: 'prescription', label: 'Prescriptions', icon: Pill },
  { key: 'lab_report', label: 'Lab Reports', icon: TestTube },
  { key: 'doctor_note', label: 'Doctor Notes', icon: FileText },
  { key: 'other', label: 'Other', icon: FileText }
];

export default function HealthRecords() {
  const [user, setUser] = useState(null);
  const [filterType, setFilterType] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [showUpload, setShowUpload] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef(null);
  const queryClient = useQueryClient();

  useEffect(() => {
    base44.auth.me().then(setUser).catch(() => {});
  }, []);

  const { data: records = [], isLoading } = useQuery({
    queryKey: ['healthRecords', filterType],
    queryFn: async () => {
      let filter = {};
      if (filterType !== 'all') {
        filter.record_type = filterType;
      }
      return base44.entities.HealthRecord.filter(filter, '-record_date', 50);
    },
    enabled: !!user
  });

  const createRecord = useMutation({
    mutationFn: (data) => base44.entities.HealthRecord.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['healthRecords'] });
      setShowUpload(false);
    }
  });

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setIsUploading(true);
    try {
      const { file_url } = await base44.integrations.Core.UploadFile({ file });
      
      // Use AI to extract info from the document
      const extractedData = await base44.integrations.Core.ExtractDataFromUploadedFile({
        file_url,
        json_schema: {
          type: "object",
          properties: {
            title: { type: "string" },
            record_type: { type: "string", enum: ["prescription", "lab_report", "doctor_note", "vaccination", "other"] },
            doctor_name: { type: "string" },
            hospital_name: { type: "string" },
            date: { type: "string" }
          }
        }
      });

      await createRecord.mutateAsync({
        title: extractedData.output?.title || file.name,
        record_type: extractedData.output?.record_type || 'other',
        doctor_name: extractedData.output?.doctor_name,
        hospital_name: extractedData.output?.hospital_name,
        record_date: extractedData.output?.date || new Date().toISOString().split('T')[0],
        file_url,
        file_type: file.type
      });
    } catch (error) {
      console.error('Upload error:', error);
    }
    setIsUploading(false);
  };

  const filteredRecords = records.filter(record =>
    record.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    record.doctor_name?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white px-4 pt-4 pb-4">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Health Records</h1>
            <p className="text-sm text-gray-500 mt-1">Your digital health history</p>
          </div>
          <Button
            onClick={() => fileInputRef.current?.click()}
            className="rounded-xl bg-blue-600 hover:bg-blue-700"
            disabled={isUploading}
          >
            {isUploading ? (
              <Loader2 size={18} className="animate-spin" />
            ) : (
              <>
                <Plus size={18} className="mr-1" />
                Add
              </>
            )}
          </Button>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*,.pdf"
            onChange={handleFileUpload}
            className="hidden"
          />
        </div>

        {/* Search */}
        <div className="relative">
          <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <Input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search records..."
            className="pl-10 rounded-xl border-gray-200"
          />
        </div>

        {/* Filter Tabs */}
        <div className="flex gap-2 mt-4 overflow-x-auto scrollbar-hide pb-1">
          {recordTypes.map((type) => (
            <button
              key={type.key}
              onClick={() => setFilterType(type.key)}
              className={`flex-shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-sm font-medium transition-all ${
                filterType === type.key
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-600'
              }`}
            >
              <type.icon size={14} />
              {type.label}
            </button>
          ))}
        </div>
      </div>

      {/* ABHA Link Banner */}
      <div className="px-4 py-3">
        <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-3 border border-green-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center">
              🏥
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium text-green-800">ABHA Integration</p>
              <p className="text-xs text-green-600">Link to sync with national health records</p>
            </div>
            <ChevronDown size={18} className="text-green-600" />
          </div>
        </div>
      </div>

      {/* Records List */}
      <div className="px-4 pb-24 space-y-3">
        {isLoading ? (
          Array(4).fill(0).map((_, i) => (
            <div key={i} className="bg-white rounded-2xl p-4 space-y-3">
              <div className="flex gap-3">
                <Skeleton className="w-12 h-12 rounded-xl" />
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-5 w-3/4" />
                  <Skeleton className="h-4 w-1/2" />
                </div>
              </div>
            </div>
          ))
        ) : filteredRecords.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <FileText size={32} className="text-gray-400" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-1">No records found</h3>
            <p className="text-sm text-gray-500 mb-4">
              Upload your prescriptions, lab reports, and more
            </p>
            <Button
              onClick={() => fileInputRef.current?.click()}
              variant="outline"
              className="rounded-xl"
            >
              <Upload size={16} className="mr-2" />
              Upload First Record
            </Button>
          </div>
        ) : (
          <AnimatePresence>
            {filteredRecords.map((record, index) => (
              <RecordCard key={record.id} record={record} index={index} />
            ))}
          </AnimatePresence>
        )}
      </div>
    </div>
  );
}