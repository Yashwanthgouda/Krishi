import React, { useState, useRef, useEffect } from 'react';
import { useLang } from '../context/LanguageContext';

const LANGS = [
  { code: 'en', label: 'English', flag: '🇬🇧' },
  { code: 'hi', label: 'हिंदी', flag: '🇮🇳' },
  { code: 'kn', label: 'ಕನ್ನಡ', flag: '🇮🇳' },
];

export default function Header({ onMenuClick }) {
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
        <button 
          className="mobile-menu-trigger"
          onClick={onMenuClick}
          style={{ 
            background: 'none', 
            border: 'none', 
            fontSize: '1.5rem', 
            cursor: 'pointer',
            padding: '0.5rem',
            marginLeft: '-0.5rem'
          }}
        >
          ☰
        </button>

        <div className="desktop-search" style={{ flex: 1 }}>
          <input 
            type="text" 
            placeholder="Search features, crops, or weather..." 
            style={{ 
              background: 'var(--bg)', 
              border: '1px solid var(--border)', 
              padding: '0.6rem 1rem', 
              borderRadius: 'var(--radius-md)',
              width: '100%',
              maxWidth: '320px',
              fontSize: '0.875rem'
            }} 
          />
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
        <div className="header-action" style={{ fontSize: '1.25rem', cursor: 'pointer' }}>🔔</div>
        
        <div style={{ position: 'relative' }} ref={langRef}>
          <button 
            className="lang-btn" 
            onClick={() => setShowLang(!showLang)}
            style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: '0.4rem', 
              background: 'none', 
              border: 'none', 
              cursor: 'pointer', 
              fontWeight: 600, 
              fontSize: '0.875rem' 
            }}
          >
            <span style={{ fontSize: '1.1rem' }}>{LANGS.find(l => l.code === lang)?.flag}</span> 
            <span className="lang-code">{lang.toUpperCase()}</span>
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

        <div className="header-profile" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', paddingLeft: '1rem', borderLeft: '1px solid var(--border)' }}>
          <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'linear-gradient(45deg, var(--primary), var(--accent))', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 700, fontSize: '0.7rem' }}>YG</div>
        </div>
      </div>
    </header>
  );
}
