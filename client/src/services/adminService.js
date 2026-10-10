import api from './api.js';

export const getAdminStats = () => api.get('/admin/stats').then((r) => r.data);
export const getAdminUsers = (params) => api.get('/admin/users', { params }).then((r) => r.data);
export const getAdminUser = (id) => api.get(`/admin/users/${id}`).then((r) => r.data);
export const setUserRole = (id, role) => api.put(`/admin/users/${id}/role`, { role }).then((r) => r.data);
export const deleteAdminUser = (id) => api.delete(`/admin/users/${id}`).then((r) => r.data);
export const getAdminAssessments = (params) => api.get('/admin/assessments', { params }).then((r) => r.data);
export const getAdminAssessment = (id) => api.get(`/admin/assessments/${id}`).then((r) => r.data);
export const deleteAdminAssessment = (id) => api.delete(`/admin/assessments/${id}`).then((r) => r.data);
export const getAdminModels = () => api.get('/admin/models').then((r) => r.data);
export const getSystemInfo = () => api.get('/admin/system').then((r) => r.data);
