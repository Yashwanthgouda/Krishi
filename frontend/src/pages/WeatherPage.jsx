import React, { useState, useEffect } from 'react';
import { getWeather, getWeatherByCoords } from '../services/api';
import { useLang } from '../context/LanguageContext';

const WEATHER_ICONS = {
  '01d': '☀️', '01n': '🌙', '02d': '⛅', '02n': '☁️',
  '03d': '☁️', '03n': '☁️', '04d': '☁️', '04n': '☁️',
  '09d': '🌧️', '09n': '🌧️', '10d': '🌦️', '10n': '🌧️',
  '11d': '⛈️', '11n': '⛈️', '13d': '❄️', '13n': '❄️',
  '50d': '🌫️', '50n': '🌫️',
};

function getIcon(icon) {
  return WEATHER_ICONS[icon] || '🌤️';
}

function formatDate(dateStr) {
  const d = new Date(dateStr);
  return d.toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric' });
}

export default function WeatherPage() {
  const { t } = useLang();
  const [input, setInput] = useState('Bangalore');
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const fetchWeather = async (c) => {
    setLoading(true); setError('');
    try {
      const d = await getWeather(c);
      setData(d);
    } catch {
      setError(t('serverError'));
    } finally { setLoading(false); }
  };

  const fetchByCoords = async (lat, lon) => {
    setLoading(true); setError('');
    try {
      const d = await getWeatherByCoords(lat, lon);
      setData(d);
      if (d.success && d.city) setInput(d.city);
    } catch {
      fetchWeather('Bangalore');
    } finally { setLoading(false); }
  };

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => fetchByCoords(pos.coords.latitude, pos.coords.longitude),
        () => fetchWeather('Bangalore')
      );
    } else {
      fetchWeather('Bangalore');
    }
  }, []);

  const handleSubmit = (e) => { e.preventDefault(); fetchWeather(input); };

  return (
    <div className="result-panel">
      <header style={{ marginBottom: '2.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
        <div>
          <h1 className="section-title">🌤️ {t('weather')}</h1>
          <p className="section-subtitle">{t('weatherSubtitle')}</p>
        </div>
        <form onSubmit={handleSubmit} style={{ display: 'flex', gap: '0.75rem', marginBottom: '0.5rem' }}>
          <input
            className="form-input"
            style={{ width: '250px', padding: '0.6rem 1rem', background: 'var(--surface)' }}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={t('searchCity')}
          />
          <button type="submit" className="btn btn-primary" style={{ width: 'auto' }}>{t('search')}</button>
        </form>
      </header>

      {error && <div className="card" style={{ borderLeft: '4px solid var(--error)', background: '#FEF2F2', color: 'var(--error)', marginBottom: '2rem', padding: '1rem' }}>⚠️ {error}</div>}

      {data && (
        <>
          {/* Main Hero Weather */}
          <div className="weather-main" style={{ marginBottom: '2rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <p style={{ textTransform: 'uppercase', fontWeight: 800, opacity: 0.8, fontSize: '0.875rem' }}>{t('currentForecast')}</p>
                <div style={{ fontSize: '2rem', fontWeight: 800, margin: '0.5rem 0' }}>{data.city}, {data.country}</div>
                <div style={{ fontSize: '5rem', fontWeight: 800, lineHeight: 1 }}>{data.current.temp}°C</div>
                <p style={{ fontSize: '1.25rem', fontWeight: 600, marginTop: '1rem' }}>{getIcon(data.current.icon)} {data.current.description}</p>
              </div>
              <div className="grid-cols-2" style={{ gap: '2rem' }}>
                <div className="stat-card" style={{ background: 'rgba(255,255,255,0.1)', padding: '1.5rem', borderRadius: 'var(--radius-lg)', minWidth: '140px' }}>
                  <p style={{ fontSize: '0.75rem', fontWeight: 800, opacity: 0.8 }}>{t('humidity')}</p>
                  <p style={{ fontSize: '2rem', fontWeight: 800 }}>{data.current.humidity}%</p>
                </div>
                <div className="stat-card" style={{ background: 'rgba(255,255,255,0.1)', padding: '1.5rem', borderRadius: 'var(--radius-lg)', minWidth: '140px' }}>
                  <p style={{ fontSize: '0.75rem', fontWeight: 800, opacity: 0.8 }}>{t('windSpeed')}</p>
                  <p style={{ fontSize: '2rem', fontWeight: 800 }}>{data.current.windSpeed} km/h</p>
                </div>
              </div>
            </div>
          </div>

          {/* 7-Day Forecast */}
          <div className="card" style={{ marginBottom: '2rem' }}>
            <div className="card-title">
              <span className="card-icon">📅</span> {t('next7Days')}
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '1rem' }}>
              {data.forecast.map((f, i) => (
                <div key={i} style={{ textAlign: 'center', padding: '1rem', background: i === 0 ? 'var(--primary-light)' : 'var(--bg)', borderRadius: 'var(--radius-md)', border: i === 0 ? '1px solid var(--primary)' : '1px solid var(--border)' }}>
                  <p style={{ fontSize: '0.75rem', fontWeight: 800, color: i === 0 ? 'var(--primary)' : 'var(--text-secondary)' }}>{i === 0 ? t('today') : formatDate(f.date).toUpperCase()}</p>
                  <div style={{ fontSize: '2.5rem', margin: '0.75rem 0' }}>{getIcon(f.icon)}</div>
                  <p style={{ fontWeight: 800, fontSize: '1.125rem' }}>{f.maxTemp}°</p>
                  <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{f.minTemp}°</p>
                </div>
              ))}
            </div>
          </div>

          {/* Farming Advisory */}
          <div className="card">
            <div className="card-title">
              <span className="card-icon">🌾</span> {t('smartAdvisory')}
            </div>
            <div className="grid-cols-2">
              <div className="card" style={{ background: 'var(--bg)', border: 'none' }}>
                <h4 style={{ color: 'var(--primary)', marginBottom: '0.5rem' }}>✅ {t('optimalConditions')}</h4>
                <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>{t('optimalText')}</p>
              </div>
              <div className="card" style={{ background: 'var(--bg)', border: 'none' }}>
                <h4 style={{ color: 'var(--warning)', marginBottom: '0.5rem' }}>⚠️ {t('irrigationAlert')}</h4>
                <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>{t('irrigationText')}</p>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
