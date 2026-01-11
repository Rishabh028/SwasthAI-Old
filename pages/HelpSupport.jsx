import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { 
  ArrowLeft, HelpCircle, Phone, Mail, MessageCircle, 
  ChevronDown, ChevronUp, Send
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/Components/ui/button';
import { Input } from '@/Components/ui/input';

const faqs = [
  {
    question: 'How do I book an appointment?',
    answer: 'Go to the home screen, tap "Find Doctor", search for a specialist, select the doctor, choose a date and time, and confirm your booking.'
  },
  {
    question: 'How can I upload my health records?',
    answer: 'Navigate to the "Records" tab, tap the upload button, select a file from your device, and add relevant details like title and date.'
  },
  {
    question: 'What is ABHA Health ID?',
    answer: 'ABHA (Ayushman Bharat Health Account) is a unique 14-digit health ID issued by the Government of India to digitally store and access your health records across the country.'
  },
  {
    question: 'How do I use the AI Symptom Checker?',
    answer: 'Tap on "Check Symptoms" from the home screen, describe your symptoms, answer follow-up questions from the AI, and receive a health assessment with recommendations.'
  },
  {
    question: 'Can I cancel or reschedule appointments?',
    answer: 'Yes, go to the "Bookings" tab, select your appointment, and choose to reschedule or cancel. Please do this at least 24 hours in advance when possible.'
  },
  {
    question: 'How do I order medicines?',
    answer: 'Tap "Order Medicines" from the home screen, upload your prescription or search for medicines, add to cart, enter delivery address, and place your order.'
  },
  {
    question: 'Is my health data secure?',
    answer: 'Yes, all your health data is encrypted and stored securely. We comply with healthcare data protection regulations and never share your data without consent.'
  },
  {
    question: 'How does the AI Health Coach work?',
    answer: 'The AI Health Coach analyzes your health profile, appointments, and records to provide personalized health advice, preventive care tips, and answer your health questions.'
  }
];

const contactOptions = [
  {
    icon: Phone,
    label: 'Call Us',
    value: '1800-XXX-XXXX',
    action: 'tel:1800XXXXXXX',
    color: 'text-blue-600 bg-blue-50'
  },
  {
    icon: Mail,
    label: 'Email Us',
    value: 'support@swasthai.com',
    action: 'mailto:support@swasthai.com',
    color: 'text-green-600 bg-green-50'
  },
  {
    icon: MessageCircle,
    label: 'WhatsApp',
    value: '+91-XXXXX-XXXXX',
    action: 'https://wa.me/91XXXXXXXXXX',
    color: 'text-emerald-600 bg-emerald-50'
  }
];

export default function HelpSupport() {
  const navigate = useNavigate();
  const [expandedFaq, setExpandedFaq] = useState(null);
  const [message, setMessage] = useState('');

  const toggleFaq = (index) => {
    setExpandedFaq(expandedFaq === index ? null : index);
  };

  const handleSendMessage = () => {
    if (message.trim()) {
      alert('Thank you for your message. Our support team will get back to you soon!');
      setMessage('');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-500 to-indigo-600 text-white px-4 pt-6 pb-8">
        <div className="flex items-center gap-4 mb-4">
          <button 
            onClick={() => navigate(createPageUrl('Profile'))}
            className="p-2 rounded-xl bg-white/20 backdrop-blur-sm hover:bg-white/30 transition-colors"
          >
            <ArrowLeft size={20} />
          </button>
          <div>
            <h1 className="text-xl font-bold">Help & Support</h1>
            <p className="text-indigo-100 text-sm">We're here to help you</p>
          </div>
        </div>
      </div>

      <div className="px-4 -mt-4 space-y-4">
        {/* Contact Options */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl p-5 shadow-sm"
        >
          <h2 className="font-bold text-gray-900 mb-4">Contact Us</h2>
          <div className="space-y-3">
            {contactOptions.map((option, index) => (
              <a
                key={index}
                href={option.action}
                className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors"
              >
                <div className={`w-12 h-12 rounded-xl ${option.color} flex items-center justify-center`}>
                  <option.icon size={20} />
                </div>
                <div className="flex-1">
                  <p className="font-medium text-gray-900 text-sm">{option.label}</p>
                  <p className="text-xs text-gray-600">{option.value}</p>
                </div>
              </a>
            ))}
          </div>
        </motion.div>

        {/* Send Message */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-2xl p-5 shadow-sm"
        >
          <h2 className="font-bold text-gray-900 mb-4">Send us a message</h2>
          <div className="flex gap-2">
            <Input
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Type your message..."
              className="flex-1 rounded-xl"
            />
            <Button
              onClick={handleSendMessage}
              className="rounded-xl bg-indigo-600 hover:bg-indigo-700"
            >
              <Send size={18} />
            </Button>
          </div>
        </motion.div>

        {/* FAQs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-2xl p-5 shadow-sm"
        >
          <h2 className="font-bold text-gray-900 mb-4">Frequently Asked Questions</h2>
          <div className="space-y-2">
            {faqs.map((faq, index) => (
              <div
                key={index}
                className="border border-gray-100 rounded-xl overflow-hidden"
              >
                <button
                  onClick={() => toggleFaq(index)}
                  className="w-full flex items-center justify-between p-4 hover:bg-gray-50 transition-colors"
                >
                  <p className="font-medium text-gray-900 text-sm text-left">{faq.question}</p>
                  {expandedFaq === index ? (
                    <ChevronUp size={18} className="text-gray-400 flex-shrink-0 ml-2" />
                  ) : (
                    <ChevronDown size={18} className="text-gray-400 flex-shrink-0 ml-2" />
                  )}
                </button>
                <AnimatePresence>
                  {expandedFaq === index && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <div className="px-4 pb-4 text-sm text-gray-600 border-t border-gray-100 pt-3">
                        {faq.answer}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>
        </motion.div>

        {/* App Info */}
        <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl p-4 text-center">
          <p className="text-sm text-gray-700 mb-1">SwasthAI - Your Health Navigator</p>
          <p className="text-xs text-gray-500">Version 1.0.0</p>
          <p className="text-xs text-gray-500 mt-2">Made with ❤️ for India</p>
        </div>
      </div>
    </div>
  );
}