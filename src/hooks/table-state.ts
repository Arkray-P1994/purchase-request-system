import { useQueryState } from "nuqs";

interface TableStateProps {
  pageKey?: string;
  limitKey?: string;
  sortKey?: string;
  filterKey?: string;
  defaultPageSize?: string;
}

export function useDataTableState({
  pageKey = "page",
  limitKey = "pageSize",
  sortKey = "sort",
  filterKey = "filter",
  defaultPageSize = "10",
}: TableStateProps = {}) {
  const [page, setPage] = useQueryState(pageKey, { defaultValue: "1" });
  const [limit, setLimit] = useQueryState(limitKey, {
    defaultValue: defaultPageSize,
  });
  const [sort, setSort] = useQueryState(sortKey, { defaultValue: "" });
  const [globalFilter, setGlobalFilter] = useQueryState(filterKey, {
    defaultValue: "",
  });

  const tableState = {
    pagination: {
      pageIndex: parseInt(page) - 1,
      pageSize: parseInt(limit),
    },
    onPaginationChange: (updater: any) => {
      const newState =
        typeof updater === "function"
          ? updater({
              pageIndex: parseInt(page) - 1,
              pageSize: parseInt(limit),
            })
          : updater;
      setPage(String(newState.pageIndex + 1));
      setLimit(String(newState.pageSize));
    },
    globalFilter: globalFilter,
    onGlobalFilterChange: (value: string) => setGlobalFilter(value),
    columnFilters: [],
    onColumnFiltersChange: () => {},
    ensurePageInRange: () => {},
  };

  return {
    page,
    limit,
    sort,
    globalFilter,
    setPage,
    setLimit,
    setSort,
    setGlobalFilter,
    tableState,
  };
}
