import { jobService } from './jobService';
import { candidateService } from './candidateService';
import { applicationService } from './applicationService';

// Facade de compatibilidad hacia atrás
export const api = {
  getVacantes: (filters) => jobService.getVacantes(filters),
  getVacanteById: (id) => jobService.getVacanteById(id),
  getCategorias: () => jobService.getCategorias(),
  getPostulaciones: () => applicationService.getApplications(),
  getCandidato: () => candidateService.getProfile()
};
