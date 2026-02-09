import {
  ArrowDownIcon,
  ArrowUpIcon,
  CaretSortIcon,
  EyeNoneIcon,
} from "@radix-ui/react-icons";
import { type Column } from "@tanstack/react-table";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useQueryState } from "nuqs";

type DataTableColumnHeaderProps<TData, TValue> =
  React.HTMLAttributes<HTMLDivElement> & {
    column: Column<TData, TValue>;
    title: string;
  };

export function DataTableColumnHeader<TData, TValue>({
  column,
  title,
  className,
}: DataTableColumnHeaderProps<TData, TValue>) {
  if (!column.getCanSort()) {
    return <div className={cn(className)}>{title}</div>;
  }

  const [sorting, setSorting] = useQueryState("sort", {
    defaultValue: "",
  });
  return (
    <div className={cn("flex items-center space-x-2", className)}>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            size="sm"
            className="data-[state=open]:bg-accent -ms-3 h-8"
          >
            <span>{title}</span>
            {sorting === `${column.id}:desc` ? (
              <ArrowDownIcon className="ms-2 h-4 w-4" />
            ) : sorting === `${column.id}:asc` ? (
              <ArrowUpIcon className="ms-2 h-4 w-4" />
            ) : (
              <CaretSortIcon className="ms-2 h-4 w-4" />
            )}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start">
          <DropdownMenuItem onClick={() => setSorting(`${column.id}:asc`)}>
            <ArrowUpIcon className="text-muted-foreground/70 size-3.5" />
            Asc
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setSorting(`${column.id}:desc`)}>
            <ArrowDownIcon className="text-muted-foreground/70 size-3.5" />
            Desc
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => setSorting("")}
            disabled={sorting === ""}
          >
            <CaretSortIcon className="text-muted-foreground/70 size-3.5" />
            Reset
          </DropdownMenuItem>
          {column.getCanHide() && (
            <>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => column.toggleVisibility(false)}>
                <EyeNoneIcon className="text-muted-foreground/70 size-3.5" />
                Hide
              </DropdownMenuItem>
            </>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
