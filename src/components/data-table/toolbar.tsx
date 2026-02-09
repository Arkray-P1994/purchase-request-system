import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import AssetInsertForm from "@/features/assets/components/forms/insert";
import PrintList from "@/features/assets/print/print-list";
import { PrintView } from "@/features/assets/print/print-view";
import { Cross2Icon } from "@radix-ui/react-icons";
import { type Table } from "@tanstack/react-table";
import { debounce, useQueryState } from "nuqs";
import { useState } from "react";
import { LedgerActionsSheet } from "../sheet/actions-sheet";
import { DataTableViewOptions } from "./view-options";
import { useIdStore } from "@/features/assets/store";
import { useUser } from "@/api/fetch-user";
type DataTableToolbarProps<TData> = {
  table: Table<TData>;
  searchPlaceholder?: string;
  searchKey?: string;
};

export function DataTableToolbar<TData>({
  table,
  searchPlaceholder = "Filter...",
}: DataTableToolbarProps<TData>) {
  const { user } = useUser();

  const [open, setOpen] = useState(false);
  const [openPrintList, setOpenPrintList] = useState(false);
  const { ids } = useIdStore();
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
        {user.user.position === "superadmin" && (
          <LedgerActionsSheet
            title="Create New Asset"
            buttonName="New Asset"
            open={open}
            setOpen={setOpen}
          >
            <AssetInsertForm action={"create"} setOpen={setOpen} />
          </LedgerActionsSheet>
        )}

        {ids.length > 0 && (
          <LedgerActionsSheet
            title="Print List"
            buttonName="Print List"
            open={openPrintList}
            setOpen={setOpenPrintList}
          >
            <div className="grid  grid-cols-1">
              <Dialog>
                <DialogTrigger className="mx-4">
                  <Button className="w-full">Proceed to Print</Button>
                </DialogTrigger>
                <DialogContent className="min-w-full">
                  <PrintView />
                </DialogContent>
              </Dialog>
              <PrintList />
            </div>
          </LedgerActionsSheet>
        )}
      </div>
    </div>
  );
}
