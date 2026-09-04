import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getDebts, resolveDebt } from '../api/homeDebt';

export function useHomeDebt(params = {}) {
  return useQuery({
    queryKey: ['home-debts', params],
    queryFn: () => getDebts(params),
    refetchInterval: 60000,
  });
}

export function useResolveDebt() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id) => resolveDebt(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['home-debts'] });
    },
  });
}
