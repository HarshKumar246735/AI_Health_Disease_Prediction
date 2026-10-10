import api from './api.js';

export const getDiseases = () => api.get('/diseases').then((r) => r.data.diseases);
export const getDisease = (id) => api.get(`/diseases/${id}`).then((r) => r.data);
