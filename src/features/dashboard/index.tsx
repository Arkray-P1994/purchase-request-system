import { useDashboard } from "@/api/fetch-dashboard";
import { Header } from "@/components/layout/header";
import { Main } from "@/components/main";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Spinner from "@/components/ui/spinner";
import {
  CheckCircle2,
  Clock,
  FileText,
  History,
  Hourglass,
  Package,
  XCircle,
} from "lucide-react";
import { RequestDistribution } from "./charts/request-distribution";
import { StatusDistribution } from "./charts/status-distribution";
import { TeamDistribution } from "./charts/team-distribution";
import { CostCenterExpenditure } from "./charts/cost-center-expenditure";
import { StatusBadge } from "../requests/components/status-badge";
import { format } from "date-fns";
import { Link } from "@tanstack/react-router";

export default function DashboardPage() {
  const { data, isLoading } = useDashboard();

  if (isLoading) return <Spinner />;

  const stats = data.statistics;
  const kpis = data.kpis;
  const recentRequests = data.recent_requests;

  const total = stats.Total ?? 0;
  const pending = stats.Pending ?? 0;
  const approved = stats.Approved ?? 0;
  const disapproved = stats.Disapproved ?? 0;
  const draft = stats.Draft ?? 0;
  const draftRequests = data.draft_requests ?? [];

  return (
    <>
      <Header fixed />
      <Main>
        <div className="mb-2 flex items-center justify-between space-y-2">
          <h1 className="text-2xl font-bold tracking-tight">
            Purchase Request Dashboard
          </h1>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Requests</CardTitle>
              <Package className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{total.toLocaleString()}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pending</CardTitle>
              <Hourglass className="h-4 w-4 text-amber-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{pending.toLocaleString()}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Approved</CardTitle>
              <CheckCircle2 className="h-4 w-4 text-emerald-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{approved.toLocaleString()}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Disapproved</CardTitle>
              <XCircle className="h-4 w-4 text-red-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {disapproved.toLocaleString()}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Avg. Approval Time</CardTitle>
              <Clock className="h-4 w-4 text-blue-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{kpis.average_approval_time}</div>
            </CardContent>
          </Card>
        </div>

        <div className="mt-4 grid grid-cols-1 gap-4 lg:grid-cols-6">
          <RequestDistribution data={data.request_distribution} />
          <StatusDistribution data={data.statistics} />
        </div>

        <div className="mt-4 grid grid-cols-1 gap-4 lg:grid-cols-6">
          <TeamDistribution data={data.team_distribution} />
          <CostCenterExpenditure data={data.expenditure_by_cost_center} />
        </div>

        <div className="mt-4 grid grid-cols-1 gap-4 lg:grid-cols-3">
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <History className="h-5 w-5" />
                Recent Requests
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="relative w-full overflow-auto">
                <table className="w-full caption-bottom text-sm">
                  <thead className="[&_tr]:border-b">
                    <tr className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                      <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
                        Ticket ID
                      </th>
                      <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
                        Requestor
                      </th>
                      <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
                        Status
                      </th>
                      <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
                        Date
                      </th>
                    </tr>
                  </thead>
                  <tbody className="[&_tr:last-child]:border-0">
                    {recentRequests.length > 0 ? (
                      recentRequests.map((req) => (
                        <tr
                          key={req.id}
                          className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted"
                        >
                          <td className="p-4 align-middle font-medium">
                            <Link
                              to="/purchase-request/requests/$requestId"
                              params={{ requestId: String(req.id) }}
                              className="text-primary hover:underline"
                            >
                              {req.ticket_id}
                            </Link>
                          </td>
                          <td className="p-4 align-middle">{req.requestor_name}</td>
                          <td className="p-4 align-middle">
                            <StatusBadge status={req.status_name} />
                          </td>
                          <td className="p-4 align-middle text-muted-foreground">
                            {format(new Date(req.created_at), "MMM dd, yyyy")}
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td
                          colSpan={4}
                          className="h-24 text-center align-middle text-muted-foreground"
                        >
                          No recent requests found.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                List of Drafts
              </CardTitle>
            </CardHeader>
            <CardContent>
              {draftRequests.length > 0 ? (
                <div className="space-y-4">
                  {draftRequests.map((req) => (
                    <div key={req.id} className="flex flex-col space-y-1 border-b pb-2 last:border-0 last:pb-0">
                      <Link
                        to="/purchase-request/requests/$requestId"
                        params={{ requestId: String(req.id) }}
                        className="text-sm font-bold text-primary hover:underline"
                      >
                        {req.ticket_id}
                      </Link>
                      <div className="flex items-center justify-between text-xs text-muted-foreground">
                        <span>{req.requestor_name}</span>
                        <span>{format(new Date(req.created_at), "MMM dd")}</span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-6 text-center">
                  <div className="text-4xl font-bold text-muted-foreground/30">
                    {draft}
                  </div>
                  <p className="mt-2 text-sm text-muted-foreground">
                    No drafts found.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </Main>
    </>
  );
}
