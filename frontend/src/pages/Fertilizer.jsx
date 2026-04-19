import { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { useLocation } from 'react-router-dom';
import { SliderInput } from '../components/ui/SliderInput';
import { PillSelect } from '../components/ui/PillSelect';
import { ResultCard } from '../components/ui/ResultCard';
import { FertilizerIcon, WaterIcon } from '../components/icons';
import { useApi } from '../hooks/useApi';

export function Fertilizer() {
  const { t, i18n } = useTranslation();
  const api = useApi();
  const location = useLocation();

  let initialCrop = 'Rice';
  let initialN = 40;
  let initialP = 30;
  let initialK = 35;
  let autoSubmit = false;

  if (location.state) {
     if (location.state.crop) {
       const rawCrop = location.state.crop;
       initialCrop = rawCrop.charAt(0).toUpperCase() + rawCrop.slice(1).toLowerCase();
     }
     if (location.state.N !== undefined) initialN = Number(location.state.N);
     if (location.state.P !== undefined) initialP = Number(location.state.P);
     if (location.state.K !== undefined) initialK = Number(location.state.K);
     if (location.state.autoSubmit) autoSubmit = true;
  }
  
  let cropOptions = [
    { label: 'Rice', value: 'Rice' },
    { label: 'Wheat', value: 'Wheat' },
    { label: 'Cotton', value: 'Cotton' },
    { label: 'Sugarcane', value: 'Sugarcane' },
    { label: 'Tomato', value: 'Tomato' },
  ];

  if (!cropOptions.find(c => c.value === initialCrop)) {
    cropOptions = [{ label: initialCrop, value: initialCrop }, ...cropOptions];
  }

  const [formData, setFormData] = useState({
    crop: initialCrop,
    area: 1,
    N: initialN,
    P: initialP,
    K: initialK
  });

  const [result, setResult] = useState(null);
  const fetchedRef = useRef(false);

  useEffect(() => {
    if (autoSubmit && !fetchedRef.current) {
      fetchedRef.current = true;
      api.post('/fertilizer', {
        crop: initialCrop,
        area: 1,
        N: initialN,
        P: initialP,
        K: initialK,
        lang: i18n.language
      }).then(data => {
        if (data && data.success) {
          setResult(data);
        }
      });
      // Clean up history state to prevent refetch on back navigation
      window.history.replaceState({}, document.title);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setResult(null);
    const data = await api.post('/fertilizer', { ...formData, lang: i18n.language });
    if (data && data.success) {
      setResult(data);
    }
  };

  useEffect(() => {
    if (result && i18n.language) {
      const reFetch = async () => {
        const data = await api.post('/fertilizer', { ...formData, lang: i18n.language });
        if (data && data.success) setResult(data);
      };
      reFetch();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [i18n.language]);

  const updateField = (f, v) => setFormData(p => ({ ...p, [f]: v }));

  return (
    <div className="flex flex-col lg:flex-row gap-8 w-full max-w-6xl mx-auto">
      {/* Left Form */}
      <div className="flex-1 w-full">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 rounded-xl bg-gold-pale flex items-center justify-center text-gold">
             <FertilizerIcon size={24} />
          </div>
          <h1 className="text-2xl font-extrabold text-soil">{t('fertilizer.pageTitle')}</h1>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="card">
             <label className="text-[15px] font-bold text-soil block mb-3">{t('fertilizer.cropLabel')}</label>
             <PillSelect options={cropOptions} selected={formData.crop} onChange={(v)=>updateField('crop', v)} />
          </div>

          <div className="card">
             <label className="text-[15px] font-bold text-soil block mb-3">{t('fertilizer.areaLabel')} (Acres)</label>
             <input 
               type="number" min="0.1" step="0.1" 
               value={formData.area} 
               onChange={(e) => updateField('area', parseFloat(e.target.value) || 1)}
               className="w-full h-12 border-2 border-gray-200 rounded-xl px-4 font-bold text-soil focus:border-gold outline-none transition-colors" 
             />
          </div>

          <div className="card border-t-4 border-t-gold">
             <h2 className="section-label">Current Soil Status</h2>
             <SliderInput label={t('fertilizer.nLabel')} min={0} max={140} value={formData.N} breaks={[40, 90]} onChange={(v)=>updateField('N',v)} />
             <SliderInput label={t('fertilizer.pLabel')} min={0} max={145} value={formData.P} breaks={[45, 95]} onChange={(v)=>updateField('P',v)} />
             <SliderInput label={t('fertilizer.kLabel')} min={0} max={205} value={formData.K} breaks={[60, 140]} onChange={(v)=>updateField('K',v)} />
          </div>

          <button type="submit" disabled={api.loading} className="btn-primary !bg-gradient-to-tr !from-gold !to-[#d6a954] shadow-[0_4px_14px_rgba(200,150,58,0.3)] hover:shadow-[0_6px_20px_rgba(200,150,58,0.4)] relative overflow-hidden group">
             <span className="relative z-10 flex items-center gap-2">
                 {api.loading ? '...' : t('fertilizer.submitBtn')}
                 {!api.loading && <FertilizerIcon size={20} color="#fff" />}
             </span>
             <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform"></div>
          </button>
          
          {api.error && <p className="text-danger font-bold text-center mt-2">{api.error}</p>}
        </form>
      </div>

      {/* Right Result */}
      <div className="w-full lg:w-[420px] shrink-0">
          <div className="sticky top-24">
             {api.loading && (
                <div className="card min-h-[300px] flex items-center justify-center border-2 border-dashed border-gray-200">
                   <div className="flex flex-col items-center">
                       <FertilizerIcon size={40} color="var(--gold)" />
                       <p className="mt-4 text-soil font-bold text-lg animate-pulse">{t('common.loading')}</p>
                   </div>
                </div>
             )}

             <ResultCard title={t('fertilizer.resultTitle')} show={!!result}>
                {result && (
                  <div className="space-y-4">
                     {result.recommendations?.map((rec, i) => (
                       <div key={i} className="bg-gold-pale/30 border border-gold/20 p-4 rounded-xl flex items-center justify-between">
                          <div className="pr-4">
                             <p className="font-bold text-soil">{rec.fertilizer}</p>
                             <p className="text-sm font-semibold text-soil-light">{rec.timing}</p>
                          </div>
                          <div className="bg-white px-3 py-1.5 rounded-lg border border-gray-100 text-center shadow-sm shrink-0">
                             <span className="block text-xl font-extrabold text-gold leading-none">
                                {rec.applicationKg}<span className="text-xs">kg</span>
                             </span>
                          </div>
                       </div>
                     ))}
                     
                     {result.warnings?.length > 0 && (
                        <div className="mt-4 space-y-2">
                           <h4 className="text-sm font-bold text-soil-light uppercase tracking-wider border-b border-gray-100 pb-2">Notations</h4>
                           {result.warnings.map((w, i) => (
                              <p key={i} className="text-sm font-semibold text-soil">{w}</p>
                           ))}
                        </div>
                     )}

                     <h3 className="font-bold border-b border-gray-100 pb-2 mb-2 mt-6">{t('fertilizer.irrigationTitle')}</h3>
                     <div className="flex items-center gap-4 bg-sky-light/30 p-4 rounded-xl">
                        <WaterIcon size={24} color="#4A90C4" />
                        <p className="text-sm font-bold text-sky leading-tight flex-1">{result.irrigationTip}</p>
                     </div>
                  </div>
                )}
             </ResultCard>
          </div>
      </div>
    </div>
  );
}
