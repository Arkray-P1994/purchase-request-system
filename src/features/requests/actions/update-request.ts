"use client";

import { useSWRConfig } from "swr";
import useSWRMutation from "swr/mutation";
import { showErrorToast } from "@/components/toast/error-toast";
import { showSuccessToast } from "@/components/toast/success-toast";
import { baseUrl } from "@/lib/base-url";
import { useNavigate } from "@tanstack/react-router";

async function request(url: string, payload?: FormData | object) {
  const isFormData = typeof FormData !== "undefined" && payload instanceof FormData;

  const res = await fetch(url, {
    method: "POST", // The PHP backend expects POST
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

const update = (url: string, { arg }: { arg?: FormData | object }) => request(url, arg);

export function useUpdateRequest(id: string | number) {
  const navigate = useNavigate();
  const { mutate } = useSWRConfig();
  const API_URL = `${baseUrl}/request/update/${id}`;

  return useSWRMutation<unknown, Error, string, FormData | object>(
    API_URL,
    update,
    {
      onSuccess: () => {
        mutate((key) => typeof key === "string" && key.includes(`${baseUrl}/request`));
        navigate({
          to: `/purchase-request/requests/${id}`,
        });
        showSuccessToast("Request updated successfully");
      },
      onError: (err: any) => {
        showErrorToast(err?.message || "Failed to update request");
      },
    }
  );
}
