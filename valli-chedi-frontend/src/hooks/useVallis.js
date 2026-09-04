import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getVallis, resolveValli, createValli } from '../api/vallis';

export function useVallis(params = {}) {
  return useQuery({
    queryKey: ['vallis', params],
    queryFn: () => getVallis(params),
    refetchInterval: 30000,
    staleTime: 10000,
  });
}

export function useResolveValli() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id) => resolveValli(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['vallis'] });
      queryClient.invalidateQueries({ queryKey: ['valli-state'] });
    },
  });
}

export function useCreateValli() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data) => createValli(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['vallis'] });
      queryClient.invalidateQueries({ queryKey: ['valli-state'] });
    },
  });
}
