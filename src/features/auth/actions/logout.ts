import { showErrorToast } from "@/components/toast/error-toast";
import { showSuccessToast } from "@/components/toast/success-toast";
import { useRouter } from "@tanstack/react-router";
import useSWRMutation from "swr/mutation";
import { fetcher } from "./login"; // reuse the same fetcher
import { baseUrl } from "@/lib/base-url";
import { API_URL } from "@/api/fetch-user";
import { mutate } from "swr";

export const logout = (url: string) => {
  // no payload needed, just call POST
  return fetcher(url, {});
};

export function useLogout() {
  const router = useRouter();

  return useSWRMutation(`${baseUrl}/logout`, logout, {
    onSuccess: async () => {
      await mutate(API_URL);
      showSuccessToast("Logged out successfully!");
      router.navigate({ to: "/login" }); // redirect after logout
    },
    onError: (err: unknown) => {
      const message = err instanceof Error ? err.message : "Failed to logout";
      showErrorToast(message);
    },
  });
}
