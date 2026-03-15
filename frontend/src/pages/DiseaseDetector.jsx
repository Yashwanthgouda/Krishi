import React, { useState, useRef } from 'react';
import { useDropzone } from 'react-dropzone';
import { detectDisease } from '../services/api';
import { useLang } from '../context/LanguageContext';

export default function DiseaseDetector() {
  const { t } = useLang();
  const [preview, setPreview] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const videoRef = useRef(null);
  const [camActive, setCamActive] = useState(false);

  const processFile = (file) => {
    if (!file) return;
    setImageFile(file);
    const url = URL.createObjectURL(file);
    setPreview(url);
    setResult(null); setError('');
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
      setError('Camera access denied. Please check site permissions.');
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

  const analyze = async () => {
    if (!imageFile) return;
    setLoading(true); setError('');
    try {
      const data = await detectDisease(imageFile);
      if (data.success) {
        setResult(data);
        window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
      } else {
        setError(data.error || 'Analysis failed');
      }
    } catch {
      setError('Cannot reach server. Please try again later.');
    } finally { setLoading(false); }
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
        <p className="section-subtitle">Identify plant health issues instantly using our computer vision models.</p>
      </header>

      {/* Main Upload / Camera View */}
      <div className="grid-cols-2" style={{ marginBottom: '2rem' }}>
        <div className="card" style={{ display: 'flex', flexDirection: 'column' }}>
          <div className="card-title">
            <span className="card-icon">📸</span> Capture & Analyze
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
                    ✕ Remove
                  </button>
                  {loading && (
                    <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.5)', borderRadius: 'var(--radius-lg)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', flexDirection: 'column', gap: '1rem' }}>
                      <div className="spinner" style={{ width: 40, height: 40, borderWidth: 4 }} />
                      <p style={{ fontWeight: 700 }}>AI Scanning Leaf Architecture...</p>
                    </div>
                  )}
                </div>
              ) : (
                <div className={`upload-zone${isDragActive ? ' drag-active' : ''}`} {...getRootProps()} style={{ padding: '4rem 2rem' }}>
                  <input {...getInputProps()} />
                  <div className="upload-zone-icon" style={{ fontSize: '4rem' }}>🍃</div>
                  <h3 style={{ marginBottom: '0.5rem' }}>Drop leaf photo here</h3>
                  <p className="upload-zone-sub">or click to browse from gallery</p>
                </div>
              )}

              <div style={{ display: 'flex', gap: '1rem', marginTop: '1.5rem' }}>
                <button className="btn btn-outline" onClick={openCamera} style={{ flex: 1 }}>📷 Camera</button>
                <button 
                  className="btn btn-primary" 
                  onClick={analyze} 
                  disabled={!imageFile || loading}
                  style={{ flex: 1.5 }}
                >
                  {loading ? 'Analyzing...' : 'Diagnose Disease'}
                </button>
              </div>
            </>
          )}
        </div>

        {/* Info / FAQ Card */}
        <div className="card">
          <div className="card-title">
            <span className="card-icon">💡</span> How it works
          </div>
          <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', lineHeight: 1.8 }}>
            Our deep learning models are trained on over 50,000 images of infected crops. 
            For best results:
          </p>
          <ul style={{ paddingLeft: '1.5rem', marginTop: '1rem', fontSize: '0.875rem', color: 'var(--text-secondary)', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            <li>Ensure the leaf is well-lit and in focus.</li>
            <li>Place the leaf against a neutral background.</li>
            <li>Focus on the infected part of the plant.</li>
          </ul>
        </div>
      </div>

      {error && <div className="card" style={{ borderLeft: '4px solid var(--error)', background: '#FEF2F2', color: 'var(--error)', marginBottom: '2rem', padding: '1rem' }}>⚠️ {error}</div>}

      {/* Results Display */}
      {result && (
        <div className="result-panel">
          {result.isHealthy ? (
            <div className="card" style={{ textAlign: 'center', padding: '3rem', borderLeft: '8px solid var(--success)' }}>
              <div style={{ fontSize: '4rem' }}>🌿</div>
              <h2 style={{ fontSize: '2rem', margin: '1rem 0', color: 'var(--success)' }}>Target looks healthy!</h2>
              <p style={{ color: 'var(--text-secondary)' }}>No symptoms of common diseases detected. Keep up the good work!</p>
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
                      {result.disease.severity.toUpperCase()} SEVERITY
                    </span>
                  </div>
                </header>

                <div className="disease-section">
                  <div className="disease-section-label">AI Confidence</div>
                  <div className="progress-bar-track" style={{ marginBottom: '1.5rem' }}>
                    <div className="progress-bar-fill" style={{ width: `${result.disease.confidence}%` }} />
                  </div>
                  <div className="disease-section-label">Primary Symptoms</div>
                  <p className="disease-section-text">{result.disease.symptoms}</p>
                </div>
              </div>

              <div className="card" style={{ background: 'var(--primary-light)', borderColor: 'var(--primary)' }}>
                <div className="card-title" style={{ color: 'var(--primary)' }}>
                  <span className="card-icon" style={{ background: 'white' }}>💊</span> Treatment Plan
                </div>
                <p style={{ fontSize: '1rem', lineHeight: 1.8, color: 'var(--text-main)' }}>{result.disease.treatment}</p>
                
                <div style={{ marginTop: '2rem' }}>
                  <div className="disease-section-label">Affected Crops</div>
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
