import { logoutMutation, sessionQuery } from '@/queries/auth';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useRouter } from '@tanstack/react-router';
import Cookies from 'js-cookie';

export function useAuth() {
  const queryClient = useQueryClient();
  const router = useRouter();

  const hasHint = Cookies.get('hint') === 'true';

  const {
    data: user,
    isLoading,
    isPlaceholderData,
  } = useQuery({
    queryKey: ['auth', 'session'],
    queryFn: sessionQuery,
    retry: false,
    staleTime: 5 * 60 * 1000,
    placeholderData: hasHint
      ? { isAuthenticated: true, user: null }
      : undefined,
    enabled: hasHint,
  });

  const logout = useMutation({
    mutationFn: logoutMutation,
    onSuccess: () => {
      Cookies.remove('hint', { domain: 'localhost', path: '/' });
      queryClient.setQueryData(['auth', 'session'], null);
      queryClient.invalidateQueries({ queryKey: ['auth'] });
      router.invalidate();
    },
  });

  return {
    user,
    isAuthenticated: !!user || (isPlaceholderData && hasHint),
    isLoading: hasHint ? isLoading : false,
    logout: () => logout.mutate(),
  };
}
