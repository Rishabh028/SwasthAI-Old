// HealthProfile entity schema
const HealthProfileSchema = {
  "name": "HealthProfile",
  "type": "object",
  "properties": {
    "phone": {
      "type": "string",
      "description": "User's phone number"
    },
    "language": {
      "type": "string",
      "enum": [
        "english",
        "hindi",
        "assamese",
        "bengali"
      ],
      "default": "english"
    },
    "age": {
      "type": "number"
    },
    "gender": {
      "type": "string",
      "enum": [
        "male",
        "female",
        "other"
      ]
    },
    "city": {
      "type": "string"
    },
    "blood_group": {
      "type": "string",
      "enum": [
        "A+",
        "A-",
        "B+",
        "B-",
        "AB+",
        "AB-",
        "O+",
        "O-",
        "unknown"
      ]
    },
    "existing_conditions": {
      "type": "array",
      "items": {
        "type": "string"
      },
      "description": "List of existing health conditions"
    },
    "allergies": {
      "type": "array",
      "items": {
        "type": "string"
      }
    },
    "abha_id": {
      "type": "string",
      "description": "ABHA health ID"
    },
    "abha_linked": {
      "type": "boolean",
      "default": false
    },
    "emergency_contact": {
      "type": "string"
    },
    "onboarding_completed": {
      "type": "boolean",
      "default": false
    }
  },
  "required": [
    "phone"
  ]
};

export default HealthProfileSchema;