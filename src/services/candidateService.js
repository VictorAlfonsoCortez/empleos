import { apiClient, USE_MOCK, mockDelay } from './apiClient';
import initialCandidate from '../data/candidato.json';

const CANDIDATE_STORAGE_KEY = 'empleos_candidato';

const getStoredCandidate = () => {
  const stored = localStorage.getItem(CANDIDATE_STORAGE_KEY);
  if (stored) {
    try {
      return JSON.parse(stored);
    } catch {
      return initialCandidate.data;
    }
  }
  localStorage.setItem(CANDIDATE_STORAGE_KEY, JSON.stringify(initialCandidate.data));
  return initialCandidate.data;
};

export const candidateService = {
  getProfile: async () => {
    if (!USE_MOCK) {
      return apiClient.get('/candidato/perfil');
    }

    await mockDelay(250);
    return { data: getStoredCandidate() };
  },

  updateProfile: async (updatedData) => {
    if (!USE_MOCK) {
      return apiClient.put('/candidato/perfil', updatedData);
    }

    await mockDelay(300);
    const current = getStoredCandidate();
    const newProfile = { ...current, ...updatedData };
    localStorage.setItem(CANDIDATE_STORAGE_KEY, JSON.stringify(newProfile));
    return { data: newProfile, message: 'Perfil actualizado con éxito' };
  }
};
