import { api } from './client';

export const getVallis = (params = {}) => {
  const query = new URLSearchParams(params).toString();
  return api.get(`/vallis${query ? `?${query}` : ''}`);
};
export const getValli = (id) => api.get(`/vallis/${id}`);
export const getValliChain = (id) => api.get(`/vallis/${id}/chain`);
export const createValli = (data) => api.post('/vallis', data);
export const updateValli = (id, data) => api.put(`/vallis/${id}`, data);
export const resolveValli = (id) => api.post(`/vallis/${id}/resolve`);
