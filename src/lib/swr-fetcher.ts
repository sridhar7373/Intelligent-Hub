import apiClient from "./axios";

export const swrFetcher = (url: string) => apiClient.get(url).then(res => res.data);
export const swrMutator = (url: string, { arg }: { arg: any }) => {
  const config = arg instanceof FormData
    ? { headers: { "Content-Type": "multipart/form-data" } }
    : {};
  return apiClient.post(url, arg, config).then(res => res.data);
};
