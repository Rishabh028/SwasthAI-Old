// HealthRecord entity schema
export const HealthRecordSchema = {
  name: 'HealthRecord',
  type: 'object',
  properties: {
    id: { type: 'string' },
    record_type: { type: 'string', enum: ['prescription', 'lab_report', 'doctor_note', 'vaccination', 'discharge_summary', 'other'] },
    title: { type: 'string' },
    description: { type: 'string' },
    doctor_name: { type: 'string' },
    hospital_name: { type: 'string' },
    record_date: { type: 'string', format: 'date' },
    file_url: { type: 'string' },
    file_type: { type: 'string' },
    appointment_id: { type: 'string' },
    tags: { type: 'array', items: { type: 'string' } },
    is_abha_synced: { type: 'boolean', default: false },
    created_date: { type: 'string', format: 'date-time' }
  },
  required: ['record_type', 'title']
};

export default HealthRecordSchema;