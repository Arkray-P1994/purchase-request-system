import { DataTableViewOptions } from "@/components/data-table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Cross2Icon } from "@radix-ui/react-icons";
import { type Table } from "@tanstack/react-table";
import { debounce, useQueryState } from "nuqs";

type DataTableToolbarProps<TData> = {
  table: Table<TData>;
  searchPlaceholder?: string;
  searchKey?: string;
};

export function DataTableUserToolbar<TData>({
  table,
  searchPlaceholder = "Filter...",
}: DataTableToolbarProps<TData>) {
  // 1. Explicitly track pageSize.
  // We don't use the setter, but this "registers" the param with nuqs in this component.
  // const [pageSize] = useQueryState("pageSize", parseAsString.withDefault("10"));

  // 2. Global filter state
  const [filter, setfilter] = useQueryState("filter", {
    defaultValue: "",
    shallow: true, // Keep it shallow to avoid full page reloads
    clearOnDefault: true,
    limitUrlUpdates: debounce(500),
  });

  // 3. Page state
  const [page, setPage] = useQueryState("page", {
    defaultValue: "1",
    shallow: true,
  });

  const handleSearchChange = async (value: string | null) => {
    // We update the filter.
    // nuqs naturally preserves other existing params in the URL (like pageSize)
    // unless they are explicitly set to null.
    await setfilter(value || null);

    // Reset to page 1 when searching
    if (page !== "1") {
      await setPage(null);
    }
  };

  const isFiltered = filter !== "" || table.getState().columnFilters.length > 0;

  return (
    <div className="flex items-center justify-between">
      <div className="flex flex-1 flex-col-reverse items-start gap-y-2 sm:flex-row sm:items-center sm:space-x-2">
        <Input
          placeholder={searchPlaceholder}
          value={filter ?? ""}
          onChange={(e) => handleSearchChange(e.target.value)}
          className="h-8 w-[150px] lg:w-[250px]"
        />

        {isFiltered && (
          <Button
            variant="ghost"
            onClick={() => {
              table.resetColumnFilters();
              table.setGlobalFilter("");
              setfilter(null);
              setPage(null);
            }}
            className="h-8 px-2 lg:px-3"
          >
            Reset
            <Cross2Icon className="ms-2 h-4 w-4" />
          </Button>
        )}
      </div>
      <div className="flex gap-2">
        <DataTableViewOptions table={table} />
      </div>
    </div>
  );
}
