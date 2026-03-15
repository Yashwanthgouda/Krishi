import React, { useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { LanguageProvider } from './context/LanguageContext';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import MobileNav from './components/MobileNav';
import VoiceButton from './components/VoiceButton';
import Dashboard from './pages/Dashboard';
import CropAdvisor from './pages/CropAdvisor';
import FertilizerGuide from './pages/FertilizerGuide';
import WeatherPage from './pages/WeatherPage';
import DiseaseDetector from './pages/DiseaseDetector';
import MarketPrices from './pages/MarketPrices';
import VoiceAssistant from './pages/VoiceAssistant';
import './index.css';

export default function App() {
  const [isSidebarOpen, setSidebarOpen] = useState(false);

  return (
    <LanguageProvider>
      <BrowserRouter>
        <div className="app-container">
          <Sidebar isOpen={isSidebarOpen} onClose={() => setSidebarOpen(false)} />
          <div className="main-content">
            <Header onMenuClick={() => setSidebarOpen(true)} />
            <main className="content-inner">
              <Routes>
                <Route path="/" element={<Dashboard />} />
                <Route path="/crop" element={<CropAdvisor />} />
                <Route path="/fertilizer" element={<FertilizerGuide />} />
                <Route path="/weather" element={<WeatherPage />} />
                <Route path="/disease" element={<DiseaseDetector />} />
                <Route path="/market" element={<MarketPrices />} />
                <Route path="/voice" element={<VoiceAssistant />} />
              </Routes>
            </main>
          </div>
          <MobileNav />
          <VoiceButton />
        </div>
      </BrowserRouter>
    </LanguageProvider>
  );
}
