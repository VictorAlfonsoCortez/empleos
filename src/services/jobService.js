import { apiClient, USE_MOCK, mockDelay } from './apiClient';
import initialJobs from '../data/jobOpening.json';
import initialCategories from '../data/categorias.json';

const JOBS_STORAGE_KEY = 'empleos_vacantes';

const getStoredJobs = () => {
  const stored = localStorage.getItem(JOBS_STORAGE_KEY);
  if (stored) {
    try {
      return JSON.parse(stored);
    } catch {
      return initialJobs.data;
    }
  }
  localStorage.setItem(JOBS_STORAGE_KEY, JSON.stringify(initialJobs.data));
  return initialJobs.data;
};

export const jobService = {
  getVacantes: async (filters = {}) => {
    if (!USE_MOCK) {
      return apiClient.get('/vacantes', { params: filters });
    }

    await mockDelay();
    let jobs = getStoredJobs();

    const { q, ubicacion, categoria, modalidad, tipoContrato } = filters;

    if (q) {
      const term = q.toLowerCase();
      jobs = jobs.filter(j => 
        j.titulo.toLowerCase().includes(term) || 
        j.empresa.toLowerCase().includes(term) ||
        j.descripcion.toLowerCase().includes(term)
      );
    }

    if (ubicacion) {
      const ubiTerm = ubicacion.toLowerCase();
      jobs = jobs.filter(j => j.ubicacion.toLowerCase().includes(ubiTerm));
    }

    if (categoria && categoria.length > 0) {
      const categoriesArr = Array.isArray(categoria) ? categoria : [categoria];
      jobs = jobs.filter(j => categoriesArr.includes(j.categoria));
    }

    if (modalidad && modalidad.length > 0) {
      const modalidadesArr = Array.isArray(modalidad) ? modalidad : [modalidad];
      jobs = jobs.filter(j => modalidadesArr.includes(j.modalidad));
    }

    if (tipoContrato && tipoContrato.length > 0) {
      const tiposArr = Array.isArray(tipoContrato) ? tipoContrato : [tipoContrato];
      jobs = jobs.filter(j => tiposArr.includes(j.tipoContrato));
    }

    return { data: jobs, total: jobs.length };
  },

  getVacanteById: async (id) => {
    if (!USE_MOCK) {
      return apiClient.get(`/vacantes/${id}`);
    }

    await mockDelay();
    const jobs = getStoredJobs();
    const vacante = jobs.find(v => String(v.id) === String(id));
    if (!vacante) {
      throw new Error(`Vacante con ID "${id}" no encontrada.`);
    }
    return vacante;
  },

  getCategorias: async () => {
    if (!USE_MOCK) {
      return apiClient.get('/categorias');
    }

    await mockDelay(200);
    return initialCategories;
  }
};
