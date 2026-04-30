import { Header } from "@/components/layout/header";
import { useSearch } from "@tanstack/react-router";
import { ConfigDrawer } from "@/components/layout/config-drawer";
import { Main } from "@/components/main";
import { ModeToggle } from "@/components/toggle";
import { useApprovalLogs } from "@/api/fetch-logs";
import { DataTable } from "./components/table";
import { useQueryState } from "nuqs";
import { GitPullRequest } from "lucide-react";

export function TimelinePage() {
  const search = useSearch({ from: "/purchase-request/timeline/" }) as {
    filter?: string;
  };
  const [page] = useQueryState("page", { defaultValue: "1" });
  const [limit] = useQueryState("pageSize", { defaultValue: "10" });
  const [sort] = useQueryState("sort", { defaultValue: "" });

  const { data } = useApprovalLogs({
    page: String(page),
    limit: String(limit),
    filter: search.filter ? String(search.filter) : "",
    sort: String(sort),
  });

  return (
    <>
      <Header fixed>
        <div className="ms-auto flex items-center space-x-4">
          <ModeToggle />
          <ConfigDrawer />
        </div>
      </Header>
      <Main>
        <div className="mb-4 flex flex-wrap items-center justify-between space-y-2 gap-x-4 border-b pb-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-primary/10 text-primary">
               <GitPullRequest className="h-6 w-6" />
            </div>
            <div>
              <h2 className="text-2xl font-bold tracking-tight">Approval Timeline</h2>
              <p className="text-muted-foreground text-sm">
                Track the progress and history of request approvals across all levels.
              </p>
            </div>
          </div>
        </div>

        <div className="-mx-4 flex-1 overflow-disable px-4 py-1 lg:flex-row lg:space-y-0 lg:space-x-12">
          <DataTable data={data ?? { data: [], total: 0, total_pages: 0 }} />
        </div>
      </Main>
    </>
  );
}
