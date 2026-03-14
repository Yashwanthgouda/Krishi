import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { LanguageProvider } from './context/LanguageContext';
import Navbar from './components/Navbar';
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
  return (
    <LanguageProvider>
      <BrowserRouter>
        <div className="app-container">
          <Navbar />
          <div className="main-layout">
            <main className="page">
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
          <VoiceButton />
        </div>
      </BrowserRouter>
    </LanguageProvider>
  );
}
