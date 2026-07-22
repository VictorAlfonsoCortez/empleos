import { apiClient, USE_MOCK, mockDelay } from './apiClient';
import initialApplications from '../data/jobApplications.json';
import { jobService } from './jobService';

const APPLICATIONS_STORAGE_KEY = 'empleos_postulaciones';

const getStoredApplications = () => {
  const stored = localStorage.getItem(APPLICATIONS_STORAGE_KEY);
  if (stored) {
    try {
      return JSON.parse(stored);
    } catch {
      return initialApplications.data;
    }
  }
  localStorage.setItem(APPLICATIONS_STORAGE_KEY, JSON.stringify(initialApplications.data));
  return initialApplications.data;
};

export const applicationService = {
  getApplications: async () => {
    if (!USE_MOCK) {
      return apiClient.get('/postulaciones');
    }

    await mockDelay(350);
    const applications = getStoredApplications();
    const { data: jobs } = await jobService.getVacantes();

    // Enriquecer cada postulación con el título y la empresa de la vacante correspondiente
    const enrichedApplications = applications.map(app => {
      const vacante = jobs.find(v => String(v.id) === String(app.vacanteId));
      return {
        ...app,
        vacanteTitulo: vacante ? vacante.titulo : `Vacante #${app.vacanteId}`,
        empresa: vacante ? vacante.empresa : 'Empresa',
        logoEmpresa: vacante ? vacante.logoEmpresa : null,
        ubicacion: vacante ? vacante.ubicacion : null
      };
    });

    return { data: enrichedApplications, total: enrichedApplications.length };
  },

  applyToJob: async (vacanteId, applicationDetails = {}) => {
    if (!USE_MOCK) {
      return apiClient.post('/postulaciones', { vacanteId, ...applicationDetails });
    }

    await mockDelay(400);
    const applications = getStoredApplications();

    // Verificar si ya se postuló a esta vacante
    const existing = applications.find(a => String(a.vacanteId) === String(vacanteId));
    if (existing) {
      throw new Error('Ya te has postulado a esta vacante anteriormente.');
    }

    const newApp = {
      id: `post-${Date.now().toString().slice(-4)}`,
      vacanteId,
      candidatoId: 'c-2024-001',
      fechaPostulacion: new Date().toISOString(),
      estatus: 'Enviada',
      cvUrl: applicationDetails.cvUrl || 'https://ejemplo.com/files/cv/ana-ruiz.pdf',
      cartaPresentacion: applicationDetails.cartaPresentacion || ''
    };

    const updated = [newApp, ...applications];
    localStorage.setItem(APPLICATIONS_STORAGE_KEY, JSON.stringify(updated));
    return { data: newApp, success: true, message: 'Postulación enviada correctamente' };
  },

  hasApplied: async (vacanteId) => {
    const apps = getStoredApplications();
    return apps.some(a => String(a.vacanteId) === String(vacanteId));
  }
};
