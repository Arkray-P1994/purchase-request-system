// hooks/useVendor.ts
"use client";

import { showErrorToast } from "@/components/toast/error-toast";
import { showSuccessToast } from "@/components/toast/success-toast";
import { baseUrl } from "@/lib/base-url";
import { mutate } from "swr";
import useSWRMutation from "swr/mutation";
// --- API CONFIG ---
export const API_URL = `${baseUrl}/assets/update` as const;

// Generic request wrapper that handles FormData and JSON
async function request(url: string, payload?: FormData | object) {
  const isFormData =
    typeof FormData !== "undefined" && payload instanceof FormData;

  const res = await fetch(url, {
    method: payload ? "POST" : "GET",
    body: payload
      ? isFormData
        ? (payload as FormData)
        : JSON.stringify(payload)
      : undefined,
    headers: isFormData
      ? { accept: "application/json" }
      : { accept: "application/json", "Content-Type": "application/json" },
  });

  if (!res.ok) {
    try {
      const errJson = await res.json();
      throw new Error(errJson?.message || `HTTP error! status: ${res.status}`);
    } catch (_) {
      throw new Error(`HTTP error! status: ${res.status}`);
    }
  }

  return (await res.json()) as unknown;
}

// SWR fetcher — allow FormData | object
const fetcher = (url: string, { arg }: { arg?: FormData | object }) =>
  request(url, arg);

// Allow the mutation to accept either FormData or plain object
export function useUpdateAsset({ id }: { id: number }) {
  return useSWRMutation<unknown, Error, string, FormData | object>(
    `${API_URL}/${id}`,
    fetcher,
    {
      onSuccess: () => {
        mutate(
          (key) =>
            typeof key === "string" &&
            key.startsWith(`${baseUrl}/assets-params`),
          undefined,
          { revalidate: true }
        );
        showSuccessToast(`Success`);
      },
      onError: (err: any) => {
        showErrorToast(err?.message || "Failed to update asset");
      },
    }
  );
}
