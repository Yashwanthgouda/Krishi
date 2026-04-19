import axios from 'axios';
import { useState, useCallback } from 'react';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const client = axios.create({ baseURL: API_URL, timeout: 60000 });

export function useApi() {
  const [loading, setLoading] = useState(false);
  const [error,   setError]   = useState(null);

  const call = useCallback(async (method, path, data = null) => {
    setLoading(true);
    setError(null);
    try {
      const res = method === 'get'
        ? await client.get(path, { params: data })
        : await client.post(path, data);
      return res.data;
    } catch (err) {
      const msg =
        err.response?.data?.error ||
        (err.code === 'ECONNABORTED' ? 'Server is waking up, please try again in 30s.' : null) ||
        (err.message === 'Network Error' ? 'Cannot connect to server. Check your connection.' : null) ||
        err.message ||
        'Something went wrong';
      setError(msg);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const get  = useCallback((path, params) => call('get',  path, params), [call]);
  const post = useCallback((path, body)   => call('post', path, body),   [call]);

  return { loading, error, get, post, clearError: () => setError(null) };
}
