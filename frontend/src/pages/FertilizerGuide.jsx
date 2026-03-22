import React, { useState } from 'react';
import { getFertilizerAdvice } from '../services/api';
import { useLang } from '../context/LanguageContext';
import { useEnhancedApi } from '../hooks/useEnhancedApi';

const CROPS = [
  'rice', 'wheat', 'maize', 'sugarcane', 'cotton',
  'banana', 'mango', 'chickpea', 'lentil', 'coffee', 'coconut',
];

const FIELDS = [
  { key: 'N', labelKey: 'soilNitrogen', icon: '🔵', color: '#0EA5E9' },
  { key: 'P', labelKey: 'soilPhosphorus', icon: '🟡', color: '#F59E0B' },
  { key: 'K', labelKey: 'soilPotassium', icon: '🟣', color: '#7C3AED' },
];

export default function FertilizerGuide() {
  const { t } = useLang();
  const [form, setForm] = useState({ crop: 'rice', N: 40, P: 20, K: 20, area: 1 });
  const [result, setResult] = useState(null);
  const { execute, loading, error, isWakingUp, countdown } = useEnhancedApi(getFertilizerAdvice);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setResult(null);
    const data = await execute(form);
    if (data && data.success) {
      setResult(data);
      setTimeout(() => {
        window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
      }, 100);
    }
  };

  return (
    <div className="result-panel">
      <header style={{ marginBottom: '2.5rem' }}>
        <h1 className="section-title">🧪 {t('fertilizerGuide')}</h1>
        <p className="section-subtitle">Get precise, surface-area calculated NPK nutrient plans tailored to your crop type.</p>
      </header>

      <form onSubmit={handleSubmit}>
        <div className="grid-cols-2" style={{ marginBottom: '2rem' }}>
          <div className="card">
            <div className="card-title">
              <span className="card-icon">🌱</span> Field Parameters
            </div>
            
            <div className="form-group">
              <label className="form-label">{t('selectCrop')}</label>
              <select className="form-select" value={form.crop} onChange={(e) => update('crop', e.target.value)}>
                {CROPS.map((c) => <option key={c} value={c}>{c.charAt(0).toUpperCase() + c.slice(1)}</option>)}
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Total Land Area (Hectares)</label>
              <div className="input-module">
                <span>🚜</span>
                <input 
                  type="range" className="form-range" min={0.1} max={10} step={0.1}
                  value={form.area} onChange={(e) => update('area', parseFloat(e.target.value))}
                  style={{ '--val': `${(form.area / 10) * 100}%` }}
                />
                <span style={{ minWidth: '50px', fontWeight: 800, textAlign: 'right' }}>{form.area} ha</span>
              </div>
            </div>
          </div>

          <div className="card">
            <div className="card-title">
              <span className="card-icon">🧪</span> Soil Test Results (kg/ha)
            </div>
            
            {FIELDS.map((f) => (
              <div className="form-group" key={f.key}>
                <label className="form-label">{t(f.labelKey)}</label>
                <div className="input-module">
                  <span style={{ filter: 'grayscale(0)' }}>{f.icon}</span>
                  <input 
                    type="range" className="form-range" min={0} max={150}
                    value={form[f.key]} onChange={(e) => update(f.key, Number(e.target.value))}
                    style={{ '--val': `${(form[f.key] / 150) * 100}%` }}
                  />
                  <span style={{ minWidth: '50px', fontWeight: 800, textAlign: 'right', color: f.color }}>{form[f.key]}</span>
                </div>
              </div>
            ))}

            <div style={{ marginTop: '1rem', display: 'flex', justifyContent: 'flex-end' }}>
              <button type="submit" className="btn btn-primary" style={{ width: 'auto', padding: '1rem 2rem' }} disabled={loading}>
                {loading ? 'Calculating...' : 'Generate Nutrient Plan'}
              </button>
            </div>
          </div>
        </div>
      </form>

      {(isWakingUp || error) && (
        <div className="card" style={{ 
          border: `1px solid ${isWakingUp ? 'var(--primary)' : 'var(--error)'}`, 
          background: isWakingUp ? 'var(--primary-light)' : '#FEF2F2', 
          marginBottom: '2rem' 
        }}>
          {isWakingUp ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
              <span className="spinner" style={{ width: '28px', height: '28px', position: 'static', margin: 0, borderWidth: '3px' }} />
              <div>
                <p style={{ color: 'var(--primary)', fontWeight: 700, margin: 0, fontSize: '1.1rem' }}>
                  ⏳ ML Server is waking up (Render cold start)...
                </p>
                <p style={{ fontSize: '0.9rem', color: 'var(--primary)', opacity: 0.9, margin: '0.25rem 0 0 0' }}>
                  The server is starting up. Retrying automatically in <b>{countdown}</b> seconds.
                </p>
              </div>
            </div>
          ) : (
            <p style={{ color: 'var(--error)', fontWeight: 600, margin: 0 }}>⚠️ {error}</p>
          )}
        </div>
      )}

      {result && (
        <div className="result-panel">
          {result.recommendations.length === 0 ? (
            <div className="card" style={{ textAlign: 'center', padding: '3rem', borderLeft: '8px solid var(--success)' }}>
              <div style={{ fontSize: '4rem' }}>✨</div>
              <h2 style={{ fontSize: '2rem', margin: '1rem 0', color: 'var(--success)' }}>Perfect Soil Balance!</h2>
              <p style={{ color: 'var(--text-secondary)' }}>Nutriet levels are optimal for {form.crop}. No additional fertilizer required.</p>
            </div>
          ) : (
            <div className="grid-cols-2" style={{ marginBottom: '2rem' }}>
              <div className="card">
                <div className="card-title">
                  <span className="card-icon">📦</span> Required Supplements
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  {result.recommendations.map((rec) => (
                    <div key={rec.nutrient} style={{ padding: '1.25rem', background: 'var(--bg)', borderRadius: 'var(--radius-md)', borderLeft: `6px solid ${FIELDS.find(f => f.key === rec.nutrient)?.color}` }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                        <span style={{ fontWeight: 800, fontSize: '1.125rem' }}>{rec.fertilizer}</span>
                        <span style={{ fontWeight: 800, color: 'var(--primary)', fontSize: '1.25rem' }}>{rec.applicationKg} kg</span>
                      </div>
                      <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>Timing: {rec.timing}</p>
                      <p style={{ fontSize: '0.75rem', marginTop: '0.5rem', opacity: 0.8 }}>Organic Alternative: {rec.organicAlternative}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                <div className="card" style={{ background: 'var(--primary-light)', borderColor: 'var(--primary)' }}>
                  <div className="card-title" style={{ color: 'var(--primary)' }}>
                    <span className="card-icon" style={{ background: 'white' }}>💧</span> Irrigation Impact
                  </div>
                  <p style={{ fontSize: '1rem', lineHeight: 1.8, color: 'var(--text-main)', fontWeight: 600 }}>{result.irrigationTip}</p>
                </div>

                {result.warnings.length > 0 && (
                  <div className="card" style={{ borderLeft: '4px solid var(--warning)', background: '#FFFBEB' }}>
                    <div className="card-title">
                      <span className="card-icon">⚠️</span> Soil Status Alerts
                    </div>
                    <ul style={{ paddingLeft: '1.25rem', fontSize: '0.875rem', color: 'var(--text-secondary)', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                      {result.warnings.map((w, i) => <li key={i}>{w}</li>)}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
