import { useState, useEffect } from 'react';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export const useAnalytics = () => {
  const [stats, setStats] = useState(null);
  const [monthlyStats, setMonthlyStats] = useState(null);
  const [categoryStats, setCategoryStats] = useState(null);
  const [userStats, setUserStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem('token');
        const config = { headers: { Authorization: `Bearer ${token}` } };

        const [globalRes, monthlyRes, categoryRes, userRes] = await Promise.all([
          axios.get(`${API_URL}/analytics/global-stats`, config),
          axios.get(`${API_URL}/analytics/monthly-stats`, config),
          axios.get(`${API_URL}/analytics/category-stats`, config),
          axios.get(`${API_URL}/analytics/user-stats`, config)
        ]);

        setStats(globalRes.data);
        setMonthlyStats(monthlyRes.data);
        setCategoryStats(categoryRes.data);
        setUserStats(userRes.data);
      } catch (err) {
        setError(err.response?.data?.message || err.message);
        console.error('Erreur lors du chargement des statistiques:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, []);

  return { stats, monthlyStats, categoryStats, userStats, loading, error };
};

export default useAnalytics;
