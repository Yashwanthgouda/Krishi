import React, { useState, useEffect } from 'react';
import { getPriceForecast, getDistricts } from '../services/api';
import { useLang } from '../context/LanguageContext';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from 'recharts';

const CROPS = [
  'rice', 'wheat', 'maize', 'sugarcane', 'cotton',
  'banana', 'mango', 'chickpea', 'groundnut', 'mustard',
  'soybean', 'potato', 'tomato', 'onion',
];

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload?.length) {
    return (
      <div style={{ background: '#fff', border: '1px solid var(--border)', borderRadius: 10, padding: '8px 14px', fontSize: 13, boxShadow: 'var(--shadow-md)' }}>
        <p style={{ fontWeight: 700, color: 'var(--text-primary)' }}>{label}</p>
        <p style={{ color: 'var(--green-primary)' }}>₹{payload[0].value?.toLocaleString('en-IN')}/Qtl</p>
      </div>
    );
  }
  return null;
};

export default function MarketPrices() {
  const { t } = useLang();
  const [form, setForm] = useState({ crop: 'rice', district: 'Bangalore', months: 6 });
  const [districts, setDistricts] = useState([]);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    getDistricts().then((d) => setDistricts(d.districts || [])).catch(() => {});
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); setError(''); setResult(null);
    try {
      const data = await getPriceForecast(form);
      if (data.success) setResult(data);
      else setError(data.error || 'Failed');
    } catch {
      setError('Cannot reach server. Make sure Node.js and Flask servers are running.');
    } finally { setLoading(false); }
  };

  const chartData = result?.forecastLabels?.map((label, i) => ({
    month: label,
    price: result.forecastPrices[i],
  })) || [];

  return (
    <div className="page">
      <h1 className="section-title">📊 {t('marketPrices')}</h1>
      <p className="section-subtitle">Get 6-month price forecasts for your crop by district.</p>

      <form onSubmit={handleSubmit}>
        <div className="card">
          <div className="form-group">
            <label className="form-label">{t('cropName')}</label>
            <select className="form-select" value={form.crop} onChange={(e) => setForm(p => ({ ...p, crop: e.target.value }))}>
              {CROPS.map((c) => <option key={c} value={c}>{c.charAt(0).toUpperCase() + c.slice(1)}</option>)}
            </select>
          </div>
          <div className="form-group">
            <label className="form-label">{t('districtName')}</label>
            <input
              className="form-input"
              value={form.district}
              onChange={(e) => setForm(p => ({ ...p, district: e.target.value }))}
              list="districts-list"
              placeholder="e.g. Bangalore"
            />
            <datalist id="districts-list">{districts.map(d => <option key={d} value={d} />)}</datalist>
          </div>
          <div className="form-group">
            <label className="form-label">{t('forecastMonths')}: <strong>{form.months}</strong></label>
            <div className="slider-row">
              <input
                type="range" className="form-range" min={3} max={12}
                style={{ '--val': `${((form.months - 3) / 9) * 100}%` }}
                value={form.months}
                onChange={(e) => setForm(p => ({ ...p, months: Number(e.target.value) }))}
              />
              <span className="slider-val">{form.months}</span>
            </div>
          </div>
          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? <><span className="spinner" style={{ width: 18, height: 18, borderWidth: 3 }} /> {t('loading')}</> : `📊 ${t('getPrices')}`}
          </button>
        </div>
      </form>

      {error && <div className="alert-banner medium"><span>⚠️</span> {error}</div>}

      {result && (
        <>
          {/* Price Summary Grid */}
          <div className="price-grid">
            <div className="price-badge">
              <span className="price-badge-value">₹{result.currentPrice?.toLocaleString('en-IN')}</span>
              <span className="price-badge-label">{t('currentPrice')}</span>
            </div>
            <div className="price-badge">
              <span className="price-badge-value">₹{result.msp?.toLocaleString('en-IN')}</span>
              <span className="price-badge-label">{t('msp')}</span>
            </div>
            <div className="price-badge">
              <span className={`price-badge-value ${result.trend === 'Rising' ? 'trend-up' : 'trend-down'}`}>
                {result.trend === 'Rising' ? '📈' : '📉'} {result.trend}
              </span>
              <span className="price-badge-label">6-Month Trend</span>
            </div>
            <div className="price-badge">
              <span className={`price-badge-value ${result.trendPercent >= 0 ? 'trend-up' : 'trend-down'}`}>
                {result.trendPercent >= 0 ? '+' : ''}{result.trendPercent}%
              </span>
              <span className="price-badge-label">Expected Change</span>
            </div>
          </div>

          {/* Forecast Chart */}
          <div className="card">
            <div className="card-title"><span className="card-icon">📈</span> Price Forecast — {result.crop?.toUpperCase()} ({result.district})</div>
            <div className="chart-wrap">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                  <defs>
                    <linearGradient id="priceGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#2d7a3a" stopOpacity={0.4} />
                      <stop offset="95%" stopColor="#2d7a3a" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                  <XAxis dataKey="month" tick={{ fontSize: 12, fill: 'var(--text-secondary)' }} />
                  <YAxis tick={{ fontSize: 11, fill: 'var(--text-secondary)' }} tickFormatter={(v) => `₹${(v / 1000).toFixed(1)}k`} />
                  <Tooltip content={<CustomTooltip />} />
                  <Area type="monotone" dataKey="price" stroke="var(--green-primary)" strokeWidth={2.5} fill="url(#priceGrad)" dot={{ fill: 'var(--green-primary)', r: 4 }} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Market Advice */}
          <div className="tip-card">
            <span className="tip-icon">💡</span>
            <div>
              <div style={{ fontWeight: 700, fontSize: 13, color: '#92400e', marginBottom: 4 }}>{t('priceAdvice')}</div>
              <div className="tip-text">{result.advice}</div>
            </div>
          </div>

          {/* Monthly breakdown */}
          <div className="card">
            <div className="card-title"><span className="card-icon">📋</span> Month-by-Month Forecast (₹/Quintal)</div>
            {chartData.map((d, i) => (
              <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 0', borderBottom: '1px solid var(--border)', fontSize: 14 }}>
                <span style={{ fontWeight: 500 }}>{d.month}</span>
                <span style={{ fontWeight: 700, color: 'var(--green-primary)' }}>₹{d.price?.toLocaleString('en-IN')}</span>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
