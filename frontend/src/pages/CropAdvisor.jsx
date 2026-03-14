import React, { useState } from 'react';
import { getCropRecommendation } from '../services/api';
import { useLang } from '../context/LanguageContext';

const FIELDS = [
  { key: 'N', labelKey: 'nitrogen', min: 0, max: 200, default: 90 },
  { key: 'P', labelKey: 'phosphorus', min: 0, max: 200, default: 42 },
  { key: 'K', labelKey: 'potassium', min: 0, max: 200, default: 43 },
  { key: 'pH', labelKey: 'ph', min: 0, max: 14, default: 6.5, step: 0.1 },
  { key: 'temperature', labelKey: 'temperature', min: 0, max: 50, default: 25 },
  { key: 'humidity', labelKey: 'humidity', min: 0, max: 100, default: 70 },
  { key: 'rainfall', labelKey: 'rainfall', min: 0, max: 500, default: 200 },
];

export default function CropAdvisor() {
  const { t } = useLang();
  const [values, setValues] = useState(
    Object.fromEntries(FIELDS.map((f) => [f.key, f.default]))
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
      if (data.success) setResult(data);
      else setError(data.error || 'Prediction failed');
    } catch (err) {
      setError('Cannot reach server. Make sure Node.js and Flask servers are running.');
    } finally {
      setLoading(false);
    }
  };

  const update = (key, val) => setValues((prev) => ({ ...prev, [key]: parseFloat(val) }));
  const pct = (f) => ((values[f.key] - f.min) / (f.max - f.min)) * 100;

  return (
    <div className="page">
      <h1 className="section-title">🌾 {t('cropAdvisor')}</h1>
      <p className="section-subtitle">Enter your soil parameters to get the best crop recommendation.</p>

      <form onSubmit={handleSubmit}>
        <div className="card">
          {FIELDS.map((f) => (
            <div className="form-group" key={f.key}>
              <label className="form-label">
                {t(f.labelKey)}: <strong>{values[f.key]}</strong>
              </label>
              <div className="slider-row">
                <input
                  type="range"
                  className="form-range"
                  min={f.min} max={f.max}
                  step={f.step || 1}
                  value={values[f.key]}
                  onChange={(e) => update(f.key, e.target.value)}
                  style={{ '--val': `${pct(f)}%` }}
                />
                <span className="slider-val">{values[f.key]}</span>
              </div>
            </div>
          ))}
          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? (
              <><span className="spinner" style={{ width: 18, height: 18, borderWidth: 3 }} /> {t('loading')}</>
            ) : `🌱 ${t('getRecommendation')}`}
          </button>
        </div>
      </form>

      {error && (
        <div className="alert-banner medium">
          <span>⚠️</span> {error}
        </div>
      )}

      {result && (
        <>
          {/* Top Recommendation */}
          <div className="result-banner">
            <span className="crop-icon">{result.recommendations[0].icon}</span>
            <div className="crop-name">{result.recommendations[0].crop.toUpperCase()}</div>
            <div className="crop-confidence">
              AI Confidence: {result.recommendations[0].confidence}%
            </div>
            <div className="result-tags">
              <span className="tag">📅 {result.recommendations[0].season}</span>
              <span className="tag">💧 {result.recommendations[0].waterRequirement}</span>
            </div>
          </div>

          {/* Top 5 */}
          <div className="card">
            <div className="card-title"><span className="card-icon">📋</span> All Recommendations</div>
            <div className="result-list">
              {result.recommendations.map((r, i) => (
                <div key={r.crop} className="result-item">
                  <span className="result-item-rank">#{i + 1}</span>
                  <span style={{ fontSize: 26 }}>{r.icon}</span>
                  <div>
                    <div className="result-item-name">{r.crop}</div>
                    <div style={{ fontSize: 12, color: 'var(--text-secondary)' }}>
                      {r.season} • {r.waterRequirement} water
                    </div>
                    <div className="progress-bar-track">
                      <div className="progress-bar-fill" style={{ width: `${r.confidence}%` }} />
                    </div>
                  </div>
                  <span className="result-item-conf">{r.confidence}%</span>
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
