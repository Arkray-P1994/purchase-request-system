import type { Row } from "@tanstack/react-table";
import { useState } from "react";
import { DeleteUser } from "./delete-user";
import { EditUserForm } from "./forms/edit-form";
import { ResetPassword } from "./reset-password";
import { Button } from "@/components/ui/button";
import { Edit, Eye } from "lucide-react";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { Link } from "@tanstack/react-router";

interface DataTableRowActionsProps<TData extends { id: string | number }> {
  row: Row<TData>;
}

export function DataTableRowActions<TData extends { id: string | number }>({
  row,
}: DataTableRowActionsProps<TData>) {
  const [open, setOpen] = useState(false);
  
  return (
    <div className="flex gap-1 items-center">
      <Tooltip delayDuration={0}>
        <TooltipTrigger asChild>
          <Link
            to="/purchase-request/users/$userId"
            params={{ userId: row.original.id.toString() }}
          >
            <Button
              variant="ghost"
              size="sm"
              className="cursor-pointer h-8 w-8 p-0 hover:bg-blue-50 hover:text-blue-600 text-blue-500"
            >
              <Eye className="h-4 w-4" />
            </Button>
          </Link>
        </TooltipTrigger>
        <TooltipContent side="bottom">
          <p>View</p>
        </TooltipContent>
      </Tooltip>

      <Tooltip delayDuration={0}>
        <TooltipTrigger asChild>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setOpen(true)}
            className="cursor-pointer h-8 w-8 p-0 hover:bg-green-50 hover:text-green-600 text-green-500"
          >
            <Edit className="h-4 w-4" />
          </Button>
        </TooltipTrigger>
        <TooltipContent side="bottom">
          <p>Edit</p>
        </TooltipContent>
      </Tooltip>
      
      <EditUserForm
        open={open}
        onOpenChange={setOpen}
        user={row.original as any}
      />
      
      <ResetPassword Id={row.original.id} />
      <DeleteUser Id={row.original.id} />
    </div>
  );
}
