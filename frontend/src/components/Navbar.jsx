import React, { useState, useRef, useEffect } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { useLang } from '../context/LanguageContext';

const LANGS = [
  { code: 'en', label: 'English', flag: '🇬🇧' },
  { code: 'hi', label: 'हिंदी', flag: '🇮🇳' },
  { code: 'kn', label: 'ಕನ್ನಡ', flag: '🇮🇳' },
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
  
  // Close language dropdown if clicked outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [menuRef]);

  const renderLanguageSelector = () => (
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
  );

  return (
    <>
      {/* ─── Mobile Top Header ─── */}
      <header className="top-header">
        <div className="app-brand">
          <div className="app-logo">🌱</div>
          <div>
            <div className="app-name">{t('appName')}</div>
            <div className="app-tagline">{t('tagline')}</div>
          </div>
        </div>
        <div className="header-actions">
          {renderLanguageSelector()}
        </div>
      </header>

      {/* ─── Desktop Sidebar ─── */}
      <nav className="sidebar-nav">
        <div className="sidebar-header">
          <div className="sidebar-logo">
            <span className="sidebar-icon">🌱</span>
            <span className="sidebar-title">{t('appName')}</span>
          </div>
          <div className="sidebar-tagline">{t('tagline')}</div>
        </div>
        
        <div className="sidebar-menu">
          {NAV_ITEMS.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === '/'}
              className={({ isActive }) => `sidebar-item${isActive ? ' active' : ''}`}
            >
              <span className="sidebar-item-icon">{item.icon}</span>
              <span>{t(item.labelKey)}</span>
            </NavLink>
          ))}
        </div>
        
        <div className="sidebar-footer">
          {renderLanguageSelector()}
        </div>
      </nav>

      {/* ─── Mobile Bottom Nav ─── */}
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
