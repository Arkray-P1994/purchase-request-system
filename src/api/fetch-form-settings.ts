import { baseUrl } from "@/lib/base-url";
import useSWR from "swr";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export function useFormSettings() {
  const url = `${baseUrl}/form-settings`;

  const { data, error, isLoading } = useSWR(url, fetcher, {
    keepPreviousData: true,
  });

  return {
    data: data ?? { statuses: [], teams: [] },
    error,
    isLoading,
  };
}
