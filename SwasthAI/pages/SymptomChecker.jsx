import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { ArrowLeft, Bot, User, Loader2, RefreshCw } from 'lucide-react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { motion, AnimatePresence } from 'framer-motion';
import SymptomInput from '@/components/symptom/SymptomInput';
import FollowUpQuestion from '@/components/symptom/FollowUpQuestion';
import AssessmentResult from '@/components/symptom/AssessmentResult';
import { Button } from '@/components/ui/button';

export default function SymptomChecker() {
  const [stage, setStage] = useState('input'); // input, conversation, result
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(null);
  const [assessment, setAssessment] = useState(null);
  const [symptomCheckId, setSymptomCheckId] = useState(null);

  const addMessage = (role, content) => {
    setMessages(prev => [...prev, { role, content, timestamp: new Date() }]);
  };

  const analyzeSymptoms = async (symptomsText) => {
    setIsLoading(true);
    addMessage('user', symptomsText);
    setStage('conversation');

    try {
      // Create symptom check record
      const symptomCheck = await base44.entities.SymptomCheck.create({
        symptoms_text: symptomsText,
        symptoms: symptomsText.split(',').map(s => s.trim()),
        conversation_history: [{ role: 'user', content: symptomsText }]
      });
      setSymptomCheckId(symptomCheck.id);

      // AI Analysis with follow-up questions
      const analysis = await base44.integrations.Core.InvokeLLM({
        prompt: `You are a medical AI triage assistant for SwasthAI, an Indian healthcare app.

The patient reports: "${symptomsText}"

Based on common Indian health patterns and conditions, analyze these symptoms and:

1. Ask 2-3 important follow-up questions to better understand the condition
2. Each question should help differentiate between possible conditions

Respond ONLY in this JSON format:
{
  "follow_up_questions": [
    {
      "question": "How long have you been experiencing these symptoms?",
      "options": ["Less than 24 hours", "1-3 days", "More than a week"]
    }
  ],
  "initial_observations": "Brief note about what you're considering"
}`,
        response_json_schema: {
          type: "object",
          properties: {
            follow_up_questions: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  question: { type: "string" },
                  options: { type: "array", items: { type: "string" } }
                }
              }
            },
            initial_observations: { type: "string" }
          }
        }
      });

      if (analysis.follow_up_questions && analysis.follow_up_questions.length > 0) {
        const firstQ = analysis.follow_up_questions[0];
        addMessage('assistant', firstQ.question);
        setCurrentQuestion({
          question: firstQ.question,
          options: firstQ.options,
          remainingQuestions: analysis.follow_up_questions.slice(1)
        });
      }
    } catch (error) {
      console.error('Error analyzing symptoms:', error);
      addMessage('assistant', 'I apologize, but I encountered an issue. Please try again.');
    }
    setIsLoading(false);
  };

  const handleAnswer = async (answer) => {
    setIsLoading(true);
    addMessage('user', answer);

    try {
      if (currentQuestion.remainingQuestions && currentQuestion.remainingQuestions.length > 0) {
        // Ask next question
        const nextQ = currentQuestion.remainingQuestions[0];
        addMessage('assistant', nextQ.question);
        setCurrentQuestion({
          question: nextQ.question,
          options: nextQ.options,
          remainingQuestions: currentQuestion.remainingQuestions.slice(1)
        });
      } else {
        // Generate final assessment
        const conversationContext = messages.map(m => `${m.role}: ${m.content}`).join('\n');
        
        const finalAssessment = await base44.integrations.Core.InvokeLLM({
          prompt: `You are a medical AI triage assistant for SwasthAI, focusing on Indian healthcare.

Based on this conversation:
${conversationContext}
Latest answer: ${answer}

Provide a comprehensive but easy-to-understand health assessment. Consider:
- Common conditions in India matching these symptoms
- Appropriate severity level
- Practical home care tips
- When to seek immediate medical attention

Respond in this JSON format:
{
  "severity": "mild|moderate|severe",
  "risk_level": "low|medium|high|emergency",
  "recommended_action": "home_care|consult_doctor|urgent_care|emergency",
  "recommended_specialty": "General Physician|Cardiologist|Gastroenterologist|etc",
  "ai_assessment": "A clear, reassuring explanation in 2-3 sentences about what might be happening and what the patient should do.",
  "home_care_tips": ["tip1", "tip2", "tip3"],
  "red_flags": ["warning sign 1", "warning sign 2"]
}`,
          response_json_schema: {
            type: "object",
            properties: {
              severity: { type: "string" },
              risk_level: { type: "string" },
              recommended_action: { type: "string" },
              recommended_specialty: { type: "string" },
              ai_assessment: { type: "string" },
              home_care_tips: { type: "array", items: { type: "string" } },
              red_flags: { type: "array", items: { type: "string" } }
            }
          }
        });

        // Update symptom check record
        if (symptomCheckId) {
          await base44.entities.SymptomCheck.update(symptomCheckId, {
            ...finalAssessment,
            completed: true
          });
        }

        setAssessment(finalAssessment);
        setStage('result');
      }
    } catch (error) {
      console.error('Error processing answer:', error);
    }
    setIsLoading(false);
  };

  const resetChecker = () => {
    setStage('input');
    setMessages([]);
    setCurrentQuestion(null);
    setAssessment(null);
    setSymptomCheckId(null);
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="sticky top-0 bg-white border-b border-gray-100 px-4 py-4 z-10">
        <div className="flex items-center gap-4">
          <Link to={createPageUrl('Home')}>
            <button className="p-2 rounded-xl bg-gray-100 hover:bg-gray-200 transition-colors">
              <ArrowLeft size={20} className="text-gray-600" />
            </button>
          </Link>
          <div>
            <h1 className="text-lg font-bold text-gray-900">AI Symptom Checker</h1>
            <p className="text-xs text-gray-500">Powered by SwasthAI</p>
          </div>
          {stage !== 'input' && (
            <button 
              onClick={resetChecker}
              className="ml-auto p-2 rounded-xl bg-gray-100 hover:bg-gray-200 transition-colors"
            >
              <RefreshCw size={18} className="text-gray-600" />
            </button>
          )}
        </div>
      </div>

      <div className="p-4">
        {stage === 'input' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            {/* Introduction */}
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-5 mb-6">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center">
                  <Bot className="text-white" size={22} />
                </div>
                <div>
                  <h2 className="font-semibold text-gray-900">Hello! I'm your AI Health Guide</h2>
                  <p className="text-sm text-gray-600">Tell me about your symptoms</p>
                </div>
              </div>
              <p className="text-sm text-gray-600">
                Describe what you're experiencing and I'll help you understand your symptoms 
                and guide you to the right care.
              </p>
            </div>

            <SymptomInput onSubmit={analyzeSymptoms} isLoading={isLoading} />
          </motion.div>
        )}

        {stage === 'conversation' && (
          <div className="space-y-4">
            {/* Messages */}
            <div className="space-y-4 mb-4">
              <AnimatePresence>
                {messages.map((msg, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`flex gap-3 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    {msg.role === 'assistant' && (
                      <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center flex-shrink-0">
                        <Bot className="text-white" size={16} />
                      </div>
                    )}
                    <div className={`max-w-[80%] rounded-2xl px-4 py-3 ${
                      msg.role === 'user' 
                        ? 'bg-blue-600 text-white rounded-br-md' 
                        : 'bg-gray-100 text-gray-800 rounded-bl-md'
                    }`}>
                      <p className="text-sm">{msg.content}</p>
                    </div>
                    {msg.role === 'user' && (
                      <div className="w-8 h-8 rounded-lg bg-gray-200 flex items-center justify-center flex-shrink-0">
                        <User className="text-gray-600" size={16} />
                      </div>
                    )}
                  </motion.div>
                ))}
              </AnimatePresence>

              {isLoading && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex gap-3"
                >
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center">
                    <Loader2 className="text-white animate-spin" size={16} />
                  </div>
                  <div className="bg-gray-100 rounded-2xl rounded-bl-md px-4 py-3">
                    <div className="flex gap-1">
                      <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                      <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                      <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                    </div>
                  </div>
                </motion.div>
              )}
            </div>

            {/* Current Question */}
            {currentQuestion && !isLoading && (
              <FollowUpQuestion
                question={currentQuestion.question}
                options={currentQuestion.options}
                onAnswer={handleAnswer}
                isLoading={isLoading}
              />
            )}
          </div>
        )}

        {stage === 'result' && assessment && (
          <AssessmentResult assessment={assessment} />
        )}
      </div>

      {/* Disclaimer - Always visible */}
      <div className="fixed bottom-20 left-0 right-0 px-4">
        <div className="bg-amber-50 border border-amber-200 rounded-xl px-3 py-2">
          <p className="text-[10px] text-amber-800 text-center">
            ⚠️ This is AI-powered guidance, not a medical diagnosis. Always consult a qualified doctor.
          </p>
        </div>
      </div>
    </div>
  );
}