import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Link } from "@tanstack/react-router";
import type { Row } from "@tanstack/react-table";
import { Eye, Pencil } from "lucide-react";
import { Request } from "./schema";

interface DataTableRowActionsProps {
  row: Row<Request>;
}

export function DataTableRowActions({
  row,
}: DataTableRowActionsProps) {
  return (
    <div className="flex gap-1 items-center justify-end">
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Link
              to="/purchase-request/requests/$requestId"
              params={{ requestId: row.original.id.toString() }}
            >
              <Button
                variant="ghost"
                className="h-8 w-8 p-0 hover:bg-primary/10 hover:text-primary text-muted-foreground transition-colors"
              >
                <Eye className="h-4 w-4" />
              </Button>
            </Link>
          </TooltipTrigger>
          <TooltipContent side="bottom">
            <p className="text-[10px] font-bold">View Request</p>
          </TooltipContent>
        </Tooltip>
        
        <Tooltip>
          <TooltipTrigger asChild>
            <Link
              to="/purchase-request/requests/$requestId/edit"
              params={{ requestId: row.original.id.toString() }}
            >
              <Button
                variant="ghost"
                className="h-8 w-8 p-0 hover:bg-primary/10 hover:text-primary text-muted-foreground transition-colors"
              >
                <Pencil className="h-4 w-4" />
              </Button>
            </Link>
          </TooltipTrigger>
          <TooltipContent side="bottom">
            <p className="text-[10px] font-bold">Edit Request</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>
  );
}
