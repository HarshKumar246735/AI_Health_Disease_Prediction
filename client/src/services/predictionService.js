import api from './api.js';

export const createPrediction = (disease, inputData) => api.post('/predictions', { disease, inputData }).then((r) => r.data.assessment);
export const listPredictions = (params) => api.get('/predictions', { params }).then((r) => r.data);
export const getPrediction = (id) => api.get(`/predictions/${id}`).then((r) => r.data);
export const deletePrediction = (id) => api.delete(`/predictions/${id}`).then((r) => r.data);
export const downloadReport = (id) => api.get(`/predictions/${id}/report`, { responseType: 'blob' }).then((r) => r.data);
