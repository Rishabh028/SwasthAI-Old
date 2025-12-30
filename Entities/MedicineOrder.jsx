// MedicineOrder entity schema
export const MedicineOrderSchema = {
  name: 'MedicineOrder',
  type: 'object',
  properties: {
    id: { type: 'string' },
    prescription_id: { type: 'string' },
    pharmacy_name: { type: 'string' },
    medicines: { type: 'array', items: { type: 'object' } },
    total_amount: { type: 'number' },
    delivery_address: { type: 'string' },
    status: { type: 'string', enum: ['pending', 'confirmed', 'dispatched', 'delivered', 'cancelled'], default: 'pending' },
    order_date: { type: 'string', format: 'date' },
    expected_delivery: { type: 'string', format: 'date' },
    created_date: { type: 'string', format: 'date-time' }
  },
  required: ['medicines']
};

export default MedicineOrderSchema;