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

export function useResetPassword({ id }: { id: Number | String }) {
  return useSWRMutation(`${baseUrl}/user/reset-password/${id} `, fetch, {
    onSuccess: () => {
      showSuccessToast(`User password reset successfully`);
      mutate(
        (key) => typeof key === "string" && key.startsWith(`${baseUrl}/users`),
        undefined,
        { revalidate: true },
      );
    },
    onError: () => {
      showErrorToast("Failed to reset password");
    },
  });
}
