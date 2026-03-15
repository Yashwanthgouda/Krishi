import React, { useState, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLang } from '../context/LanguageContext';

const COMMANDS = [
  { text: 'Say "crop"', icon: '🌾' },
  { text: 'Say "fertilizer"', icon: '🧪' },
  { text: 'Say "weather"', icon: '🌤️' },
  { text: 'Say "disease"', icon: '🔬' },
  { text: 'Say "market"', icon: '📊' },
  { text: 'Say "home"', icon: '🏠' },
];

const LANG_COMMANDS = {
  en: ['Crop', 'Fertilizer', 'Weather', 'Disease', 'Market', 'Home'],
  hi: ['Fasal (फसल)', 'Khaad (खाद)', 'Mausam (मौसम)', 'Rog (रोग)', 'Baazaar (बाज़ार)', 'Home (होम)'],
  kn: ['Bele (ಬೆಳೆ)', 'Gobbara (ಗೊಬ್ಬರ)', 'Havaamaana (ಹವಾಮಾನ)', 'Roga (ರೋಗ)', 'Maarukatte (ಮಾರುಕಟ್ಟೆ)', 'Mane (ಮನೆ)'],
};

const ROUTE_MAP = {
  crop: '/crop', फसल: '/crop', ಬೆಳೆ: '/crop',
  fertilizer: '/fertilizer', खाद: '/fertilizer', ಗೊಬ್ಬರ: '/fertilizer',
  weather: '/weather', मौसम: '/weather', ಹವಾಮಾನ: '/weather',
  disease: '/disease', रोग: '/disease', ರೋಗ: '/disease',
  market: '/market', 'बाज़ार': '/market', ಮಾರುಕಟ್ಟೆ: '/market',
  home: '/', होम: '/', ಮನೆ: '/',
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
    utter.lang = lang === 'hi' ? 'hi-IN' : lang === 'kn' ? 'kn-IN' : 'en-IN';
    window.speechSynthesis?.speak(utter);
  };

  const processVoice = useCallback((text) => {
    const lower = text.toLowerCase();
    for (const [keyword, route] of Object.entries(ROUTE_MAP)) {
      if (lower.includes(keyword.toLowerCase())) {
        setStatus('done');
        setTranscript(`✅ Found command: "${keyword}"`);
        speak(`Opening ${keyword}`);
        setTimeout(() => navigate(route), 1000);
        return;
      }
    }
    setStatus('error');
    setTranscript(`"${text}" — Command not found.`);
  }, [navigate]);

  const startListening = useCallback(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) { 
      setStatus('error'); 
      setTranscript('Speech recognition not supported in this browser.'); 
      return; 
    }
    const r = new SpeechRecognition();
    recognitionRef.current = r;
    r.lang = lang === 'hi' ? 'hi-IN' : lang === 'kn' ? 'kn-IN' : 'en-IN';
    r.interimResults = true;
    r.onstart = () => { setListening(true); setStatus('listening'); setTranscript('Go ahead, I\'m listening...'); };
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
    <div className="result-panel">
      <header style={{ marginBottom: '2.5rem' }}>
        <h1 className="section-title">🎙️ {t('voiceAssistant')}</h1>
        <p className="section-subtitle">Navigate through Krishi using simple voice commands in your preferred language.</p>
      </header>

      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '2.5rem' }}>
        {/* Animated Mic Section */}
        <div style={{ position: 'relative' }}>
          {listening && (
            <div className="pulse" style={{ position: 'absolute', inset: '-20px', background: 'var(--primary)', opacity: 0.2, borderRadius: '50%' }} />
          )}
          <button
            className={`big-mic ${listening ? 'listening' : ''}`}
            onClick={listening ? stopListening : startListening}
            style={{ 
              width: '120px', height: '120px', borderRadius: '50%', border: 'none', 
              background: listening ? 'var(--error)' : 'var(--primary)', 
              color: 'white', fontSize: '3rem', cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              boxShadow: '0 8px 32px rgba(31, 122, 76, 0.3)',
              transition: 'all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)'
            }}
          >
            {listening ? '⏹' : '🎤'}
          </button>
        </div>

        <div style={{ textAlign: 'center' }}>
          <p style={{ 
            fontWeight: 800, fontSize: '1.25rem', 
            color: status === 'error' ? 'var(--error)' : status === 'done' ? 'var(--primary)' : 'var(--text-main)' 
          }}>
            {status === 'idle' && 'Tap to start talking'}
            {status === 'listening' && 'Recording...'}
            {status === 'done' && 'Command Recognized!'}
            {status === 'error' && 'Didn\'t catch that'}
          </p>
          
          <div className="card" style={{ 
            marginTop: '1.5rem', minWidth: '400px', minHeight: '80px', 
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            background: 'var(--bg)', borderStyle: 'dashed'
          }}>
            <p style={{ fontStyle: 'italic', color: 'var(--text-secondary)' }}>
              {transcript || '"Try saying: Open Weather"'}
            </p>
          </div>
        </div>

        {/* Command Reference Grid */}
        <div style={{ width: '100%' }}>
          <h3 className="card-title" style={{ justifyContent: 'center', marginBottom: '1.5rem' }}>
            Available Commands in {lang.toUpperCase()}
          </h3>
          <div className="grid-cols-3">
            {COMMANDS.map((c, i) => (
              <div key={i} className="card" style={{ textAlign: 'center', padding: '1.5rem' }}>
                <span style={{ fontSize: '2rem', display: 'block', marginBottom: '0.75rem' }}>{c.icon}</span>
                <p style={{ fontWeight: 800 }}>{langCommands[i]}</p>
              </div>
            ))}
          </div>
        </div>

        <button 
          className="btn btn-outline" 
          style={{ width: 'auto', padding: '0.75rem 2rem' }}
          onClick={() => speak('I am your Krishi voice assistant. How can I help you today?')}
        >
          🔊 Test Audio Output
        </button>
      </div>
    </div>
  );
}
