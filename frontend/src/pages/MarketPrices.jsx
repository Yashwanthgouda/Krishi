import React, { useState, useEffect } from 'react';
import { getPriceForecast, getDistricts } from '../services/api';
import { useLang } from '../context/LanguageContext';
import { useEnhancedApi } from '../hooks/useEnhancedApi';
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
      <div className="card" style={{ padding: '0.5rem 1rem', boxShadow: 'var(--shadow-lg)' }}>
        <p style={{ fontWeight: 800, fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '0.25rem' }}>{label}</p>
        <p style={{ fontWeight: 800, color: 'var(--primary)', fontSize: '1rem' }}>₹{payload[0].value?.toLocaleString('en-IN')}</p>
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
  const { execute, loading, error, isWakingUp, countdown } = useEnhancedApi(getPriceForecast);

  useEffect(() => {
    getDistricts().then((d) => setDistricts(d.districts || [])).catch(() => {});
  }, []);

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

  const chartData = result?.forecastLabels?.map((label, i) => ({
    month: label,
    price: result.forecastPrices[i],
  })) || [];

  return (
    <div className="result-panel">
      <header style={{ marginBottom: '2.5rem' }}>
        <h1 className="section-title">📊 {t('marketPrices')}</h1>
        <p className="section-subtitle">{t('marketSubtitle')}</p>
      </header>

      <form onSubmit={handleSubmit}>
        <div className="card" style={{ marginBottom: '2rem' }}>
          <div className="grid-cols-2" style={{ gap: '2rem' }}>
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
          </div>
          
          <div style={{ marginTop: '1.5rem', display: 'flex', justifyContent: 'flex-end' }}>
            <button type="submit" className="btn btn-primary" style={{ width: 'auto', padding: '1rem 2rem' }} disabled={loading}>
              {loading ? t('calculating') : t('generateForecast')}
            </button>
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
          {/* Price Summary Grid */}
          <div className="grid-cols-4" style={{ marginBottom: '2rem' }}>
            <div className="card stat-card">
              <div className="stat-label">{t('currentPrice')}</div>
              <div className="stat-value">₹{result.currentPrice?.toLocaleString('en-IN')}</div>
              <div className="stat-trend">{t('perQuintal')}</div>
            </div>
            <div className="card stat-card">
              <div className="stat-label">{t('msp')}</div>
              <div className="stat-value">₹{result.msp?.toLocaleString('en-IN')}</div>
              <div className="stat-trend" style={{ color: 'var(--primary)' }}>{t('guaranteed')}</div>
            </div>
            <div className="card stat-card">
              <div className="stat-label">{t('sixMonthTrend')}</div>
              <div className={`stat-value ${result.trend === 'Rising' ? 'up' : 'down'}`} style={{ color: result.trend === 'Rising' ? 'var(--success)' : 'var(--error)' }}>
                {result.trend === 'Rising' ? '↑' : '↓'} {result.trend}
              </div>
              <div className="stat-trend">{result.trendPercent}% Change</div>
            </div>
            <div className="card stat-card">
              <div className="stat-label">{t('marketStatus')}</div>
              <div className="stat-value" style={{ fontSize: '1.5rem' }}>{result.trend === 'Rising' ? t('bullish') : t('bearish')}</div>
              <div className="stat-trend">{t('highDemand')}</div>
            </div>
          </div>

          {/* Forecast Chart */}
          <div className="grid-cols-2" style={{ marginBottom: '2rem' }}>
            <div className="card" style={{ display: 'flex', flexDirection: 'column' }}>
              <div className="card-title">
                <span className="card-icon">📈</span> {t('priceProj')}
              </div>
              <div style={{ flex: 1, height: '300px', marginTop: '1rem' }}>
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={chartData}>
                    <defs>
                      <linearGradient id="priceGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="var(--primary)" stopOpacity={0.4} />
                        <stop offset="95%" stopColor="var(--primary)" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border)" />
                    <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: 'var(--text-secondary)' }} />
                    <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: 'var(--text-secondary)' }} />
                    <Tooltip content={<CustomTooltip />} />
                    <Area type="monotone" dataKey="price" stroke="var(--primary)" strokeWidth={3} fill="url(#priceGrad)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="card" style={{ background: 'var(--primary-light)', borderColor: 'var(--primary)' }}>
              <div className="card-title" style={{ color: 'var(--primary)' }}>
                <span className="card-icon" style={{ background: 'white' }}>💡</span> {t('marketAdviceText')}
              </div>
              <p style={{ fontSize: '1.125rem', lineHeight: 1.8, color: 'var(--text-main)', fontWeight: 600 }}>{result.advice}</p>
              <div style={{ marginTop: '2rem' }}>
                <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginBottom: '1rem' }}>{t('recStrategy')}</p>
                <div className="card" style={{ background: 'white', border: '1px solid var(--border)', padding: '1rem' }}>
                  <p style={{ fontSize: '0.875rem' }}>{t('staggeredSell')}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
