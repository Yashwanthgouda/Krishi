# 🌱 Krishi – Smart Crop Advisory System

> AI-powered farming assistant for Indian small and marginal farmers.
> Crop recommendation · Fertilizer advisory · Weather forecasts · Disease detection · Market prices · Multilingual voice interface

---

## 🗂 Project Structure

```
Krishi/
├── frontend/         # React.js web app (Vite)
├── backend/          # Node.js Express API server
├── ml-server/        # Python Flask ML model server
└── README.md
```

---

## 🚀 How to Run Locally

### Prerequisites
- Node.js 18+ and npm
- Python 3.9+
- (Optional) OpenWeatherMap free API key from https://openweathermap.org/api

---

### 1. Start the Flask ML Server

```bash
cd ml-server
pip install -r requirements.txt
python app.py
# Runs on http://localhost:5001
```

> 📝 First run will train the crop recommendation model (~10 seconds)

---

### 2. Configure Backend (Optional – for live weather)

Edit `backend/.env`:
```
OPENWEATHERMAP_API_KEY=your_key_here
```
> Without this, the app uses realistic mock weather data automatically.

### 3. Start the Node.js Backend

```bash
cd backend
npm install
node index.js
# Runs on http://localhost:5000
```

---

### 4. Start the React Frontend

```bash
cd frontend
npm install
npm run dev
# Opens http://localhost:5173
```

Open **http://localhost:5173** in Chrome for full voice support.

---

## 🧠 Features

| Module | Technology | Description |
|--------|-----------|-------------|
| 🌾 Crop Recommendation | Random Forest (scikit-learn) | Recommends best crops from N,P,K,pH,temp,humidity,rainfall |
| 🧪 Fertilizer Advisory | Rule-based + NPK deficit | Precise fertilizer dosage + irrigation tips |
| 🌤️ Weather Forecast | OpenWeatherMap API | Current + 7-day forecast with farming alerts |
| 🔬 Disease Detection | Color analysis CV | Upload leaf photo → disease name + treatment |
| 📊 Market Prices | ARIMA (statsmodels) | 6-month price forecast with Recharts graph |
| 🎙️ Voice Interface | Web Speech API | Voice navigation in EN/HI/KN/TE |
| 🌍 Multilingual | Built-in i18n | English · Hindi · Kannada · Telugu |

---

## 🌐 API Endpoints

### Node.js (`:5000`)
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/health` | Health check |
| POST | `/api/crop` | Crop recommendation |
| POST | `/api/fertilizer` | Fertilizer advice |
| POST | `/api/disease` | Disease detection (multipart) |
| POST | `/api/price` | Market price forecast |
| GET | `/api/weather?city=Bangalore` | Weather data |
| GET | `/api/districts` | List of districts |

### Flask ML Server (`:5001`)
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/predict/crop` | Random Forest crop prediction |
| POST | `/predict/fertilizer` | Fertilizer rule engine |
| POST | `/predict/disease` | Image disease analysis |
| POST | `/predict/price` | ARIMA price forecast |

---

## 🧪 Test Sample Data

**Crop Recommendation (predicts: Rice)**
```json
{ "N": 90, "P": 42, "K": 43, "pH": 6.5, "temperature": 25, "humidity": 82, "rainfall": 202 }
```

**Fertilizer Advisory**
```json
{ "crop": "rice", "N": 40, "P": 20, "K": 20, "area": 1.5 }
```

**Market Price**
```json
{ "crop": "wheat", "district": "Bangalore", "months": 6 }
```

---

## ☁️ Cloud Deployment

### Free Tier Options
| Service | Use For |
|---------|---------|
| Render.com | Node.js backend |
| Railway.app | Flask ML server |
| Vercel / Netlify | React frontend |
| MongoDB Atlas | Database (if extended) |

### Docker (optional)
```bash
# Each service has its own Dockerfile (add as needed)
docker build -t krishi-ml ./ml-server
docker build -t krishi-backend ./backend
docker build -t krishi-frontend ./frontend
```

---

## 📜 License
MIT – Free to use, modify and distribute for agricultural purposes.
