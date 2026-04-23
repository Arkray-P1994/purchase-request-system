import { useSearchParams } from "@/api/data";
import { Header } from "@/components/layout/header";
import { useSearch } from "@tanstack/react-router";
import { ConfigDrawer } from "@/components/layout/config-drawer";
import { Main } from "@/components/main";
import { ModeToggle } from "@/components/toggle";
import { DataTable } from "@/components/table";

import { Columns } from "./components/columns";
import { useDataTableState } from "@/hooks/table-state";

export function AssetPage() {
  const { tableState } = useDataTableState();
  const search = useSearch({ from: "/asset-inventory/assets/" }) as any;
  const { data } = useSearchParams(search);
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
            <h2 className="text-2xl font-bold tracking-tight">Assets List</h2>
            <p className="text-muted-foreground">
              Here&apos;s a list of assets.
            </p>
          </div>
        </div>
        {/* {data.data.map((asset) => (
          <AssetTag asset={asset} />
        ))} */}

        {/* <TasksPrimaryButtons /> */}

        <div></div>
        <div className="-mx-4 flex-1 overflow-disable px-4 py-1 lg:flex-row lg:space-y-0 lg:space-x-12">
          <DataTable data={data} columns={Columns} urlState={tableState} />
        </div>
      </Main>
    </>
  );
}
