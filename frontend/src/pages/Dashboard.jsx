export default function Dashboard() {
  const { t } = useLang();

  return (
    <div className="result-panel">
      <header style={{ marginBottom: '2.5rem' }}>
        <h1 className="section-title">{t('welcome')} 👋</h1>
        <p className="section-subtitle">{t('farmStatus')}</p>
      </header>

      {/* 1. Smart Overview Cards */}
      <div className="grid-cols-4" style={{ marginBottom: '2rem' }}>
        <div className="card stat-card">
          <div className="stat-label">{t('soilHealth')}</div>
          <div className="stat-value">84/100</div>
          <div className="stat-trend up">{t('soilTrend')}</div>
        </div>
        <div className="card stat-card">
          <div className="stat-label">{t('todayWeather')}</div>
          <div className="stat-value">28°C</div>
          <div className="stat-trend">Partly Cloudy</div>
        </div>
        <div className="card stat-card">
          <div className="stat-label">{t('priceTrendRice')}</div>
          <div className="stat-value">₹2,150</div>
          <div className="stat-trend up">{t('priceTrendUp')}</div>
        </div>
        <div className="card stat-card">
          <div className="stat-label">{t('aiCropMatch')}</div>
          <div className="stat-value">92%</div>
          <div className="stat-trend" style={{ color: 'var(--primary)' }}>{t('optimalRice')}</div>
        </div>
      </div>

      <div className="grid-cols-2" style={{ marginBottom: '2rem' }}>
        {/* 2. AI Insights Panel */}
        <div className="card" style={{ borderLeft: '4px solid var(--primary)' }}>
          <div className="card-title">
            <span className="card-icon">🤖</span> {t('aiInsights')}
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div className="card" style={{ background: 'var(--bg)', border: 'none', padding: '1rem' }}>
              <p style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--primary)' }}>💡 {t('agriTip')}</p>
              <p style={{ fontSize: '0.875rem', marginTop: '0.25rem' }}>{t('rainTip')}</p>
            </div>
            <div className="card" style={{ background: 'var(--bg)', border: 'none', padding: '1rem' }}>
              <p style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--warning)' }}>⚠️ {t('disAlert')}</p>
              <p style={{ fontSize: '0.875rem', marginTop: '0.25rem' }}>{t('humidityAlert')}</p>
            </div>
          </div>
        </div>

        {/* 3. Quick Actions */}
        <div className="card">
          <div className="card-title">
            <span className="card-icon">⚡</span> {t('quickActions')}
          </div>
          <div className="grid-cols-2" style={{ gap: '1rem' }}>
            <Link to="/crop" className="btn btn-primary" style={{ height: '80px', flexDirection: 'column' }}>
              <span>🌾</span> {t('analyzeSoil')}
            </Link>
            <Link to="/disease" className="btn btn-outline" style={{ height: '80px', flexDirection: 'column' }}>
              <span>🔬</span> {t('detectDisease')}
            </Link>
            <Link to="/weather" className="btn btn-outline" style={{ height: '80px', flexDirection: 'column' }}>
              <span>🌤️</span> {t('weather')}
            </Link>
            <Link to="/market" className="btn btn-outline" style={{ height: '80px', flexDirection: 'column' }}>
              <span>📊</span> {t('marketPrices')}
            </Link>
          </div>
        </div>
      </div>

      {/* Recent Activity or Chart Placeholder */}
      <div className="card" style={{ minHeight: '300px' }}>
        <div className="card-title">
          <span className="card-icon">📈</span> {t('farmAnalytics')}
        </div>
        <div style={{ height: '200px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bg)', borderRadius: 'var(--radius-md)', color: 'var(--text-muted)', fontSize: '0.875rem' }}>
          {t('chartLoading')}
        </div>
      </div>
    </div>
  );
}
