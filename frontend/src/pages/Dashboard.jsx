import React from 'react';
import { Link } from 'react-router-dom';
import { useLang } from '../context/LanguageContext';

const TIPS = [
  'Test your soil before sowing – it improves yield by 20–30%.',
  'Use drip irrigation to save 40% water compared to flood irrigation.',
  'Apply neem oil spray fortnightly to prevent most insect attacks.',
  'Crop rotation every season helps improve soil fertility naturally.',
  'Sell after peak harvest season for 15–25% higher market prices.',
  'Mix farmyard manure with chemical fertilizers for best results.',
  'Check weather forecast before applying pesticides or fertilizers.',
];

const MODULES = [
  { to: '/crop', icon: '🌾', labelKey: 'cropAdvisor', color: '#e8f5ea' },
  { to: '/fertilizer', icon: '🧪', labelKey: 'fertilizerGuide', color: '#e0f2fe' },
  { to: '/weather', icon: '🌤️', labelKey: 'weather', color: '#fef3c7' },
  { to: '/disease', icon: '🔬', labelKey: 'diseaseDetector', color: '#fce7f3' },
  { to: '/market', icon: '📊', labelKey: 'marketPrices', color: '#ede9fe' },
  { to: '/voice', icon: '🎙️', labelKey: 'voiceAssistant', color: '#ffedd5' },
];

export default function Dashboard() {
  const { t } = useLang();
  const tip = TIPS[new Date().getDate() % TIPS.length];

  return (
    <div className="page">
      <h1 className="section-title">{t('welcomeBack')}</h1>
      <p className="section-subtitle">{t('welcomeMsg')}</p>

      {/* Quick Module Grid */}
      <div className="module-grid">
        {MODULES.map((m) => (
          <Link
            key={m.to}
            to={m.to}
            className="module-card"
            style={{ background: m.color }}
          >
            <span className="module-icon">{m.icon}</span>
            <span className="module-label">{t(m.labelKey)}</span>
          </Link>
        ))}
      </div>

      {/* Daily Tip */}
      <div style={{ marginTop: 20 }}>
        <div className="tip-card">
          <span className="tip-icon">💡</span>
          <div>
            <div style={{ fontWeight: 700, fontSize: 13, color: '#92400e', marginBottom: 4 }}>{t('tipOfDay')}</div>
            <div className="tip-text">{tip}</div>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div style={{ marginTop: 16 }}>
        <div className="card">
          <div className="card-title"><span className="card-icon">📋</span> Features at a Glance</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {[
              ['🌾', 'Crop Recommendation', 'AI selects best crops for your soil'],
              ['🧪', 'Fertilizer Advisory', 'Precise NPK dosage & irrigation tips'],
              ['🌤️', 'Weather Forecast', '7-day forecast + extreme alerts'],
              ['🔬', 'Disease Detection', 'Upload leaf photo for diagnosis'],
              ['📊', 'Market Prices', '6-month price forecast by district'],
              ['🎙️', 'Voice Interface', 'Speak in Hindi, Kannada or Telugu'],
            ].map(([icon, title, desc]) => (
              <div key={title} style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
                <span style={{ fontSize: 22, flexShrink: 0 }}>{icon}</span>
                <div>
                  <div style={{ fontWeight: 600, fontSize: 14 }}>{title}</div>
                  <div style={{ fontSize: 12, color: 'var(--text-secondary)' }}>{desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
