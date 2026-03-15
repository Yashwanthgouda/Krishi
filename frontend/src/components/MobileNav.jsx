import React from 'react';
import { NavLink } from 'react-router-dom';
import { useLang } from '../context/LanguageContext';

const MOBILE_ITEMS = [
  { to: '/', icon: '🏠', labelKey: 'dashboard' },
  { to: '/crop', icon: '🌾', labelKey: 'advisor' },
  { to: '/weather', icon: '🌤️', labelKey: 'weather' },
  { to: '/market', icon: '📊', labelKey: 'market' },
  { to: '/voice', icon: '🎤', labelKey: 'voice' },
];

export default function MobileNav() {
  const { t } = useLang();

  return (
    <nav className="mobile-nav">
      {MOBILE_ITEMS.map((item) => (
        <NavLink
          key={item.to}
          to={item.to}
          end={item.to === '/'}
          className={({ isActive }) => `mobile-nav-link${isActive ? ' active' : ''}`}
        >
          <span className="mobile-nav-icon">{item.icon}</span>
          <span className="mobile-nav-label">{t(item.labelKey)}</span>
        </NavLink>
      ))}
    </nav>
  );
}
