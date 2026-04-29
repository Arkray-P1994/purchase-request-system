import { baseUrl } from "@/lib/base-url";
import useSWR from "swr";

const fetcher = (url: string) =>
  fetch(url, {
    credentials: "include",
  }).then((res) => res.json());

export function useTeams() {
  const { data, error, isLoading } = useSWR(`${baseUrl}/teams?limit=all`, fetcher);

  return {
    teams: data?.data ?? [],
    error,
    isLoading,
  };
}
