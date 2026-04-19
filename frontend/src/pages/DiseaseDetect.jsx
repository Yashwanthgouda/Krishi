import { useState, useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useApi } from '../hooks/useApi';
import { DiseaseIcon } from '../components/icons';
import { ResultCard } from '../components/ui/ResultCard';
import { motion, AnimatePresence } from 'framer-motion';

export function DiseaseDetect() {
  const { t, i18n } = useTranslation();
  const api = useApi();
  const fileInputRef = useRef(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState('');
  const [result, setResult] = useState(null);
  const [isDragging, setIsDragging] = useState(false);

  const processFile = async (file) => {
    if (!file || !file.type.startsWith('image/')) return;
    setSelectedFile(file);
    setPreviewUrl(URL.createObjectURL(file));
    setResult(null);

    // Auto-submit
    const formData = new FormData();
    formData.append('image', file);
    formData.append('lang', i18n.language);

    const data = await api.post('/disease', formData);
    if(data && data.success) {
      setResult(data);
    }
  };

  useEffect(() => {
    if (result && selectedFile && i18n.language) {
      const reFetch = async () => {
        const formData = new FormData();
        formData.append('image', selectedFile);
        formData.append('lang', i18n.language);
        const data = await api.post('/disease', formData);
        if (data && data.success) setResult(data);
      };
      reFetch();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [i18n.language]);

  const handleFileSelect = (e) => {
    processFile(e.target.files[0]);
  };

  const onDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };
  
  const onDragLeave = () => {
    setIsDragging(false);
  };
  
  const onDrop = async (e) => {
    e.preventDefault();
    setIsDragging(false);
    
    // 1. Standard file from local system
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      processFile(e.dataTransfer.files[0]);
      return;
    }

    // 2. Image dragged directly from another website
    const html = e.dataTransfer.getData('text/html');
    const url = e.dataTransfer.getData('text/uri-list') || e.dataTransfer.getData('text/plain');
    
    let imgSrc = null;
    if (html) {
      const match = html.match(/<img.*?src=["'](.*?)["']/i);
      if (match && match[1]) imgSrc = match[1];
    }
    if (!imgSrc && url && url.match(/^https?:\/\//i)) {
      imgSrc = url;
    }

    if (imgSrc) {
       try {
          if (imgSrc.startsWith('data:image/')) {
             const res = await fetch(imgSrc);
             const blob = await res.blob();
             if (blob.type.startsWith('image/')) {
               processFile(new File([blob], 'dragged.jpg', { type: blob.type }));
             }
          } else {
             // Handle CORS by using a public proxy to fetch the image bytes
             const proxyUrl = `https://api.allorigins.win/raw?url=${encodeURIComponent(imgSrc)}`;
             const res = await fetch(proxyUrl);
             const blob = await res.blob();
             if (blob.type.startsWith('image/')) {
                processFile(new File([blob], 'dragged.jpg', { type: blob.type }));
             } else {
                alert('Please copy and paste (Ctrl+V) the image instead. Your browser blocked the drag-and-drop download.');
             }
          }
       } catch (err) {
          console.error("Failed to fetch dragged image:", err);
          alert('Could not download the dragged image. Please Copy and Paste (Ctrl+V) or save it to your computer first.');
       }
    }
  };

  useEffect(() => {
    const handlePaste = (e) => {
      const items = (e.clipboardData || e.originalEvent.clipboardData).items;
      for (const item of items) {
        if (item.type.indexOf('image/') === 0) {
          const file = item.getAsFile();
          if (file) processFile(file);
          break;
        }
      }
    };
    window.addEventListener('paste', handlePaste);
    return () => window.removeEventListener('paste', handlePaste);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const severityColor = {
    'Low': 'bg-gold-pale text-gold',
    'Medium': 'bg-gold text-white',
    'High': 'bg-danger text-white'
  };

  return (
    <div className="flex flex-col lg:flex-row gap-8 w-full max-w-5xl mx-auto">
       <div className="flex-1 w-full">
         <div className="flex items-center gap-3 mb-6">
           <div className="w-12 h-12 rounded-xl bg-red-pale flex items-center justify-center text-danger">
              <DiseaseIcon size={24} color="#C0392B" />
           </div>
           <h1 className="text-2xl font-extrabold text-soil">{t('disease.pageTitle')}</h1>
         </div>

         {/* Upload Zone */}
         <div 
           className={`card border-2 border-dashed ${isDragging ? 'border-danger bg-red-pale/20' : 'border-gray-300'} flex flex-col items-center justify-center min-h-[360px] cursor-pointer hover:border-danger/50 hover:bg-red-pale/20 transition-colors relative overflow-hidden`}
           onClick={() => fileInputRef.current?.click()}
           onDragOver={onDragOver}
           onDragLeave={onDragLeave}
           onDrop={onDrop}
         >
            <input 
              type="file" 
              ref={fileInputRef} 
              className="hidden" 
              accept="image/*" 
              capture="environment" /* Open camera directly on mobile if supported */
              onChange={handleFileSelect}
            />

            <AnimatePresence>
               {previewUrl ? (
                 <motion.div
                   initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                   className="absolute inset-0 w-full h-full p-4"
                 >
                    <img src={previewUrl} alt="Leaf preview" className="w-full h-full object-contain rounded-xl" />
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity rounded-xl m-4">
                       <span className="btn-primary w-auto">Retake Photo</span>
                    </div>
                 </motion.div>
               ) : (
                 <motion.div className="flex flex-col items-center p-6 text-center" initial={{ opacity: 1 }} exit={{ opacity: 0 }}>
                    <div className="w-24 h-24 rounded-full bg-red-pale flex items-center justify-center mb-6">
                       <DiseaseIcon size={48} color="#C0392B" />
                    </div>
                    <h2 className="text-xl font-bold text-soil mb-2">{t('disease.uploadTitle')}</h2>
                    <p className="text-soil-light font-semibold">{t('disease.uploadHint')}</p>
                 </motion.div>
               )}
            </AnimatePresence>

            {/* Scanning Overlay */}
            {api.loading && (
               <div className="absolute inset-0 bg-black/60 backdrop-blur-sm z-10 flex flex-col items-center justify-center">
                  <div className="w-full h-1 bg-danger/50 absolute top-0 animate-wave opacity-50 shadow-[0_0_20px_rgba(192,57,43,0.8)]"></div>
                  <div className="w-16 h-16 rounded-full border-4 border-white/20 border-t-danger animate-spin mb-4"></div>
                  <p className="text-white font-bold text-lg animate-pulse">{t('disease.loading')}</p>
               </div>
            )}
         </div>

         {api.error && <p className="text-danger font-bold text-center mt-4">{api.error}</p>}
       </div>

        {/* Result Panel */}
       <div className="w-full lg:w-[420px] shrink-0">
          <div className="sticky top-24">
             <ResultCard title={result?.isHealthy ? t('disease.healthy') : t('disease.resultTitle')} show={!!result}>
               {result && (
                 result.isHealthy ? (
                    <div className="text-center py-6">
                       <div className="w-20 h-20 bg-leaf-pale rounded-full flex items-center justify-center mx-auto mb-4 text-4xl">
                          {result.disease?.icon || '🍀'}
                       </div>
                       <h3 className="text-2xl font-extrabold text-leaf mb-2">{t('disease.healthy')}</h3>
                       <p className="font-semibold text-soil-light">{result.disease?.treatment || t('disease.healthyMsg')}</p>
                    </div>
                 ) : (
                    <div>
                       <div className="flex justify-between items-start mb-6">
                          <h3 className="text-3xl font-black text-danger leading-tight flex-1 pr-4">
                             {result.disease?.icon && <span className="mr-2 text-2xl">{result.disease.icon}</span>}
                             {result.disease?.name}
                          </h3>
                          <span className={`px-3 py-1 rounded-full text-xs font-bold shrink-0 ${severityColor[result.disease?.severity] || 'bg-danger text-white'}`}>
                             {result.disease?.severity || 'High'} Severity
                          </span>
                       </div>
                       
                       <div className="space-y-4">
                          <h4 className="text-sm font-bold text-soil-light uppercase tracking-wider border-b border-gray-100 pb-2">
                             {t('disease.treatment')}
                          </h4>
                          <div className="bg-red-pale/20 p-4 rounded-xl border border-red-pale/50 whitespace-pre-wrap font-semibold text-soil text-sm leading-relaxed">
                             {result.disease?.treatment}
                          </div>
                       </div>
                    </div>
                 )
               )}
             </ResultCard>

             {!result && !api.loading && (
                <div className="hidden lg:flex card min-h-[360px] items-center justify-center border-2 border-dashed border-gray-200 bg-transparent text-center px-8">
                   <p className="font-semibold text-soil-light opacity-60">
                      Upload a photo of an infected leaf to get an instant diagnosis.
                   </p>
                </div>
             )}
          </div>
       </div>
    </div>
  );
}

function CheckIcon({ size = 20, color = 'currentColor' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 20 20" fill="none">
      <path d="M4 10 L8 14 L16 6" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}
