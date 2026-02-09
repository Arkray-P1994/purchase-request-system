import { showErrorToast } from "@/components/toast/error-toast";
import { showSuccessToast } from "@/components/toast/success-toast";
import { baseUrl } from "@/lib/base-url";
import { fetcher } from "@/lib/fetcher";
import { mutate } from "swr";
import useSWRMutation from "swr/mutation";
// --- Utility fetcher ---

const fetch = async (url: string) => {
  return fetcher(url, {});
};

export function useDeleteUser({ id }: { id: Number | String }) {
  return useSWRMutation(`${baseUrl}/user/delete/${id} `, fetch, {
    onSuccess: () => {
      showSuccessToast(`User deleted successfully`);
      mutate(
        (key) => typeof key === "string" && key.startsWith(`${baseUrl}/users`),
        undefined,
        { revalidate: true },
      );
    },
    onError: () => {
      showErrorToast("Failed to delete User");
    },
  });
}
