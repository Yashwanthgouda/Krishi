import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { FeatureCard } from '../components/ui/FeatureCard';
import { WeatherWidget } from '../components/ui/WeatherWidget';
import { CropIcon, FertilizerIcon, WeatherIcon, DiseaseIcon, PriceIcon, MicIcon } from '../components/icons';

export function Home() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [userName, setUserName] = useState('Kisan');

  useEffect(() => {
    // Attempt to load from local storage if login was implemented
    const saved = localStorage.getItem('krishi_user');
    if (saved) setUserName(saved);
  }, []);

  const features = [
    { to: '/crop',       title: t('features.crop.title'),       sub: t('features.crop.subtitle'),       Icon: CropIcon,       color: 'bg-leaf-pale text-leaf' },
    { to: '/fertilizer', title: t('features.fertilizer.title'), sub: t('features.fertilizer.subtitle'), Icon: FertilizerIcon, color: 'bg-gold-pale text-gold' },
    { to: '/weather',    title: t('features.weather.title'),    sub: t('features.weather.subtitle'),    Icon: WeatherIcon,    color: 'bg-sky-light text-sky' },
    { to: '/disease',    title: t('features.disease.title'),    sub: t('features.disease.subtitle'),    Icon: DiseaseIcon,    color: 'bg-red-pale text-danger' },
    { to: '/prices',     title: t('features.prices.title'),     sub: t('features.prices.subtitle'),     Icon: PriceIcon,      color: 'bg-leaf-pale text-leaf' },
  ];

  return (
    <div className="flex flex-col lg:flex-row gap-6 w-full">
      {/* Left Column: Greeting & Features */}
      <div className="flex-1 w-full flex flex-col gap-6">
         {/* Greeting Card */}
         <div className="bg-gradient-to-r from-leaf to-leaf-hover rounded-2xl p-6 shadow-lift text-white relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-white opacity-10 rounded-full -translate-y-8 translate-x-8"></div>
            <div className="relative z-10">
               <span className="inline-block px-3 py-1 bg-white/20 rounded-full text-xs font-bold mb-3">
                 {t('home.season')}
               </span>
               <h1 className="text-3xl font-extrabold mb-1 tracking-tight">
                 {t('home.greeting')}, {userName} 🙏
               </h1>
               <p className="text-white/90 font-semibold">{t('home.todayDate')}: {new Date().toLocaleDateString()}</p>
            </div>
         </div>

         {/* Features Grid */}
         <div>
            <h2 className="section-label">{t('home.sectionTitle')}</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
               {features.map((f, i) => (
                 <FeatureCard 
                    key={f.to}
                    Icon={f.Icon}
                    title={f.title}
                    subtitle={f.sub}
                    colorClass={f.color}
                    onClick={() => navigate(f.to)}
                    delay={i * 0.08}
                 />
               ))}
               
               {/* Voice trigger card hidden on small mobile, visible on tablet+ to show it's a feature */}
               <div className="hidden sm:block">
                 <FeatureCard 
                    Icon={MicIcon}
                    title={t('features.voice.title')}
                    subtitle={t('features.voice.subtitle')}
                    colorClass="bg-gray-100 text-soil"
                    onClick={() => {
                        // We can't easily trigger the global FAB from here without context,
                        // so we just hint to use the floating button.
                        window.alert('Tap the floating microphone button to speak!');
                    }}
                    delay={0.4}
                 />
               </div>
            </div>
         </div>
      </div>

      {/* Right Column: Weather & Tips panel (Desktop mainly) */}
      <div className="w-full lg:w-[360px] xl:w-[400px] flex flex-col gap-6 shrink-0">
         <WeatherWidget />
         
         <div className="card bg-gold-pale border border-gold/20">
            <h3 className="text-lg font-bold text-soil mb-2">Tip of the day</h3>
            <p className="text-sm font-semibold text-soil-light">
               Keep records of your fertilizer usage. It helps AI recommend better next season!
            </p>
         </div>
      </div>
    </div>
  );
}
