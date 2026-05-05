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

export interface RequestDistribution {
  seven_days: { date: string; count: number }[];
  thirty_days: { date: string; count: number }[];
  yearly: { month: string; count: number }[];
}

export interface ExpenditureByCostCenter {
  cost_center: string;
  total: number | string;
}

export interface TeamDistribution {
  team_name: string;
  count: number;
}

export interface DashboardKPIs {
  average_approval_time: string;
}

export interface DashboardData {
  statistics: DashboardStatistics;
  recent_requests: RecentRequest[];
  request_distribution: RequestDistribution;
  expenditure_by_cost_center: ExpenditureByCostCenter[];
  team_distribution: TeamDistribution[];
  draft_requests: RecentRequest[];
  kpis: DashboardKPIs;
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
      request_distribution: { seven_days: [], thirty_days: [], yearly: [] },
      expenditure_by_cost_center: [],
      team_distribution: [],
      draft_requests: [],
      kpis: { average_approval_time: "N/A" },
    },
    error,
    isLoading,
  };
}
