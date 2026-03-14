import React, { useState } from 'react';
import { getFertilizerAdvice } from '../services/api';
import { useLang } from '../context/LanguageContext';

const CROPS = [
  'rice', 'wheat', 'maize', 'sugarcane', 'cotton',
  'banana', 'mango', 'chickpea', 'lentil', 'coffee', 'coconut',
];

const NUTRIENT_COLORS = { N: '#0ea5e9', P: '#f59e0b', K: '#7c3aed' };

export default function FertilizerGuide() {
  const { t } = useLang();
  const [form, setForm] = useState({ crop: 'rice', N: 40, P: 20, K: 20, area: 1 });
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const update = (k, v) => setForm((p) => ({ ...p, [k]: v }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); setError(''); setResult(null);
    try {
      const data = await getFertilizerAdvice(form);
      if (data.success) setResult(data);
      else setError(data.error || 'Failed');
    } catch {
      setError('Cannot reach server. Make sure Node.js and Flask servers are running.');
    } finally { setLoading(false); }
  };

  return (
    <div className="page">
      <h1 className="section-title">🧪 {t('fertilizerGuide')}</h1>
      <p className="section-subtitle">Get precise NPK fertilizer plan based on your soil and crop.</p>

      <form onSubmit={handleSubmit}>
        <div className="card">
          <div className="form-group">
            <label className="form-label">{t('selectCrop')}</label>
            <select className="form-select" value={form.crop} onChange={(e) => update('crop', e.target.value)}>
              {CROPS.map((c) => <option key={c} value={c}>{c.charAt(0).toUpperCase() + c.slice(1)}</option>)}
            </select>
          </div>

          {['N', 'P', 'K'].map((n) => (
            <div className="form-group" key={n}>
              <label className="form-label">
                {n === 'N' ? t('soilNitrogen') : n === 'P' ? t('soilPhosphorus') : t('soilPotassium')}: <strong>{form[n]}</strong> kg/ha
              </label>
              <div className="slider-row">
                <input
                  type="range" className="form-range" min={0} max={150}
                  style={{ '--val': `${(form[n] / 150) * 100}%` }}
                  value={form[n]}
                  onChange={(e) => update(n, Number(e.target.value))}
                />
                <span className="slider-val" style={{ color: NUTRIENT_COLORS[n] }}>{form[n]}</span>
              </div>
            </div>
          ))}

          <div className="form-group">
            <label className="form-label">{t('area')}: <strong>{form.area}</strong> ha</label>
            <div className="slider-row">
              <input
                type="range" className="form-range" min={0.1} max={10} step={0.1}
                style={{ '--val': `${(form.area / 10) * 100}%` }}
                value={form.area}
                onChange={(e) => update('area', parseFloat(e.target.value))}
              />
              <span className="slider-val">{form.area}</span>
            </div>
          </div>

          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? <><span className="spinner" style={{ width: 18, height: 18, borderWidth: 3 }} /> {t('loading')}</> : `🌱 ${t('getFertilizer')}`}
          </button>
        </div>
      </form>

      {error && <div className="alert-banner medium"><span>⚠️</span> {error}</div>}

      {result && (
        <>
          {result.recommendations.length === 0 ? (
            <div className="card">
              <p style={{ color: 'var(--green-primary)', fontWeight: 600 }}>
                ✅ Soil nutrients are adequate! No additional fertilizer needed for {form.crop}.
              </p>
            </div>
          ) : (
            result.recommendations.map((rec) => (
              <div key={rec.nutrient} className={`fert-card ${rec.nutrient}`}>
                <div className="fert-card-title" style={{ color: NUTRIENT_COLORS[rec.nutrient] }}>
                  {rec.nutrient === 'N' ? '🔵 Nitrogen (N)' : rec.nutrient === 'P' ? '🟡 Phosphorus (P)' : '🟣 Potassium (K)'}
                </div>
                <div className="fert-card-value">{rec.fertilizer}</div>
                <div className="fert-card-detail">Apply: <strong>{rec.applicationKg} kg</strong> for {form.area} ha · {rec.timing}</div>
                <div className="fert-card-detail" style={{ marginTop: 4 }}>
                  Organic: <em>{rec.organicAlternative}</em>
                </div>
              </div>
            ))
          )}

          {result.warnings.length > 0 && (
            <div className="card">
              <div className="card-title"><span className="card-icon">⚠️</span> Soil Status</div>
              {result.warnings.map((w, i) => (
                <div key={i} style={{ fontSize: 13, color: 'var(--text-secondary)', marginBottom: 4 }}>• {w}</div>
              ))}
            </div>
          )}

          <div className="card">
            <div className="card-title"><span className="card-icon">💧</span> Irrigation Advisory</div>
            <p style={{ fontSize: 14, color: 'var(--text-primary)', lineHeight: 1.7 }}>{result.irrigationTip}</p>
          </div>

          {result.notes && (
            <div className="tip-card">
              <span className="tip-icon">📝</span>
              <div className="tip-text">{result.notes}</div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
