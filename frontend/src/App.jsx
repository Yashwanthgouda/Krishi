import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Layout } from './components/layout/Layout';
import { Home } from './pages/Home';
import { CropRecommend } from './pages/CropRecommend';
import { Fertilizer } from './pages/Fertilizer';
import { Weather } from './pages/Weather';
import { DiseaseDetect } from './pages/DiseaseDetect';
import { MandiPrices } from './pages/MandiPrices';

function App() {
  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/crop" element={<CropRecommend />} />
          <Route path="/fertilizer" element={<Fertilizer />} />
          <Route path="/weather" element={<Weather />} />
          <Route path="/disease" element={<DiseaseDetect />} />
          <Route path="/prices" element={<MandiPrices />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  );
}

export default App;
