import React, { useState, useRef } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { useLang } from '../context/LanguageContext';

const LANGS = [
  { code: 'en', label: 'English', flag: '🇬🇧' },
  { code: 'hi', label: 'हिंदी', flag: '🇮🇳' },
  { code: 'kn', label: 'ಕನ್ನಡ', flag: '🇮🇳' },
  { code: 'te', label: 'తెలుగు', flag: '🇮🇳' },
];

const NAV_ITEMS = [
  { to: '/', icon: '🏠', labelKey: 'dashboard' },
  { to: '/crop', icon: '🌾', labelKey: 'cropAdvisor' },
  { to: '/fertilizer', icon: '🧪', labelKey: 'fertilizerGuide' },
  { to: '/weather', icon: '🌤️', labelKey: 'weather' },
  { to: '/disease', icon: '🔬', labelKey: 'diseaseDetector' },
  { to: '/market', icon: '📊', labelKey: 'marketPrices' },
];

export default function Navbar() {
  const { lang, setLang, t } = useLang();
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);
  const location = useLocation();

  const PAGE_TITLES = {
    '/': 'dashboard',
    '/crop': 'cropAdvisor',
    '/fertilizer': 'fertilizerGuide',
    '/weather': 'weather',
    '/disease': 'diseaseDetector',
    '/market': 'marketPrices',
    '/voice': 'voiceAssistant',
  };

  const currentTitle = PAGE_TITLES[location.pathname] || 'dashboard';

  return (
    <>
      {/* Top Header */}
      <header className="top-header">
        <div className="header-row">
          <div className="app-brand">
            <div className="app-logo">🌱</div>
            <div>
              <div className="app-name">{t('appName')}</div>
              <div className="app-tagline">{t('tagline')}</div>
            </div>
          </div>
          <div className="header-actions">
            <div className="lang-dropdown" ref={menuRef}>
              <button
                className="lang-btn"
                onClick={() => setMenuOpen(!menuOpen)}
                aria-label="Select language"
              >
                {LANGS.find((l) => l.code === lang)?.flag} {lang.toUpperCase()} ▾
              </button>
              {menuOpen && (
                <div className="lang-menu">
                  {LANGS.map((l) => (
                    <div
                      key={l.code}
                      className={`lang-option${l.code === lang ? ' active' : ''}`}
                      onClick={() => { setLang(l.code); setMenuOpen(false); }}
                    >
                      <span className="flag">{l.flag}</span>
                      {l.label}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Bottom Navigation */}
      <nav className="bottom-nav">
        {NAV_ITEMS.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.to === '/'}
            className={({ isActive }) => `nav-item${isActive ? ' active' : ''}`}
          >
            <span className="nav-icon">{item.icon}</span>
            <span>{t(item.labelKey).split(' ')[0]}</span>
          </NavLink>
        ))}
      </nav>
    </>
  );
}
