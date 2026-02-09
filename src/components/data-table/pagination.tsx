import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn, getPageNumbers } from "@/lib/utils";
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  DoubleArrowLeftIcon,
  DoubleArrowRightIcon,
} from "@radix-ui/react-icons";
import { type Table } from "@tanstack/react-table";

type DataTablePaginationProps<TData> = {
  table: Table<TData>;
  totalPages: number;
};

export function DataTablePagination<TData>({
  table,
  totalPages,
}: DataTablePaginationProps<TData>) {
  // Use the table's internal state which is synced to the URL via useTableUrlState
  const { pageIndex, pageSize } = table.getState().pagination;
  const currentPage = pageIndex + 1;
  const pageNumbers = getPageNumbers(currentPage, totalPages);

  const handlePageChange = (newPage: number) => {
    table.setPageIndex(newPage - 1);
  };

  const handleLimitChange = (newLimit: string) => {
    table.setPageSize(Number(newLimit));
  };

  return (
    <div className={cn("flex items-center justify-between px-2")}>
      <div className="flex items-center gap-2">
        <p className="text-sm font-medium">Rows per page</p>
        <Select value={`${pageSize}`} onValueChange={handleLimitChange}>
          <SelectTrigger className="h-8 w-[70px]">
            <SelectValue placeholder={pageSize} />
          </SelectTrigger>
          <SelectContent side="top">
            {[10, 20, 30, 40, 50].map((size) => (
              <SelectItem key={size} value={`${size}`}>
                {size}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="flex items-center space-x-2">
        <div className="text-sm font-medium">
          Page {currentPage} of {totalPages}
        </div>

        <Button
          variant="outline"
          className="size-8 p-0"
          onClick={() => handlePageChange(1)}
          disabled={currentPage === 1}
        >
          <DoubleArrowLeftIcon className="h-4 w-4" />
        </Button>

        <Button
          variant="outline"
          className="size-8 p-0"
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
        >
          <ChevronLeftIcon className="h-4 w-4" />
        </Button>

        {pageNumbers.map((pageNumber, index) => (
          <div key={`${pageNumber}-${index}`}>
            {pageNumber === "..." ? (
              <span className="px-2">...</span>
            ) : (
              <Button
                variant={currentPage === pageNumber ? "default" : "outline"}
                className="size-8"
                onClick={() => handlePageChange(pageNumber as number)}
              >
                {pageNumber}
              </Button>
            )}
          </div>
        ))}

        <Button
          variant="outline"
          className="size-8 p-0"
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage >= totalPages}
        >
          <ChevronRightIcon className="h-4 w-4" />
        </Button>

        <Button
          variant="outline"
          className="size-8 p-0"
          onClick={() => handlePageChange(totalPages)}
          disabled={currentPage >= totalPages}
        >
          <DoubleArrowRightIcon className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
