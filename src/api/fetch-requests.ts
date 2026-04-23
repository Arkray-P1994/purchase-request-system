import { baseUrl } from "@/lib/base-url";
import useSWR from "swr";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export function useRequests({
  page,
  limit,
  filter,
  sort,
  id,
  ...extraFilters
}: {
  page?: string;
  limit?: string;
  filter?: string;
  sort?: string;
  id?: string;
  [key: string]: string | undefined;
} = {}) {
  const params = new URLSearchParams();

  if (page) params.append("page", page);
  if (limit) params.append("limit", limit);
  if (filter) params.append("search", filter);
  if (sort) params.append("sort", sort);
  if (id) params.append("id", id);

  Object.entries(extraFilters).forEach(([key, value]) => {
    if (value) {
      params.append(key, value);
    }
  });

  const queryString = params.toString();
  const url = queryString
    ? `${baseUrl}/requests?${queryString}`
    : `${baseUrl}/requests`;

  const { data, error, isLoading } = useSWR(url, fetcher, {
    keepPreviousData: true,
  });

  return {
    data: data ?? { data: [], total: 0, total_pages: 0 },
    error,
    isLoading,
  };
}
