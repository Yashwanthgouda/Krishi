import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLang } from '../context/LanguageContext';

const COMMANDS = {
  en: [
    { keywords: ['crop', 'recomme', 'soil'], route: '/crop', label: 'Go to Crop Advisor' },
    { keywords: ['fertil', 'manure', 'nutrient'], route: '/fertilizer', label: 'Go to Fertilizer Guide' },
    { keywords: ['weather', 'rain', 'temp', 'forecast'], route: '/weather', label: 'Check Weather' },
    { keywords: ['disease', 'leaf', 'sick', 'photo'], route: '/disease', label: 'Open Disease Detector' },
    { keywords: ['market', 'price', 'sell', 'msp'], route: '/market', label: 'Check Market Prices' },
    { keywords: ['home', 'dash', 'main'], route: '/', label: 'Go Home' },
  ],
  hi: [
    { keywords: ['फसल', 'बीज', 'खेती', 'मिट्टी'], route: '/crop', label: 'फसल सलाहकार' },
    { keywords: ['खाद', 'उर्वरक', 'पोषण'], route: '/fertilizer', label: 'खाद गाइड' },
    { keywords: ['मौसम', 'बारिश', 'तापमान'], route: '/weather', label: 'मौसम जांचें' },
    { keywords: ['रोग', 'पत्ती', 'बीमारी'], route: '/disease', label: 'रोग पहचान' },
    { keywords: ['बाज़ार', 'भाव', 'कीमत'], route: '/market', label: 'बाज़ार भाव' },
  ],
};

export default function VoiceButton() {
  const [listening, setListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [show, setShow] = useState(false);
  const navigate = useNavigate();
  const { t, lang } = useLang();
  const recognitionRef = React.useRef(null);

  const processCommand = useCallback((text) => {
    const lower = text.toLowerCase();
    const cmds = COMMANDS[lang] || COMMANDS.en;
    for (const cmd of cmds) {
      if (cmd.keywords.some((kw) => lower.includes(kw))) {
        navigate(cmd.route);
        setTranscript(`✅ ${cmd.label}`);
        setTimeout(() => setShow(false), 2000);
        return;
      }
    }
    // fallback: English
    for (const cmd of COMMANDS.en) {
      if (cmd.keywords.some((kw) => lower.includes(kw))) {
        navigate(cmd.route);
        setTranscript(`✅ ${cmd.label}`);
        setTimeout(() => setShow(false), 2000);
        return;
      }
    }
    setTranscript(`"${text}" – command not recognised. Try: "crop", "fertilizer", "weather", "disease", "market"`);
    setTimeout(() => setShow(false), 3500);
  }, [lang, navigate]);

  const startListening = useCallback(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      setTranscript('Speech recognition not supported in this browser.');
      setShow(true);
      setTimeout(() => setShow(false), 3000);
      return;
    }
    const recognition = new SpeechRecognition();
    recognitionRef.current = recognition;
    recognition.lang = lang === 'hi' ? 'hi-IN' : lang === 'kn' ? 'kn-IN' : lang === 'te' ? 'te-IN' : 'en-IN';
    recognition.interimResults = true;
    recognition.maxAlternatives = 1;

    recognition.onstart = () => { setListening(true); setShow(true); setTranscript('🎤 Listening...' ); };
    recognition.onresult = (e) => {
      const result = Array.from(e.results).map((r) => r[0].transcript).join('');
      setTranscript(result);
      if (e.results[e.results.length - 1].isFinal) {
        setListening(false);
        processCommand(result);
      }
    };
    recognition.onerror = (e) => { setListening(false); setTranscript(`Error: ${e.error}`); setTimeout(() => setShow(false), 3000); };
    recognition.onend = () => setListening(false);
    recognition.start();
  }, [lang, processCommand]);

  const stopListening = () => {
    recognitionRef.current?.stop();
    setListening(false);
  };

  return (
    <>
      {show && <div className="voice-transcript">{transcript}</div>}
      <button
        className={`voice-fab${listening ? ' listening' : ''}`}
        onClick={listening ? stopListening : startListening}
        title={listening ? 'Stop listening' : t('talkToUs')}
        aria-label="Voice assistant"
      >
        {listening ? '⏹' : '🎤'}
      </button>
    </>
  );
}
