import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getActivities, createActivity, updateActivity, deleteActivity } from '../api/activities';

export function useActivities(params = {}) {
  return useQuery({
    queryKey: ['activities', params],
    queryFn: () => getActivities(params),
    refetchInterval: 30000,
    staleTime: 10000,
  });
}

export function useCreateActivity() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data) => createActivity(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['activities'] });
      queryClient.invalidateQueries({ queryKey: ['vallis'] });
      queryClient.invalidateQueries({ queryKey: ['valli-state'] });
      queryClient.invalidateQueries({ queryKey: ['reminders'] });
    },
  });
}

export function useUpdateActivity() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }) => updateActivity(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['activities'] });
      queryClient.invalidateQueries({ queryKey: ['reminders'] });
    },
  });
}

export function useDeleteActivity() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id) => deleteActivity(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['activities'] });
      queryClient.invalidateQueries({ queryKey: ['vallis'] });
      queryClient.invalidateQueries({ queryKey: ['valli-state'] });
    },
  });
}
