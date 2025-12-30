import React from 'react';
import { FileText, Pill, TestTube, Stethoscope, Calendar, Download, Share2 } from 'lucide-react';
import { format } from 'date-fns';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';

const recordTypeConfig = {
  prescription: {
    icon: Pill,
    color: 'from-orange-400 to-orange-500',
    bgColor: 'bg-orange-50',
    label: 'Prescription'
  },
  lab_report: {
    icon: TestTube,
    color: 'from-purple-400 to-purple-500',
    bgColor: 'bg-purple-50',
    label: 'Lab Report'
  },
  doctor_note: {
    icon: Stethoscope,
    color: 'from-blue-400 to-blue-500',
    bgColor: 'bg-blue-50',
    label: 'Doctor Note'
  },
  vaccination: {
    icon: FileText,
    color: 'from-green-400 to-green-500',
    bgColor: 'bg-green-50',
    label: 'Vaccination'
  },
  discharge_summary: {
    icon: FileText,
    color: 'from-cyan-400 to-cyan-500',
    bgColor: 'bg-cyan-50',
    label: 'Discharge Summary'
  },
  other: {
    icon: FileText,
    color: 'from-gray-400 to-gray-500',
    bgColor: 'bg-gray-50',
    label: 'Document'
  }
};

export default function RecordCard({ record, index = 0, onView }) {
  const config = recordTypeConfig[record.record_type] || recordTypeConfig.other;
  const Icon = config.icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm"
      onClick={() => onView?.(record)}
    >
      <div className="flex items-start gap-3">
        <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${config.color} flex items-center justify-center flex-shrink-0`}>
          <Icon className="text-white" size={22} />
        </div>
        
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0">
              <h3 className="font-semibold text-gray-900 truncate">{record.title}</h3>
              <span className={`text-xs px-2 py-0.5 rounded-full ${config.bgColor} text-gray-700 inline-block mt-1`}>
                {config.label}
              </span>
            </div>
          </div>
          
          {record.doctor_name && (
            <p className="text-sm text-gray-600 mt-2">Dr. {record.doctor_name}</p>
          )}
          {record.hospital_name && (
            <p className="text-xs text-gray-500">{record.hospital_name}</p>
          )}
          
          <div className="flex items-center gap-4 mt-3">
            <div className="flex items-center gap-1 text-xs text-gray-500">
              <Calendar size={12} />
              <span>
                {record.record_date 
                  ? format(new Date(record.record_date), 'MMM d, yyyy')
                  : format(new Date(record.created_date), 'MMM d, yyyy')
                }
              </span>
            </div>
            
            {record.is_abha_synced && (
              <div className="text-xs text-green-600 font-medium">
                ✓ ABHA Synced
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-2 mt-4 pt-3 border-t border-gray-50">
        {record.file_url && (
          <Button
            variant="outline"
            size="sm"
            className="flex-1 rounded-xl text-xs"
            onClick={(e) => {
              e.stopPropagation();
              window.open(record.file_url, '_blank');
            }}
          >
            <Download size={14} className="mr-1" />
            Download
          </Button>
        )}
        <Button
          variant="outline"
          size="sm"
          className="flex-1 rounded-xl text-xs"
          onClick={(e) => {
            e.stopPropagation();
            if (record.file_url) {
              if (navigator.share) {
                navigator.share({
                  title: record.title,
                  text: `Health Record: ${record.title}`,
                  url: record.file_url
                }).catch(() => {
                  navigator.clipboard.writeText(record.file_url);
                  alert('Link copied to clipboard!');
                });
              } else {
                navigator.clipboard.writeText(record.file_url);
                alert('Link copied to clipboard!');
              }
            }
          }}
        >
          <Share2 size={14} className="mr-1" />
          Share
        </Button>
      </div>
    </motion.div>
  );
}