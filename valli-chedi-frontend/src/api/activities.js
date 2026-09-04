import { api } from './client';

export const getActivities = (params = {}) => {
  const query = new URLSearchParams(params).toString();
  return api.get(`/activities${query ? `?${query}` : ''}`);
};
export const getActivity = (id) => api.get(`/activities/${id}`);
export const createActivity = (data) => api.post('/activities', data);
export const previewActivity = (data) => api.post('/activities/preview', data);
export const updateActivity = (id, data) => api.put(`/activities/${id}`, data);
export const deleteActivity = (id) => api.delete(`/activities/${id}`);
