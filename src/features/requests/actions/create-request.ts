"use client";

import { useSWRConfig } from "swr";
import useSWRMutation from "swr/mutation";
import { showErrorToast } from "@/components/toast/error-toast";
import { showSuccessToast } from "@/components/toast/success-toast";
import { baseUrl } from "@/lib/base-url";
import { useNavigate } from "@tanstack/react-router";

export const API_URL = `${baseUrl}/requests/store` as const;

async function request(url: string, payload?: FormData | object) {
  const isFormData = typeof FormData !== "undefined" && payload instanceof FormData;

  const res = await fetch(url, {
    method: "POST",
    credentials: "include",
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

const create = (url: string, { arg }: { arg?: FormData | object }) => request(url, arg);

export function useCreateRequest() {
  const navigate = useNavigate();
  const { mutate } = useSWRConfig();

  return useSWRMutation<unknown, Error, string, FormData | object>(
    API_URL,
    create,
    {
      onSuccess: () => {
        mutate((key) => typeof key === "string" && key.includes(`${baseUrl}/requests`));
        navigate({
          to: "/purchase-request/requests",
        });
        showSuccessToast("Request created successfully");
      },
      onError: (err: any) => {
        showErrorToast(err?.message || "Failed to create request");
      },
    }
  );
}
