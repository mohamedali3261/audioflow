/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { motion } from 'motion/react';
import { Music, FileText, ArrowRight, Zap } from 'lucide-react';

interface LandingProps {
  onNavigate: (page: 'audio' | 'pdf') => void;
  lang: 'ar' | 'en';
}

const translations = {
  ar: {
    welcome: 'مرحباً بك في AudioFlow',
    subtitle: 'منصة متكاملة لمعالجة الصوت والمستندات',
    audioTitle: 'معالج الصوت الاحترافي',
    audioDesc: 'ضغط الصوت، تحليل الترددات، معالجة متقدمة والمزيد',
    pdfTitle: 'محرر PDF والصور',
    pdfDesc: 'تحرير ملفات PDF والصور بسهولة وسرعة',
    explore: 'استكشف',
  },
  en: {
    welcome: 'Welcome to AudioFlow',
    subtitle: 'Integrated platform for audio and document processing',
    audioTitle: 'Professional Audio Editor',
    audioDesc: 'Audio compression, frequency analysis, advanced processing and more',
    pdfTitle: 'PDF & Image Editor',
    pdfDesc: 'Edit PDF and image files easily and quickly',
    explore: 'Explore',
  }
};

export function Landing({ onNavigate, lang }: LandingProps) {
  const t = translations[lang];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 },
    },
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0A0C0F] via-[#14171C] to-[#0A0C0F] text-white overflow-hidden" dir={lang === 'ar' ? 'rtl' : 'ltr'}>
      {/* Animated background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <motion.div
          animate={{
            x: [0, 100, 0],
            y: [0, 50, 0],
          }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          className="absolute top-0 left-1/4 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl"
        />
        <motion.div
          animate={{
            x: [0, -100, 0],
            y: [0, -50, 0],
          }}
          transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
          className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl"
        />
      </div>

      {/* Content */}
      <div className="relative z-10 min-h-screen flex flex-col items-center justify-center px-4">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="text-center max-w-4xl"
        >
          {/* Logo and Title */}
          <motion.div variants={itemVariants} className="mb-8">
            <div className="flex justify-center mb-6">
              <svg viewBox="0 0 100 100" className="w-20 h-20">
                <defs>
                  <linearGradient id="landingGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" style={{ stopColor: '#6366f1', stopOpacity: 1 }} />
                    <stop offset="100%" style={{ stopColor: '#8b5cf6', stopOpacity: 1 }} />
                  </linearGradient>
                </defs>
                <circle cx="50" cy="50" r="45" fill="url(#landingGrad)" className="drop-shadow-xl" />
                <g fill="white">
                  <motion.rect 
                    x="30" y="35" width="8" rx="3"
                    animate={{ height: [30, 15, 30] }}
                    transition={{ duration: 1.2, repeat: Infinity, ease: "easeInOut" }}
                  />
                  <motion.rect 
                    x="42" y="28" width="8" rx="3"
                    animate={{ height: [44, 22, 44] }}
                    transition={{ duration: 1.2, repeat: Infinity, ease: "easeInOut", delay: 0.1 }}
                  />
                  <motion.rect 
                    x="54" y="32" width="8" rx="3"
                    animate={{ height: [36, 18, 36] }}
                    transition={{ duration: 1.2, repeat: Infinity, ease: "easeInOut", delay: 0.2 }}
                  />
                  <motion.rect 
                    x="66" y="38" width="8" rx="3"
                    animate={{ height: [24, 12, 24] }}
                    transition={{ duration: 1.2, repeat: Infinity, ease: "easeInOut", delay: 0.3 }}
                  />
                </g>
              </svg>
            </div>
            <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-4 font-display italic">
              {t.welcome}
            </h1>
            <p className="text-gray-400 text-lg md:text-xl">
              {t.subtitle}
            </p>
          </motion.div>

          {/* Cards Grid */}
          <motion.div variants={itemVariants} className="grid md:grid-cols-2 gap-8 mt-16">
            {/* Audio Card */}
            <motion.button
              onClick={() => onNavigate('audio')}
              whileHover={{ scale: 1.05, y: -10 }}
              whileTap={{ scale: 0.95 }}
              className="group relative"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/20 to-purple-500/20 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <div className="relative bg-gradient-to-br from-[#1A1D23] to-[#14171C] border border-indigo-500/30 group-hover:border-indigo-500/60 rounded-2xl p-8 transition-all duration-300 h-full flex flex-col justify-between">
                <div>
                  <motion.div
                    animate={{ y: [0, -10, 0] }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="inline-flex p-4 bg-indigo-500/20 rounded-xl mb-6"
                  >
                    <Music className="text-indigo-400" size={32} />
                  </motion.div>
                  <h2 className="text-2xl font-bold mb-3 text-white">
                    {t.audioTitle}
                  </h2>
                  <p className="text-gray-400 text-sm leading-relaxed">
                    {t.audioDesc}
                  </p>
                </div>
                <div className="mt-8 flex items-center gap-2 text-indigo-400 font-semibold">
                  <span>{t.explore}</span>
                  <ArrowRight size={20} className="group-hover:translate-x-2 transition-transform" />
                </div>
              </div>
            </motion.button>

            {/* PDF Card */}
            <motion.button
              onClick={() => onNavigate('pdf')}
              whileHover={{ scale: 1.05, y: -10 }}
              whileTap={{ scale: 0.95 }}
              className="group relative"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <div className="relative bg-gradient-to-br from-[#1A1D23] to-[#14171C] border border-purple-500/30 group-hover:border-purple-500/60 rounded-2xl p-8 transition-all duration-300 h-full flex flex-col justify-between">
                <div>
                  <motion.div
                    animate={{ rotate: [0, 5, 0] }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="inline-flex p-4 bg-purple-500/20 rounded-xl mb-6"
                  >
                    <FileText className="text-purple-400" size={32} />
                  </motion.div>
                  <h2 className="text-2xl font-bold mb-3 text-white">
                    {t.pdfTitle}
                  </h2>
                  <p className="text-gray-400 text-sm leading-relaxed">
                    {t.pdfDesc}
                  </p>
                </div>
                <div className="mt-8 flex items-center gap-2 text-purple-400 font-semibold">
                  <span>{t.explore}</span>
                  <ArrowRight size={20} className="group-hover:translate-x-2 transition-transform" />
                </div>
              </div>
            </motion.button>
          </motion.div>

          {/* Footer */}
          <motion.div variants={itemVariants} className="mt-16 flex items-center justify-center gap-2 text-gray-500 text-sm">
            <Zap size={16} />
            <span>Powered by AudioFlow</span>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}
