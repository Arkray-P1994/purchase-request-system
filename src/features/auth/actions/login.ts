import { showErrorToast } from "@/components/toast/error-toast";
import { showSuccessToast } from "@/components/toast/success-toast";
import { baseUrl } from "@/lib/base-url";
import { API_URL } from "@/api/fetch-user";
import { useRouter } from "@tanstack/react-router";
import { mutate } from "swr";
import useSWRMutation from "swr/mutation";
export const fetcher = async (url: string, payload?: any) => {
  const isFormData = payload instanceof FormData;
  const options: RequestInit = {
    method: payload ? "POST" : "GET",
    ...(payload && { body: isFormData ? payload : JSON.stringify(payload) }),
    credentials: "include",
    headers: {
      accept: "application/json",
      ...(isFormData ? {} : { "Content-Type": "application/json" }),
    },
  };

  const res = await fetch(url, options);

  // Try to parse JSON even on error
  let data: any = null;
  try {
    data = await res.json();
  } catch {
    /* ignore */
  }

  if (!res.ok) {
    const msg = data?.error || data?.message || `HTTP ${res.status}`;
    throw new Error(msg);
  }
  return data;
};

export const login = (url: string, { arg }: { arg: any }) => {
  return fetcher(url, arg);
};

export function useLogin() {
  const router = useRouter();

  return useSWRMutation(`${baseUrl}/login`, login, {
    onSuccess: async () => {
      await mutate(API_URL);
      showSuccessToast("Login successfully!");
      router.navigate({ to: "/asset-inventory/dashboard" });
    },
    onError: (err: unknown) => {
      const message = err instanceof Error ? err.message : "Failed to login";
      showErrorToast(message);
    },
  });
}
