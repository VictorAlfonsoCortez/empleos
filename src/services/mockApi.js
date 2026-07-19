import jobOpeningData from '../data/jobOpening.json';
import categoriasData from '../data/categorias.json';
import postulacionesData from '../data/postulaciones.json';
import candidatoData from '../data/candidato.json';

// Simulador de delay de red
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export const api = {
  getVacantes: async () => {
    await delay(500);
    return jobOpeningData;
  },
  getVacanteById: async (id) => {
    await delay(500);
    const vacante = jobOpeningData.data.find(v => v.id === id);
    if (!vacante) throw new Error('Not found');
    return vacante;
  },
  getCategorias: async () => {
    await delay(300);
    return categoriasData;
  },
  getPostulaciones: async () => {
    await delay(500);
    return postulacionesData;
  },
  getCandidato: async () => {
    await delay(300);
    return candidatoData;
  }
};
