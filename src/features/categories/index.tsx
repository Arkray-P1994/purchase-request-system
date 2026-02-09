import { Header } from "@/components/layout/header";
import { useSearch } from "@tanstack/react-router";

import { useCategories } from "@/api/fetch-categories";
import { ConfigDrawer } from "@/components/layout/config-drawer";
import { Main } from "@/components/main";
import { ModeToggle } from "@/components/toggle";
import { useQueryState } from "nuqs";
import { DataTable } from "./components/table";

export function CategoriesPage() {
  const search = useSearch({ from: "/asset-inventory/categories/" }) as {
    filter?: string;
  };
  const [page] = useQueryState("page", { defaultValue: "1" });
  const [limit] = useQueryState("pageSize", { defaultValue: "10" });
  const [sort] = useQueryState("sort", { defaultValue: "" });
  const [remarks] = useQueryState("remarks", { defaultValue: "" });
  const { data } = useCategories({
    page: String(page),
    limit: String(limit),
    filter: search.filter ? String(search.filter) : "",
    sort: String(sort),
    remarks: String(remarks),
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
            <h2 className="text-2xl font-bold tracking-tight">
              Categories Page
            </h2>
            <p className="text-muted-foreground">
              Here&apos;s a list of categories.
            </p>
          </div>
        </div>
        {/* {data.data.map((asset) => (
          <AssetTag asset={asset} />
        ))} */}

        {/* <TasksPrimaryButtons /> */}

        <div></div>
        <div className="-mx-4 flex-1 overflow-disable px-4 py-1 lg:flex-row lg:space-y-0 lg:space-x-12">
          <DataTable data={data ?? []} />
        </div>
      </Main>
    </>
  );
}
