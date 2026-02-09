import { baseUrl } from "@/lib/base-url";
import useSWR from "swr";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export function useAsset({ id }: { id: number | string }) {
  // Build query params dynamically

  const url = `${baseUrl}/asset/${id}`;

  const { data, error, isLoading } = useSWR(url, fetcher);

  return {
    data: data ?? [],
    error,
    isLoading,
  };
}
