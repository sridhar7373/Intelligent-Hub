import useSWRMutation from "swr/mutation";
import apiClient from "@/lib/axios";
import { API_ENDPOINTS } from "@/lib/api-endpoints";

async function deleteFetcher(url: string) {
    return apiClient.delete(url).then(res => res.data);
}

export function useKBDelete(baseId: string) {
    return useSWRMutation(
        API_ENDPOINTS.KB + `/${baseId}/documents`,
        (url, { arg: docId }: { arg: string }) => {
            return deleteFetcher(`${url}/${docId}`);
        }
    );
}
