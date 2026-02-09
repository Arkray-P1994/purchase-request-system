import { baseUrl } from "@/lib/base-url";
import useSWR from "swr";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export function useDashboard() {
  // Build query params dynamically

  const url = `${baseUrl}/dashboard`;

  const { data, error, isLoading } = useSWR(url, fetcher);

  return {
    data: data ?? [],
    error,
    isLoading,
  };
}
