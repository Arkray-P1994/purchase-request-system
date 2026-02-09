import { baseUrl } from "@/lib/base-url";
import useSWR from "swr";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export function useFetchRequests({
  page,
  limit,
  filter,
  sort,
}: { page?: string; limit?: string; filter?: string; sort?: string } = {}) {
  // Build query params dynamically
  const params = new URLSearchParams();

  if (page) params.append("page", page);
  if (limit) params.append("limit", limit);
  if (filter) params.append("search", filter);
  if (sort) params.append("sort", sort);

  const url =
    params.toString().length > 0
      ? `${baseUrl}/quotation/index.json?${params.toString()}`
      : `${baseUrl}/quotation/index.json`;

  const { data, error, isLoading } = useSWR(url, fetcher, {
    keepPreviousData: true,
  });

  return {
    data: data ?? [],
    error,
    isLoading,
  };
}
