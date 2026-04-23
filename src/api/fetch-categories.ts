import { baseUrl } from "@/lib/base-url";
import useSWR from "swr";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export function useCategories({
  page,
  limit,
  filter,
  sort,
  remarks,
}: {
  page?: string;
  limit?: string;
  filter?: string;
  sort?: string;
  remarks?: string;
} = {}) {
  const params = new URLSearchParams();

  if (page) params.append("page", page);
  if (limit) params.append("limit", limit);
  if (filter) params.append("search", filter);
  if (sort) params.append("sort", sort);
  if (remarks) params.append("remarks", remarks);

  const url =
    params.toString().length > 0
      ? `${baseUrl}/categories?${params.toString()}`
      : `${baseUrl}/categories`;

  const { data, error, isLoading } = useSWR(url, fetcher, {
    keepPreviousData: true,
  });

  return {
    data: data ?? [],
    error,
    isLoading,
  };
}
