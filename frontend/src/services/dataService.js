import api from './api';

export const dashboardService = {
  getStats: () => api.get('/dashboard/stats')
};

export const satelliteService = {
  getAll: (params) => api.get('/satellites', { params }),
  getById: (id) => api.get(`/satellites/${id}`),
  create: (data) => api.post('/satellites', data),
  update: (id, data) => api.put(`/satellites/${id}`, data),
  delete: (id) => api.delete(`/satellites/${id}`)
};

export const missionService = {
  getAll: (params) => api.get('/missions', { params }),
  getById: (id) => api.get(`/missions/${id}`),
  create: (data) => api.post('/missions', data),
  update: (id, data) => api.put(`/missions/${id}`, data),
  delete: (id) => api.delete(`/missions/${id}`)
};

export const debrisService = {
  getAll: (params) => api.get('/debris', { params }),
  getById: (id) => api.get(`/debris/${id}`),
  create: (data) => api.post('/debris', data),
  update: (id, data) => api.put(`/debris/${id}`, data),
  delete: (id) => api.delete(`/debris/${id}`)
};

export const collisionService = {
  detect: () => api.get('/collisions/detect')
};

export const telemetryService = {
  getAll: () => api.get('/telemetry'),
  getBySatellite: (id) => api.get(`/telemetry/satellite/${id}`),
  simulate: () => api.post('/telemetry/simulate')
};

export const alertService = {
  getAll: (params) => api.get('/alerts', { params }),
  resolve: (id, notes) => api.put(`/alerts/${id}/resolve`, { operatorNotes: notes }),
  delete: (id) => api.delete(`/alerts/${id}`)
};

export const logService = {
  getAll: (params) => api.get('/logs', { params })
};
