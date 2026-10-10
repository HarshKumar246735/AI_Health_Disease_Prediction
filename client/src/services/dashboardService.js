import api from './api.js';

export const getStats = () => api.get('/dashboard/stats').then((r) => r.data);
export const getRecent = () => api.get('/dashboard/recent').then((r) => r.data.items);
