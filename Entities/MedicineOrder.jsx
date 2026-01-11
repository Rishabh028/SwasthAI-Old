// MedicineOrder entity schema
const MedicineOrderSchema = {
  "name": "MedicineOrder",
  "type": "object",
  "properties": {
    "prescription_id": {
      "type": "string"
    },
    "pharmacy_name": {
      "type": "string"
    },
    "medicines": {
      "type": "array",
      "items": {
        "type": "object",
        "properties": {
          "name": {
            "type": "string"
          },
          "quantity": {
            "type": "number"
          },
          "price": {
            "type": "number"
          },
          "dosage": {
            "type": "string"
          }
        }
      }
    },
    "total_amount": {
      "type": "number"
    },
    "delivery_address": {
      "type": "string"
    },
    "status": {
      "type": "string",
      "enum": [
        "pending",
        "confirmed",
        "dispatched",
        "delivered",
        "cancelled"
      ],
      "default": "pending"
    },
    "order_date": {
      "type": "string",
      "format": "date"
    },
    "expected_delivery": {
      "type": "string",
      "format": "date"
    }
  },
  "required": [
    "medicines"
  ]
};

export default MedicineOrderSchema;