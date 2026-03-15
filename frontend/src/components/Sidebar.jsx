import React, { useState, useRef, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import { useLang } from '../context/LanguageContext';

export const NAV_ITEMS = [
  { to: '/', icon: '🏠', labelKey: 'dashboard' },
  { to: '/crop', icon: '🌾', labelKey: 'cropAdvisor' },
  { to: '/fertilizer', icon: '🧪', labelKey: 'fertilizerGuide' },
  { to: '/weather', icon: '🌤️', labelKey: 'weather' },
  { to: '/disease', icon: '🔬', labelKey: 'diseaseDetector' },
  { to: '/market', icon: '📊', labelKey: 'marketPrices' },
  { to: '/voice', icon: '🎤', labelKey: 'voiceAssistant' },
];

export default function Sidebar({ isOpen, onClose }) {
  const { t } = useLang();

  return (
    <>
      <div 
        className={`sidebar-overlay ${isOpen ? 'active' : ''}`} 
        onClick={onClose}
      />
      <aside className={`sidebar ${isOpen ? 'mobile-open' : ''}`}>
        <div style={{ padding: '2rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div className="card-icon" style={{ background: 'var(--primary)', color: 'white' }}>🌱</div>
          <div>
            <h2 style={{ fontSize: '1.25rem', color: 'var(--primary)', fontWeight: 800 }}>KRISHI</h2>
            <p style={{ fontSize: '0.65rem', fontWeight: 600, color: 'var(--text-secondary)', textTransform: 'uppercase' }}>Smart Advisory</p>
          </div>
        </div>

        <nav style={{ flex: 1, padding: '0.5rem 0' }}>
          {NAV_ITEMS.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === '/'}
              className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`}
              onClick={onClose}
            >
              <span className="nav-icon">{item.icon}</span>
              <span>{t(item.labelKey)}</span>
            </NavLink>
          ))}
        </nav>

        <div style={{ padding: '1.5rem', borderTop: '1px solid var(--border)', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div className="card" style={{ padding: '1rem', background: 'var(--bg)', border: 'none' }}>
            <p style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-secondary)' }}>{t('needHelp')}</p>
            <p style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginBottom: '0.75rem' }}>{t('supportText')}</p>
            <button className="btn btn-outline" style={{ fontSize: '0.7rem', padding: '0.5rem' }}>{t('support')}</button>
          </div>

          <div style={{ padding: '0.5rem', background: '#f8fafc', borderRadius: 'var(--radius-md)', border: '1px dashed var(--border)' }}>
            <p style={{ fontSize: '0.6rem', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '0.25rem' }}>{t('systemStatus')}</p>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#10b981' }} />
              <p style={{ fontSize: '0.6rem', fontWeight: 600, color: 'var(--text-secondary)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {t('backendLabel')}: {import.meta.env.VITE_API_URL || 'Local (Proxy)'}
              </p>
            </div>
            {import.meta.env.VITE_API_URL && (
              <p style={{ fontSize: '0.5rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>
                {t('backendMatch')}
              </p>
            )}
          </div>
        </div>
      </aside>
    </>
  );
}
