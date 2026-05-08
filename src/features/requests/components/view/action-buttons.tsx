import { useState } from "react";
import { Link, useNavigate } from "@tanstack/react-router";
import { FileText, Ban, Trash2, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ApprovalActions } from "../approval-actions";
import { useDeleteRequest } from "../../actions/delete-request";
import { useCancelRequest } from "../../actions/cancel-request";
import { PurchaseRequest } from "@/types/request";

interface ActionButtonsProps {
  request: PurchaseRequest;
  user: any;
}

export function ActionButtons({ request, user }: ActionButtonsProps) {
  const navigate = useNavigate();
  const [openDelete, setOpenDelete] = useState(false);
  const [openCancel, setOpenCancel] = useState(false);

  const { trigger: deleteReq, isMutating: isDeleting } = useDeleteRequest(String(request.id));
  const { trigger: cancelReq, isMutating: isCancelling } = useCancelRequest(String(request.id));

  const canEditOrAction = user?.user?.role?.toLowerCase() === "admin"
    ? !["For Cash Release", "Released", "Approved", "Disapproved", "Rejected", "Cancelled"].includes(request.status_id?.name || "")
    : ["Pending", "Draft"].includes(request.status_id?.name || "");

  if (!request) return null;

  return (
    <div className="flex items-center gap-2">
      <ApprovalActions request={request} />
      {canEditOrAction && (
        <>
          <Link to="/purchase-request/requests/$requestId/edit" params={{ requestId: String(request.id) }}>
            <Button variant="outline" size="sm">
              <FileText className="mr-2 h-4 w-4" />
              Edit Request
            </Button>
          </Link>

          <Button
            variant="outline"
            size="sm"
            className="text-orange-500 hover:bg-orange-50 hover:text-orange-600 border-orange-200"
            onClick={() => setOpenCancel(true)}
          >
            <Ban className="mr-2 h-4 w-4" />
            Cancel Request
          </Button>

          {user?.user?.role?.toLowerCase() === "admin" && (
            <Button
              variant="outline"
              size="sm"
              className="text-destructive hover:bg-destructive/10 hover:text-destructive"
              onClick={() => setOpenDelete(true)}
            >
              <Trash2 className="mr-2 h-4 w-4" />
              Delete Request
            </Button>
          )}

          <Dialog open={openCancel} onOpenChange={setOpenCancel}>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <div className="bg-orange-100 w-fit p-2 rounded-full mb-2">
                  <Ban className="h-6 w-6 text-orange-600" />
                </div>
                <DialogTitle>Confirm Cancellation</DialogTitle>
                <DialogDescription className="text-sm">
                  Are you sure you want to cancel request{" "}
                  <span className="font-bold text-foreground">#{request.ticket_id}</span>? This will
                  stop the approval process and notify involved parties.
                </DialogDescription>
              </DialogHeader>
              <DialogFooter className="gap-2 sm:gap-0">
                <Button variant="outline" onClick={() => setOpenCancel(false)} disabled={isCancelling}>
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
                  Are you sure you want to delete request{" "}
                  <span className="font-bold text-foreground">#{request.ticket_id}</span>? This
                  action is permanent and will soft-delete all associated items and attachments.
                </DialogDescription>
              </DialogHeader>
              <DialogFooter className="gap-2 sm:gap-0">
                <Button variant="outline" onClick={() => setOpenDelete(false)} disabled={isDeleting}>
                  Cancel
                </Button>
                <Button
                  variant="destructive"
                  onClick={async () => {
                    await deleteReq({ causer_id: user?.user?.id });
                    setOpenDelete(false);
                    navigate({ to: "/purchase-request/requests" });
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
    </div>
  );
}
