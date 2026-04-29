import { baseUrl } from "@/lib/base-url";
import { toast } from "sonner";
import { mutate } from "swr";
import useSWRMutation from "swr/mutation";

async function createApproverRequest(url: string, { arg }: { arg: any }) {
  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(arg),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => null);
    throw new Error(errorData?.error || "Failed to create approver");
  }

  return response.json();
}

export function useCreateApprover() {
  return useSWRMutation(`${baseUrl}/approver/store`, createApproverRequest, {
    onSuccess: () => {
      mutate(
        (key) => typeof key === "string" && key.startsWith(`${baseUrl}/approvers`),
        undefined,
        { revalidate: true }
      );
    },
    onError: (error) => {
      toast.error(error.message || "Something went wrong");
    },
  });
}

async function updateApproverRequest(
  url: string,
  { arg }: { arg: { id: string | number; data: any } }
) {
  const response = await fetch(`${url}/${arg.id}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(arg.data),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => null);
    throw new Error(errorData?.error || "Failed to update approver");
  }

  return response.json();
}

export function useUpdateApprover() {
  return useSWRMutation(`${baseUrl}/approver/update`, updateApproverRequest, {
    onSuccess: () => {
      mutate(
        (key) => typeof key === "string" && key.startsWith(`${baseUrl}/approvers`),
        undefined,
        { revalidate: true }
      );
    },
    onError: (error) => {
      toast.error(error.message || "Something went wrong");
    },
  });
}

async function deleteApproverRequest(
  url: string,
  { arg }: { arg: { id: string | number } }
) {
  const response = await fetch(`${url}/${arg.id}`, {
    method: "POST",
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => null);
    throw new Error(errorData?.error || "Failed to delete approver");
  }

  return response.json();
}

export function useDeleteApprover() {
  return useSWRMutation(`${baseUrl}/approver/delete`, deleteApproverRequest, {
    onSuccess: () => {
      mutate(
        (key) => typeof key === "string" && key.startsWith(`${baseUrl}/approvers`),
        undefined,
        { revalidate: true }
      );
    },
    onError: (error) => {
      toast.error(error.message || "Something went wrong");
    },
  });
}

async function reorderApproversRequest(url: string, { arg }: { arg: { approvers: { id: number; approval_level: number }[] } }) {
  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(arg),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => null);
    throw new Error(errorData?.error || "Failed to reorder workflow");
  }

  return response.json();
}

export function useReorderApprovers() {
  return useSWRMutation(`${baseUrl}/approver/reorder`, reorderApproversRequest, {
    onSuccess: () => {
      mutate(
        (key) => typeof key === "string" && key.startsWith(`${baseUrl}/approvers`),
        undefined,
        { revalidate: true }
      );
    },
    onError: (error) => {
      toast.error(error.message || "Something went wrong");
    },
  });
}
