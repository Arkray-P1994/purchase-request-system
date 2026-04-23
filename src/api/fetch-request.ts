import { baseUrl } from "@/lib/base-url";
import useSWR from "swr";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export function useRequest({ id }: { id: number | string }) {
  const url = `${baseUrl}/request/${id}`;

  const { data, error, isLoading } = useSWR(url, fetcher);

  return {
    data: data?.data,
    error,
    isLoading,
  };
}
