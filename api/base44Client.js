// Base44 API Client with Real Endpoints
const APP_ID = '694fd8b61fb0c471c15b8341';
const API_KEY = '3f3fa91f326742bb8bb2eb444baac1f3';
const BASE_URL = `https://app.base44.com/api/apps/${APP_ID}`;

const headers = {
  'api_key': API_KEY,
  'Content-Type': 'application/json'
};

// Generic fetch function with improved error handling
async function fetchAPI(endpoint, method = 'GET', body = null, retries = 2) {
  try {
    const options = {
      method,
      headers
    };
    
    if (body) {
      options.body = JSON.stringify(body);
    }
    
    const response = await fetch(endpoint, options);
    
    // Better error handling
    if (!response.ok) {
      if (response.status === 401) {
        console.error('Unauthorized - Check API key');
      } else if (response.status === 404) {
        console.warn(`Resource not found: ${endpoint}`);
        return null;
      } else if (response.status === 500 && retries > 0) {
        // Retry on server error
        await new Promise(r => setTimeout(r, 1000));
        return fetchAPI(endpoint, method, body, retries - 1);
      }
      throw new Error(`API Error: ${response.status} ${response.statusText}`);
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error(`API Error at ${endpoint}:`, error);
    return null;
  }
}

// Helper to build filter query string
const buildFilterQuery = (filter = {}) => {
  const params = new URLSearchParams();
  Object.entries(filter).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      params.append(key, value);
    }
  });
  return params.toString();
};

// Helper to create list method aliases
const createEntityAPI = (entityName) => {
  return {
    filter: async (query = {}, sort = '-created_date', limit = 10) => {
      try {
        const filterQuery = buildFilterQuery(query);
        const baseUrl = `${BASE_URL}/entities/${entityName}`;
        const url = filterQuery 
          ? `${baseUrl}?${filterQuery}&sort=${sort}&limit=${limit}`
          : `${baseUrl}?sort=${sort}&limit=${limit}`;
        
        const data = await fetchAPI(url);
        
        // Handle both array and paginated responses
        if (Array.isArray(data)) {
          return data;
        } else if (data?.results) {
          return data.results;
        } else if (data?.data) {
          return data.data;
        }
        return [];
      } catch (error) {
        console.error(`Error filtering ${entityName}:`, error);
        return [];
      }
    },
    
    list: async (sort = '-created_date', limit = 10) => {
      try {
        const data = await fetchAPI(`${BASE_URL}/entities/${entityName}?sort=${sort}&limit=${limit}`);
        
        // Handle both array and paginated responses
        if (Array.isArray(data)) {
          return data;
        } else if (data?.results) {
          return data.results;
        } else if (data?.data) {
          return data.data;
        }
        return [];
      } catch (error) {
        console.error(`Error listing ${entityName}:`, error);
        return [];
      }
    },
    
    get: async (id) => {
      try {
        return await fetchAPI(`${BASE_URL}/entities/${entityName}/${id}`);
      } catch (error) {
        console.error(`Error getting ${entityName}/${id}:`, error);
        return null;
      }
    },
    
    create: async (data) => {
      try {
        const result = await fetchAPI(`${BASE_URL}/entities/${entityName}`, 'POST', data);
        return result;
      } catch (error) {
        console.error(`Error creating ${entityName}:`, error);
        return null;
      }
    },
    
    update: async (id, data) => {
      try {
        return await fetchAPI(`${BASE_URL}/entities/${entityName}/${id}`, 'PUT', data);
      } catch (error) {
        console.error(`Error updating ${entityName}/${id}:`, error);
        return null;
      }
    },
    
    delete: async (id) => {
      try {
        return await fetchAPI(`${BASE_URL}/entities/${entityName}/${id}`, 'DELETE');
      } catch (error) {
        console.error(`Error deleting ${entityName}/${id}:`, error);
        return null;
      }
    }
  };
};

