// Doctor entity schema
const DoctorSchema = {
  "name": "Doctor",
  "type": "object",
  "properties": {
    "name": {
      "type": "string"
    },
    "specialty": {
      "type": "string"
    },
    "qualification": {
      "type": "string"
    },
    "experience_years": {
      "type": "number"
    },
    "rating": {
      "type": "number"
    },
    "reviews_count": {
      "type": "number"
    },
    "consultation_fee": {
      "type": "number"
    },
    "languages": {
      "type": "array",
      "items": {
        "type": "string"
      }
    },
    "available_online": {
      "type": "boolean",
      "default": true
    },
    "available_offline": {
      "type": "boolean",
      "default": true
    },
    "clinic_name": {
      "type": "string"
    },
    "clinic_address": {
      "type": "string"
    },
    "city": {
      "type": "string"
    },
    "photo_url": {
      "type": "string"
    },
    "available_slots": {
      "type": "array",
      "items": {
        "type": "object",
        "properties": {
          "date": {
            "type": "string"
          },
          "time": {
            "type": "string"
          },
          "type": {
            "type": "string"
          }
        }
      }
    },
    "next_available": {
      "type": "string"
    }
  },
  "required": [
    "name",
    "specialty"
  ]
};

export default DoctorSchema;