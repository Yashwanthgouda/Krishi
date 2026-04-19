import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { SliderInput } from '../components/ui/SliderInput';
import { PillSelect } from '../components/ui/PillSelect';
import { ResultCard } from '../components/ui/ResultCard';
import { LoadingLeaf } from '../components/ui/LoadingLeaf';
import { CropIcon, WaterIcon, SunIcon, CalendarIcon, ArrowRightIcon } from '../components/icons';
import { useApi } from '../hooks/useApi';

export function CropRecommend() {
  const { t } = useTranslation();
  const api = useApi();
  const navigate = useNavigate();
  
  // Form State
  const [formData, setFormData] = useState({
    N: 50, P: 50, K: 50, ph: 6.5,
    temperature: 28, humidity: 65, rainfall: 150
  });

  const [result, setResult] = useState(null);

  const handleSubmit = async (e) => {
    if (e) e.preventDefault();
    setResult(null);
    const data = await api.post('/crop', { ...formData, pH: formData.ph });
    if (data && data.success && data.recommendations && data.recommendations.length > 0) {
      setResult(data.recommendations[0]);
    }
  };

  const updateField = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="flex flex-col lg:flex-row gap-8 w-full max-w-6xl mx-auto">
      
      {/* Left Column: Form */}
      <div className="flex-1 w-full">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 rounded-xl bg-leaf-pale flex items-center justify-center text-leaf">
             <CropIcon size={24} />
          </div>
          <h1 className="text-2xl font-extrabold text-soil">{t('crop.pageTitle')}</h1>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Card 1: Soil */}
          <div className="card border-t-4 border-t-leaf">
             <h2 className="section-label">{t('crop.soilCard')}</h2>
             <SliderInput label={t('crop.nitrogen')} min={0} max={140} value={formData.N} breaks={[40, 90]} onChange={(v)=>updateField('N',v)} />
             <SliderInput label={t('crop.phosphorus')} min={0} max={145} value={formData.P} breaks={[45, 95]} onChange={(v)=>updateField('P',v)} />
             <SliderInput label={t('crop.potassium')} min={0} max={205} value={formData.K} breaks={[60, 140]} onChange={(v)=>updateField('K',v)} />
             <SliderInput label={t('crop.ph')} min={3.5} max={9.5} value={formData.ph} breaks={[5.5, 7.5]} onChange={(v)=>updateField('ph',v)} />
          </div>

          {/* Card 2: Climate */}
          <div className="card border-t-4 border-t-sky">
             <h2 className="section-label">{t('crop.climateCard')}</h2>
             <SliderInput label={t('crop.temperature')} min={5} max={50} value={formData.temperature} unit="°C" breaks={[15, 35]} onChange={(v)=>updateField('temperature',v)} />
             <SliderInput label={t('crop.humidity')} min={10} max={100} value={formData.humidity} unit="%" breaks={[40, 80]} onChange={(v)=>updateField('humidity',v)} />
             <SliderInput label={t('crop.rainfall')} min={20} max={300} value={formData.rainfall} unit="mm" breaks={[80, 200]} onChange={(v)=>updateField('rainfall',v)} />
          </div>

          <button type="submit" disabled={api.loading} className="btn-primary mt-4 relative overflow-hidden group">
             <span className="relative z-10 flex items-center gap-2">
                 {api.loading ? '...' : t('crop.submitBtn')}
                 {!api.loading && <CropIcon size={20} color="#fff" />}
             </span>
             <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform"></div>
          </button>
          
          {api.error && <p className="text-danger font-bold text-center mt-2">{api.error}</p>}
        </form>
      </div>

      {/* Right Column: Results (Sticky) */}
      <div className="w-full lg:w-[420px] shrink-0">
          <div className="sticky top-24">
             {api.loading && (
                <div className="card min-h-[300px] flex items-center justify-center border-2 border-dashed border-gray-200">
                   <LoadingLeaf text={t('common.loading')} />
                </div>
             )}

             <ResultCard title={t('crop.resultTitle')} show={!!result}>
                {result && (
                  <div className="text-center pb-2">
                     <h3 className="flex items-center justify-center gap-2 text-4xl font-black text-leaf capitalize mb-2">
                        {result.icon} {result.crop}
                     </h3>
                     <div className="inline-block bg-leaf-pale px-4 py-1.5 rounded-full text-leaf font-bold text-sm mb-6">
                       {t('crop.confidence')}: {result.confidence}%
                     </div>
                     
                     <div className="space-y-4 text-left">
                       <div className="flex items-center gap-4 bg-gray-50 p-3 rounded-xl border border-gray-100">
                          <WaterIcon size={24} color="#4A90C4"/>
                          <div>
                            <p className="text-xs font-bold text-soil-light uppercase">{t('crop.waterNeeded')}</p>
                            <p className="text-sm font-semibold text-soil">{result.waterRequirement} Water Requirement</p>
                          </div>
                       </div>
                       <div className="flex items-center gap-4 bg-gray-50 p-3 rounded-xl border border-gray-100">
                          <SunIcon size={24} color="#C8963A"/>
                          <div>
                            <p className="text-xs font-bold text-soil-light uppercase">{t('crop.season')}</p>
                            <p className="text-sm font-semibold text-soil">{result.season}</p>
                          </div>
                       </div>
                       <div className="flex items-center gap-4 bg-gray-50 p-3 rounded-xl border border-gray-100">
                          <CalendarIcon size={24} color="#3D7A3F"/>
                          <div>
                            <p className="text-xs font-bold text-soil-light uppercase">{t('crop.harvestIn')}</p>
                            <p className="text-sm font-semibold text-soil">120 {t('common.days')}</p>
                          </div>
                       </div>
                     </div>

                     <button 
                        onClick={() => navigate('/fertilizer', { state: { crop: result.crop, N: formData.N, P: formData.P, K: formData.K, autoSubmit: true } })}
                        className="btn-outline w-full mt-6 flex justify-between"
                     >
                        {t('crop.goFertilizer')}
                        <ArrowRightIcon />
                     </button>
                  </div>
                )}
             </ResultCard>

             {!result && !api.loading && (
                <div className="hidden lg:flex card min-h-[300px] items-center justify-center border-2 border-dashed border-gray-200 bg-transparent text-center px-8">
                   <p className="font-semibold text-soil-light opacity-60">
                      Fill the form and submit to get an AI-powered crop recommendation here.
                   </p>
                </div>
             )}
          </div>
      </div>
    </div>
  );
}
