import { API_ENDPOINTS } from "@/lib/api-endpoints";
import { swrFetcher } from "@/lib/swr-fetcher";
import useSWR from "swr";

export function useKnowldegeBase(baseId: string) {
  return useSWR(API_ENDPOINTS.KB + baseId, swrFetcher);
}
