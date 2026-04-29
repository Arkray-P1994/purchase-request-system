import { baseUrl } from "@/lib/base-url";
import { toast } from "sonner";
import { mutate } from "swr";
import useSWRMutation from "swr/mutation";
import { CreateUser, UpdateUser } from "../schema";

async function createUserRequest(url: string, { arg }: { arg: CreateUser }) {
  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(arg),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => null);
    throw new Error(errorData?.message || "Failed to create user");
  }

  return response.json();
}

export function useCreateUser() {
  return useSWRMutation(`${baseUrl}/user/store`, createUserRequest, {
    onSuccess: () => {
      mutate(
        (key) =>
          typeof key === "string" &&
          key.startsWith(`${baseUrl}/users`),
        undefined,
        { revalidate: true }
      );
      toast.success("User created successfully");
    },
    onError: (error) => {
      toast.error(error.message || "Something went wrong");
    },
  });
}

async function updateUserRequest(
  url: string,
  { arg }: { arg: { id: string | number; data: UpdateUser } }
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
    throw new Error(errorData?.message || "Failed to update user");
  }

  return response.json();
}

export function useUpdateUser() {
  return useSWRMutation(`${baseUrl}/user/update`, updateUserRequest, {
    onSuccess: () => {
      mutate(
        (key) =>
          typeof key === "string" &&
          key.startsWith(`${baseUrl}/users`),
        undefined,
        { revalidate: true }
      );
      toast.success("User updated successfully");
    },
    onError: (error) => {
      toast.error(error.message || "Something went wrong");
    },
  });
}

async function deleteUserRequest(
  url: string,
  { arg }: { arg: { id: string | number } }
) {
  const response = await fetch(`${url}/${arg.id}`, {
    method: "POST",
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => null);
    throw new Error(errorData?.message || "Failed to delete user");
  }

  return response.json();
}

export function useDeleteUser() {
  return useSWRMutation(`${baseUrl}/user/delete`, deleteUserRequest, {
    onSuccess: () => {
      mutate(
        (key) =>
          typeof key === "string" &&
          key.startsWith(`${baseUrl}/users`),
        undefined,
        { revalidate: true }
      );
      toast.success("User deleted successfully");
    },
    onError: (error) => {
      toast.error(error.message || "Something went wrong");
    },
  });
}
