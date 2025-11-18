import { API_ENDPOINTS } from "@/lib/api-endpoints";
import { swrMutator } from "@/lib/swr-fetcher";
import { User } from "@/types/user";
import useSWRMutation from "swr/mutation";

export interface OnboardingPayload {
  username: string;
  workspaceName: string;
  kbName: string;
}

export interface OnboardingResponse {
  ok: boolean;
  user: User;
}

export function useCompleteOnboarding() {
  return useSWRMutation<OnboardingResponse, any, string, OnboardingPayload>(API_ENDPOINTS.ONBOARD, swrMutator);
}
