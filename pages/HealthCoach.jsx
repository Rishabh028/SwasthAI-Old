import React, { useState, useEffect, useRef } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery } from '@tanstack/react-query';
import { 
  ArrowLeft, Send, Sparkles, Heart, Calendar, 
  Pill, Activity, TrendingUp, Clock, AlertCircle
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import ReactMarkdown from 'react-markdown';

const quickQuestions = [
  'What should I eat for better heart health?',
  'How can I improve my sleep?',
  'Give me tips for managing stress',
  'How much water should I drink daily?'
];

export default function HealthCoach() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const { data: profile } = useQuery({
    queryKey: ['healthProfile'],
    queryFn: async () => {
      const user = await base44.auth.me();
      const profiles = await base44.entities.HealthProfile.filter(
        { created_by: user.email }, 
        '-created_date', 
        1
      );
      return profiles[0];
    }
  });

  const { data: appointments = [] } = useQuery({
    queryKey: ['recentAppointments'],
    queryFn: () => base44.entities.Appointment.list('-created_date', 5)
  });

  const { data: records = [] } = useQuery({
    queryKey: ['recentRecords'],
    queryFn: () => base44.entities.HealthRecord.list('-created_date', 5)
  });

  const { data: symptomChecks = [] } = useQuery({
    queryKey: ['recentSymptomChecks'],
    queryFn: () => base44.entities.SymptomCheck.list('-created_date', 3)
  });

  useEffect(() => {
    // Welcome message
    if (messages.length === 0 && profile) {
      const welcomeMessage = {
        role: 'assistant',
        content: `Hello! 👋 I'm your AI Health Coach. I'm here to provide personalized health advice based on your profile and medical history.\n\nI can help you with:\n- Health tips and preventive care\n- Understanding your symptoms\n- Medication reminders\n- Lifestyle recommendations\n\nHow can I help you today?`
      };
      setMessages([welcomeMessage]);
    }
  }, [profile]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const buildContext = () => {
    let context = `User Profile:
Age: ${profile?.age || 'Not specified'}
Gender: ${profile?.gender || 'Not specified'}
Blood Group: ${profile?.blood_group || 'Not specified'}
City: ${profile?.city || 'Not specified'}
Existing Conditions: ${profile?.existing_conditions?.join(', ') || 'None'}
Allergies: ${profile?.allergies?.join(', ') || 'None'}

Recent Health Activity:`;

    if (appointments.length > 0) {
      context += `\n\nRecent Appointments:`;
      appointments.slice(0, 3).forEach(apt => {
        context += `\n- ${apt.doctor_specialty} appointment on ${apt.date}`;
        if (apt.symptoms) context += ` for ${apt.symptoms}`;
      });
    }

    if (symptomChecks.length > 0) {
      context += `\n\nRecent Symptom Checks:`;
      symptomChecks.forEach(check => {
        context += `\n- ${check.symptoms_text} (Severity: ${check.severity || 'unknown'})`;
      });
    }

    return context;
  };

  const handleSend = async (question = input) => {
    if (!question.trim()) return;

    const userMessage = { role: 'user', content: question };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const context = buildContext();
      const conversationHistory = messages.slice(-5).map(m => 
        `${m.role === 'user' ? 'User' : 'AI'}: ${m.content}`
      ).join('\n\n');

      const prompt = `You are an AI Health Coach providing personalized health advice. Be empathetic, clear, and actionable.

${context}

Previous conversation:
${conversationHistory}

User's question: ${question}

Provide helpful, personalized health advice based on the user's profile and history. If suggesting medical action, always recommend consulting a doctor. Be concise but comprehensive.`;

      const response = await base44.integrations.Core.InvokeLLM({
        prompt,
        add_context_from_internet: false
      });

      const aiMessage = { 
        role: 'assistant', 
        content: response 
      };
      setMessages(prev => [...prev, aiMessage]);
    } catch (error) {
      console.error('Error:', error);
      const errorMessage = {
        role: 'assistant',
        content: "I'm sorry, I encountered an error. Please try again."
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const getHealthInsights = () => {
    const insights = [];

    if (profile?.existing_conditions?.length > 0) {
      insights.push({
        icon: Heart,
        color: 'text-red-500 bg-red-50',
        title: 'Chronic Conditions',
        value: profile.existing_conditions.join(', ')
      });
    }

    if (appointments.length > 0) {
      const upcomingCount = appointments.filter(a => 
        a.status === 'scheduled' && new Date(a.date) > new Date()
      ).length;
      if (upcomingCount > 0) {
        insights.push({
          icon: Calendar,
          color: 'text-blue-500 bg-blue-50',
          title: 'Upcoming Appointments',
          value: `${upcomingCount} scheduled`
        });
      }
    }

    if (symptomChecks.length > 0) {
      const recentCheck = symptomChecks[0];
      if (recentCheck.completed) {
        insights.push({
          icon: Activity,
          color: 'text-purple-500 bg-purple-50',
          title: 'Last Symptom Check',
          value: `${recentCheck.severity || 'Unknown'} severity`
        });
      }
    }

    return insights;
  };

  const insights = getHealthInsights();

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 to-white flex flex-col">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 to-purple-700 text-white px-4 pt-4 pb-6">
        <div className="flex items-center gap-4 mb-4">
          <Link to={createPageUrl('Home')}>
            <button className="p-2 rounded-xl bg-white/20 backdrop-blur-sm hover:bg-white/30 transition-colors">
              <ArrowLeft size={20} />
            </button>
          </Link>
          <div>
            <h1 className="text-lg font-bold flex items-center gap-2">
              <Sparkles size={20} />
              AI Health Coach
            </h1>
            <p className="text-purple-100 text-xs">Your personal health assistant</p>
          </div>
        </div>

        {/* Health Insights */}
        {insights.length > 0 && (
          <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
            {insights.map((insight, i) => (
              <div
                key={i}
                className="bg-white/10 backdrop-blur-sm rounded-xl p-3 min-w-[160px] border border-white/20"
              >
                <div className={`w-8 h-8 rounded-lg ${insight.color} flex items-center justify-center mb-2`}>
                  <insight.icon size={16} />
                </div>
                <p className="text-xs text-purple-100 mb-1">{insight.title}</p>
                <p className="text-sm font-semibold">{insight.value}</p>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Messages */}
      <div className="flex-1 px-4 py-4 space-y-4 overflow-y-auto">
        <AnimatePresence>
          {messages.map((message, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[85%] rounded-2xl px-4 py-3 ${
                  message.role === 'user'
                    ? 'bg-purple-600 text-white'
                    : 'bg-white shadow-sm border border-gray-100'
                }`}
              >
                {message.role === 'assistant' ? (
                  <ReactMarkdown
                    className="text-sm prose prose-sm prose-slate max-w-none [&>*:first-child]:mt-0 [&>*:last-child]:mb-0"
                    components={{
                      p: ({ children }) => <p className="my-2 leading-relaxed text-gray-700">{children}</p>,
                      ul: ({ children }) => <ul className="my-2 ml-4 list-disc text-gray-700">{children}</ul>,
                      li: ({ children }) => <li className="my-1">{children}</li>,
                      strong: ({ children }) => <strong className="font-semibold text-gray-900">{children}</strong>,
                    }}
                  >
                    {message.content}
                  </ReactMarkdown>
                ) : (
                  <p className="text-sm">{message.content}</p>
                )}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {isLoading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex justify-start"
          >
            <div className="bg-white shadow-sm border border-gray-100 rounded-2xl px-4 py-3">
              <div className="flex items-center gap-2">
                <div className="flex gap-1">
                  <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                  <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                  <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
                <span className="text-xs text-gray-500">Thinking...</span>
              </div>
            </div>
          </motion.div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Quick Questions */}
      {messages.length <= 1 && (
        <div className="px-4 pb-4 overflow-x-auto scrollbar-hide bg-white border-t border-gray-100">
          <div className="flex gap-2 pb-2">
            {quickQuestions.map((question, i) => (
              <button
                key={i}
                onClick={() => handleSend(question)}
                className="flex-shrink-0 px-4 py-2 bg-white rounded-xl text-sm text-gray-700 border border-gray-200 hover:border-purple-300 hover:bg-purple-50 transition-all"
              >
                {question}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Input */}
      <div className="bg-white border-t border-gray-100 p-4">
        <div className="flex gap-2">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && !isLoading && handleSend()}
            placeholder="Ask about your health..."
            className="flex-1 h-12 rounded-xl border-gray-200"
            disabled={isLoading}
          />
          <Button
            onClick={() => handleSend()}
            disabled={!input.trim() || isLoading}
            className="h-12 px-4 rounded-xl bg-purple-600 hover:bg-purple-700 whitespace-nowrap flex items-center justify-center"
          >
            <Send size={18} />
          </Button>
        </div>
      </div>
    </div>
  );
}