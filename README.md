# 🌱 Krishi – Advanced Smart Crop Advisory System

> An AI-powered, meticulously designed farming assistant tailored for Indian farmers.  
> **Features:** Crop recommendation · Fertilizer advisory · Real-time Weather · ML Disease Detection · Market Price Forecasts · Multilingual Voice AI

---

## 🗂 Project Architecture

This application represents a full-stack, decoupled architecture optimized for rapid ML predictions and a highly responsive user experience.

```
Krishi/
├── frontend/         # React.js (Vite) + Tailwind + Framer Motion + i18next
├── backend/          # Node.js Express API Server (Caches, Routes, Geolocation)
├── ml-server/        # Python Flask ML Server (Ensemble Models, ARIMA, Auto-Translators)
└── README.md
```

---

## 🚀 How to Run Locally

### Prerequisites
- Node.js 18+ and npm
- Python 3.9+

---

### 1. Start the Flask ML Server
This server handles the heavy lifting: HuggingFace Vision Models, ARIMA time-series, Random Forests, and real-time Natural Language Translation.

```bash
cd ml-server
pip install -r requirements.txt
python app.py
# Runs securely on http://localhost:5001
```

> **Note:** The server loads Deep-Translator and HuggingFace models automatically. Ensure you have an internet connection for translation capabilities.

---

### 2. Start the Node.js API Gateway

```bash
cd backend
npm install
node index.js
# Runs instantly on http://localhost:5000
```

> **Note:** The backend uses Open-Meteo for hyper-local weather. No API/Auth keys are required! It features an in-memory geocoding cache for sub-millisecond city lookups.

---

### 3. Start the React Frontend

```bash
cd frontend
npm install
npm run dev
# Opens beautifully on http://localhost:5173
```

> **Tip:** Open the application in Chrome/Edge for the best Web Speech AI Synthesis experience.

---

## 🧠 Breakthrough Features

| Module | Core Technology | Description |
|--------|-----------|-------------|
| 🌾 **Crop Recommendation** | `Random Forest` (scikit-learn) | Recommends optimal crops based on exact Nitrogen, P, K, pH, temperature, and humidity inputs. |
| 🧪 **Fertilizer Advisory** | Deep ML Rule Engine | Provides precise, localized NPK dosage instructions and irrigation scheduling. |
| 🌤️ **Live Weather** | **Open-Meteo** + Geo-Caching | Current & 7-day hyper-local agricultural weather forecasts with automatic alert synthesis. |
| 🔬 **Disease Engine** | Ensemble **HuggingFace MobileNetV2** | Upload, Drag-and-Drop, or Paste external images! It uses advanced plant-disease ML classification coupled with heuristic color-fallback to diagnose plant health. |
| 📊 **Market Forecasting** | **ARIMA** (statsmodels) + Recharts | Projects local crop prices 6 months into the future using time-series AI logic. |
| 🎙️ **Voice AI Assistant** | **Smart Intent Router** | Speaks to you! Recognizes entities (crop names), silently queries the backend, and verbally reads out farming advice via speech synthesis. |
| 🌍 **Auto-Translation** | `react-i18next` & `deep-translator` | **Native support for English, Hindi, Kannada, and Telugu**. The ML server instantly intercepts English medical/market ML outputs and auto-translates them to your UI language in real time, while reverse-translating any foreign input back into English! |

---

## 🌐 API Interaction Architecture

The Node.js backend (`:5000`) acts as a secure reverse-proxy for the Flask ML Engine (`:5001`).

### Node.js Gateway 
| Endpoint | Functionality |
|----------|-------------|
| `GET /api/weather` | Handles latitude/longitude caching and hits Open-Meteo for live agricultural forecasts. |
| `POST /api/crop`, `/api/fertilizer`, `/api/price` | Forwards clean payloads to the Flask API. |
| `POST /api/disease` | Intercepts Web Drag-and-Drop blobs & Clipboard base64 strings and reliably streams them to Flask. |

### Flask ML Server
| Endpoint | Functionality |
|----------|-------------|
| `POST /predict/disease` | Processes image bytes. Auto-translates disease name, medical symptoms, and treatment action plans based on requested UI language! |
| `POST /predict/price` | Runs ARIMA forecasting. Magically reverse-translates requested foreign crop names into English before passing them to the strict ML system! |

---

## 🧪 Sample Payloads to Test

**Live Market Price (with translation support)**
```json
{ 
  "crop": "మొక్కజొన్న", // Telugu for Maize is instantly understood!
  "district": "Bangalore", 
  "months": 6,
  "lang": "te" 
}
```

**Scientific Crop Recommendation**
```json
{ "N": 90, "P": 42, "K": 43, "pH": 6.5, "temperature": 25, "humidity": 82, "rainfall": 202 }
```