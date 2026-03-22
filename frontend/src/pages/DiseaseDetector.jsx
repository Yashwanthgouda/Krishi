import React, { useState, useRef } from 'react';
import { useDropzone } from 'react-dropzone';
import { detectDisease } from '../services/api';
import { useLang } from '../context/LanguageContext';
import { useEnhancedApi } from '../hooks/useEnhancedApi';

export default function DiseaseDetector() {
  const { t } = useLang();
  const [preview, setPreview] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [result, setResult] = useState(null);
  const { execute, loading, error, isWakingUp, countdown } = useEnhancedApi(detectDisease);

  const analyze = async () => {
    if (!imageFile) return;
    setResult(null);
    const data = await execute(imageFile);
    if (data && data.success) {
      setResult(data);
      setTimeout(() => {
        window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
      }, 100);
    }
  };

  const videoRef = useRef(null);
  const [camActive, setCamActive] = useState(false);

  const processFile = (file) => {
    if (!file) return;
    setImageFile(file);
    const url = URL.createObjectURL(file);
    setPreview(url);
    setResult(null); 
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: { 'image/*': [] },
    onDrop: (files) => processFile(files[0]),
    maxFiles: 1,
  });

  const openCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } });
      setCamActive(true);
      setTimeout(() => {
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          videoRef.current.play();
        }
      }, 100);
    } catch {
      // Manual error handling for cam
    }
  };

  const capturePhoto = () => {
    const canvas = document.createElement('canvas');
    canvas.width = videoRef.current.videoWidth;
    canvas.height = videoRef.current.videoHeight;
    canvas.getContext('2d').drawImage(videoRef.current, 0, 0);
    canvas.toBlob((blob) => {
      processFile(new File([blob], 'capture.jpg', { type: 'image/jpeg' }));
      videoRef.current.srcObject?.getTracks().forEach((t) => t.stop());
      setCamActive(false);
    });
  };

  const getSeverityStyle = (s) => ({
    High: { color: '#EF4444', bg: '#FEF2F2', border: '#FCA5A5' },
    Medium: { color: '#F59E0B', bg: '#FFFBEB', border: '#FCD34D' },
    Low: { color: '#10B981', bg: '#ECFDF5', border: '#A7F3D0' }
  }[s] || { color: 'var(--primary)', bg: 'var(--primary-light)', border: 'var(--border)' });

  return (
    <div className="result-panel">
      <header style={{ marginBottom: '2.5rem' }}>
        <h1 className="section-title">🔬 {t('diseaseDetector')}</h1>
        <p className="section-subtitle">{t('detectorSubtitle')}</p>
      </header>

      {/* Main Upload / Camera View */}
      <div className="grid-cols-2" style={{ marginBottom: '2rem' }}>
        <div className="card" style={{ display: 'flex', flexDirection: 'column' }}>
          <div className="card-title">
            <span className="card-icon">📸</span> {t('captureAnalyze')}
          </div>
          
          {camActive ? (
            <div style={{ position: 'relative', borderRadius: 'var(--radius-md)', overflow: 'hidden', background: '#000' }}>
              <video ref={videoRef} style={{ width: '100%', display: 'block' }} playsInline />
              <div style={{ position: 'absolute', bottom: '1rem', left: 0, right: 0, display: 'flex', justifyContent: 'center', gap: '1rem' }}>
                <button className="btn btn-primary" onClick={capturePhoto} style={{ width: 'auto' }}>Capture Photo</button>
                <button className="btn btn-outline" onClick={() => { videoRef.current?.srcObject?.getTracks().forEach(t => t.stop()); setCamActive(false); }} style={{ width: 'auto', background: 'white' }}>Cancel</button>
              </div>
            </div>
          ) : (
            <>
              {preview ? (
                <div style={{ position: 'relative' }}>
                  <img src={preview} alt="Leaf preview" className="preview-img" style={{ height: '300px' }} />
                  <button 
                    className="btn btn-outline" 
                    style={{ position: 'absolute', top: '1rem', right: '1rem', width: 'auto', background: 'white', padding: '0.5rem' }}
                    onClick={() => { setPreview(null); setImageFile(null); setResult(null); }}
                  >
                    ✕ {t('remove')}
                  </button>
                  {loading && (
                    <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.5)', borderRadius: 'var(--radius-lg)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', flexDirection: 'column', gap: '1rem' }}>
                      <div className="spinner" style={{ width: 40, height: 40, borderWidth: 4 }} />
                      <p style={{ fontWeight: 700 }}>{t('analyzing')}</p>
                    </div>
                  )}
                </div>
              ) : (
                <div className={`upload-zone${isDragActive ? ' drag-active' : ''}`} {...getRootProps()} style={{ padding: '4rem 2rem' }}>
                  <input {...getInputProps()} />
                  <div className="upload-zone-icon" style={{ fontSize: '4rem' }}>🍃</div>
                  <h3 style={{ marginBottom: '0.5rem' }}>{t('uploadLeaf')}</h3>
                  <p className="upload-zone-sub">{t('browseGallery')}</p>
                </div>
              )}

              <div style={{ display: 'flex', gap: '1rem', marginTop: '1.5rem' }}>
                <button className="btn btn-outline" onClick={openCamera} style={{ flex: 1 }}>📷 {t('camera')}</button>
                <button 
                  className="btn btn-primary" 
                  onClick={analyze} 
                  disabled={!imageFile || loading}
                  style={{ flex: 1.5 }}
                >
                  {loading ? t('analyzing') : t('diagnose')}
                </button>
              </div>
            </>
          )}
        </div>

        {/* Info / FAQ Card */}
        <div className="card">
          <div className="card-title">
            <span className="card-icon">💡</span> {t('howItWorks')}
          </div>
          <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', lineHeight: 1.8 }}>
            {t('howItWorksText')}
          </p>
          <ul style={{ paddingLeft: '1.5rem', marginTop: '1rem', fontSize: '0.875rem', color: 'var(--text-secondary)', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            <li>{t('tip1')}</li>
            <li>{t('tip2')}</li>
            <li>{t('tip3')}</li>
          </ul>
        </div>
      </div>

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

      {/* Results Display */}
      {result && (
        <div className="result-panel">
          {!result.detected ? (
            <div className="card" style={{ borderLeft: '4px solid var(--error)', background: '#FEF2F2', padding: '1.5rem' }}>
              <p style={{ color: 'var(--error)', fontWeight: 700, margin: 0 }}>⚠️ {result.error}</p>
              <p style={{ fontSize: '0.875rem', marginTop: '0.5rem', color: 'var(--text-secondary)' }}>
                Tips: Ensure the plant leaf is centered, well-lit, and occupies most of the frame.
              </p>
            </div>
          ) : result.isHealthy ? (
            <div className="card" style={{ textAlign: 'center', padding: '3rem', borderLeft: '8px solid var(--success)' }}>
              <div style={{ fontSize: '4rem' }}>🌿</div>
              <h2 style={{ fontSize: '2rem', margin: '1rem 0', color: 'var(--success)' }}>{t('healthyTarget')}</h2>
              <p style={{ color: 'var(--text-secondary)' }}>{t('noSymptoms')}</p>
            </div>
          ) : (
            <div className="grid-cols-2">
              <div className="card" style={{ borderLeft: `6px solid ${getSeverityStyle(result.disease.severity).color}` }}>
                <header style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
                  <span style={{ fontSize: '3rem' }}>{result.disease.icon}</span>
                  <div>
                    <h2 style={{ fontSize: '1.75rem' }}>{result.disease.name}</h2>
                    <span style={{ 
                      fontSize: '0.75rem', 
                      fontWeight: 800, 
                      padding: '0.25rem 0.75rem', 
                      borderRadius: '20px',
                      background: getSeverityStyle(result.disease.severity).bg,
                      color: getSeverityStyle(result.disease.severity).color,
                      border: `1px solid ${getSeverityStyle(result.disease.severity).border}`
                    }}>
                      {result.disease.severity.toUpperCase()} {t('severityLabel')}
                    </span>
                  </div>
                </header>

                <div className="disease-section">
                  <div className="disease-section-label">{t('aiConfidence')}</div>
                  <div className="progress-bar-track" style={{ marginBottom: '1.5rem' }}>
                    <div className="progress-bar-fill" style={{ width: `${result.disease.confidence}%` }} />
                  </div>
                  <div className="disease-section-label">{t('primarySymptoms')}</div>
                  <p className="disease-section-text">{result.disease.symptoms}</p>
                </div>
              </div>

              <div className="card" style={{ background: 'var(--primary-light)', borderColor: 'var(--primary)' }}>
                <div className="card-title" style={{ color: 'var(--primary)' }}>
                  <span className="card-icon" style={{ background: 'white' }}>💊</span> {t('treatmentPlan')}
                </div>
                <p style={{ fontSize: '1rem', lineHeight: 1.8, color: 'var(--text-main)' }}>{result.disease.treatment}</p>
                
                <div style={{ marginTop: '2rem' }}>
                  <div className="disease-section-label">{t('affectedCrops')}</div>
                  <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginTop: '0.5rem' }}>
                    {result.disease.crops?.map(c => <span key={c} className="tag" style={{ background: 'white', border: '1px solid var(--border)', color: 'var(--text-main)' }}>{c}</span>)}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
