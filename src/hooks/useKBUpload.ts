import { API_ENDPOINTS } from "@/lib/api-endpoints";
import useSWRMutation from "swr/mutation";
import { swrMutator } from "@/lib/swr-fetcher";

export function useKBUpload(baseId: string) {
  return useSWRMutation(
    `${API_ENDPOINTS.KB}/${baseId}/upload`,
    swrMutator
  );
}
