import { api } from './client';

export const analyzePermission = (data) => api.post('/permissions/analyze', data);
export const getPermission = (activityId) => api.get(`/permissions/${activityId}`);
