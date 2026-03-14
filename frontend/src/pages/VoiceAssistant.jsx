import React, { useState, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLang } from '../context/LanguageContext';

const COMMANDS = [
  { text: 'Say "crop" → Opens Crop Advisor', icon: '🌾' },
  { text: 'Say "fertilizer" → Opens Fertilizer Guide', icon: '🧪' },
  { text: 'Say "weather" → Opens Weather Forecast', icon: '🌤️' },
  { text: 'Say "disease" → Opens Disease Detector', icon: '🔬' },
  { text: 'Say "market" → Opens Market Prices', icon: '📊' },
  { text: 'Say "home" → Back to Dashboard', icon: '🏠' },
];

const LANG_COMMANDS = {
  en: ['crop', 'fertilizer', 'weather', 'disease', 'market', 'home'],
  hi: ['फसल', 'खाद', 'मौसम', 'रोग', 'बाज़ार', 'होम'],
  kn: ['ಬೆಳೆ', 'ಗೊಬ್ಬರ', 'ಹವಾಮಾನ', 'ರೋಗ', 'ಮಾರುಕಟ್ಟೆ', 'ಮನೆ'],
  te: ['పంట', 'ఎరువు', 'వాతావరణం', 'వ్యాధి', 'మార్కెట్', 'హోమ్'],
};

const ROUTE_MAP = {
  crop: '/crop', फसल: '/crop', ಬೆಳೆ: '/crop', పంట: '/crop',
  fertilizer: '/fertilizer', खाद: '/fertilizer', ಗೊಬ್ಬರ: '/fertilizer', ఎరువు: '/fertilizer',
  weather: '/weather', मौसम: '/weather', ಹವಾಮಾನ: '/weather', వాతావరణం: '/weather',
  disease: '/disease', रोग: '/disease', ರೋಗ: '/disease', వ్యాధి: '/disease',
  market: '/market', 'बाज़ार': '/market', ಮಾರುಕಟ್ಟೆ: '/market', మార్కెట్: '/market',
  home: '/', होम: '/', ಮನೆ: '/', హోమ్: '/',
};

export default function VoiceAssistant() {
  const { t, lang } = useLang();
  const navigate = useNavigate();
  const [listening, setListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [status, setStatus] = useState('idle'); // idle | listening | done | error
  const recognitionRef = useRef(null);

  const speak = (text) => {
    const utter = new SpeechSynthesisUtterance(text);
    utter.lang = lang === 'hi' ? 'hi-IN' : lang === 'kn' ? 'kn-IN' : lang === 'te' ? 'te-IN' : 'en-IN';
    window.speechSynthesis?.speak(utter);
  };

  const processVoice = useCallback((text) => {
    const lower = text.toLowerCase();
    for (const [keyword, route] of Object.entries(ROUTE_MAP)) {
      if (lower.includes(keyword.toLowerCase())) {
        setStatus('done');
        setTranscript(`✅ Opening "${keyword}" ...`);
        speak(`Opening ${keyword}`);
        setTimeout(() => navigate(route), 1000);
        return;
      }
    }
    setStatus('error');
    setTranscript(`"${text}" — not understood. Try: crop, fertilizer, weather, disease, market.`);
  }, [navigate, lang]);

  const startListening = useCallback(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) { setStatus('error'); setTranscript('Speech recognition not supported in this browser. Use Chrome.'); return; }
    const r = new SpeechRecognition();
    recognitionRef.current = r;
    r.lang = lang === 'hi' ? 'hi-IN' : lang === 'kn' ? 'kn-IN' : lang === 'te' ? 'te-IN' : 'en-IN';
    r.interimResults = true;
    r.onstart = () => { setListening(true); setStatus('listening'); setTranscript(''); };
    r.onresult = (e) => {
      const t = Array.from(e.results).map(r => r[0].transcript).join('');
      setTranscript(t);
      if (e.results[e.results.length - 1].isFinal) {
        setListening(false);
        processVoice(t);
      }
    };
    r.onerror = (e) => { setListening(false); setStatus('error'); setTranscript(`Error: ${e.error}`); };
    r.onend = () => setListening(false);
    r.start();
  }, [lang, processVoice]);

  const stopListening = () => { recognitionRef.current?.stop(); setListening(false); setStatus('idle'); };

  const langCommands = LANG_COMMANDS[lang] || LANG_COMMANDS.en;

  return (
    <div className="page">
      <h1 className="section-title">🎙️ {t('voiceAssistant')}</h1>
      <p className="section-subtitle">{t('talkToUs')}</p>

      <div className="voice-page-center">
        <button
          className={`big-mic${listening ? ' listening' : ''}`}
          onClick={listening ? stopListening : startListening}
          aria-label="Voice input"
        >
          {listening ? '⏹' : '🎤'}
        </button>

        <div style={{ fontWeight: 600, fontSize: 16, color: status === 'error' ? 'var(--danger)' : status === 'done' ? 'var(--green-primary)' : 'var(--text-secondary)' }}>
          {status === 'idle' && 'Tap the microphone to speak'}
          {status === 'listening' && '🔴 Listening... speak now'}
          {status === 'done' && '✅ Command recognized'}
          {status === 'error' && '❌ Try again'}
        </div>

        {transcript && (
          <div style={{ background: 'var(--green-pale)', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)', padding: '12px 16px', fontSize: 15, color: 'var(--text-primary)', width: '100%', textAlign: 'center', fontStyle: transcript.startsWith('✅') ? 'normal' : 'italic' }}>
            {transcript || '...'}
          </div>
        )}

        {/* Voice Commands Reference */}
        <div style={{ width: '100%' }}>
          <div style={{ fontWeight: 700, fontSize: 14, marginBottom: 10, color: 'var(--text-secondary)' }}>Available Commands ({lang.toUpperCase()}):</div>
          <div className="voice-commands">
            {COMMANDS.map((c, i) => (
              <div key={i} className="voice-cmd">
                <span>{c.icon}</span> {c.text}
                {langCommands[i] !== c.text.split('"')[1] && (
                  <span style={{ color: 'var(--green-primary)', fontWeight: 600 }}> / "{langCommands[i]}"</span>
                )}
              </div>
            ))}
          </div>
        </div>

        <button className="btn btn-outline" style={{ width: '100%' }} onClick={() => speak('Welcome to Krishi. Your smart farming assistant. Say crop, weather, fertilizer, disease, or market to navigate.')}>
          🔊 Test Voice Output
        </button>
      </div>
    </div>
  );
}
