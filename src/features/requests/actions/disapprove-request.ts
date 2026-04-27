"use client";

import { useSWRConfig } from "swr";
import useSWRMutation from "swr/mutation";
import { showErrorToast } from "@/components/toast/error-toast";
import { showSuccessToast } from "@/components/toast/success-toast";
import { baseUrl } from "@/lib/base-url";

async function request(url: string, payload?: object) {
  const res = await fetch(url, {
    method: "POST",
    body: JSON.stringify(payload),
    headers: {
      accept: "application/json",
      "Content-Type": "application/json",
    },
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

const post = (url: string, { arg }: { arg?: object }) => request(url, arg);

export function useDisapproveRequest(id: string | number) {
  const { mutate } = useSWRConfig();
  const API_URL = `${baseUrl}/request/disapprove/${id}`;

  return useSWRMutation<unknown, Error, string, object>(
    API_URL,
    post,
    {
      onSuccess: () => {
        mutate((key) => typeof key === "string" && key.includes(`${baseUrl}/request/${id}`));
        mutate((key) => typeof key === "string" && key.includes(`${baseUrl}/requests`));
        showSuccessToast("Request disapproved");
      },
      onError: (err: any) => {
        showErrorToast(err?.message || "Failed to disapprove request");
      },
    }
  );
}
