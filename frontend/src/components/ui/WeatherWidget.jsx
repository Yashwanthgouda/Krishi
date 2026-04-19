import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { WeatherIcon, WaterIcon, WindIcon, AlertIcon } from '../icons';
import { useApi } from '../../hooks/useApi';

export function WeatherWidget({ weather }) {
  const { t } = useTranslation();
  const api = useApi();
  const [localWeather, setLocalWeather] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editCity, setEditCity] = useState('');

  const [cities, setCities] = useState([
    'Davangere', 'Bangalore', 'Mysore', 'Hubli', 'Mangalore', 
    'Hyderabad', 'Mumbai', 'Pune', 'Delhi', 'Chennai', 'Kolkata', 'Ahmedabad', 'Patna', 'Jaipur'
  ]);
  const [selectedCity, setSelectedCity] = useState('USE_GPS');

  // Use explicitly provided weather prop, OR locally fetched, OR fallback mock
  const data = weather || localWeather || {
    city: 'Davangere', temp: 28, condition: 'Clear', humidity: 68, wind: 12,
    forecast: [
      { day: 'Mon', high: 30, low: 22, rain: 0 },
      { day: 'Tue', high: 32, low: 23, rain: 20 },
      { day: 'Wed', high: 29, low: 21, rain: 80 },
    ]
  };

  const updateWeatherState = (res) => {
    setLocalWeather({
      city: res.city,
      temp: res.current.temp,
      condition: res.current.description,
      humidity: res.current.humidity,
      wind: res.current.windSpeed,
      forecast: res.forecast.map(f => ({
        day: new Date(f.date).toLocaleDateString('en-US', { weekday: 'short' }),
        high: f.maxTemp,
        low: f.minTemp,
        rain: f.rain
      })),
      alerts: res.alerts || []
    });
  };

  const handleFetchCity = async (val) => {
    setSelectedCity(val);
    
    if (val === 'USE_GPS') {
       if (!navigator.geolocation) {
          alert('Geolocation is not supported by your browser');
          handleFetchCity('Davangere');
          return;
       }
       navigator.geolocation.getCurrentPosition(
         async (pos) => {
            const res = await api.get(`/weather?lat=${pos.coords.latitude}&lon=${pos.coords.longitude}&city=My%20Location`);
            if (res && res.success) updateWeatherState(res);
         },
         () => {
            console.warn('Unable to retrieve your location');
            handleFetchCity('Davangere');
         },
         { timeout: 3000, maximumAge: 300000, enableHighAccuracy: false }
       );
       return;
    }

    const res = await api.get(`/weather?city=${encodeURIComponent(val)}`);
    if(res && res.success) updateWeatherState(res);
  };

  // Load districts list and fetch initial location on mount
  useEffect(() => {
     api.get('/districts').then(res => {
        if(res && res.districts) setCities(res.districts);
     });
     handleFetchCity('USE_GPS');
     // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="card overflow-hidden !p-0">
      {/* Hero section */}
      <div className="bg-gradient-to-br from-leaf to-sky p-6 text-white relative overflow-hidden">
        <div className="absolute right-0 top-0 opacity-20 -translate-y-4 translate-x-4 pointer-events-none">
          <WeatherIcon size={120} color="#fff" />
        </div>

        <div className="relative z-10">
          <div className="flex items-center justify-between mb-2">
             <div className="flex items-center gap-2">
                <select 
                   value={selectedCity}
                   onChange={(e) => handleFetchCity(e.target.value)}
                   className="bg-white/20 border border-white/40 rounded-lg px-2 py-1 text-sm font-bold tracking-widest uppercase outline-none focus:bg-white/30 text-white cursor-pointer appearance-none pr-6 relative"
                   style={{ WebkitAppearance: 'none' }}
                >
                   <option value="USE_GPS" className="text-leaf bg-white font-black">📍 My Location</option>
                   <option disabled className="text-gray-400 bg-white shadow-sm">──────────</option>
                   {cities.map(c => <option key={c} value={c} className="text-soil bg-white capitalize">{c}</option>)}
                </select>
                <svg className="w-3 h-3 text-white -ml-6 pointer-events-none" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6"/></svg>
                {api.loading && <span className="w-3 h-3 ml-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>}
             </div>
             <span className="text-xs font-bold tracking-widest uppercase opacity-80">{t('weather.today')}</span>
          </div>

          <div className="flex items-end gap-3 mt-2">
            <span className="text-6xl font-extrabold tracking-tighter">{data.temp}°</span>
            <span className="text-xl font-semibold mb-2 opacity-90 capitalize">{data.condition}</span>
          </div>

          <div className="flex gap-6 mt-6">
            <div className="flex items-center gap-2 bg-white/10 px-3 py-1.5 rounded-full">
              <WaterIcon size={16} color="#fff" />
              <span className="text-sm font-semibold">{t('weather.humidity')}: {data.humidity}%</span>
            </div>
            <div className="flex items-center gap-2 bg-white/10 px-3 py-1.5 rounded-full">
              <WindIcon size={16} color="#fff" />
              <span className="text-sm font-semibold">{t('weather.wind')}: {data.wind} {t('common.kmph')}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Forecast Strip */}
      <div className="p-4 bg-white">
        <p className="text-xs font-bold text-soil-light uppercase tracking-wider mb-2">{t('weather.forecast')}</p>
        <div className="flex justify-between">
          {data.forecast.slice(0, 3).map((f, i) => (
            <div key={i} className="flex flex-col items-center p-2 rounded-lg hover:bg-gray-50">
              <span className="text-sm font-semibold text-soil">{f.day}</span>
              <div className="my-1 text-sky">
                <WeatherIcon size={24} color={f.rain > 50 ? '#4A90C4' : '#C8963A'} />
              </div>
              <span className="text-sm font-bold text-soil">{f.high}° <span className="text-soil-light font-normal">{f.low}°</span></span>
            </div>
          ))}
        </div>
      </div>

      {/* Alert Banners (Dynamic from Backend) */}
      {data.alerts && data.alerts.length > 0 && (
        <div className="flex flex-col border-t border-gold/20">
          {data.alerts.map((alert, idx) => (
            <div key={idx} className={`px-4 py-3 flex gap-3 items-start ${alert.severity === 'high' ? 'bg-red-pale text-danger border-b border-red-pale/50' : 'bg-gold-pale border-b border-gold/20'}`}>
              <div className="mt-0.5">
                <AlertIcon size={20} color={alert.severity === 'high' ? '#C0392B' : '#C8963A'} />
              </div>
              <p className="text-sm font-semibold text-soil leading-tight">{alert.message}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
