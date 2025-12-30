// LabBooking entity schema
export const LabBookingSchema = {
  name: 'LabBooking',
  type: 'object',
  properties: {
    id: { type: 'string' },
    lab_name: { type: 'string' },
    tests: { type: 'array', items: { type: 'object' } },
    total_amount: { type: 'number' },
    booking_type: { type: 'string', enum: ['home_collection', 'lab_visit'] },
    address: { type: 'string' },
    date: { type: 'string', format: 'date' },
    time_slot: { type: 'string' },
    status: { type: 'string', enum: ['booked', 'sample_collected', 'processing', 'report_ready', 'cancelled'], default: 'booked' },
    report_url: { type: 'string' },
    created_date: { type: 'string', format: 'date-time' }
  },
  required: ['lab_name', 'tests']
};

export default LabBookingSchema;