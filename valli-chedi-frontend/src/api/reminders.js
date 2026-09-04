import { api } from './client';

export const getReminders = (params = {}) => {
  const query = new URLSearchParams(params).toString();
  return api.get(`/reminders${query ? `?${query}` : ''}`);
};
export const checkInReminder = (id) => api.post(`/reminders/${id}/checkin`, {});
export const stopReminder = (id, reason) => api.post(`/reminders/${id}/stop`, { reason });
