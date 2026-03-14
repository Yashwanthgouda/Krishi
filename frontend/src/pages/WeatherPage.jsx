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

const DESC_ICONS = {
  'clear sky': '☀️', 'sunny': '☀️', 'few clouds': '⛅', 'partly cloudy': '⛅',
  'scattered clouds': '☁️', 'broken clouds': '☁️', 'cloudy': '☁️',
  'shower rain': '🌧️', 'rain': '🌧️', 'light rain': '🌦️', 'haze': '🌫️',
  'thunderstorm': '⛈️', 'snow': '❄️', 'mist': '🌫️', 'fog': '🌫️',
};

function getIcon(icon, desc) {
  return WEATHER_ICONS[icon] || DESC_ICONS[desc?.toLowerCase()] || '🌤️';
}

function formatDate(dateStr) {
  const d = new Date(dateStr);
  return d.toLocaleDateString('en-IN', { weekday: 'short', month: 'short', day: 'numeric' });
}

function sunTime(ts) {
  const d = new Date(ts * 1000);
  return d.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });
}

const CITIES = ['Bangalore', 'Hyderabad', 'Mumbai', 'Delhi', 'Chennai', 'Pune', 'Kolkata', 'Ahmedabad', 'Jaipur', 'Lucknow'];

export default function WeatherPage() {
  const { t } = useLang();
  const [city, setCity] = useState('Bangalore');
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
      setError('Could not fetch weather. Check your internet connection.');
    } finally { setLoading(false); }
  };

  useEffect(() => { fetchWeather('Bangalore'); }, []);

  const handleSubmit = (e) => { e.preventDefault(); setCity(input); fetchWeather(input); };

  const tryGeoLocation = () => {
    navigator.geolocation?.getCurrentPosition(
      async (pos) => {
        setLoading(true);
        try {
          const d = await getWeatherByCoords(pos.coords.latitude, pos.coords.longitude);
          setData(d); setCity(d.city || 'Your Location'); setInput(d.city || 'Your Location');
        } catch { setError('Could not get weather for your location.'); }
        finally { setLoading(false); }
      },
      () => setError('Location access denied. Please enter city manually.')
    );
  };

  return (
    <div className="page">
      <h1 className="section-title">🌤️ {t('weather')}</h1>
      <form onSubmit={handleSubmit} style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
        <input
          className="form-input"
          style={{ flex: 1 }}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={t('enterCity')}
          list="city-list"
        />
        <datalist id="city-list">{CITIES.map(c => <option key={c} value={c} />)}</datalist>
        <button type="submit" className="btn btn-primary" style={{ width: 'auto', padding: '12px 16px' }}>🔍</button>
        <button type="button" className="btn btn-outline" style={{ width: 'auto', padding: '12px 16px' }} onClick={tryGeoLocation} title="Use my location">📍</button>
      </form>

      {loading && <div className="loader"><div className="spinner" /><p className="loader-text">{t('loading')}</p></div>}
      {error && <div className="alert-banner medium"><span>⚠️</span> {error}</div>}

      {data && !loading && (
        <>
          {data.isMockData && (
            <div className="alert-banner info" style={{ marginBottom: 12 }}>
              <span>ℹ️</span> Using sample weather data. Add your OpenWeatherMap API key in <code>backend/.env</code> for live data.
            </div>
          )}

          {/* Alerts */}
          {data.alerts?.map((a, i) => (
            <div key={i} className={`alert-banner ${a.severity}`}>{a.message}</div>
          ))}

          {/* Current Weather */}
          <div className="weather-main">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div>
                <div className="weather-city">{data.city}, {data.country}</div>
                <div className="weather-temp">{data.current.temp}°C</div>
                <div className="weather-desc">{getIcon(data.current.icon, data.current.description)} {data.current.description}</div>
              </div>
              <div style={{ textAlign: 'right', fontSize: 13, opacity: 0.85 }}>
                <div>Feels {data.current.feelsLike}°C</div>
                {data.current.sunrise && <div>🌅 {sunTime(data.current.sunrise)}</div>}
                {data.current.sunset && <div>🌇 {sunTime(data.current.sunset)}</div>}
              </div>
            </div>
            <div className="weather-meta">
              <div className="weather-meta-item"><span className="weather-meta-label">Humidity</span><span className="weather-meta-value">💧 {data.current.humidity}%</span></div>
              <div className="weather-meta-item"><span className="weather-meta-label">Wind</span><span className="weather-meta-value">💨 {data.current.windSpeed} km/h</span></div>
              {data.current.pressure && <div className="weather-meta-item"><span className="weather-meta-label">Pressure</span><span className="weather-meta-value">🔵 {data.current.pressure} hPa</span></div>}
              {data.current.visibility && <div className="weather-meta-item"><span className="weather-meta-label">Visibility</span><span className="weather-meta-value">👁️ {data.current.visibility} km</span></div>}
            </div>
          </div>

          {/* 7-Day Forecast */}
          <div className="card">
            <div className="card-title"><span className="card-icon">📅</span> 7-Day Forecast</div>
            <div className="forecast-scroll">
              {data.forecast.map((f, i) => (
                <div key={i} className="forecast-card">
                  <div className="forecast-day">{i === 0 ? 'Today' : formatDate(f.date)}</div>
                  <div className="forecast-icon">{getIcon(f.icon, f.description)}</div>
                  <div className="forecast-temp">
                    {f.maxTemp}° <span className="min">/ {f.minTemp}°</span>
                  </div>
                  {f.rain > 0 && <div style={{ fontSize: 11, color: '#0ea5e9', marginTop: 2 }}>🌧 {f.rain}mm</div>}
                </div>
              ))}
            </div>
          </div>

          {/* Farming Advice based on weather */}
          <div className="card">
            <div className="card-title"><span className="card-icon">🌾</span> Farming Advisory</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {data.current.humidity > 80 && (
                <div className="alert-banner medium">🍄 High humidity — watch for fungal diseases. Consider preventive fungicide spray.</div>
              )}
              {data.current.temp > 35 && (
                <div className="alert-banner high">🌡️ Heat stress risk — irrigate in early morning or evening. Avoid afternoon field work.</div>
              )}
              {data.current.windSpeed > 40 && (
                <div className="alert-banner high">💨 Strong winds — avoid pesticide spray. Secure greenhouses and crop covers.</div>
              )}
              {data.forecast?.some(f => f.rain > 10) && (
                <div className="alert-banner info">🌧️ Heavy rain expected — hold fertilizer application. Ensure field drainage is clear.</div>
              )}
              {data.current.temp < 15 && (
                <div className="alert-banner info">❄️ Cool weather — ideal for Rabi crops like wheat and mustard. Plan sowing now.</div>
              )}
              {!data.alerts?.length && data.current.humidity <= 80 && data.current.temp <= 35 && (
                <div style={{ fontSize: 14, color: 'var(--text-secondary)', padding: '8px 0' }}>
                  ✅ Weather conditions are normal. Good time for regular farm activities.
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
