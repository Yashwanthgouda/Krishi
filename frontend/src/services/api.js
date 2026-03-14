/**
 * Krishi API Service - All backend API calls
 */
import axios from 'axios';

// When deployed to Vercel, this will use the VITE_API_URL from environment
// When developing locally, it defaults to /api which is proxied by Vite
const API_URL = import.meta.env.VITE_API_URL || '/api';
const API = axios.create({ baseURL: API_URL, timeout: 20000 });

// Crop Recommendation
export const getCropRecommendation = (params) =>
  API.post('/crop', params).then((r) => r.data);

// Fertilizer Advisory
export const getFertilizerAdvice = (params) =>
  API.post('/fertilizer', params).then((r) => r.data);

// Crop Disease Detection
export const detectDisease = (file) => {
  if (typeof file === 'string') {
    return API.post('/disease', { imageBase64: file }).then((r) => r.data);
  }
  const fd = new FormData();
  fd.append('image', file);
  return API.post('/disease', fd, {
    headers: { 'Content-Type': 'multipart/form-data' },
  }).then((r) => r.data);
};

// Weather
export const getWeather = (city) =>
  API.get(`/weather?city=${encodeURIComponent(city)}`).then((r) => r.data);

export const getWeatherByCoords = (lat, lon) =>
  API.get(`/weather?lat=${lat}&lon=${lon}`).then((r) => r.data);

// Market Price Forecast
export const getPriceForecast = (params) =>
  API.post('/price', params).then((r) => r.data);

// Districts list
export const getDistricts = () =>
  API.get('/districts').then((r) => r.data);

export default API;