export const base44 = {
  // Authentication
  auth: {
    me: async () => {
      try {
        // In a real app, this would get from actual auth API
        // For now, return a mock user
        const storedUser = localStorage.getItem('swasthAI_user');
        if (storedUser) {
          return JSON.parse(storedUser);
        }
        
        return {
          id: 'user-1',
          email: 'user@example.com',
          full_name: 'John',
          phone: '+91-9876543210'
        };
      } catch (error) {
        console.error('Auth error:', error);
        return null;
      }
    },
    
    login: async (email, password) => {
      try {
        const user = { id: 'user-1', email, full_name: email.split('@')[0] };
        localStorage.setItem('swasthAI_user', JSON.stringify(user));
        return { success: true, user };
      } catch (error) {
        console.error('Login error:', error);
        return null;
      }
    },
    
    logout: async () => {
      try {
        localStorage.removeItem('swasthAI_user');
        return { success: true };
      } catch (error) {
        console.error('Logout error:', error);
        return null;
      }
    }
  },

  // Integrations
  integrations: {
    Core: {
      // Query AI with schema support
      QueryAI: async (config) => {
        try {
          // Mock AI response - in production, call real API
          const { prompt, json_schema } = config;
          
          // Simulate API call delay
          await new Promise(r => setTimeout(r, 800));
          
          // Return mock data based on schema
          if (json_schema?.properties?.possibleConditions) {
            return {
              possibleConditions: ['Common Cold', 'Flu', 'Allergies'],
              severity: 'mild',
              followUpQuestions: [
                'How long have you had these symptoms?',
                'Do you have a fever?',
                'Any recent travel?'
              ],
              recommendations: [
                'Rest and stay hydrated',
                'Monitor temperature',
                'Consult doctor if symptoms persist'
              ]
            };
          }
          
          return { success: true };
        } catch (error) {
          console.error('AI Query error:', error);
          return null;
        }
      },

      InvokeLLM: async (config) => {
        try {
          const { prompt } = config;
          
          // Mock LLM response for symptom analysis
          await new Promise(r => setTimeout(r, 1200));
          
          return {
            follow_up_questions: [
              {
                question: 'How long have you been experiencing these symptoms?',
                options: ['Less than 24 hours', '1-3 days', 'More than a week']
              },
              {
                question: 'Do you have a fever?',
                options: ['Yes', 'No', 'Not sure']
              },
              {
                question: 'Any recent travel or exposure?',
                options: ['Yes', 'No']
              }
            ],
            initial_observations: 'Based on symptoms reported, consulting with specialists might be beneficial.',
            risk_level: 'low',
            recommended_action: 'Schedule consultation',
            recommended_specialty: 'General Physician'
          };
        } catch (error) {
          console.error('LLM error:', error);
          return null;
        }
      },

      UploadFile: async (fileData) => {
        try {
          // Mock file upload
          await new Promise(r => setTimeout(r, 1000));
          
          return {
            file_url: 'https://example.com/uploads/file-' + Date.now() + '.pdf',
            file_name: fileData.name,
            file_size: fileData.size,
            success: true
          };
        } catch (error) {
          console.error('Upload error:', error);
          return null;
        }
      },

      ExtractDataFromUploadedFile: async (config) => {
        try {
          // Mock prescription extraction
          await new Promise(r => setTimeout(r, 800));
          
          return {
            medicines: [
              { name: 'Aspirin', dosage: '500mg', quantity: 30, frequency: 'Twice daily' },
              { name: 'Paracetamol', dosage: '650mg', quantity: 20, frequency: 'As needed' },
              { name: 'Cough Syrup', dosage: '5ml', quantity: 100, frequency: 'Thrice daily' }
            ],
            doctor_name: 'Dr. Smith',
            consultation_date: new Date().toISOString(),
            validity_days: 14
          };
        } catch (error) {
          console.error('Extract error:', error);
          return null;
        }
      }
    }
  },
  
  // Entities - Auto-created with factory function
  entities: {
    HealthProfile: createEntityAPI('HealthProfile'),
    SymptomCheck: createEntityAPI('SymptomCheck'),
    Doctor: {
      // Enhanced Doctor API with sample data fallback
      filter: async (query = {}, sort = '-rating', limit = 20) => {
        try {
          const filterQuery = buildFilterQuery(query);
          const baseUrl = `${BASE_URL}/entities/Doctor`;
          const url = filterQuery 
            ? `${baseUrl}?${filterQuery}&sort=${sort}&limit=${limit}`
            : `${baseUrl}?sort=${sort}&limit=${limit}`;
          
          const data = await fetchAPI(url);
          
          // If API returns data, use it
          if (Array.isArray(data) && data.length > 0) {
            return data;
          } else if (data?.results && data.results.length > 0) {
            return data.results;
          } else if (data?.data && data.data.length > 0) {
            return data.data;
          }
          
          // Fallback to sample data with filtering
          let results = [
            {
              id: 'doc_1',
              name: 'Rajesh Kumar',
              specialty: 'General Physician',
              qualification: 'MBBS, MD (Internal Medicine)',
              experience_years: 12,
              rating: 4.8,
              reviews_count: 342,
              consultation_fee: 500,
              languages: ['English', 'Hindi'],
              available_online: true,
              available_offline: true,
              clinic_name: 'Mumbai Medical Center',
              clinic_address: '123 Main Street, Mumbai, MH 400001',
              city: 'Mumbai',
              photo_url: null
            },
            {
              id: 'doc_2',
              name: 'Priya Sharma',
              specialty: 'Cardiologist',
              qualification: 'MBBS, DM (Cardiology)',
              experience_years: 15,
              rating: 4.9,
              reviews_count: 512,
              consultation_fee: 800,
              languages: ['English', 'Hindi'],
              available_online: true,
              available_offline: true,
              clinic_name: 'Heart Care Hospital',
              clinic_address: '456 Park Avenue, Delhi, DL 110001',
              city: 'Delhi',
              photo_url: null
            },
            {
              id: 'doc_3',
              name: 'Amit Patel',
              specialty: 'Dermatologist',
              qualification: 'MBBS, MD (Dermatology)',
              experience_years: 10,
              rating: 4.7,
              reviews_count: 289,
              consultation_fee: 600,
              languages: ['English', 'Hindi', 'Gujarati'],
              available_online: true,
              available_offline: true,
              clinic_name: 'Skin & Hair Clinic',
              clinic_address: '789 West Lane, Bangalore, KA 560001',
              city: 'Bangalore',
              photo_url: null
            },
            {
              id: 'doc_4',
              name: 'Dr. Neha Verma',
              specialty: 'Pediatrician',
              qualification: 'MBBS, MD (Pediatrics)',
              experience_years: 11,
              rating: 4.9,
              reviews_count: 421,
              consultation_fee: 450,
              languages: ['English', 'Hindi'],
              available_online: true,
              available_offline: true,
              clinic_name: 'Kids Care Clinic',
              clinic_address: '321 Child Street, Hyderabad, TG 500001',
              city: 'Hyderabad',
              photo_url: null
            },
            {
              id: 'doc_5',
              name: 'Vijay Singh',
              specialty: 'Orthopedic',
              qualification: 'MBBS, MS (Orthopedics)',
              experience_years: 14,
              rating: 4.6,
              reviews_count: 378,
              consultation_fee: 700,
              languages: ['English', 'Hindi'],
              available_online: true,
              available_offline: true,
              clinic_name: 'Bone & Joint Hospital',
              clinic_address: '654 Health Road, Pune, MH 411001',
              city: 'Pune',
              photo_url: null
            },
            {
              id: 'doc_6',
              name: 'Dr. Anjali Gupta',
              specialty: 'Gynecologist',
              qualification: 'MBBS, DGO (Obstetrics & Gynecology)',
              experience_years: 13,
              rating: 4.8,
              reviews_count: 456,
              consultation_fee: 600,
              languages: ['English', 'Hindi'],
              available_online: true,
              available_offline: true,
              clinic_name: 'Women\'s Health Center',
              clinic_address: '987 Ladies Lane, Chennai, TN 600001',
              city: 'Chennai',
              photo_url: null
            },
            {
              id: 'doc_7',
              name: 'Rohit Desai',
              specialty: 'ENT',
              qualification: 'MBBS, MS (ENT)',
              experience_years: 9,
              rating: 4.5,
              reviews_count: 267,
              consultation_fee: 550,
              languages: ['English', 'Hindi', 'Marathi'],
              available_online: true,
              available_offline: true,
              clinic_name: 'Ear Nose Throat Clinic',
              clinic_address: '147 Sound Street, Kolkata, WB 700001',
              city: 'Kolkata',
              photo_url: null
            },
            {
              id: 'doc_8',
              name: 'Dr. Sandeep Reddy',
              specialty: 'Neurologist',
              qualification: 'MBBS, MD (Neurology)',
              experience_years: 16,
              rating: 4.9,
              reviews_count: 534,
              consultation_fee: 900,
              languages: ['English', 'Hindi', 'Telugu'],
              available_online: true,
              available_offline: true,
              clinic_name: 'Neuro Care Institute',
              clinic_address: '258 Brain Road, Hyderabad, TG 500002',
              city: 'Hyderabad',
              photo_url: null
            },
            {
              id: 'doc_9',
              name: 'Dr. Ravi Malhotra',
              specialty: 'Gastroenterologist',
              qualification: 'MBBS, MD (Internal Medicine), DM (Gastroenterology)',
              experience_years: 17,
              rating: 4.8,
              reviews_count: 489,
              consultation_fee: 850,
              languages: ['English', 'Hindi', 'Punjabi'],
              available_online: true,
              available_offline: true,
              clinic_name: 'Digestive Health Center',
              clinic_address: '369 Digestive Lane, Chandigarh, CH 160001',
              city: 'Chandigarh',
              photo_url: null
            },
            {
              id: 'doc_10',
              name: 'Dr. Megha Kapoor',
              specialty: 'General Physician',
              qualification: 'MBBS, MD (Internal Medicine)',
              experience_years: 8,
              rating: 4.7,
              reviews_count: 312,
              consultation_fee: 450,
              languages: ['English', 'Hindi'],
              available_online: true,
              available_offline: true,
              clinic_name: 'City Medical Clinic',
              clinic_address: '741 Health Plaza, Bangalore, KA 560002',
              city: 'Bangalore',
              photo_url: null
            },
            {
              id: 'doc_11',
              name: 'Dr. Anil Rao',
              specialty: 'Cardiologist',
              qualification: 'MBBS, MD, DM (Cardiology)',
              experience_years: 18,
              rating: 4.9,
              reviews_count: 678,
              consultation_fee: 1000,
              languages: ['English', 'Hindi', 'Kannada'],
              available_online: true,
              available_offline: true,
              clinic_name: 'Advanced Cardiology Center',
              clinic_address: '852 Heart Avenue, Bangalore, KA 560003',
              city: 'Bangalore',
              photo_url: null
            },
            {
              id: 'doc_12',
              name: 'Dr. Pooja Singh',
              specialty: 'Dermatologist',
              qualification: 'MBBS, MD (Dermatology)',
              experience_years: 12,
              rating: 4.6,
              reviews_count: 298,
              consultation_fee: 650,
              languages: ['English', 'Hindi'],
              available_online: true,
              available_offline: true,
              clinic_name: 'Aesthetic Skin Clinic',
              clinic_address: '963 Beauty Street, Delhi, DL 110002',
              city: 'Delhi',
              photo_url: null
            }
          ];
          
          if (query.specialty) {
            results = results.filter(d => d.specialty === query.specialty);
          }
          if (query.available_online === true) {
            results = results.filter(d => d.available_online);
          }
          if (query.available_offline === true) {
            results = results.filter(d => d.available_offline);
          }
          
          // Sort
          if (sort === '-rating') {
            results.sort((a, b) => b.rating - a.rating);
          } else if (sort === '-experience_years') {
            results.sort((a, b) => b.experience_years - a.experience_years);
          }
          
          return results.slice(0, limit);
        } catch (error) {
          console.error('Error filtering doctors:', error);
          return [];
        }
      },
      
      list: async (sort = '-rating', limit = 20) => {
        try {
          const data = await fetchAPI(`${BASE_URL}/entities/Doctor?sort=${sort}&limit=${limit}`);
          
          if (Array.isArray(data) && data.length > 0) {
            return data;
          } else if (data?.results && data.results.length > 0) {
            return data.results;
          } else if (data?.data && data.data.length > 0) {
            return data.data;
          }
          
          // Return sample doctors
          let sampleDocs = [
            { id: 'doc_1', name: 'Rajesh Kumar', specialty: 'General Physician', rating: 4.8, consultation_fee: 500 },
            { id: 'doc_2', name: 'Priya Sharma', specialty: 'Cardiologist', rating: 4.9, consultation_fee: 800 },
            { id: 'doc_3', name: 'Amit Patel', specialty: 'Dermatologist', rating: 4.7, consultation_fee: 600 }
          ];
          return sampleDocs.slice(0, limit);
        } catch (error) {
          console.error('Error listing doctors:', error);
          return [];
        }
      },
      
      get: async (id) => {
        try {
          const data = await fetchAPI(`${BASE_URL}/entities/Doctor/${id}`);
          if (data) return data;
          
          // Try to find in sample data
          const sampleDocs = {
            'doc_1': { id: 'doc_1', name: 'Rajesh Kumar', specialty: 'General Physician', experience_years: 12, rating: 4.8, consultation_fee: 500 },
            'doc_2': { id: 'doc_2', name: 'Priya Sharma', specialty: 'Cardiologist', experience_years: 15, rating: 4.9, consultation_fee: 800 }
          };
          return sampleDocs[id] || null;
        } catch (error) {
          console.error('Error getting doctor:', error);
          return null;
        }
      },
      
      create: async (data) => {
        try {
          const response = await fetchAPI(`${BASE_URL}/entities/Doctor`, 'POST', data);
          return response || { id: 'doc_' + Date.now(), ...data };
        } catch (error) {
          console.error('Error creating doctor:', error);
          return { id: 'doc_' + Date.now(), ...data };
        }
      },
      
      update: async (id, data) => {
        try {
          const response = await fetchAPI(`${BASE_URL}/entities/Doctor/${id}`, 'PUT', data);
          return response || { id, ...data };
        } catch (error) {
          console.error('Error updating doctor:', error);
          return { id, ...data };
        }
      },
      
      delete: async (id) => {
        try {
          await fetchAPI(`${BASE_URL}/entities/Doctor/${id}`, 'DELETE');
          return true;
        } catch (error) {
          console.error('Error deleting doctor:', error);
          return false;
        }
      }
    },
    Appointment: createEntityAPI('Appointment'),
    HealthRecord: createEntityAPI('HealthRecord'),
    MedicineOrder: createEntityAPI('MedicineOrder'),
    LabBooking: createEntityAPI('LabBooking'),
    ForumPost: createEntityAPI('ForumPost'),
    ForumReply: createEntityAPI('ForumReply'),
    ArticleComment: createEntityAPI('ArticleComment'),
    PostUpvote: createEntityAPI('PostUpvote'),
    SavedArticles: createEntityAPI('SavedArticles'),
    HealthArticles: createEntityAPI('HealthArticles'),
    LabTests: createEntityAPI('LabTests'),
    LabBookingHistory: createEntityAPI('LabBookingHistory')
  }
};

