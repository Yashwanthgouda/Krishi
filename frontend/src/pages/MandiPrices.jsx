import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useApi } from '../hooks/useApi';
import { PriceIcon, TrendUpIcon, TrendDownIcon } from '../components/icons';
import { PillSelect } from '../components/ui/PillSelect';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export function MandiPrices() {
  const { t, i18n } = useTranslation();
  const api = useApi();
  const [selectedCrop, setSelectedCrop] = useState('rice');
  const [searchInput, setSearchInput] = useState('');
  const [priceData, setPriceData] = useState(null);

  const knownCrops = [
    'Rice', 'Wheat', 'Maize', 'Sugarcane', 'Cotton', 'Banana', 
    'Mango', 'Chickpea', 'Lentil', 'Coffee', 'Coconut', 'Grapes', 
    'Soybean', 'Mustard', 'Groundnut', 'Potato', 'Tomato', 'Onion'
  ];

  useEffect(() => {
    const fetchData = async () => {
      const data = await api.post('/price', { crop: selectedCrop, district: 'Bangalore', months: 6, lang: i18n.language });
      
      if (data && data.success) {
        // Transform the backend parallel arrays into the array of objects Recharts expects
        const forecast = data.forecastLabels.map((label, index) => ({
          month: label,
          price: data.forecastPrices[index]
        }));
        
        setPriceData({
          crop: data.crop,
          current_price: data.currentPrice,
          trend: data.trend,
          trendPercent: data.trendPercent,
          forecast: forecast,
          advice: data.advice
        });
      }
    };
    fetchData();
  }, [selectedCrop, i18n.language]);

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-soil text-white px-4 py-2 rounded-lg shadow-lift border border-white/10">
          <p className="font-bold mb-1">{label}</p>
          <p className="text-xl font-extrabold text-gold">{t('common.rupee')}{payload[0].value}</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="w-full max-w-5xl mx-auto">
       <div className="flex flex-col lg:flex-row items-start justify-between gap-4 mb-8">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-leaf-pale flex items-center justify-center text-leaf">
               <PriceIcon size={24} color="#3D7A3F" />
            </div>
            <h1 className="text-2xl font-extrabold text-soil">{t('prices.pageTitle')}</h1>
          </div>
          
          <div className="w-full lg:w-auto flex flex-col gap-3">
             <form onSubmit={(e) => { e.preventDefault(); if (searchInput.trim()) { setSelectedCrop(searchInput.trim().toLowerCase()); } }} className="flex">
                <input 
                   type="text" 
                   value={searchInput}
                   onChange={(e) => setSearchInput(e.target.value)}
                   placeholder={t('prices.searchPlaceholder') || "Search any crop..."}
                   className="w-full lg:w-64 border-2 border-gray-200 rounded-l-xl px-4 font-bold text-soil focus:border-leaf outline-none h-11"
                   list="known-crops"
                />
                <button type="submit" disabled={api.loading} className="bg-leaf text-white px-4 h-11 rounded-r-xl font-bold hover:bg-[#326634] transition-colors">
                   {t('common.search')}
                </button>
             </form>
             <datalist id="known-crops">
                {knownCrops.map(c => <option key={c} value={c}>{t(`crops.${c.toLowerCase()}`, { defaultValue: c })}</option>)}
             </datalist>
             
             {/* Quick pills */}
             <div className="flex flex-wrap gap-2">
                {['Rice', 'Wheat', 'Cotton', 'Maize'].map(opt => (
                   <button 
                      key={opt}
                      onClick={() => { setSelectedCrop(opt.toLowerCase()); setSearchInput(''); }}
                      className={`px-3 py-1 bg-gray-100 rounded-full text-xs font-bold transition-colors ${selectedCrop === opt.toLowerCase() ? 'bg-leaf text-white' : 'text-soil-light hover:bg-leaf/20 hover:text-leaf'}`}
                   >
                      {t(`crops.${opt.toLowerCase()}`, { defaultValue: opt })}
                   </button>
                ))}
             </div>
          </div>
       </div>

       {priceData && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
             {/* Left: Chart */}
             <div className="lg:col-span-2 card !px-2 sm:!p-6 h-[400px] flex flex-col">
                <h3 className="section-label px-4 sm:px-0 mb-4">{t('prices.forecast')}</h3>
                <div className="flex-1 w-full relative">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={priceData.forecast} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                      <defs>
                        <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="var(--green)" stopOpacity={0.3}/>
                          <stop offset="95%" stopColor="var(--green)" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                      <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{fill: '#6B4C3B', fontWeight: 600, fontSize: 13}} dy={10} />
                      <YAxis axisLine={false} tickLine={false} tick={{fill: '#6B4C3B', fontWeight: 600, fontSize: 13}} dx={-10} domain={['dataMin - 100', 'dataMax + 100']} />
                      <Tooltip content={<CustomTooltip />} />
                      <Area type="monotone" dataKey="price" stroke="var(--gold)" strokeWidth={3} fillOpacity={1} fill="url(#colorPrice)" />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
             </div>

             {/* Right: Stats */}
             <div className="flex flex-col gap-4 w-full">
                <div className="card text-center py-8 bg-gradient-to-br from-white to-gray-50 border border-gray-100">
                   <p className="text-sm font-bold text-soil-light uppercase tracking-wider mb-2">{t('prices.currentPrice')}</p>
                   <div className="flex items-center justify-center gap-2">
                      <span className="text-4xl font-black text-leaf">{t('common.rupee')}{priceData.current_price}</span>
                      <span className="text-lg font-bold text-soil-light mt-2">/ Q</span>
                   </div>
                   <div className={`mt-4 inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold ${priceData.trend === 'Rising' ? 'bg-leaf-pale text-leaf' : 'bg-red-pale text-danger'}`}>
                      {priceData.trend === 'Rising' ? <TrendUpIcon size={16} /> : <TrendDownIcon size={16} />} 
                      {priceData.trendPercent}% this season
                   </div>
                </div>

                <div className="card bg-gold-pale border border-gold/20 flex-1 flex flex-col justify-center text-center">
                   <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center mx-auto mb-3 shadow-sm text-gold">
                      <PriceIcon size={24} />
                   </div>
                   <h3 className="font-extrabold text-soil text-lg mb-1">{t('prices.bestTime')}</h3>
                   <p className="text-[15px] font-semibold text-soil-light">
                      {priceData.advice}
                   </p>
                </div>
             </div>
          </div>
       )}
    </div>
  );
}
