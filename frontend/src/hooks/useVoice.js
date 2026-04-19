import { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useApi } from './useApi';

const CROPS = ['rice', 'wheat', 'maize', 'sugarcane', 'cotton', 'banana', 'mango', 'chickpea', 'lentil', 'coffee', 'coconut', 'grapes', 'soybean', 'mustard', 'groundnut', 'potato', 'tomato', 'onion'];

export function useVoice() {
  const [isListening,  setIsListening]  = useState(false);
  const [transcript,   setTranscript]   = useState('');
  const [isSpeaking,   setIsSpeaking]   = useState(false);
  const [isSupported,  setIsSupported]  = useState(false);
  const recognitionRef = useRef(null);
  
  const navigate = useNavigate();
  const { i18n } = useTranslation();
  const api = useApi();

  const speak = useCallback((text, lang = 'en-IN') => {
    if (!window.speechSynthesis) return;
    const utt = new SpeechSynthesisUtterance(text);
    utt.lang = lang;
    utt.onstart = () => setIsSpeaking(true);
    utt.onend   = () => setIsSpeaking(false);
    window.speechSynthesis.speak(utt);
  }, []);

  const handleSmartCommand = async (text) => {
    const t = text.toLowerCase();
    const lang = i18n?.language === 'hi' ? 'hi-IN' : 'en-IN';
    
    // Stop any ongoing speech before processing new command
    if (window.speechSynthesis) {
        window.speechSynthesis.cancel();
    }

    if (t.includes('weather') || t.includes('mausam') || t.includes('rain') || t.includes('barish')) {
      navigate('/weather');
      speak("Checking the latest weather forecast.", lang);
      try {
        const res = await api.get('/weather?city=Bangalore');
        if (res && res.success) {
           const alert = res.alerts && res.alerts.length > 0 ? res.alerts[0] : `It is currently ${res.current?.temp} degrees outside.`;
           speak(`Today's weather: ${alert}`, lang);
        }
      } catch (e) {}
      return;
    }

    if (t.includes('price') || t.includes('mandi') || t.includes('bhav') || t.includes('market') || t.includes('rate')) {
      const foundCrop = CROPS.find(c => t.includes(c)) || 'rice';
      navigate('/prices');
      speak(`Checking the market prices for ${foundCrop}.`, lang);
      try {
        const res = await api.post('/price', { crop: foundCrop, district: 'Bangalore', months: 6 });
        if (res && res.success) {
           speak(`The current price for ${foundCrop} is ${res.currentPrice} rupees per quintal. ${res.advice}`, lang);
        }
      } catch (e) {}
      return;
    }

    if (t.includes('fertilizer') || t.includes('khaad') || t.includes('manure')) {
      const foundCrop = CROPS.find(c => t.includes(c)) || 'rice';
      navigate('/fertilizer');
      speak(`Generating fertilizer plan for ${foundCrop}.`, lang);
      try {
        const res = await api.post('/fertilizer', { crop: foundCrop, N: 40, P: 20, K: 30, area: 1 });
        if (res && res.success && res.recommendations?.length > 0) {
           const rec = res.recommendations[0];
           speak(`You should apply ${rec.applicationKg} kilograms of ${rec.fertilizer} per acre for best results.`, lang);
        }
      } catch (e) {}
      return;
    }

    if (t.includes('disease') || t.includes('bimari') || t.includes('leaf') || t.includes('sick')) {
      navigate('/disease');
      speak("Opening the disease scanner. Please upload a clear photo of your plant leaf.", lang);
      return;
    }
    
    if (t.includes('crop') || t.includes('fasal') || t.includes('grow')) {
      navigate('/crop');
      speak("Opening crop recommendation. Enter your soil health details to see the best crop to grow.", lang);
      return;
    }

    speak("I am sorry, I didn't quite catch that. Try asking about weather, crop prices, or fertilizer advice.", lang);
  };

  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    setIsSupported(!!SpeechRecognition);
    if (!SpeechRecognition) return;

    const rec = new SpeechRecognition();
    rec.continuous    = false;
    rec.interimResults = true;
    rec.lang          = i18n?.language === 'hi' ? 'hi-IN' : 'en-IN';

    rec.onresult = (e) => {
      const t = Array.from(e.results)
        .map(r => r[0].transcript).join(' ').toLowerCase();
      setTranscript(t);
      if (e.results[e.results.length - 1].isFinal) {
        setIsListening(false);
        handleSmartCommand(t);
      }
    };

    rec.onend  = () => setIsListening(false);
    rec.onerror = (err) => { 
       console.error("Speech Recognition Error:", err); 
       setIsListening(false); 
    };
    recognitionRef.current = rec;
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [navigate, i18n?.language]);

  const startListening = useCallback(() => {
    if (!recognitionRef.current || isListening) return;
    setTranscript('');
    setIsListening(true);
    try {
      recognitionRef.current.start();
    } catch (e) {
      console.warn("Speech start handled:", e);
      setIsListening(false);
    }
  }, [isListening]);

  const stopListening = useCallback(() => {
    if (recognitionRef.current && isListening) {
      try {
        recognitionRef.current.stop();
      } catch(e) {}
      setIsListening(false);
    }
  }, [isListening]);

  return { isListening, transcript, isSpeaking, isSupported, startListening, stopListening, speak, handleSmartCommand };
}
