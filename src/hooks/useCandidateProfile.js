import { useState, useEffect, useCallback } from 'react';
import { candidateService } from '../services/candidateService';

export const useCandidateProfile = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [updating, setUpdating] = useState(false);

  const fetchProfile = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await candidateService.getProfile();
      setProfile(res.data);
    } catch (err) {
      setError(err.message || 'Error al cargar el perfil.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  const updateProfile = async (updatedFields) => {
    setUpdating(true);
    try {
      const res = await candidateService.updateProfile(updatedFields);
      setProfile(res.data);
      return res;
    } catch (err) {
      throw err;
    } finally {
      setUpdating(false);
    }
  };

  return { profile, loading, error, updating, updateProfile, refetch: fetchProfile };
};
