import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getReminders, checkInReminder, stopReminder } from '../api/reminders';

export function useReminders(params = {}) {
  return useQuery({
    queryKey: ['reminders', params],
    queryFn: () => getReminders(params),
    refetchInterval: 30000,
    staleTime: 10000,
  });
}

export function useCheckIn() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id) => checkInReminder(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reminders'] });
      queryClient.invalidateQueries({ queryKey: ['valli-state'] });
    },
  });
}

export function useStopReminder() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, reason }) => stopReminder(id, reason),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reminders'] });
    },
  });
}
