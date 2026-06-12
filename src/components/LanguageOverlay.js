import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import { FiGlobe } from 'react-icons/fi';

export default function LanguageOverlay() {
  const { user, changeLanguage } = useAuth();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (user) {
      const hasChosen = localStorage.getItem(`smart_campus_lang_chosen_${user.id}`);
      // Show if the user doesn't have a languagePreference and hasn't chosen it on this device
      if (!user.languagePreference && !hasChosen) {
        setVisible(true);
      } else {
        setVisible(false);
      }
    } else {
      setVisible(false);
    }
  }, [user]);

  const handleSelectLanguage = (lang) => {
    changeLanguage(lang);
    if (user) {
      localStorage.setItem(`smart_campus_lang_chosen_${user.id}`, 'true');
    }
    setVisible(false);
  };

  if (!visible) return null;

  const languages = [
    { code: 'en-IN', native: 'English', english: 'English', desc: 'Select English as your default language' },
    { code: 'te-IN', native: 'తెలుగు', english: 'Telugu', desc: 'తెలుగును మీ డిఫాల్ట్ భాషగా ఎంచుకోండి' },
    { code: 'hi-IN', native: 'हिन्दी', english: 'Hindi', desc: 'हिन्दी को अपनी डिफ़ॉल्ट भाषा के रूप में चुनें' },
    { code: 'ta-IN', native: 'தமிழ்', english: 'Tamil', desc: 'தமிழை உங்கள் இயல்புநிலை மொழியாகத் தேர்ந்தெடுக்கவும்' },
    { code: 'kn-IN', native: 'ಕನ್ನಡ', english: 'Kannada', desc: 'ಕನ್ನಡವನ್ನು ನಿಮ್ಮ ಡೀಫಾಲ್ಟ್ ಭಾಷೆಯಾಗಿ ಆಯ್ಕೆಮಾಡಿ' }
  ];

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          className="fixed inset-0 z-[99999] bg-[#070708] flex items-center justify-center p-6 md:p-12 overflow-y-auto"
          style={{
            backgroundImage: 'radial-gradient(circle at top right, rgba(94, 107, 255, 0.12), transparent 45%), radial-gradient(circle at bottom left, rgba(0, 177, 194, 0.12), transparent 45%)'
          }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* Dot Pattern Overlay */}
          <div className="absolute inset-0 bg-[radial-gradient(rgba(255,255,255,0.015)_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none"></div>

          <div className="relative w-full max-w-5xl mx-auto text-center z-10 py-8">
            {/* Globe Icon and Header */}
            <motion.div
              className="flex justify-center mb-6"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.1, duration: 0.4 }}
            >
              <div className="w-20 h-20 rounded-full border border-primary/30 flex items-center justify-center bg-primary/10 shadow-[0_0_30px_rgba(94,107,255,0.25)]">
                <FiGlobe className="text-[36px] text-primary animate-[spin_20s_linear_infinite]" />
              </div>
            </motion.div>

            {/* Multilingual Welcome Heading */}
            <motion.h1
              className="text-[26px] md:text-[36px] font-bold tracking-tight text-white leading-snug mb-4 max-w-3xl mx-auto font-h1"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.4 }}
            >
              Choose Your Language <br />
              <span className="text-[18px] md:text-[22px] font-normal text-custom-text-muted" style={{ color: '#9A9DA3' }}>
                మీ భాషను ఎంచుకోండి &bull; अपनी भाषा चुनें &bull; மொழியைத் தேர்ந்தெடுக்கவும் &bull; ಭಾಷೆಯನ್ನು ಆಯ್ಕೆಮಾಡಿ
              </span>
            </motion.h1>

            <motion.p
              className="text-[14px] md:text-[16px] text-custom-text-muted mb-12 max-w-lg mx-auto"
              style={{ color: '#9A9DA3' }}
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.4 }}
            >
              Please select your preferred language to customize the SmartCampus dashboard, portals, and AI speech analytics.
            </motion.p>

            {/* Language Selection Grid */}
            <motion.div
              className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-6 justify-center"
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.4, duration: 0.5 }}
            >
              {languages.map((lang, index) => (
                <button
                  key={lang.code}
                  onClick={() => handleSelectLanguage(lang.code)}
                  className="bg-[#101112]/85 hover:bg-[#16171a] border border-white/[0.05] hover:border-primary/50 rounded-2xl p-6 text-center transition-all duration-300 flex flex-col justify-center items-center h-[180px] group hover:shadow-[0_0_20px_rgba(94,107,255,0.15)] hover:scale-[1.03] cursor-pointer"
                  style={{ backdropFilter: 'blur(10px)', boxShadow: 'inset 0 1px 1px rgba(255,255,255,0.02)' }}
                >
                  <span className="text-[28px] font-bold text-white group-hover:text-primary transition-colors duration-300 block mb-2">{lang.native}</span>
                  <span className="text-[13px] font-semibold text-custom-text-muted uppercase tracking-wider block mb-3" style={{ color: '#9A9DA3' }}>{lang.english}</span>
                  <span className="text-[10px] text-custom-text-muted/60 leading-relaxed block max-h-[40px] overflow-hidden group-hover:text-white/70 transition-colors duration-300" style={{ color: 'rgba(154, 157, 163, 0.6)' }}>{lang.desc}</span>
                </button>
              ))}
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
