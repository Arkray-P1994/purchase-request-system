import { baseUrl } from "@/lib/base-url";
import useSWR, { mutate } from "swr";

const fetcher = (url: string) =>
  fetch(url, {
    credentials: "include",
  }).then((res) => res.json());

export const API_URL = `${baseUrl}/user/session` as const;
export function useUser() {
  const { data, error, isLoading } = useSWR(API_URL, fetcher);

  return {
    user: data ?? [],
    error,
    isLoading,
    mutate,
  };
}
