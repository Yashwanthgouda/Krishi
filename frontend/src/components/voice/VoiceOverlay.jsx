import { motion, AnimatePresence } from 'framer-motion';
import { MicIcon, CloseIcon } from '../icons';
import { useTranslation } from 'react-i18next';

export function VoiceOverlay({ voice }) {
  const { t } = useTranslation();
  const { isListening, stopListening, transcript } = voice;

  return (
    <AnimatePresence>
      {isListening && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] flex items-end sm:items-center justify-center p-4"
        >
          <motion.div
            initial={{ y: '100%', scale: 0.9 }}
            animate={{ y: 0, scale: 1 }}
            exit={{ y: '100%', scale: 0.9 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="bg-white rounded-t-3xl sm:rounded-3xl w-full max-w-lg p-6 sm:p-8 relative shadow-2xl"
          >
            <button 
              onClick={stopListening}
              className="absolute top-4 right-4 p-2 text-soil-light bg-gray-100 rounded-full hover:bg-gray-200"
            >
              <CloseIcon size={24} />
            </button>

            <div className="flex flex-col items-center mt-4">
               {/* Animated Mic Indicator */}
               <div className="relative w-24 h-24 mb-6 flex items-center justify-center">
                  <div className="absolute inset-0 bg-danger/20 rounded-full animate-ping"></div>
                  <div className="absolute inset-2 bg-danger/40 rounded-full animate-pulse"></div>
                  <div className="relative w-16 h-16 bg-danger rounded-full flex items-center justify-center shadow-lg">
                     <MicIcon size={36} color="#fff" />
                  </div>
               </div>

               <h2 className="text-2xl font-bold text-soil mb-2 text-center">
                 {t('voice.listening')}
               </h2>
               
               <div className="min-h-[80px] w-full bg-gray-50 rounded-xl p-4 flex items-center justify-center mb-6">
                 {transcript ? (
                    <p className="text-lg text-soil font-semibold text-center italic">"{transcript}"</p>
                 ) : (
                    <p className="text-soil-light text-center">{t('voice.speakCommand')}</p>
                 )}
               </div>

               <div className="w-full">
                  <p className="text-xs font-bold text-soil-light uppercase tracking-wider mb-3 text-center">{t('voice.commands')}</p>
                  <div className="flex flex-wrap justify-center gap-2">
                     <button 
                         onClick={() => { voice.stopListening(); voice.handleSmartCommand(t('voice.cmd_crop')); }}
                         className="pill text-sm cursor-pointer hover:bg-leaf hover:text-white transition-colors"
                     >
                         {t('voice.cmd_crop')}
                     </button>
                     <button 
                         onClick={() => { voice.stopListening(); voice.handleSmartCommand(t('voice.cmd_weather')); }}
                         className="pill text-sm cursor-pointer hover:bg-leaf hover:text-white transition-colors"
                     >
                         {t('voice.cmd_weather')}
                     </button>
                     <button 
                         onClick={() => { voice.stopListening(); voice.handleSmartCommand(t('voice.cmd_fertilizer')); }}
                         className="pill text-sm cursor-pointer hover:bg-leaf hover:text-white transition-colors"
                     >
                         {t('voice.cmd_fertilizer')}
                     </button>
                  </div>
               </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
