import { useState, useEffect, useCallback } from 'react';
import { applicationService } from '../services/applicationService';

export const useApplications = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchApplications = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await applicationService.getApplications();
      setApplications(res.data);
    } catch (err) {
      setError(err.message || 'Error al obtener las postulaciones.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchApplications();
  }, [fetchApplications]);

  return { applications, loading, error, refetch: fetchApplications };
};
