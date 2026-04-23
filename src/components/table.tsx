import { DataTablePagination } from "@/components/data-table/pagination";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { rankItem, type RankingInfo } from "@tanstack/match-sorter-utils";
import {
  flexRender,
  getCoreRowModel,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getFilteredRowModel,
  getPaginationRowModel,
  useReactTable,
  type ColumnDef,
  type FilterFn,
  type Table as TableType,
  type VisibilityState,
  type PaginationState,
  type ColumnFiltersState,
} from "@tanstack/react-table";
import { useCallback, useEffect, useMemo, useState, ReactNode } from "react";

export type ApiResponse<T> = {
  data: T[];
  total: number;
  total_pages: number;
  uniques?: Record<string, string[]>;
  filters_applied?: any;
};

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: ApiResponse<TData>;
  urlState: {
    pagination?: PaginationState;
    onPaginationChange: (updater: any) => void;
    globalFilter?: string;
    onGlobalFilterChange: (value: string) => void;
    columnFilters?: ColumnFiltersState;
    onColumnFiltersChange: (updater: any) => void;
    ensurePageInRange: (pageCount: number) => void;
  };
  renderToolbar?: (table: TableType<TData>) => ReactNode;
  storageKey?: string;
}

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

export function DataTable<TData, TValue>({
  columns,
  data,
  urlState,
  renderToolbar,
  storageKey = "data-table",
}: DataTableProps<TData, TValue>) {
  const isBrowser = typeof window !== "undefined";
  const tableData = useMemo(() => data?.data || [], [data]);

  const allowedColumnIds = useMemo(() => {
    return new Set(
      columns
        .map((c) => (c as any).id ?? (c as any).accessorKey)
        .filter(Boolean),
    );
  }, [columns]);

  const [rowSelection, setRowSelection] = useState({});
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>(
    () => {
      if (!isBrowser) return {};
      try {
        const raw = window.localStorage.getItem(
          `${storageKey}:columnVisibility`,
        );
        if (!raw) return {};
        const parsed = JSON.parse(raw) as VisibilityState;
        return Object.fromEntries(
          Object.entries(parsed).filter(([key]) => allowedColumnIds.has(key)),
        );
      } catch {
        return {};
      }
    },
  );

  const persistVisibility = useCallback(
    (next: VisibilityState) => {
      if (!isBrowser) return;
      window.localStorage.setItem(
        `${storageKey}:columnVisibility`,
        JSON.stringify(next),
      );
    },
    [isBrowser, storageKey],
  );

  const {
    globalFilter = "",
    onGlobalFilterChange,
    columnFilters = [],
    onColumnFiltersChange,
    pagination = { pageIndex: 0, pageSize: 10 },
    onPaginationChange,
    ensurePageInRange,
  } = urlState;

  const table = useReactTable({
    data: tableData,
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
    if (ensurePageInRange) {
      ensurePageInRange(pageCount);
    }
  }, [pageCount, ensurePageInRange]);

  return (
    <div className="space-y-4 max-sm:has-[div[role='toolbar']]:mb-16">
      {renderToolbar?.(table)}
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
