import React from 'react';
import { Link } from 'react-router-dom';
import { useLang } from '../context/LanguageContext';

export default function Dashboard() {
  const { t } = useLang();

  const handleQuickAction = (action) => {
    console.log('Action:', action);
  };

  return (
    <div className="result-panel">
      <header style={{ marginBottom: '2.5rem' }}>
        <h1 className="section-title">Welcome back, Yashwanth 👋</h1>
        <p className="section-subtitle">Here is what's happening on your farm today.</p>
      </header>

      {/* 1. Smart Overview Cards */}
      <div className="grid-cols-4" style={{ marginBottom: '2rem' }}>
        <div className="card stat-card">
          <div className="stat-label">Soil Health Score</div>
          <div className="stat-value">84/100</div>
          <div className="stat-trend up">↑ 4% from last test</div>
        </div>
        <div className="card stat-card">
          <div className="stat-label">Today's Weather</div>
          <div className="stat-value">28°C</div>
          <div className="stat-trend">Partly Cloudy</div>
        </div>
        <div className="card stat-card">
          <div className="stat-label">Price Trend (Rice)</div>
          <div className="stat-value">₹2,150</div>
          <div className="stat-trend up">↑ 2.4% this week</div>
        </div>
        <div className="card stat-card">
          <div className="stat-label">AI Crop Match</div>
          <div className="stat-value">92%</div>
          <div className="stat-trend" style={{ color: 'var(--primary)' }}>Optimal: Rice</div>
        </div>
      </div>

      <div className="grid-cols-2" style={{ marginBottom: '2rem' }}>
        {/* 2. AI Insights Panel */}
        <div className="card" style={{ borderLeft: '4px solid var(--primary)' }}>
          <div className="card-title">
            <span className="card-icon">🤖</span> AI Smart Insights
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div className="card" style={{ background: 'var(--bg)', border: 'none', padding: '1rem' }}>
              <p style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--primary)' }}>💡 Agricultural Tip</p>
              <p style={{ fontSize: '0.875rem', marginTop: '0.25rem' }}>Rain expected in 48 hours — consider delaying scheduled irrigation to save water.</p>
            </div>
            <div className="card" style={{ background: 'var(--bg)', border: 'none', padding: '1rem' }}>
              <p style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--warning)' }}>⚠️ Disease Alert</p>
              <p style={{ fontSize: '0.875rem', marginTop: '0.25rem' }}>High humidity levels detected. Monitor Rice fields for Bacterial Leaf Blight.</p>
            </div>
          </div>
        </div>

        {/* 3. Quick Actions */}
        <div className="card">
          <div className="card-title">
            <span className="card-icon">⚡</span> Quick Actions
          </div>
          <div className="grid-cols-2" style={{ gap: '1rem' }}>
            <Link to="/crop" className="btn btn-primary" style={{ height: '80px', flexDirection: 'column' }}>
              <span>🌾</span> Analyze Soil
            </Link>
            <Link to="/disease" className="btn btn-outline" style={{ height: '80px', flexDirection: 'column' }}>
              <span>🔬</span> Detect Disease
            </Link>
            <Link to="/weather" className="btn btn-outline" style={{ height: '80px', flexDirection: 'column' }}>
              <span>🌤️</span> Check Weather
            </Link>
            <Link to="/market" className="btn btn-outline" style={{ height: '80px', flexDirection: 'column' }}>
              <span>📊</span> Market Prices
            </Link>
          </div>
        </div>
      </div>

      {/* Recent Activity or Chart Placeholder */}
      <div className="card" style={{ minHeight: '300px' }}>
        <div className="card-title">
          <span className="card-icon">📈</span> Your Farm Analytics
        </div>
        <div style={{ height: '200px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bg)', borderRadius: 'var(--radius-md)', color: 'var(--text-muted)', fontSize: '0.875rem' }}>
          Interactive analytics chart rendering...
        </div>
      </div>
    </div>
  );
}
