import { API_ENDPOINTS } from "@/lib/api-endpoints";
import { swrFetcher } from "@/lib/swr-fetcher";
import { useUserStore } from "@/store/user-store";
import { User } from "@/types/user";
import useSWR from "swr";

interface MeResponse {
  user: User | null;
}

export function useMe() {
  const { user, loading, setUser, setLoading } = useUserStore();

  const { data, error, isLoading } = useSWR(API_ENDPOINTS.ME, swrFetcher, {
    revalidateOnFocus: false,
    revalidateOnReconnect: false,
    revalidateIfStale: false,
    refreshInterval: 0,
    shouldRetryOnError: false,
    onSuccess: (data) => {
      setUser(data?.user ?? null);
      setLoading(false);
    },
    onError: () => {
      setUser(null);
      setLoading(false);
    }
  });

  return {
    user,
    loading: loading || isLoading,
    authenticated: !!user,
    error,
  };
}
