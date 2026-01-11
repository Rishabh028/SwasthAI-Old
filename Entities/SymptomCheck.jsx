// SymptomCheck entity schema
const SymptomCheckSchema = {
  "name": "SymptomCheck",
  "type": "object",
  "properties": {
    "symptoms": {
      "type": "array",
      "items": {
        "type": "string"
      },
      "description": "List of reported symptoms"
    },
    "symptoms_text": {
      "type": "string",
      "description": "Original symptom description"
    },
    "duration": {
      "type": "string",
      "description": "How long symptoms have been present"
    },
    "severity": {
      "type": "string",
      "enum": [
        "mild",
        "moderate",
        "severe"
      ],
      "description": "AI-assessed severity"
    },
    "risk_level": {
      "type": "string",
      "enum": [
        "low",
        "medium",
        "high",
        "emergency"
      ]
    },
    "recommended_action": {
      "type": "string",
      "enum": [
        "home_care",
        "consult_doctor",
        "urgent_care",
        "emergency"
      ]
    },
    "recommended_specialty": {
      "type": "string"
    },
    "ai_assessment": {
      "type": "string",
      "description": "AI generated assessment"
    },
    "home_care_tips": {
      "type": "array",
      "items": {
        "type": "string"
      }
    },
    "red_flags": {
      "type": "array",
      "items": {
        "type": "string"
      }
    },
    "conversation_history": {
      "type": "array",
      "items": {
        "type": "object",
        "properties": {
          "role": {
            "type": "string"
          },
          "content": {
            "type": "string"
          }
        }
      }
    },
    "completed": {
      "type": "boolean",
      "default": false
    }
  },
  "required": [
    "symptoms_text"
  ]
};

export default SymptomCheckSchema;