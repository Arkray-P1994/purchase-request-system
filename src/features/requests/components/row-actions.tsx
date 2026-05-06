import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useUser } from "@/api/fetch-user";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Link } from "@tanstack/react-router";
import type { Row } from "@tanstack/react-table";
import { Eye, Pencil, Trash2, AlertTriangle, Ban } from "lucide-react";
import { Request } from "./schema";
import { ApprovalActions } from "./approval-actions";
import { useDeleteRequest } from "../actions/delete-request";
import { useCancelRequest } from "../actions/cancel-request";

interface DataTableRowActionsProps {
  row: Row<Request>;
}

export function DataTableRowActions({
  row,
}: DataTableRowActionsProps) {
  const { user } = useUser();
  const [openDelete, setOpenDelete] = useState(false);
  const [openCancel, setOpenCancel] = useState(false);
  const { trigger: deleteReq, isMutating: isDeleting } = useDeleteRequest(String(row.original.id));
  const { trigger: cancelReq, isMutating: isCancelling } = useCancelRequest(String(row.original.id));

  const isAdmin = user?.user?.role?.toLowerCase() === "admin";
  const isCreator = String(user?.user?.id) === String(row.original.user_id?.id);
  const statusName = row.original.status_id?.name || "";
  const isFinalized = ["For Cash Release", "Released", "Cash Released", "Approved", "Disapproved", "Rejected"].includes(statusName);
  const canModify = isAdmin ? !isFinalized : ["Pending", "Draft"].includes(statusName) && isCreator;

  return (
    <div className="flex gap-1 items-center justify-end">
      <ApprovalActions request={row.original} size="icon" variant="icon" />
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Link
              to="/purchase-request/requests/$requestId"
              params={{ requestId: String(row.original.id) }}
            >
              <Button
                variant="ghost"
                className="cursor-pointer h-8 w-8 p-0 hover:bg-blue-50 hover:text-blue-600 text-blue-500"
              >
                <Eye className="h-4 w-4" />
              </Button>
            </Link>
          </TooltipTrigger>
          <TooltipContent side="bottom">
            <p className="text-[10px] font-bold">View Request</p>
          </TooltipContent>
        </Tooltip>
        
        {canModify && (
          <>
            <Tooltip>
              <TooltipTrigger asChild>
                <Link
                  to="/purchase-request/requests/$requestId/edit"
                  params={{ requestId: String(row.original.id) }}
                >
                  <Button
                    variant="ghost"
                    className="cursor-pointer h-8 w-8 p-0 hover:bg-green-50 hover:text-green-600 text-green-500"
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                </Link>
              </TooltipTrigger>
              <TooltipContent side="bottom">
                <p className="text-[10px] font-bold">Edit Request</p>
              </TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  className="cursor-pointer h-8 w-8 p-0 hover:bg-orange-50 hover:text-orange-600 text-orange-500"
                  onClick={() => setOpenCancel(true)}
                >
                  <Ban className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent side="bottom">
                <p className="text-[10px] font-bold">Cancel Request</p>
              </TooltipContent>
            </Tooltip>

            {isAdmin && (
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    className="cursor-pointer h-8 w-8 p-0 hover:bg-red-50 hover:text-red-600 text-red-500"
                    onClick={() => setOpenDelete(true)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="bottom">
                  <p className="text-[10px] font-bold">Delete Request</p>
                </TooltipContent>
              </Tooltip>
            )}

            <Dialog open={openCancel} onOpenChange={setOpenCancel}>
              <DialogContent className="sm:max-w-md">
                <DialogHeader>
                  <div className="bg-orange-100 w-fit p-2 rounded-full mb-2">
                    <Ban className="h-6 w-6 text-orange-600" />
                  </div>
                  <DialogTitle>Confirm Cancellation</DialogTitle>
                  <DialogDescription className="text-sm">
                    Are you sure you want to cancel request <span className="font-bold text-foreground">#{row.original.ticket_id}</span>? 
                    This will stop the approval process and notify involved parties.
                  </DialogDescription>
                </DialogHeader>
                <DialogFooter className="gap-2 sm:gap-0">
                  <Button
                    variant="outline"
                    onClick={() => setOpenCancel(false)}
                    disabled={isCancelling}
                  >
                    No, keep it
                  </Button>
                  <Button
                    variant="default"
                    className="bg-orange-600 hover:bg-orange-700 text-white border-none"
                    onClick={async () => {
                      await cancelReq({ causer_id: user?.user?.id });
                      setOpenCancel(false);
                    }}
                    disabled={isCancelling}
                  >
                    {isCancelling ? "Cancelling..." : "Yes, Cancel Request"}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>

            <Dialog open={openDelete} onOpenChange={setOpenDelete}>
              <DialogContent className="sm:max-w-md">
                <DialogHeader>
                  <div className="bg-destructive/10 w-fit p-2 rounded-full mb-2">
                    <AlertTriangle className="h-6 w-6 text-destructive" />
                  </div>
                  <DialogTitle>Confirm Deletion</DialogTitle>
                  <DialogDescription className="text-sm">
                    Are you sure you want to delete request <span className="font-bold text-foreground">#{row.original.ticket_id}</span>? 
                    This action is permanent and will soft-delete all associated items and attachments.
                  </DialogDescription>
                </DialogHeader>
                <DialogFooter className="gap-2 sm:gap-0">
                  <Button
                    variant="outline"
                    onClick={() => setOpenDelete(false)}
                    disabled={isDeleting}
                  >
                    Cancel
                  </Button>
                  <Button
                    variant="destructive"
                    onClick={async () => {
                      await deleteReq({ causer_id: user?.user?.id });
                      setOpenDelete(false);
                    }}
                    disabled={isDeleting}
                  >
                    {isDeleting ? "Deleting..." : "Delete Permanently"}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </>
        )}
      </TooltipProvider>
    </div>
  );
}

