import { useRequests } from "@/api/fetch-requests";
import { DataTableToolbar } from "@/components/data-table";
import { ConfigDrawer } from "@/components/layout/config-drawer";
import { Header } from "@/components/layout/header";
import { Main } from "@/components/main";
import { DataTable } from "@/components/table";
import { ModeToggle } from "@/components/toggle";
import { Button } from "@/components/ui/button";
import { useDataTableState } from "@/hooks/table-state";
import { Link, useSearch } from "@tanstack/react-router";
import { Plus } from "lucide-react";
import { Columns } from "./components/columns";
import { ViewRequest } from "./components/view";
import { CreateRequestPage } from "./create";
import { EditRequestPage } from "./edit";

export function RequestsPage() {
  const search = useSearch({ from: "/purchase-request/requests/" }) as any;
  const { requestId, action } = search;

  if (requestId && action === "edit") {
    return <EditRequestPage />;
  }

  if (requestId) {
    return <ViewRequest />;
  }

  if (action === "create") {
    return <CreateRequestPage />;
  }

  return <RequestsList search={search} />;
}

function RequestsList({ search }: { search: any }) {
  const { page, limit, sort, tableState } = useDataTableState();
  const { data } = useRequests({
    page: String(page),
    limit: String(limit),
    filter: search.filter ? String(search.filter) : "",
    sort: String(sort),
    ...search,
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
            <h2 className="text-2xl font-bold tracking-tight text-primary">
              Purchase Requests
            </h2>
            <p className="text-muted-foreground">
              Manage and track your procurement requests here.
            </p>
          </div>
          <Link to="/purchase-request/requests" search={{ action: "create" }}>
            <Button
              size="lg"
              className="shadow-md hover:shadow-lg transition-all"
            >
              <Plus className="mr-2 h-4 w-4" />
              Create Request
            </Button>
          </Link>
        </div>

        <div className="-mx-4 flex-1 overflow-disable px-4 py-1 lg:flex-row lg:space-y-0 lg:space-x-12">
          <DataTable
            columns={Columns}
            data={data ?? []}
            urlState={tableState}
            storageKey="vendor-table"
            renderToolbar={(table) => (
              <DataTableToolbar
                table={table}
                searchPlaceholder="Search Vendors..."
              />
            )}
          />
        </div>
      </Main>
    </>
  );
}
