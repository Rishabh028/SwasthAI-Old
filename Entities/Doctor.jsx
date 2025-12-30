// Doctor entity schema
export const DoctorSchema = {
  name: 'Doctor',
  type: 'object',
  properties: {
    id: { type: 'string' },
    name: { type: 'string' },
    specialty: { type: 'string' },
    qualification: { type: 'string' },
    experience_years: { type: 'number' },
    rating: { type: 'number' },
    reviews_count: { type: 'number' },
    consultation_fee: { type: 'number' },
    languages: { type: 'array', items: { type: 'string' } },
    available_online: { type: 'boolean', default: true },
    available_offline: { type: 'boolean', default: true },
    clinic_name: { type: 'string' },
    clinic_address: { type: 'string' },
    city: { type: 'string' },
    photo_url: { type: 'string' },
    available_slots: { type: 'array', items: { type: 'object' } },
    next_available: { type: 'string' },
    created_date: { type: 'string', format: 'date-time' }
  },
  required: ['name', 'specialty']
};

export default DoctorSchema;