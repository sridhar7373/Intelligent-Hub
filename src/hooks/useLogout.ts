import { API_ENDPOINTS } from "@/lib/api-endpoints";
import { swrMutator } from "@/lib/swr-fetcher";
import useSWRMutation from "swr/mutation";

export const useLogout = () => {
  return useSWRMutation(API_ENDPOINTS.LOGOUT, swrMutator);
};
