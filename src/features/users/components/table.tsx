import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useTableUrlState } from "@/hooks/use-table-url-state";
import { rankItem, type RankingInfo } from "@tanstack/match-sorter-utils";
import { getRouteApi } from "@tanstack/react-router";
import {
  flexRender,
  getCoreRowModel,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getFilteredRowModel,
  getPaginationRowModel,
  useReactTable,
  type FilterFn,
  type VisibilityState,
} from "@tanstack/react-table";
import { useCallback, useEffect, useMemo, useState } from "react";
import { Columns as columns } from "./columns";
import { User } from "../schema";
import { DataTableUserToolbar } from "./toolbar";
import { DataTablePagination } from "@/components/data-table";

const route = getRouteApi("/purchase-request/users/");

/**
 * 1. Define the Response Structure
 * This matches your PHP Controller output
 */
export type ApiResponse = {
  data: User[];
  uniques?: {
    remarks: string[];
    location: string[];
    asset_name: string[];
  };
  total: number;
  total_pages: number;
  filters_applied?: any;
};

type DataTableProps = {
  data: ApiResponse;
};

declare module "@tanstack/react-table" {
  interface FilterFns {
    fuzzy: FilterFn<unknown>;
  }
  interface FilterMeta {
    itemRank: RankingInfo;
  }
}

const fuzzyFilter: FilterFn<any> = (row, columnId, value, addMeta) => {
  const itemRank = rankItem(row.getValue(columnId), value);
  addMeta({ itemRank });
  return itemRank.passed;
};

export function DataTable({ data }: DataTableProps) {
  const isBrowser = typeof window !== "undefined";

  // Safely extract the array for the table
  const tableData = useMemo(() => data?.data || [], [data]);

  const allowedColumnIds = useMemo(() => {
    return new Set(
      columns
        .map((c) => (c as any).id ?? (c as any).accessorKey)
        .filter(Boolean),
    );
  }, []);

  const defaultVisibility: VisibilityState = {};
  const [rowSelection, setRowSelection] = useState({});
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>(
    () => {
      if (!isBrowser) return defaultVisibility;
      try {
        const raw = window.localStorage.getItem(`data-table:columnVisibility`);
        if (!raw) return defaultVisibility;
        const parsed = JSON.parse(raw) as VisibilityState;
        return Object.fromEntries(
          Object.entries(parsed).filter(([key]) => allowedColumnIds.has(key)),
        ) as VisibilityState;
      } catch {
        return defaultVisibility;
      }
    },
  );

  const persistVisibility = useCallback(
    (next: VisibilityState) => {
      if (!isBrowser) return;
      try {
        window.localStorage.setItem(
          `data-table:columnVisibility`,
          JSON.stringify(next),
        );
      } catch {
        /* ignore */
      }
    },
    [isBrowser],
  );

  const {
    globalFilter,
    onGlobalFilterChange,
    columnFilters,
    onColumnFiltersChange,
    pagination,
    onPaginationChange,
    ensurePageInRange,
  } = useTableUrlState({
    search: route.useSearch(),
    navigate: route.useNavigate(),
    pagination: { defaultPage: 1, defaultPageSize: 10 },
    globalFilter: { enabled: true, key: "filter" },
    columnFilters: [
      { columnId: "status", searchKey: "status", type: "array" },
      { columnId: "priority", searchKey: "priority", type: "array" },
    ],
  });

  const table = useReactTable({
    data: tableData, // 2. Pass the array inside the object
    columns,
    state: {
      columnVisibility,
      rowSelection,
      columnFilters,
      globalFilter,
      pagination,
    },
    autoResetPageIndex: false,
    manualPagination: true,
    enableRowSelection: true,
    onRowSelectionChange: setRowSelection,
    onColumnVisibilityChange: (updater) => {
      setColumnVisibility((prev) => {
        const next = typeof updater === "function" ? updater(prev) : updater;
        persistVisibility(next);
        return next;
      });
    },
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
    onPaginationChange,
    onGlobalFilterChange,
    onColumnFiltersChange,
    filterFns: { fuzzy: fuzzyFilter },
  });

  const pageCount = data?.total_pages ?? 0;
  useEffect(() => {
    ensurePageInRange(pageCount);
  }, [pageCount, ensurePageInRange]);

  return (
    <div className="space-y-4 max-sm:has-[div[role='toolbar']]:mb-16">
      {/* 3. Pass uniques to the toolbar for faceted filtering */}
      <DataTableUserToolbar table={table} searchPlaceholder="Search..." />
      <div className="relative overflow-auto rounded-md border">
        <Table>
          <TableHeader className="text-red-500">
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  const isActionsCol = header.column.id === "actions";
                  return (
                    <TableHead
                      key={header.id}
                      colSpan={header.colSpan}
                      className={
                        isActionsCol
                          ? "sticky right-0 z-30 backdrop-blur-xl border-l"
                          : undefined
                      }
                    >
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext(),
                          )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                  className="border-bottom"
                >
                  {row.getVisibleCells().map((cell) => {
                    const isActionsCell = cell.column.id === "actions";
                    return (
                      <TableCell
                        key={cell.id}
                        className={
                          isActionsCell
                            ? "sticky right-0 z-30 after:bg-background/20 after:absolute after:inset-0 after:-z-10 after:backdrop-blur-lg"
                            : undefined
                        }
                      >
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext(),
                        )}
                      </TableCell>
                    );
                  })}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <DataTablePagination totalPages={data.total_pages} table={table} />
    </div>
  );
}
