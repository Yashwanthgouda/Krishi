/**
 * Krishi Smart Crop Advisory System
 * Node.js Express API Backend
 */
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const axios = require('axios');
const multer = require('multer');
const FormData = require('form-data');

const app = express();
const PORT = process.env.PORT || 5000;
let FLASK_URL = process.env.FLASK_URL || 'http://localhost:5001';
// Trigger redeploy 2026-03-22 (v8) - Ensemble Vision Engine (Target 98% Accuracy)
console.log('Using FLASK_URL:', FLASK_URL);

// Remove trailing slash if present to avoid double slashes in routes
if (FLASK_URL.endsWith('/')) {
  FLASK_URL = FLASK_URL.slice(0, -1);
}

const OWM_KEY = process.env.OPENWEATHERMAP_API_KEY || '';

// Middleware
// Restrict CORS to the Vercel frontend in production; allow all in dev
const allowedOrigins = process.env.FRONTEND_URL
  ? [process.env.FRONTEND_URL]
  : true; // allow all in local dev
app.use(cors({ origin: allowedOrigins, credentials: true }));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

const storage = multer.memoryStorage();
const upload = multer({ storage, limits: { fileSize: 10 * 1024 * 1024 } });

// ─────────────────────────────────────────────────────────────────────────────
// Health Check
// ─────────────────────────────────────────────────────────────────────────────
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', service: 'Krishi API Backend', timestamp: new Date().toISOString() });
});

app.get('/api/ml-health', async (req, res) => {
  try {
    const response = await axios.get(`${FLASK_URL}/health`, { timeout: 10000 });
    res.json({ 
      success: true, 
      status: 'awake', 
      mlService: response.data 
    });
  } catch (err) {
    const isColdStart = err.code === 'ECONNABORTED' || err.message.includes('timeout') || err.response?.status === 502;
    const isDown = err.code === 'ECONNREFUSED';
    res.status(503).json({ 
      success: false, 
      status: isColdStart ? 'waking_up' : (isDown ? 'down' : 'error'),
      error: isDown 
        ? `ML Server is not running at ${FLASK_URL}. Please start it using 'python app.py' in the ml-server directory.`
        : err.message
    });
  }
});

