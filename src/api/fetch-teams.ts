import { baseUrl } from "@/lib/base-url";
import useSWR from "swr";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export function useTeams({
  page,
  limit,
  filter,
  sort,
  remarks,
  location,
  id,
}: {
  page?: string;
  limit?: string;
  filter?: string;
  sort?: string;
  remarks?: string;
  location?: string;
  id?: string;
} = {}) {
  // Build query params dynamically
  const params = new URLSearchParams();

  if (page) params.append("page", page);
  if (limit) params.append("limit", limit);
  if (filter) params.append("search", filter);
  if (sort) params.append("sort", sort);
  if (remarks) params.append("remarks", remarks);
  if (location) params.append("location", location);
  if (id) params.append("id", id);

  const url =
    params.toString().length > 0
      ? `${baseUrl}/teams?${params.toString()}`
      : `${baseUrl}/teams`;

  const { data, error, isLoading } = useSWR(url, fetcher, {
    keepPreviousData: true,
  });

  return {
    data: data ?? [],
    error,
    isLoading,
  };
}
