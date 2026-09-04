import { api } from './client';

export const getDebts = (params = {}) => {
  const query = new URLSearchParams(params).toString();
  return api.get(`/home-debt${query ? `?${query}` : ''}`);
};
export const resolveDebt = (id) => api.post(`/home-debt/${id}/resolve`);
