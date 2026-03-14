import React, { useState, useRef, useCallback } from 'react';
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
      setError('Camera access denied.');
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
      if (data.success) setResult(data);
      else setError(data.error || 'Analysis failed');
    } catch {
      setError('Cannot reach server. Make sure Node.js and Flask servers are running.');
    } finally { setLoading(false); }
  };

  const SEVERITY_LABEL = { High: '🔴 High', Medium: '🟡 Medium', Low: '🟢 Low' };

  return (
    <div className="page">
      <h1 className="section-title">🔬 {t('diseaseDetector')}</h1>
      <p className="section-subtitle">Upload a leaf photo or take a picture to identify diseases and get treatment advice.</p>

      {/* Camera */}
      {camActive && (
        <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
          <video ref={videoRef} style={{ width: '100%', display: 'block', borderRadius: 'var(--radius-lg)' }} playsInline />
          <div style={{ display: 'flex', gap: 10, padding: 12 }}>
            <button className="btn btn-primary" onClick={capturePhoto} style={{ flex: 1 }}>📷 Capture</button>
            <button className="btn btn-outline" onClick={() => { videoRef.current?.srcObject?.getTracks().forEach(t => t.stop()); setCamActive(false); }} style={{ flex: 1 }}>Cancel</button>
          </div>
        </div>
      )}

      {!camActive && (
        <>
          {/* Upload Zone */}
          {!preview ? (
            <div className={`upload-zone${isDragActive ? ' drag-active' : ''}`} {...getRootProps()}>
              <input {...getInputProps()} id="leaf-upload" />
              <div className="upload-zone-icon">🍃</div>
              <div className="upload-zone-text">{t('dragDrop')}</div>
              <div className="upload-zone-sub">Supports JPG, PNG, WebP up to 10MB</div>
              <button type="button" className="btn btn-outline" style={{ marginTop: 16, width: 'auto', padding: '10px 24px' }}>Browse Files</button>
            </div>
          ) : (
            <div style={{ marginBottom: 12 }}>
              <img src={preview} alt="Leaf preview" className="preview-img" />
              <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
                <button className="btn btn-outline" style={{ flex: 1 }} onClick={() => { setPreview(null); setImageFile(null); setResult(null); }}>Remove</button>
              </div>
            </div>
          )}

          <div style={{ display: 'flex', gap: 8, marginBottom: 12 }}>
            <button type="button" className="btn btn-outline" style={{ flex: 1 }} onClick={openCamera}>📷 Camera</button>
            <label htmlFor="leaf-upload-btn" className="btn btn-outline" style={{ flex: 1, display: 'flex', alignItems:'center', justifyContent:'center', cursor:'pointer' }}>
              📁 Gallery
              <input id="leaf-upload-btn" type="file" accept="image/*" style={{ display: 'none' }} onChange={(e) => processFile(e.target.files[0])} />
            </label>
          </div>

          {imageFile && (
            <button className="btn btn-primary" onClick={analyze} disabled={loading}>
              {loading ? <><span className="spinner" style={{ width: 18, height: 18, borderWidth: 3 }} /> {t('loading')}</> : `🔬 ${t('analyzeDisease')}`}
            </button>
          )}
        </>
      )}

      {error && <div className="alert-banner medium" style={{ marginTop: 12 }}><span>⚠️</span> {error}</div>}

      {result && (
        <>
          {result.isHealthy && !result.disease ? (
            <div className="healthy-banner" style={{ marginTop: 16 }}>
              <div className="healthy-icon">🌿</div>
              <div className="healthy-title">{t('healthy')}</div>
              <div className="healthy-text">{t('healthyMsg')}</div>
            </div>
          ) : (
            <>
              <div className="disease-result" style={{ marginTop: 16 }}>
                <div className={`disease-header severity-${result.disease?.severity || 'Medium'}`}>
                  <div style={{ fontSize: 40 }}>{result.disease?.icon || '🍃'}</div>
                  <div className="disease-name">{result.disease?.name}</div>
                  <div className="disease-crops">Affects: {result.disease?.crops?.join(', ')}</div>
                  <div style={{ fontSize: 13, marginTop: 6, opacity: 0.85 }}>
                    Severity: {SEVERITY_LABEL[result.disease?.severity]} · Confidence: {result.disease?.confidence}%
                  </div>
                </div>
                <div className="disease-body">
                  <div className="disease-section">
                    <div className="disease-section-label">🔍 Symptoms</div>
                    <div className="disease-section-text">{result.disease?.symptoms}</div>
                  </div>
                  <div className="disease-section">
                    <div className="disease-section-label">💊 Treatment</div>
                    <div className="disease-section-text">{result.disease?.treatment}</div>
                  </div>
                </div>
              </div>

              {result.alternatives?.length > 0 && (
                <div className="card">
                  <div className="card-title"><span className="card-icon">🔍</span> {t('alternate')}</div>
                  {result.alternatives.map((alt) => (
                    <div key={alt.name} style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid var(--border)', fontSize: 14 }}>
                      <span>{alt.name}</span>
                      <span style={{ color: 'var(--text-secondary)' }}>{alt.confidence}%</span>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}
        </>
      )}
    </div>
  );
}
