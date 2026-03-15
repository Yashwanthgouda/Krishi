import React, { useState } from 'react';
import { getCropRecommendation } from '../services/api';
import { useLang } from '../context/LanguageContext';

const SOIL_FIELDS = [
  { key: 'N', labelKey: 'nitrogen', min: 0, max: 200, default: 90, icon: '🧪' },
  { key: 'P', labelKey: 'phosphorus', min: 0, max: 200, default: 42, icon: '⚗️' },
  { key: 'K', labelKey: 'potassium', min: 0, max: 200, default: 43, icon: '💎' },
  { key: 'pH', labelKey: 'ph', min: 0, max: 14, default: 6.5, step: 0.1, icon: '⚖️' },
];

const CLIMATE_FIELDS = [
  { key: 'temperature', labelKey: 'temperature', min: 0, max: 50, default: 25, icon: '🌡️' },
  { key: 'humidity', labelKey: 'humidity', min: 0, max: 100, default: 70, icon: '💧' },
  { key: 'rainfall', labelKey: 'rainfall', min: 0, max: 500, default: 200, icon: '🌧️' },
];

export default function CropAdvisor() {
  const { t } = useLang();
  const [values, setValues] = useState(
    Object.fromEntries([...SOIL_FIELDS, ...CLIMATE_FIELDS].map((f) => [f.key, f.default]))
  );
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setResult(null);
    try {
      const data = await getCropRecommendation(values);
      if (data.success) {
        setResult(data);
        window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
      } else {
        setError(data.error || 'Prediction failed');
      }
    } catch (err) {
      setError('Cannot reach server. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const update = (key, val) => setValues((prev) => ({ ...prev, [key]: parseFloat(val) }));
  const pct = (val, min, max) => ((val - min) / (max - min)) * 100;

  const renderField = (f) => (
    <div className="form-group" key={f.key}>
      <label className="form-label">{t(f.labelKey)}</label>
      <div className="input-module">
        <span style={{ fontSize: '1.25rem' }}>{f.icon}</span>
        <div style={{ flex: 1 }}>
          <input
            type="range"
            className="form-range"
            min={f.min} max={f.max}
            step={f.step || 1}
            value={values[f.key]}
            onChange={(e) => update(f.key, e.target.value)}
            style={{ '--val': `${pct(values[f.key], f.min, f.max)}%` }}
          />
        </div>
        <span style={{ minWidth: '45px', fontWeight: 700, textAlign: 'right', color: 'var(--primary)' }}>
          {values[f.key]}
        </span>
      </div>
    </div>
  );

  return (
    <div className="result-panel">
      <header style={{ marginBottom: '2.5rem' }}>
        <h1 className="section-title">🌾 {t('cropAdvisor')}</h1>
        <p className="section-subtitle">Our AI analyzes your soil and climate data to suggest the most profitable crops.</p>
      </header>

      <form onSubmit={handleSubmit}>
        <div className="grid-cols-2" style={{ marginBottom: '2rem' }}>
          <div className="card">
            <div className="card-title">
              <span className="card-icon">🌱</span> Soil Parameters
            </div>
            {SOIL_FIELDS.map(renderField)}
          </div>

          <div className="card">
            <div className="card-title">
              <span className="card-icon">🌦️</span> Climate Conditions
            </div>
            {CLIMATE_FIELDS.map(renderField)}
            
            <div style={{ marginTop: '2rem' }}>
              <button type="submit" className="btn btn-primary" style={{ padding: '1.25rem', fontSize: '1rem' }} disabled={loading}>
                {loading ? (
                  <><span className="spinner" style={{ width: 20, height: 20, borderWidth: 3 }} /> Analyzing...</>
                ) : `✨ Get AI Recommendation`}
              </button>
            </div>
          </div>
        </div>
      </form>

      {error && (
        <div className="card" style={{ border: '1px solid var(--error)', background: '#FEF2F2', marginBottom: '2rem' }}>
          <p style={{ color: 'var(--error)', fontWeight: 600 }}>⚠️ {error}</p>
        </div>
      )}

      {result && (
        <div className="result-panel">
          <div className="crop-hero-card">
            <div className="crop-hero-icon">{result.recommendations[0].icon}</div>
            <div style={{ flex: 1 }}>
              <p style={{ textTransform: 'uppercase', fontWeight: 800, opacity: 0.8, fontSize: '0.875rem' }}>Top Recommendation</p>
              <h2 style={{ fontSize: '3rem', margin: '0.5rem 0', color: 'white' }}>{result.recommendations[0].crop.toUpperCase()}</h2>
              <div style={{ display: 'flex', gap: '1rem' }}>
                <span className="tag">📅 {result.recommendations[0].season}</span>
                <span className="tag">💧 {result.recommendations[0].waterRequirement} Water</span>
                <span className="tag" style={{ background: 'var(--accent)', color: 'var(--text-main)' }}>🎯 {result.recommendations[0].confidence}% Match</span>
              </div>
            </div>
          </div>

          <div className="card">
            <div className="card-title">
              <span className="card-icon">📋</span> Suggestions for Your Soil
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              {result.recommendations.map((r, i) => (
                <div key={r.crop} style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', paddingBottom: '1.25rem', borderBottom: i === result.recommendations.length -1 ? 'none' : '1px solid var(--border)' }}>
                  <span style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--border)', minWidth: '40px' }}>0{i + 1}</span>
                  <span style={{ fontSize: '2rem' }}>{r.icon}</span>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                      <span style={{ fontWeight: 700, textTransform: 'capitalize' }}>{r.crop}</span>
                      <span style={{ fontWeight: 700, color: 'var(--primary)' }}>{r.confidence}%</span>
                    </div>
                    <div className="progress-bar-track" style={{ background: 'var(--bg)', height: '10px' }}>
                      <div className="progress-bar-fill" style={{ width: `${r.confidence}%`, background: 'var(--primary)', borderRadius: '10px' }} />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
