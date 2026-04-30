import { useActivityLogs } from "@/api/fetch-logs";
import { ConfigDrawer } from "@/components/layout/config-drawer";
import { Header } from "@/components/layout/header";
import { Main } from "@/components/main";
import { ModeToggle } from "@/components/toggle";
import { useSearch } from "@tanstack/react-router";
import { useQueryState } from "nuqs";
import { DataTable } from "./components/table";

export function ActivityLogsPage() {
  const search = useSearch({ from: "/history/" }) as {
    filter?: string;
  };
  const [page] = useQueryState("page", { defaultValue: "1" });
  const [limit] = useQueryState("pageSize", { defaultValue: "10" });
  const [sort] = useQueryState("sort", { defaultValue: "" });

  const { data } = useActivityLogs({
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
        <div className="mb-2 flex flex-wrap items-center justify-between space-y-2 gap-x-4">
          <div>
            <h2 className="text-2xl font-bold tracking-tight">Activity Logs</h2>
            <p className="text-muted-foreground">
              A chronological record of system activities and changes.
            </p>
          </div>
        </div>

        <div className="-mx-4 flex-1 overflow-disable px-4 py-1 lg:flex-row lg:space-y-0 lg:space-x-12">
          <DataTable data={data ?? { data: [], total: 0, total_pages: 0 }} />
        </div>
      </Main>
    </>
  );
}
