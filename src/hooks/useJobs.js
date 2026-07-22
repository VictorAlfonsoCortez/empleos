import { useState, useEffect, useCallback } from 'react';
import { jobService } from '../services/jobService';

export const useJobs = (filters = {}) => {
  const [jobs, setJobs] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Serializar filtros para la dependencia del useEffect
  const serializedFilters = JSON.stringify(filters);

  const fetchJobs = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const parsedFilters = JSON.parse(serializedFilters);
      const res = await jobService.getVacantes(parsedFilters);
      setJobs(res.data);
      setTotal(res.total || res.data.length);
    } catch (err) {
      console.error('Error fetching jobs:', err);
      setError(err.message || 'Error al cargar vacantes');
    } finally {
      setLoading(false);
    }
  }, [serializedFilters]);

  useEffect(() => {
    fetchJobs();
  }, [fetchJobs]);

  return { jobs, total, loading, error, refetch: fetchJobs };
};
