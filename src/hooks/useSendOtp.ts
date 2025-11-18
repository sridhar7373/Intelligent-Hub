import { API_ENDPOINTS } from "@/lib/api-endpoints";
import { swrMutator } from "@/lib/swr-fetcher";
import useSWRMutation from "swr/mutation";

export const useSendOtp = () => {
  return useSWRMutation(API_ENDPOINTS.SEND_OTP, swrMutator);
};
