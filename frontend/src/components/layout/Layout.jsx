import { Sidebar } from './Sidebar';
import { BottomNav } from './BottomNav';
import { Header } from './Header';
import { useOffline } from '../../hooks/useOffline';
import { useTranslation } from 'react-i18next';
import { VoiceFAB } from '../voice/VoiceFAB';
import { VoiceOverlay } from '../voice/VoiceOverlay';
import { useVoice } from '../../hooks/useVoice';

export function Layout({ children }) {
  const isOffline = useOffline();
  const { t } = useTranslation();
  const voice = useVoice();

  return (
    <div className="app-shell">
      {/* Offline Banner */}
      {isOffline && (
        <div className="fixed top-0 left-0 w-full bg-danger text-white text-center py-1 text-sm font-bold z-50">
          {t('common.offline')}
        </div>
      )}

      <Sidebar />
      
      <main className="main-content relative pb-20 md:pb-0">
        <Header />
        
        <div className="page-wrap flex-1">
            {children}
        </div>

        {/* Global Voice Button - Always available */}
        <VoiceFAB 
            onPress={voice.startListening} 
            isListening={voice.isListening} 
            isSupported={voice.isSupported} 
        />
        
        <VoiceOverlay 
           voice={voice}
        />
      </main>

      <BottomNav />
    </div>
  );
}
