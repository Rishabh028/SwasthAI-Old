// Appointment entity schema
const AppointmentSchema = {
  "name": "Appointment",
  "type": "object",
  "properties": {
    "doctor_id": {
      "type": "string"
    },
    "doctor_name": {
      "type": "string"
    },
    "doctor_specialty": {
      "type": "string"
    },
    "doctor_photo": {
      "type": "string"
    },
    "appointment_type": {
      "type": "string",
      "enum": [
        "online",
        "offline"
      ]
    },
    "date": {
      "type": "string",
      "format": "date"
    },
    "time": {
      "type": "string"
    },
    "status": {
      "type": "string",
      "enum": [
        "scheduled",
        "completed",
        "cancelled",
        "in_progress"
      ],
      "default": "scheduled"
    },
    "symptoms": {
      "type": "string"
    },
    "symptom_check_id": {
      "type": "string"
    },
    "consultation_notes": {
      "type": "string"
    },
    "prescription_id": {
      "type": "string"
    },
    "clinic_address": {
      "type": "string"
    },
    "fee": {
      "type": "number"
    },
    "payment_status": {
      "type": "string",
      "enum": [
        "pending",
        "paid",
        "refunded"
      ],
      "default": "pending"
    }
  },
  "required": [
    "doctor_id",
    "date",
    "time"
  ]
};

export default AppointmentSchema;