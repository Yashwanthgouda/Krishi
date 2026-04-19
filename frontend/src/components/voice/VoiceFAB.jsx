import { MicIcon } from '../icons/MicIcon';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';

export function VoiceFAB({ onPress, isListening, isSupported }) {
  const { t } = useTranslation();
  if (!isSupported) return null;

  return (
    <div className="fixed bottom-[80px] right-4 lg:bottom-8 lg:right-8 z-40 flex flex-col items-center">
      <AnimatePresence>
        {!isListening && (
           <motion.div 
             initial={{ opacity: 0, y: 10 }}
             animate={{ opacity: 1, y: 0 }}
             exit={{ opacity: 0, y: 5 }}
             className="bg-white px-3 py-1.5 rounded-full shadow-card text-xs font-bold text-leaf mb-3 relative"
           >
             {t('home.voiceHint')}
             <div className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-3 h-3 bg-white rotate-45"></div>
           </motion.div>
        )}
      </AnimatePresence>

      <button
        onClick={onPress}
        className={`relative flex items-center justify-center w-16 h-16 rounded-full shadow-lift transition-transform active:scale-90 ${
          isListening ? 'bg-danger' : 'bg-gradient-to-tr from-leaf to-leaf-hover'
        }`}
      >
        {!isListening && <div className="voice-ring"></div>}
        <MicIcon size={32} color="#fff" />
      </button>
    </div>
  );
}
