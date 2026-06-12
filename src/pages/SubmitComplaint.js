import React, { useState, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useAuth } from '../context/AuthContext';
import { saveComplaint } from '../services/aiEngine';
import { pyFullAnalysis, pyClassifyComplaint, pyPredictPriority, pyGenerateRAGResponse, pyGenerateAISummary, pyGeminiVoiceTranslate } from '../services/pythonAiService';
import { sendUrgentComplaintEmail } from '../services/emailService';
import { awardPoints } from '../services/gamification';
import { FiSend, FiCpu, FiMapPin, FiFileText, FiAlertTriangle, FiCheckCircle, FiLoader, FiMail, FiZap, FiMic, FiMicOff } from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';
import '../styles/submit.css';

// Gemini API for voice translation + form extraction
const GEMINI_API_KEY = process.env.REACT_APP_GEMINI_API_KEY || '';
const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent';

async function callGeminiForVoice(prompt) {
  if (!GEMINI_API_KEY || GEMINI_API_KEY === 'YOUR_GEMINI_API_KEY_HERE') {
    throw new Error('Gemini API key not configured');
  }
  const response = await fetch(`${GEMINI_API_URL}?key=${GEMINI_API_KEY}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contents: [{ parts: [{ text: prompt }] }],
      generationConfig: { temperature: 0.2, maxOutputTokens: 1024 },
      safetySettings: [
        { category: 'HARM_CATEGORY_HARASSMENT', threshold: 'BLOCK_NONE' },
        { category: 'HARM_CATEGORY_HATE_SPEECH', threshold: 'BLOCK_NONE' },
        { category: 'HARM_CATEGORY_SEXUALLY_EXPLICIT', threshold: 'BLOCK_NONE' },
        { category: 'HARM_CATEGORY_DANGEROUS_CONTENT', threshold: 'BLOCK_NONE' }
      ]
    })
  });
  if (!response.ok) throw new Error('Gemini API error');
  const data = await response.json();
  return data.candidates?.[0]?.content?.parts?.[0]?.text?.trim() || '';
}

const locations = [
  'Block 1 - Ground Floor',
  'Block 1 - 1st Floor',
  'Block 1 - 2nd Floor',
  'Block 1 - Computer Lab 1',
  'Block 1 - Computer Lab 2',
  'Block 1 - Server Room',
  'Block 2 - Ground Floor',
  'Block 2 - 1st Floor',
  'Block 2 - 2nd Floor',
  'Block 3 - Ground Floor',
  'Block 3 - 1st Floor',
  'Block 3 - Room 101-110',
  'Block 3 - Room 201-210',
  'Block 4 - Ground Floor',
  'Block 4 - 1st Floor',
  'Block 5 - Ground Floor',
  'Block 5 - 1st Floor',
  'Library - Ground Floor',
  'Library - 1st Floor',
  'Hostel - Boys Block A',
  'Hostel - Boys Block B',
  'Hostel - Girls Block A',
  'Hostel - Girls Block B',
  'Sports Ground',
  'Parking Area',
  'Campus Grounds',
  'Other'
];

function localParseVoiceSpeech(text) {
  const lower = text.toLowerCase();
  
  // Basic dictionary for common Telugu/Hindi words to English
  const dictionary = {
    'kulaayi': 'tap',
    'kulayi': 'tap',
    'neeru': 'water',
    'neellu': 'water',
    'leak': 'leak',
    'leakage': 'leak',
    'pani cheyadam ledu': 'not working',
    'pani chestale': 'not working',
    'pani cheyyadam ledu': 'not working',
    'power': 'power',
    'electricity': 'electricity',
    'current': 'power',
    'poyindi': 'outage',
    'wifi': 'wifi',
    'internet': 'internet',
    'raavatledu': 'not working',
    'ravadam ledu': 'not working',
    'classroom': 'classroom',
    'class room': 'classroom',
    'lab': 'lab',
    'fan': 'fan',
    'ac': 'ac',
    'light': 'light',
    'broken': 'broken',
    'pagilindi': 'broken',
    'trash': 'trash',
    'table': 'table',
    'chair': 'chair',
    'bunk': 'bed',
    'bed': 'bed',
    'room': 'room',
    'dhust': 'dust',
    'canteen': 'canteen',
    'food': 'food',
    'annam': 'food'
  };

  let detectedKeywords = [];
  for (const [key, value] of Object.entries(dictionary)) {
    if (lower.includes(key)) {
      detectedKeywords.push(value);
    }
  }

  // Determine a matched location
  let matchedLocation = 'Other';
  for (const loc of locations) {
    const parts = loc.toLowerCase().split('-');
    const matches = parts.some(part => lower.includes(part.trim()));
    if (matches) {
      matchedLocation = loc;
      break;
    }
  }

  // Create a default title and description
  let title = 'Campus Maintenance Report';
  let description = text;

  if (detectedKeywords.length > 0) {
    const uniqKeywords = [...new Set(detectedKeywords)];
    title = `${uniqKeywords.map(k => k.charAt(0).toUpperCase() + k.slice(1)).join(' & ')} Incident`;
    description = `Auto-parsed voice report: ${text}`;
  }

  return {
    translatedText: text,
    title: title,
    description: description,
    location: matchedLocation
  };
}

export default function SubmitComplaint() {
  const { user, t } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    location: ''
  });
  const [errors, setErrors] = useState({});
  const [aiAnalysis, setAiAnalysis] = useState(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  // ===== VOICE ASSISTANT STATE =====
  const [isListening, setIsListening] = useState(false);
  const [voiceText, setVoiceText] = useState('');
  const [voiceProcessing, setVoiceProcessing] = useState(false);
  const [voiceLang, setVoiceLang] = useState(user?.languagePreference || 'en-IN');

  React.useEffect(() => {
    if (user?.languagePreference) {
      setVoiceLang(user.languagePreference);
    }
  }, [user]);
  const mediaRecorderRef = useRef(null);
  const websocketRef = useRef(null);

  const updateField = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setErrors(prev => ({ ...prev, [field]: '' }));
    if (field === 'description' && aiAnalysis) {
      setAiAnalysis(null);
    }
  };

  const handleFileChange = (e) => {
    const f = e.target.files[0];
    if (!f) return;
    const maxBytes = 3.5 * 1024 * 1024;
    if (f.size > maxBytes) {
      toast.error('Image too large. Please upload an image smaller than 3.5 MB');
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      setImagePreview(reader.result);
      setImageFile({ name: f.name, data: reader.result });
    };
    reader.readAsDataURL(f);
  };

  const validate = () => {
    const errs = {};
    if (!formData.title.trim()) errs.title = 'Title is required';
    else if (formData.title.trim().length < 5) errs.title = 'Title must be at least 5 characters';
    if (!formData.description.trim()) errs.description = 'Description is required';
    else if (formData.description.trim().length < 20) errs.description = 'Please provide a more detailed description (at least 20 characters)';
    if (!formData.location) errs.location = 'Please select a location';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  // Process voice text with Gemini AI — translate + extract complaint details (supporting backend fallback)
  const processVoiceWithAI = useCallback(async (textToProcess) => {
    const text = textToProcess || voiceText;
    if (!text.trim()) {
      toast.warning('No speech detected. Please speak and try again.');
      return;
    }

    setVoiceProcessing(true);

    try {
      const prompt = `You are a smart assistant for a college campus complaint system.

A user has spoken (possibly in Hindi, Telugu, Tamil, Kannada, Marathi, Bengali, Urdu, or any other Indian language, or English). Their speech has been transcribed as:
"${text}"

Your job:
1. Translate the speech to clear, proper English
2. Understand the complaint/problem they described
3. Generate a short title (5-10 words) for the complaint
4. Generate a detailed English description (2-4 sentences) of the complaint
5. Try to identify the location from their speech. Match it to one of these campus locations if possible: ${locations.join(', ')}. If no match, return "Other".

IMPORTANT: The transcription may be messy or in mixed language. Use your best understanding.

Respond in EXACTLY this JSON format, nothing else:
{
  "translatedText": "Full English translation of what they said",
  "title": "Short complaint title",
  "description": "Detailed English description of the problem",
  "location": "Best matching location or Other"
}`;

      let parsed = null;

      // Try frontend first if key is available
      if (GEMINI_API_KEY && GEMINI_API_KEY !== 'YOUR_GEMINI_API_KEY_HERE') {
        try {
          const raw = await callGeminiForVoice(prompt);
          const jsonMatch = raw.match(/\{[\s\S]*\}/);
          if (jsonMatch) {
            parsed = JSON.parse(jsonMatch[0]);
          }
        } catch (e) {
          console.warn('Frontend voice translate failed, falling back to backend...', e);
        }
      }

      // Backend fallback if frontend failed or key wasn't available
      if (!parsed) {
        parsed = await pyGeminiVoiceTranslate(text, locations);
      }

      if (!parsed || !parsed.title) {
        throw new Error('AI was unable to parse transcription');
      }

      // Auto-fill the form
      setFormData({
        title: parsed.title || '',
        description: parsed.description || parsed.translatedText || '',
        location: locations.includes(parsed.location) ? parsed.location : ''
      });

      setAiAnalysis(null); // Reset so user must re-analyze
      toast.success('✅ Voice translated & form filled by AI!');
    } catch (err) {
      console.error('Voice AI processing error, using local fallback parser:', err);
      const parsed = localParseVoiceSpeech(text);
      setFormData({
        title: parsed.title,
        description: parsed.description,
        location: locations.includes(parsed.location) ? parsed.location : ''
      });
      toast.success('✅ Voice parsed & form filled by local fallback!');
    }

    setVoiceProcessing(false);
  }, [voiceText]);

  // ===== VOICE ASSISTANT LOGIC =====
  const startListening = useCallback(() => {
    const DEEPGRAM_KEY = process.env.REACT_APP_DEEPGRAM_API_KEY || '';
    if (!DEEPGRAM_KEY) {
      toast.error('Deepgram API Key is not configured. Please set REACT_APP_DEEPGRAM_API_KEY in your Vercel environment variables.');
      return;
    }

    // Determine language prefix (e.g. te-IN -> te, hi-IN -> hi, en-IN -> en)
    const langCode = voiceLang.split('-')[0];
    
    // Connect to Deepgram live transcription WebSocket with interim_results and utterance_end detection
    const socket = new WebSocket(`wss://api.deepgram.com/v1/listen?model=nova-3&language=${langCode}&smart_format=true&interim_results=true&utterance_end_ms=1000`, [
      'token',
      DEEPGRAM_KEY
    ]);

    websocketRef.current = socket;
    let finalTranscript = '';

    socket.onopen = async () => {
      console.log('Deepgram WebSocket connection established.');
      
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        
        // Setup MediaRecorder
        const options = { mimeType: 'audio/webm' };
        let mediaRecorder;
        try {
          mediaRecorder = new MediaRecorder(stream, options);
        } catch (e) {
          mediaRecorder = new MediaRecorder(stream);
        }
        
        mediaRecorderRef.current = mediaRecorder;
        
        mediaRecorder.ondataavailable = (event) => {
          if (event.data.size > 0 && socket.readyState === WebSocket.OPEN) {
            socket.send(event.data);
          }
        };
        
        // Capture chunks of 250ms
        mediaRecorder.start(250);
        setIsListening(true);
        setVoiceText('');
        toast.info('🎙️ Listening via Deepgram... Speak now');
      } catch (err) {
        console.error('Failed to access microphone:', err);
        toast.error('Could not access your microphone.');
        socket.close();
      }
    };

    socket.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data.channel?.alternatives?.[0]) {
        const transcript = data.channel.alternatives[0].transcript;
        const isFinal = data.is_final;
        if (transcript) {
          if (isFinal) {
            finalTranscript += transcript + ' ';
            setVoiceText(finalTranscript);
          } else {
            setVoiceText(finalTranscript + transcript);
          }
        }
      }
    };

    socket.onerror = (err) => {
      console.error('Deepgram WebSocket error:', err);
    };

    socket.onclose = () => {
      console.log('Deepgram connection closed.');
      setIsListening(false);
      
      // Automatically trigger translation in background if we have text
      if (finalTranscript.trim()) {
        processVoiceWithAI(finalTranscript);
      }
    };

  }, [voiceLang, processVoiceWithAI]);

  const stopListening = useCallback(() => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      mediaRecorderRef.current.stop();
      mediaRecorderRef.current.stream.getTracks().forEach(track => track.stop());
    }
    if (websocketRef.current && websocketRef.current.readyState === WebSocket.OPEN) {
      // Send CloseStream. Deepgram processes remaining buffers and closes the socket from server side.
      websocketRef.current.send(JSON.stringify({ type: 'CloseStream' }));
      
      // Safety timeout: if server doesn't close connection within 2 seconds, client forces close.
      const socketToClose = websocketRef.current;
      setTimeout(() => {
        if (socketToClose.readyState === WebSocket.OPEN) {
          console.log('Force closing socket after timeout');
          socketToClose.close();
        }
      }, 2000);
    } else {
      setIsListening(false);
    }
  }, []);

  const handleAnalyze = async () => {
    if (!formData.description.trim() || formData.description.trim().length < 10) {
      toast.warning('Please enter a more detailed description for AI analysis');
      return;
    }

    setAnalyzing(true);

    try {
      toast.info('🐍 Running Python AI analysis...', { autoClose: 2000 });
      const result = await pyFullAnalysis(formData.description);

      setAiAnalysis({
        category: result.classification.category,
        confidence: result.classification.confidence,
        priority: result.priority,
        ragResponse: result.ragResponse,
        summary: result.summary,
        aiSource: result.source
      });

      if (result.source === 'gemini') {
        toast.success('✨ Gemini AI analysis complete!');
      } else if (result.source === 'hybrid') {
        toast.info('🔄 Hybrid analysis: Gemini AI + rule-based engine');
      } else {
        toast.info('📊 Analysis complete using Python AI engine');
      }
    } catch (error) {
      console.error('Python AI Backend error, using client fallback:', error);
      try {
        const classification = await pyClassifyComplaint(formData.description);
        const priority = await pyPredictPriority(formData.description);
        const ragResponse = await pyGenerateRAGResponse(classification.category);
        const summary = await pyGenerateAISummary(formData.description, classification.category, priority.level);

        setAiAnalysis({
          ...classification,
          priority,
          ragResponse,
          summary,
          aiSource: 'rule-based'
        });
        toast.info('AI analysis complete! Review the results below.');
      } catch (fallbackError) {
        console.error('All AI backends failed:', fallbackError);
        toast.error('AI analysis temporarily unavailable. Please try again.');
      }
    }
    
    setAnalyzing(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    if (!aiAnalysis) {
      toast.warning('Please run AI analysis first before submitting');
      return;
    }

    setSubmitting(true);
    await new Promise(resolve => setTimeout(resolve, 1000));

    const complaint = {
      id: 'CMP-' + String(Date.now()).slice(-6),
      userId: user.id,
      userName: user.name,
      userEmail: user.email,
      title: formData.title,
      description: formData.description,
      location: formData.location,
      category: aiAnalysis.category,
      predictedCategory: aiAnalysis.category,
      confidence: aiAnalysis.confidence,
      priority: aiAnalysis.priority.level,
      status: 'Open',
      aiSummary: aiAnalysis.summary,
      ragResponse: aiAnalysis.ragResponse,
      imageName: imageFile?.name || null,
      imageData: imageFile?.data || null,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

  await saveComplaint(complaint);

    const pointsResult = awardPoints(user.id, user.name, 'SUBMIT_COMPLAINT', complaint.id);
    if (complaint.priority === 'High') {
      awardPoints(user.id, user.name, 'HIGH_PRIORITY_REPORT', complaint.id);
    }
    
    if (complaint.priority === 'High') {
      const emailResult = await sendUrgentComplaintEmail(complaint);
      if (emailResult.success) {
        if (emailResult.demo) {
          toast.info('📧 Demo: Admin notification would be sent for this urgent complaint');
        } else {
          toast.info('📧 Admins have been notified via email about this urgent complaint');
        }
      }
    }
    
    setSubmitted(true);
    setSubmitting(false);
  toast.success(`🎉 Complaint submitted! You earned +${pointsResult.points} points`);
    
    setTimeout(() => navigate('/complaints'), 2000);
  };

  if (submitted) {
    return (
      <div className="submit-page">
        <motion.div 
          className="success-card"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
        >
          <FiCheckCircle className="success-icon" />
          <h2>Complaint Submitted!</h2>
          <p>Your complaint has been classified as <strong>{aiAnalysis.category}</strong> with 
          <strong> {aiAnalysis.priority.level}</strong> priority.</p>
          <p>The AI has generated an action plan and it has been routed to the appropriate department.</p>
          {aiAnalysis.priority.level === 'High' && (
            <p className="urgent-email-notice"><FiMail /> 📧 Admin team has been notified via email for immediate action</p>
          )}
          <p className="redirect-text">Redirecting to complaints...</p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="submit-page">
      <div className="submit-header">
        <h1><FiFileText /> {t('sub_header')}</h1>
        <p>{t('sub_subtitle')}</p>
      </div>

      <div className="submit-layout">
        {/* Form Section */}
        <div className="submit-form-section">
          {/* ===== VOICE ASSISTANT — DIRECT MIC ===== */}
          <div className="voice-section">
            {/* Language Selector Dropdown */}
            <div className="flex items-center gap-2 mb-3 bg-white/10 dark:bg-white/[0.02] border border-gray-300 dark:border-white/[0.08] px-3 py-1.5 rounded-xl max-w-xs">
              <span className="material-symbols-outlined text-[16px] text-gray-500">translate</span>
              <span className="text-[12px] font-semibold text-gray-600 dark:text-gray-400">{t('sub_voice_lang')}:</span>
              <select
                value={voiceLang}
                onChange={(e) => setVoiceLang(e.target.value)}
                disabled={isListening || voiceProcessing}
                className="bg-transparent border-none text-[12px] text-primary focus:ring-0 font-bold p-0 cursor-pointer w-auto"
                style={{ background: 'none', border: 'none', padding: '0 8px 0 0', width: 'auto', outline: 'none', boxShadow: 'none' }}
              >
                <option value="en-IN" className="bg-white dark:bg-[#101112] text-slate-800 dark:text-white">English (India)</option>
                <option value="te-IN" className="bg-white dark:bg-[#101112] text-slate-800 dark:text-white">Telugu (తెలుగు)</option>
                <option value="hi-IN" className="bg-white dark:bg-[#101112] text-slate-800 dark:text-white">Hindi (हिन्दी)</option>
                <option value="ta-IN" className="bg-white dark:bg-[#101112] text-slate-800 dark:text-white">Tamil (தமிழ்)</option>
                <option value="kn-IN" className="bg-white dark:bg-[#101112] text-slate-800 dark:text-white">Kannada (ಕನ್ನಡ)</option>
              </select>
            </div>

            <div className="voice-row">
              <button
                type="button"
                className={`btn-voice-mic ${isListening ? 'listening' : ''}`}
                onClick={isListening ? stopListening : startListening}
                disabled={voiceProcessing}
              >
                <div className={`mic-ring ${isListening ? 'active' : ''}`}>
                  {isListening ? <FiMicOff /> : <FiMic />}
                </div>
              </button>
              <div className="voice-info">
                <span className="voice-title">
                  {isListening ? t('sub_voice_listen') : voiceProcessing ? t('sub_voice_processing') : t('sub_voice_title')}
                </span>
                <span className="voice-subtitle">
                  {isListening
                    ? t('sub_voice_stop')
                    : voiceText && !voiceProcessing
                    ? t('sub_voice_captured')
                    : t('sub_voice_tap')}
                </span>
              </div>
              {isListening && (
                <div className="listening-indicator">
                  <span className="pulse-dot"></span>
                  <span className="pulse-dot"></span>
                  <span className="pulse-dot"></span>
                </div>
              )}
            </div>

            {/* Live Transcript */}
            <AnimatePresence>
              {voiceText && (
                <motion.div
                  className="voice-transcript"
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                >
                  <label>What we heard:</label>
                  <div className="transcript-text">{voiceText}</div>

                  {/* Process Button — visible after speech stops */}
                  {!isListening && (
                    <button
                      type="button"
                      className="btn-process-voice"
                      onClick={processVoiceWithAI}
                      disabled={voiceProcessing}
                    >
                      {voiceProcessing ? (
                        <><FiLoader className="spin" /> AI is translating & filling form...</>
                      ) : (
                        <><FiCpu /> Translate & Fill Form with AI</>
                      )}
                    </button>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <form onSubmit={handleSubmit} noValidate>
            <div className={`form-group ${errors.title ? 'error' : ''}`}>
              <label>{t('sub_title_label')}</label>
              <input
                type="text"
                placeholder={t('sub_title_placeholder')}
                value={formData.title}
                onChange={(e) => updateField('title', e.target.value)}
                maxLength={100}
              />
              <div className="char-count">{formData.title.length}/100</div>
              {errors.title && <span className="error-text">{errors.title}</span>}
            </div>

            <div className={`form-group ${errors.description ? 'error' : ''}`}>
              <label>{t('sub_desc_label')}</label>
              <textarea
                placeholder={t('sub_desc_placeholder')}
                value={formData.description}
                onChange={(e) => updateField('description', e.target.value)}
                rows={6}
                maxLength={2000}
              />
              <div className="char-count">{formData.description.length}/2000</div>
              {errors.description && <span className="error-text">{errors.description}</span>}
            </div>

            <div className={`form-group ${errors.location ? 'error' : ''}`}>
              <label><FiMapPin /> {t('sub_location_label')}</label>
              <select
                value={formData.location}
                onChange={(e) => updateField('location', e.target.value)}
              >
                <option value="">{t('sub_location_placeholder')}</option>
                {locations.map(loc => <option key={loc} value={loc}>{loc}</option>)}
              </select>
              {errors.location && <span className="error-text">{errors.location}</span>}
            </div>

            <div className="form-group">
              <label>{t('sub_image_label')}</label>
              <div className="input-wrapper">
                <input type="file" accept="image/*" onChange={handleFileChange} />
              </div>
              {imagePreview && (
                <div className="image-preview">
                  <img src={imagePreview} alt="preview" style={{ maxWidth: '200px', borderRadius: 8, marginTop: 8 }} />
                </div>
              )}
            </div>

            {/* AI Analyze Button */}
            <button 
              type="button" 
              className="btn-analyze" 
              onClick={handleAnalyze}
              disabled={analyzing || !formData.description.trim()}
            >
              {analyzing ? (
                <>
                  <FiLoader className="spin" /> {t('sub_btn_analyzing')}
                </>
              ) : (
                <>
                  <FiCpu /> {t('sub_btn_analyze')}
                </>
              )}
            </button>

            {/* Submit Button */}
            <button 
              type="submit" 
              className="btn-submit-complaint"
              disabled={submitting || !aiAnalysis}
            >
              {submitting ? (
                <>
                  <FiLoader className="spin" /> {t('sub_btn_submitting')}
                </>
              ) : (
                <>
                  <FiSend /> {t('sub_btn_submit')}
                </>
              )}
            </button>
          </form>
        </div>

        {/* AI Analysis Panel */}
        <div className="ai-analysis-panel">
          <AnimatePresence>
            {!aiAnalysis && !analyzing && (
              <motion.div 
                className="analysis-placeholder"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <FiCpu className="placeholder-icon" />
                <h3>{t('sub_ai_panel_title')}</h3>
                <p>{t('sub_ai_panel_desc')}</p>
              </motion.div>
            )}

            {analyzing && (
              <motion.div 
                className="analyzing-state"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <div className="ai-pulse"></div>
                <h3>🤖 AI Processing...</h3>
                <p>Querying Python AI backend...</p>
                <p>Running NLP classification & priority analysis...</p>
                <p>Generating RAG action plan...</p>
              </motion.div>
            )}

            {aiAnalysis && !analyzing && (
              <motion.div 
                className="analysis-results"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <h3>{t('sub_ai_results')}</h3>
                
                {/* AI Source Badge */}
                <div className="ai-source-badge-container">
                  {aiAnalysis.aiSource === 'gemini' && (
                    <span className="ai-source-badge gemini"><FiZap /> Powered by Google Gemini AI</span>
                  )}
                  {aiAnalysis.aiSource === 'hybrid' && (
                    <span className="ai-source-badge hybrid"><FiZap /> Gemini AI + Rule Engine</span>
                  )}
                  {aiAnalysis.aiSource === 'rule-based' && (
                    <span className="ai-source-badge rule-based"><FiCpu /> Rule-Based AI Engine</span>
                  )}
                </div>

                {/* Category */}
                <div className="result-card">
                  <div className="result-header">
                    <span className="result-label">{t('sub_ai_predicted_cat')}</span>
                    <span className="confidence-badge">{aiAnalysis.confidence}% {t('sub_ai_confidence')}</span>
                  </div>
                  <div className="result-value category-value">{aiAnalysis.category}</div>
                  <div className="confidence-bar">
                    <div 
                      className="confidence-fill" 
                      style={{ width: `${aiAnalysis.confidence}%` }}
                    ></div>
                  </div>
                </div>

                {/* Priority */}
                <div className="result-card">
                  <div className="result-header">
                    <span className="result-label">{t('sub_ai_priority')}</span>
                    <FiAlertTriangle style={{ color: aiAnalysis.priority.color }} />
                  </div>
                  <div className="result-value">
                    <span 
                      className="priority-indicator"
                      style={{ backgroundColor: aiAnalysis.priority.color }}
                    ></span>
                    {aiAnalysis.priority.level} Priority
                  </div>
                </div>

                {/* AI Summary */}
                <div className="result-card">
                  <div className="result-header">
                    <span className="result-label">{t('sub_ai_summary')}</span>
                  </div>
                  <p className="ai-summary-text">{aiAnalysis.summary}</p>
                </div>

                {/* SOPs */}
                <div className="result-card">
                  <div className="result-header">
                    <span className="result-label">{t('sub_ai_sops')}</span>
                  </div>
                  <ul className="sop-list">
                    {aiAnalysis.ragResponse.sops.map((sop, i) => (
                      <li key={i}><FiFileText /> {sop}</li>
                    ))}
                  </ul>
                </div>

                {/* Action Plan */}
                <div className="result-card action-plan-card">
                  <div className="result-header">
                    <span className="result-label">{t('sub_ai_action_plan')}</span>
                  </div>
                  <ol className="action-plan-list">
                    {aiAnalysis.ragResponse.actionPlan.map((step, i) => (
                      <li key={i}>{step}</li>
                    ))}
                  </ol>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
