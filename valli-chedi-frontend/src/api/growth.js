import { api } from './client';

export const getValliState = () => api.get('/valli-state');
export const getGrowth = () => api.get('/growth');
export const getGrowthHistory = (limit = 50) => api.get(`/growth/history?limit=${limit}`);
