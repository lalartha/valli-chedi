import { useQuery } from '@tanstack/react-query';
import { getValliState } from '../api/growth';

export function useValliState() {
  return useQuery({
    queryKey: ['valli-state'],
    queryFn: getValliState,
    refetchInterval: 30000, // 30 seconds
    staleTime: 10000,
  });
}
