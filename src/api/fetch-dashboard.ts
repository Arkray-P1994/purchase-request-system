import { baseUrl } from "@/lib/base-url";
import useSWR from "swr";

export interface DashboardStatistics {
  Total: number;
  Pending: number;
  Approved: number;
  Disapproved: number;
  "For Cash Release": number;
  "Cash Released": number;
  Draft: number;
  [key: string]: number;
}

export interface RecentRequest {
  id: number;
  ticket_id: string;
  created_at: string;
  status_name: string;
  requestor_name: string;
}

export interface DashboardData {
  statistics: DashboardStatistics;
  recent_requests: RecentRequest[];
}

const fetcher = (url: string) =>
  fetch(url, {
    credentials: "include",
  }).then((res) => res.json());

export function useDashboard() {
  const url = `${baseUrl}/dashboard`;

  const { data, error, isLoading } = useSWR<DashboardData>(url, fetcher);

  return {
    data: data ?? {
      statistics: { Total: 0, Pending: 0, Approved: 0, Disapproved: 0, "For Cash Release": 0, "Cash Released": 0, Draft: 0 },
      recent_requests: [],
    },
    error,
    isLoading,
  };
}
