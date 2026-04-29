import { baseUrl } from "@/lib/base-url";
import useSWR from "swr";

const fetcher = (url: string) =>
  fetch(url, {
    credentials: "include",
  }).then((res) => res.json());

export function useApprovers(params: { team_id?: string | number } = {}) {
  const query = new URLSearchParams();
  if (params.team_id) query.append("team_id", String(params.team_id));
  query.append("limit", "all");

  const url = `${baseUrl}/approvers?${query.toString()}`;
  const { data, error, isLoading, mutate } = useSWR(url, fetcher);

  return {
    approvers: data?.data ?? [],
    error,
    isLoading,
    mutate,
  };
}