app.get('/api/system-info', (req, res) => {
  res.json({ 
    flaskUrl: FLASK_URL,
    usingDefaultFlask: FLASK_URL === 'http://localhost:5001',
    port: PORT,
    nodeVersion: process.version
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// Crop Recommendation
// ─────────────────────────────────────────────────────────────────────────────
app.post('/api/crop', async (req, res) => {
  try {
    const response = await axios.post(`${FLASK_URL}/predict/crop`, req.body, {
      timeout: 60000,
    });
    res.json(response.data);
  } catch (err) {
    console.error('Crop API error:', err.message);
    const flaskError = err.response?.data?.error;
    const msg = flaskError 
      ? `ML Server: ${flaskError}`
      : (err.code === 'ECONNABORTED' || err.message.includes('timeout') || err.response?.status === 502)
        ? 'Flask ML server is waking up (Render cold start). Please try again in 30-60 seconds.'
        : `Backend Error: Cannot reach Flask server at ${FLASK_URL}. Details: ${err.message}`;
    res.status(500).json({ success: false, error: msg });
  }
});

// ─────────────────────────────────────────────────────────────────────────────
// Fertilizer Advisory
// ─────────────────────────────────────────────────────────────────────────────
app.post('/api/fertilizer', async (req, res) => {
  try {
    const response = await axios.post(`${FLASK_URL}/predict/fertilizer`, req.body, {
      timeout: 60000,
    });
    res.json(response.data);
  } catch (err) {
    console.error('Fertilizer API error:', err.message);
    const flaskError = err.response?.data?.error;
    const msg = flaskError 
      ? `ML Server: ${flaskError}`
      : (err.code === 'ECONNABORTED' || err.message.includes('timeout') || err.response?.status === 502)
        ? 'Flask ML server is waking up (Render cold start). Please try again in 30-60 seconds.'
        : `Backend Error: Cannot reach Flask server at ${FLASK_URL}. Details: ${err.message}`;
    res.status(500).json({ success: false, error: msg });
  }
});

// ─────────────────────────────────────────────────────────────────────────────
// Disease Detection (file upload)
// ─────────────────────────────────────────────────────────────────────────────
app.post('/api/disease', upload.single('image'), async (req, res) => {
  try {
    let response;
    if (req.file) {
      const formData = new FormData();
      formData.append('image', req.file.buffer, {
        filename: req.file.originalname || 'leaf.jpg',
        contentType: req.file.mimetype || 'image/jpeg',
      });
      if (req.body.lang) formData.append('lang', req.body.lang);
      response = await axios.post(`${FLASK_URL}/predict/disease`, formData, {
        headers: formData.getHeaders(),
        timeout: 60000,
      });
    } else if (req.body.imageBase64) {
      response = await axios.post(
        `${FLASK_URL}/predict/disease`,
        { imageBase64: req.body.imageBase64, lang: req.body.lang },
        { timeout: 60000 }
      );
    } else {
      return res.status(400).json({ success: false, error: 'No image provided' });
    }
    res.json(response.data);
  } catch (err) {
    console.error('Disease API error:', err.message);
    const flaskError = err.response?.data?.error;
    const msg = flaskError 
      ? `ML Server: ${flaskError}`
      : (err.code === 'ECONNABORTED' || err.message.includes('timeout') || err.response?.status === 502)
        ? 'Flask ML server is waking up (Render cold start). Please try again in 30-60 seconds.'
        : `Backend Error: Cannot reach Flask server at ${FLASK_URL}. Details: ${err.message}`;
    res.status(500).json({ success: false, error: msg });
  }
});

// ─────────────────────────────────────────────────────────────────────────────
// Market Price Forecast
// ─────────────────────────────────────────────────────────────────────────────
app.post('/api/price', async (req, res) => {
  try {
    const response = await axios.post(`${FLASK_URL}/predict/price`, req.body, {
      timeout: 60000,
    });
    res.json(response.data);
  } catch (err) {
    console.error('Price API error:', err.message);
    const flaskError = err.response?.data?.error;
    const msg = flaskError 
      ? `ML Server: ${flaskError}`
      : (err.code === 'ECONNABORTED' || err.message.includes('timeout') || err.response?.status === 502)
        ? 'Flask ML server is waking up (Render cold start). Please try again in 30-60 seconds.'
        : `Backend Error: Cannot reach Flask server at ${FLASK_URL}. Details: ${err.message}`;
    res.status(500).json({ success: false, error: msg });
  }
});

// ─────────────────────────────────────────────────────────────────────────────
// Weather (OpenWeatherMap)
// ─────────────────────────────────────────────────────────────────────────────
app.get('/api/weather', async (req, res) => {
  try {
    let lat = req.query.lat;
    let lon = req.query.lon;
    let city = req.query.city || 'Bangalore';

    // 1. If lat/lon not provided, use Geocoding API to get them
    if (!lat || !lon) {
      if (global.GEO_CACHE && global.GEO_CACHE[city]) {
         lat = global.GEO_CACHE[city].lat;
         lon = global.GEO_CACHE[city].lon;
         city = global.GEO_CACHE[city].city;
      } else {
         const geoRes = await axios.get(`https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(city)}&count=1`, { timeout: 8000 });
         if (geoRes.data.results && geoRes.data.results.length > 0) {
           lat = geoRes.data.results[0].latitude;
           lon = geoRes.data.results[0].longitude;
           city = geoRes.data.results[0].name;
           if(!global.GEO_CACHE) global.GEO_CACHE = {};
           global.GEO_CACHE[city] = { lat, lon, city };
         } else {
           // Fallback robustly
           lat = 12.9716; lon = 77.5946; city = 'Bangalore';
         }
      }
    }

    // 2. Fetch from Open-Meteo Free API (Requires NO API key)
    const meteoUrl = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,wind_speed_10m,weather_code&daily=weather_code,temperature_2m_max,temperature_2m_min,precipitation_sum&timezone=auto`;
    const meteoRes = await axios.get(meteoUrl, { timeout: 8000 });
    const d = meteoRes.data;

    // 3. Map WMO Weather Codes to Human Text
    const WMO_CODES = {
      0: { desc: 'Clear sky', icon: '01d' },      1: { desc: 'Mainly clear', icon: '01d' },
      2: { desc: 'Partly cloudy', icon: '02d' },  3: { desc: 'Overcast', icon: '04d' },
      45: { desc: 'Fog', icon: '50d' },           48: { desc: 'Rime fog', icon: '50d' },
      51: { desc: 'Light drizzle', icon: '09d' }, 53: { desc: 'Moderate drizzle', icon: '09d' },
      55: { desc: 'Dense drizzle', icon: '09d' }, 61: { desc: 'Slight rain', icon: '10d' },
      63: { desc: 'Moderate rain', icon: '10d' }, 65: { desc: 'Heavy rain', icon: '10d' },
      71: { desc: 'Slight snow', icon: '13d' },   75: { desc: 'Heavy snow', icon: '13d' },
      80: { desc: 'Showers', icon: '09d'},        82: { desc: 'Violent showers', icon: '09d' },
      95: { desc: 'Thunderstorm', icon: '11d' },  99: { desc: 'Severe Thunderstorm', icon: '11d' },
    };

    const getWMO = (code) => WMO_CODES[code] || { desc: 'Clear', icon: '01d' };
    const curWMO = getWMO(d.current.weather_code);

    // 4. Construct Forecast Payload
    const forecast = d.daily.time.slice(0, 7).map((date, i) => ({
      date: date,
      maxTemp: Math.round(d.daily.temperature_2m_max[i]),
      minTemp: Math.round(d.daily.temperature_2m_min[i]),
      description: getWMO(d.daily.weather_code[i]).desc,
      icon: getWMO(d.daily.weather_code[i]).icon,
      humidity: Math.round(d.current.relative_humidity_2m),
      windSpeed: Math.round(d.current.wind_speed_10m),
      rain: d.daily.precipitation_sum[i] || 0
    }));

    // 5. Adapting existing alerts logic structure
    const mockCurrentForAlerts = { 
      main: { temp: d.current.temperature_2m, humidity: d.current.relative_humidity_2m },
      wind: { speed: d.current.wind_speed_10m / 3.6 } // existing generator multiplies by 3.6
    };
    const alerts = generateWeatherAlerts(mockCurrentForAlerts);

    res.json({
      success: true,
      city: city,
      country: 'IN',
      current: {
        temp: Math.round(d.current.temperature_2m),
        feelsLike: Math.round(d.current.temperature_2m),
        humidity: Math.round(d.current.relative_humidity_2m),
        windSpeed: Math.round(d.current.wind_speed_10m), // already km/h
        description: curWMO.desc,
        icon: curWMO.icon,
        pressure: 1013,
        visibility: 10,
        sunrise: 0, sunset: 0
      },
      forecast,
      alerts
    });

  } catch (err) {
    console.error('Weather API error:', err.message);
    res.json({ ...getMockWeather(req.query.city || 'Bangalore'), _errorTrace: err.message }); // Ultimate fallback
  }
});

function processOWMForecast(data) {
  const daily = {};
  data.list.forEach((item) => {
    const date = item.dt_txt.split(' ')[0];
    if (!daily[date]) {
      daily[date] = {
        date,
        temps: [],
        descriptions: [],
        icons: [],
        humidity: [],
        wind: [],
        rain: 0,
      };
    }
    daily[date].temps.push(item.main.temp);
    daily[date].descriptions.push(item.weather[0].description);
    daily[date].icons.push(item.weather[0].icon);
    daily[date].humidity.push(item.main.humidity);
    daily[date].wind.push(item.wind.speed * 3.6);
    if (item.rain) daily[date].rain += item.rain['3h'] || 0;
  });

  return Object.values(daily)
    .slice(0, 7)
    .map((d) => ({
      date: d.date,
      maxTemp: Math.round(Math.max(...d.temps)),
      minTemp: Math.round(Math.min(...d.temps)),
      description: d.descriptions[Math.floor(d.descriptions.length / 2)],
      icon: d.icons[Math.floor(d.icons.length / 2)],
      humidity: Math.round(d.humidity.reduce((a, b) => a + b) / d.humidity.length),
      windSpeed: Math.round(d.wind.reduce((a, b) => a + b) / d.wind.length),
      rain: Math.round(d.rain * 10) / 10,
    }));
}

function generateWeatherAlerts(current) {
  const alerts = [];
  const temp = current.main.temp;
  const humidity = current.main.humidity;
  const windSpeed = current.wind.speed * 3.6;

  if (temp >= 40) alerts.push({ type: 'heatwave', severity: 'high', message: `⚠️ Heatwave Alert: ${Math.round(temp)}°C. Protect crops and irrigate frequently.` });
  else if (temp >= 35) alerts.push({ type: 'heat', severity: 'medium', message: `🌡️ High Temperature: ${Math.round(temp)}°C. Monitor soil moisture.` });
  if (temp <= 5) alerts.push({ type: 'frost', severity: 'high', message: `❄️ Frost Alert: ${Math.round(temp)}°C. Protect sensitive crops tonight.` });
  if (humidity >= 90) alerts.push({ type: 'humid', severity: 'medium', message: '💧 Very High Humidity. Watch for fungal diseases in crops.' });
  if (windSpeed >= 60) alerts.push({ type: 'wind', severity: 'high', message: `💨 Strong Winds: ${Math.round(windSpeed)} km/h. Secure structures and young plants.` });
  if (humidity <= 20) alerts.push({ type: 'drought', severity: 'medium', message: '☀️ Drought Conditions. Increase irrigation frequency.' });
  return alerts;
}

function getMockWeather(city = 'Bangalore') {
  const mockCities = {
    'Bangalore': { temp: 28, humidity: 68, wind: 14, desc: 'partly cloudy' },
    'Hyderabad': { temp: 32, humidity: 55, wind: 18, desc: 'clear sky' },
    'Mumbai': { temp: 30, humidity: 82, wind: 22, desc: 'light rain' },
    'Delhi': { temp: 22, humidity: 45, wind: 12, desc: 'haze' },
    'Chennai': { temp: 33, humidity: 75, wind: 20, desc: 'sunny' },
    'Pune': { temp: 29, humidity: 60, wind: 16, desc: 'partly cloudy' },
  };
  const w = mockCities[city] || mockCities['Bangalore'];
  const now = Math.floor(Date.now() / 1000);

  return {
    success: true,
    city,
    country: 'IN',
    isMockData: true,
    current: {
      temp: w.temp,
      feelsLike: w.temp + 2,
      humidity: w.humidity,
      windSpeed: w.wind,
      description: w.desc,
      icon: '02d',
      pressure: 1013,
      visibility: 8,
      sunrise: now - 3600 * 4,
      sunset: now + 3600 * 6,
    },
    forecast: Array.from({ length: 7 }, (_, i) => ({
      date: new Date(Date.now() + i * 86400000).toISOString().split('T')[0],
      maxTemp: w.temp + Math.floor(Math.random() * 4) - 2,
      minTemp: w.temp - 6 + Math.floor(Math.random() * 3),
      description: ['clear sky', 'partly cloudy', 'light rain', 'sunny', 'cloudy'][i % 5],
      icon: ['01d', '02d', '10d', '01d', '04d'][i % 5],
      humidity: w.humidity + Math.floor(Math.random() * 10) - 5,
      windSpeed: w.wind + Math.floor(Math.random() * 8) - 4,
      rain: [0, 0, 5.2, 0, 0, 2.1, 0][i],
    })),
    alerts: w.temp >= 35 ? [{
      type: 'heat', severity: 'medium',
      message: `🌡️ High Temperature: ${w.temp}°C. Monitor soil moisture levels.`
    }] : [],
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// Translation (MyMemory Free API)
// ─────────────────────────────────────────────────────────────────────────────
app.post('/api/translate', async (req, res) => {
  try {
    const { text, targetLang } = req.body;
    const langMap = { hi: 'hi', kn: 'kn', te: 'te', en: 'en' };
    const lang = langMap[targetLang] || 'en';

    if (lang === 'en') return res.json({ translatedText: text });

    const response = await axios.get('https://api.mymemory.translated.net/get', {
      params: { q: text, langpair: `en|${lang}` },
      timeout: 5000,
    });
    res.json({ translatedText: response.data.responseData.translatedText });
  } catch (err) {
    res.json({ translatedText: req.body.text }); // fallback to original
  }
});

// ─────────────────────────────────────────────────────────────────────────────
// Districts list for dropdown
// ─────────────────────────────────────────────────────────────────────────────
app.get('/api/districts', (req, res) => {
  const districts = [
    'Bangalore', 'Mysore', 'Hubli', 'Belgaum', 'Mangalore',
    'Hyderabad', 'Warangal', 'Nizamabad', 'Karimnagar', 'Khammam',
    'Mumbai', 'Pune', 'Nagpur', 'Nashik', 'Aurangabad',
    'Delhi', 'Gurgaon', 'Faridabad', 'Noida', 'Agra',
    'Chennai', 'Coimbatore', 'Madurai', 'Salem', 'Trichy',
    'Kolkata', 'Howrah', 'Durgapur', 'Asansol', 'Siliguri',
    'Ahmedabad', 'Surat', 'Vadodara', 'Rajkot', 'Bhavnagar',
    'Bhopal', 'Indore', 'Jabalpur', 'Gwalior', 'Ujjain',
    'Patna', 'Gaya', 'Muzaffarpur', 'Bhagalpur', 'Darbhanga',
    'Jaipur', 'Jodhpur', 'Udaipur', 'Kota', 'Ajmer',
  ];
  res.json({ districts });
});

app.listen(PORT, () => {
  console.log(`🚀 Krishi API Backend running on http://localhost:${PORT}`);
});
