import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { WeatherWidget } from '../components/ui/WeatherWidget';
import { AlertBanner } from '../components/ui/AlertBanner';
import { WeatherIcon } from '../components/icons';
import { useApi } from '../hooks/useApi';
import { LoadingLeaf } from '../components/ui/LoadingLeaf';

export function Weather() {
  const { t } = useTranslation();
  const api = useApi();
  const [cityInput, setCityInput] = useState('');
  const [weatherData, setWeatherData] = useState(null);

  const [isLocating, setIsLocating] = useState(false);

  const handleFetch = async (queryParam) => {
    const data = await api.get(`/weather?${queryParam}`);
    if(data && data.success) {
      const transformed = {
        city: data.city,
        temp: data.current.temp,
        condition: data.current.description,
        humidity: data.current.humidity,
        wind: data.current.windSpeed,
        forecast: data.forecast.map(f => ({
          day: new Date(f.date).toLocaleDateString('en-US', { weekday: 'short' }),
          high: f.maxTemp,
          low: f.minTemp,
          rain: f.rain
        })),
        alerts: data.alerts || []
      };
      setWeatherData(transformed);
      setCityInput(data.city); // Sync input with GPS resolved city name
    }
  };

  const fetchWeather = async (e) => {
    if (e) e.preventDefault();
    if (!cityInput.trim()) return;
    await handleFetch(`city=${encodeURIComponent(cityInput)}`);
  };

  const getLiveLocation = () => {
    if (!navigator.geolocation) {
       alert(t('weather.noLocationSupport') || 'Geolocation is not supported by your browser');
       return;
    }
    setIsLocating(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
         setIsLocating(false);
         handleFetch(`lat=${position.coords.latitude}&lon=${position.coords.longitude}`);
      },
      (err) => {
         setIsLocating(false);
         alert('Unable to retrieve your location'); // Optional: replace with a toast
      }
    );
  };

  return (
    <div className="w-full max-w-4xl mx-auto flex flex-col gap-6">
      <div className="flex items-center gap-3">
         <div className="w-12 h-12 rounded-xl bg-sky-light flex items-center justify-center text-sky">
            <WeatherIcon size={24} color="#4A90C4" />
         </div>
         <h1 className="text-2xl font-extrabold text-soil">{t('features.weather.title')}</h1>
      </div>

      <form onSubmit={fetchWeather} className="flex flex-col sm:flex-row gap-3">
         <div className="flex-1 relative">
            <input 
               type="text" 
               placeholder={t('weather.searchPlaceholder')}
               value={cityInput}
               onChange={(e) => setCityInput(e.target.value)}
               className="w-full h-14 border-2 border-gray-200 rounded-xl pl-4 pr-14 font-bold text-soil focus:border-sky outline-none transition-colors"
            />
            <button 
               type="button"
               onClick={getLiveLocation}
               disabled={isLocating || api.loading}
               className="absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 flex items-center justify-center bg-sky-light text-sky rounded-lg hover:bg-sky/30 transition-colors"
               title="Use live location"
            >
               {isLocating ? (
                  <div className="w-5 h-5 border-2 border-sky border-t-transparent rounded-full animate-spin"></div>
               ) : (
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="10"></circle>
                    <circle cx="12" cy="12" r="3"></circle>
                  </svg>
               )}
            </button>
         </div>
         <button type="submit" disabled={api.loading || isLocating} className="btn-primary !bg-gradient-to-tr !from-sky !to-[#69aee3] shadow-[0_4px_14px_rgba(74,144,196,0.3)] sm:w-auto w-full py-0 h-14">
            {t('weather.search')}
         </button>
      </form>

      {api.loading && <LoadingLeaf text={t('weather.loading')} />}
      {api.error && <p className="text-danger font-bold text-center mt-2">{api.error}</p>}

      {!api.loading && (
        <div className="flex flex-col lg:flex-row gap-6 mt-4">
           {/* Left: main weather card */}
           <div className="flex-1 w-full relative">
              <WeatherWidget weather={weatherData} />
           </div>

           {/* Right: Detailed farming alerts */}
           <div className="w-full lg:w-[320px] flex flex-col gap-4">
              <h3 className="section-label">{t('weather.alerts')}</h3>
              {weatherData && weatherData.forecast[0].rain > 60 ? (
                 <AlertBanner type="warning" message={t('weather.rainAlert')} />
              ) : (
                 <AlertBanner type="success" message={t('weather.sprayOk')} />
              )}
              {weatherData && weatherData.wind > 20 && (
                 <AlertBanner type="warning" message={t('weather.windAlert')} />
              )}
              
              {!weatherData && (
                 <div className="p-4 border-2 border-dashed border-gray-200 rounded-xl text-center text-soil-light font-semibold opacity-60">
                    Enter a city above to see local farming alerts based on the weather forecast.
                 </div>
              )}
           </div>
        </div>
      )}
    </div>
  );
}
