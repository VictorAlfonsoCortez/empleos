import { useState, useEffect } from 'react';
import { jobService } from '../services/jobService';
import { applicationService } from '../services/applicationService';

export const useJobDetail = (id) => {
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [hasApplied, setHasApplied] = useState(false);

  useEffect(() => {
    if (!id) return;

    let isMounted = true;
    setLoading(true);
    setError(null);

    Promise.all([
      jobService.getVacanteById(id),
      applicationService.hasApplied(id)
    ])
      .then(([jobData, applied]) => {
        if (isMounted) {
          setJob(jobData);
          setHasApplied(applied);
          setLoading(false);
        }
      })
      .catch((err) => {
        if (isMounted) {
          setError(err.message || 'No se pudo cargar el detalle de la vacante.');
          setLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, [id]);

  const apply = async (applicationDetails) => {
    const result = await applicationService.applyToJob(id, applicationDetails);
    setHasApplied(true);
    return result;
  };

  return { job, loading, error, hasApplied, apply };
};
