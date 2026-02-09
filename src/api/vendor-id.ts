import { baseUrl } from "@/lib/base-url";
import useSWR from "swr";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export function useVendorId({ id }: { id: number }) {
  const { data, error, isLoading } = useSWR(
    `${baseUrl}/vendor/${id}.json`,
    fetcher
  );

  return {
    data: data ?? [],
    error,
    isLoading,
  };
}
