/**
 * Krishi API Service - All backend API calls
 */
import axios from 'axios';

// When deployed to Vercel, this will use the VITE_API_URL from environment
// When developing locally, it defaults to /api which is proxied by Vite
const API_URL = import.meta.env.VITE_API_URL || '/api';

// Increased timeout to 60000 (60 seconds) because Render free tier instances go to sleep 
// after 15 minutes of inactivity and take about 50 seconds to wake up.
const API = axios.create({ baseURL: API_URL, timeout: 60000 });

// Helper function to extract exact error message to show in the UI instead of falling into empty catch block
const handleApiError = (err) => {
  let msg = 'Unknown API Error';
  
  if (err.response && err.response.data && err.response.data.error) {
    // Backend successfully returned an error message
    msg = `Server Error: ${err.response.data.error}`;
  } else if (err.code === 'ECONNABORTED' || (err.message && err.message.includes('timeout'))) {
    // Render Cold Start Timeout
    msg = '⏳ The Render cloud server takes about 50 seconds to wake up. Please wait a minute and hit the button again!';
  } else if (err.message === 'Network Error') {
    // Usually means CORS, DNS, or misconfigured VITE_API_URL
    msg = `Network Error: Could not connect to backend at ${API_URL}. Check VITE_API_URL env variable on Vercel.`;
  } else {
    msg = err.message;
  }
  
  return { success: false, error: msg };
};

// Crop Recommendation
export const getCropRecommendation = (params) =>
  API.post('/crop', params).then((r) => r.data).catch(handleApiError);

// Fertilizer Advisory
export const getFertilizerAdvice = (params) =>
  API.post('/fertilizer', params).then((r) => r.data).catch(handleApiError);

// Crop Disease Detection
export const detectDisease = (file) => {
  if (typeof file === 'string') {
    return API.post('/disease', { imageBase64: file })
      .then((r) => r.data).catch(handleApiError);
  }
  const fd = new FormData();
  fd.append('image', file);
  return API.post('/disease', fd, {
    headers: { 'Content-Type': 'multipart/form-data' },
  }).then((r) => r.data).catch(handleApiError);
};

// Weather
export const getWeather = (city) =>
  API.get(`/weather?city=${encodeURIComponent(city)}`).then((r) => r.data).catch(handleApiError);

export const getWeatherByCoords = (lat, lon) =>
  API.get(`/weather?lat=${lat}&lon=${lon}`).then((r) => r.data).catch(handleApiError);

// Market Price Forecast
export const getPriceForecast = (params) =>
  API.post('/price', params).then((r) => r.data).catch(handleApiError);

// Districts list
export const getDistricts = () =>
  API.get('/districts').then((r) => r.data).catch(() => ({ districts: [] }));

export default API;
