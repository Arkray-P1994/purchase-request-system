import { useState } from "react";
import { CheckCircle2, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { useUser } from "@/api/fetch-user";
import { useApproveRequest } from "../actions/approve-request";
import { useDisapproveRequest } from "../actions/disapprove-request";
import { Request } from "./schema";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface ApprovalActionsProps {
  request: Request;
  size?: "default" | "sm" | "lg" | "icon";
  variant?: "full" | "icon";
}

export function ApprovalActions({ request, size = "sm", variant = "full" }: ApprovalActionsProps) {
  const { user: currentUser } = useUser();
  const { trigger: approve, isMutating: isApproving } = useApproveRequest(request.id.toString());
  const { trigger: disapprove, isMutating: isDisapproving } = useDisapproveRequest(request.id.toString());
  
  const [approveComment, setApproveComment] = useState("");
  const [disapproveComment, setDisapproveComment] = useState("");
  const [openApprove, setOpenApprove] = useState(false);
  const [openDisapprove, setOpenDisapprove] = useState(false);

  const workflowSteps = (
    Array.isArray(request.workflow)
      ? request.workflow
      : Object.values(request.workflow || {}).filter(
          (w: any) => w && typeof w === "object" && "approval_level" in w
        )
  ).filter((w: any) => !w.deleted_at);

  const currentStep = workflowSteps.find(
    (step: any) => Number(step.approval_level) === Number(request.current_level)
  );

  const isCurrentApprover =
    currentStep && String((currentStep as any).user?.id) === String((currentUser as any)?.user?.id);

  const isFinalized =
    request.status_id?.name === "Approved" || 
    request.status_id?.name === "Rejected" ||
    request.status_id?.name === "Disapproved";

  if (!isCurrentApprover || isFinalized) {
    return null;
  }

  return (
    <TooltipProvider>
      <div className="flex items-center gap-2">
        {/* Accept Action */}
        <Dialog open={openApprove} onOpenChange={setOpenApprove}>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="default"
                size={size}
                className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold"
                onClick={() => setOpenApprove(true)}
              >
                <CheckCircle2 className={variant === "full" ? "mr-2 h-4 w-4" : "h-4 w-4"} />
                {variant === "full" && "Accept"}
              </Button>
            </TooltipTrigger>
            {variant === "icon" && (
              <TooltipContent side="bottom">
                <p className="text-[10px] font-bold">Accept Request</p>
              </TooltipContent>
            )}
          </Tooltip>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Accept Request</DialogTitle>
              <DialogDescription>
                Are you sure you want to accept this request? You can add an optional comment below.
              </DialogDescription>
            </DialogHeader>
            <div className="py-4">
              <Textarea
                placeholder="Add a comment (optional)..."
                value={approveComment}
                onChange={(e) => setApproveComment(e.target.value)}
                className="min-h-[100px]"
              />
            </div>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => {
                  setOpenApprove(false);
                  setApproveComment("");
                }}
              >
                Cancel
              </Button>
              <Button
                className="bg-emerald-600 hover:bg-emerald-700 font-bold"
                onClick={async () => {
                  await approve({
                    approver_id: currentUser?.user?.id,
                    comment: approveComment,
                  });
                  setOpenApprove(false);
                  setApproveComment("");
                }}
                disabled={isApproving}
              >
                {isApproving ? "Processing..." : "Confirm Acceptance"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Decline Action */}
        <Dialog open={openDisapprove} onOpenChange={setOpenDisapprove}>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button 
                variant="destructive" 
                size={size} 
                className="font-bold"
                onClick={() => setOpenDisapprove(true)}
              >
                <XCircle className={variant === "full" ? "mr-2 h-4 w-4" : "h-4 w-4"} />
                {variant === "full" && "Decline"}
              </Button>
            </TooltipTrigger>
            {variant === "icon" && (
              <TooltipContent side="bottom">
                <p className="text-[10px] font-bold">Decline Request</p>
              </TooltipContent>
            )}
          </Tooltip>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Decline Request</DialogTitle>
              <DialogDescription>
                Please provide a reason for declining this request.
              </DialogDescription>
            </DialogHeader>
            <div className="py-4">
              <Textarea
                placeholder="Reason for declining..."
                value={disapproveComment}
                onChange={(e) => setDisapproveComment(e.target.value)}
                className="min-h-[100px]"
              />
            </div>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => {
                  setOpenDisapprove(false);
                  setDisapproveComment("");
                }}
              >
                Cancel
              </Button>
              <Button
                variant="destructive"
                className="font-bold"
                onClick={async () => {
                  await disapprove({
                    approver_id: currentUser?.user?.id,
                    comment: disapproveComment,
                  });
                  setOpenDisapprove(false);
                  setDisapproveComment("");
                }}
                disabled={isDisapproving}
              >
                {isDisapproving ? "Processing..." : "Confirm Decline"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </TooltipProvider>
  );
}
