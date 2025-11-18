import { API_ENDPOINTS } from "@/lib/api-endpoints";
import { swrMutator } from "@/lib/swr-fetcher";
import useSWRMutation from "swr/mutation";

interface VerifyOtpPayload {
  email: string;
  code: string;
}

export function useVerifyOtp() {
  return useSWRMutation(API_ENDPOINTS.VERIFY_OTP, swrMutator);
}
