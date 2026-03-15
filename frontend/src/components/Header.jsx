import React, { useState, useRef, useEffect } from 'react';
import { useLang } from '../context/LanguageContext';

const LANGS = [
  { code: 'en', label: 'English', flag: '🇬🇧' },
  { code: 'hi', label: 'हिंदी', flag: '🇮🇳' },
  { code: 'kn', label: 'ಕನ್ನಡ', flag: '🇮🇳' },
];

export default function Header() {
  const { lang, setLang, t } = useLang();
  const [showLang, setShowLang] = useState(false);
  const langRef = useRef(null);

  useEffect(() => {
    const clickOutside = (e) => {
      if (langRef.current && !langRef.current.contains(e.target)) setShowLang(false);
    };
    document.addEventListener('mousedown', clickOutside);
    return () => document.removeEventListener('mousedown', clickOutside);
  }, []);

  return (
    <header className="top-nav">
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flex: 1 }}>
        <input 
          type="text" 
          placeholder="Search features, crops, or weather..." 
          style={{ 
            background: 'var(--bg)', 
            border: '1px solid var(--border)', 
            padding: '0.6rem 1rem', 
            borderRadius: 'var(--radius-md)',
            width: '320px',
            fontSize: '0.875rem'
          }} 
        />
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
        <div style={{ fontSize: '1.25rem', cursor: 'pointer' }}>🔔</div>
        
        <div style={{ position: 'relative' }} ref={langRef}>
          <button 
            className="lang-btn" 
            onClick={() => setShowLang(!showLang)}
            style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'none', border: 'none', cursor: 'pointer', fontWeight: 600, fontSize: '0.875rem' }}
          >
            {LANGS.find(l => l.code === lang)?.flag} {lang.toUpperCase()}
          </button>
          
          {showLang && (
            <div className="card" style={{ position: 'absolute', top: '120%', right: 0, width: '160px', padding: '0.5rem', zIndex: 1000, boxShadow: 'var(--shadow-lg)' }}>
              {LANGS.map(l => (
                <div 
                  key={l.code} 
                  className="lang-option" 
                  style={{ 
                    padding: '0.75rem', 
                    cursor: 'pointer', 
                    borderRadius: 'var(--radius-sm)',
                    background: lang === l.code ? 'var(--primary-light)' : 'none',
                    color: lang === l.code ? 'var(--primary)' : 'var(--text-main)',
                    fontWeight: lang === l.code ? 600 : 400,
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.75rem',
                    fontSize: '0.875rem'
                  }}
                  onClick={() => { setLang(l.code); setShowLang(false); }}
                >
                  <span>{l.flag}</span> {l.label}
                </div>
              ))}
            </div>
          )}
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', paddingLeft: '1rem', borderLeft: '1px solid var(--border)' }}>
          <div style={{ width: '35px', height: '35px', borderRadius: '50%', background: 'linear-gradient(45deg, var(--primary), var(--accent))', display: 'flex', alignItems: 'center', justifyCenter: 'center', color: 'white', fontWeight: 700, fontSize: '0.75rem' }}>YG</div>
          <div style={{ display: 'none' }}>
            <p style={{ fontSize: '0.75rem', fontWeight: 700 }}>Yashwanth</p>
            <p style={{ fontSize: '0.65rem', color: 'var(--text-muted)' }}>Premium Plan</p>
          </div>
        </div>
      </div>
    </header>
  );
}
