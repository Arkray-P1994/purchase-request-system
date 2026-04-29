import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import * as React from "react";
import { Trash2 } from "lucide-react";
import { useDeleteApprover } from "../actions/mutate-approvers";
import { toast } from "sonner";

export function DeleteApprover({ id }: { id: string | number }) {
  const [dialogOpen, setDialogOpen] = React.useState(false);
  const { trigger, isMutating } = useDeleteApprover();

  return (
    <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
      <DialogTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="h-8 w-8 p-0 text-destructive hover:text-destructive hover:bg-destructive/10"
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Remove Approver?</DialogTitle>
          <DialogDescription>
            This will remove the user from the approval flow for this team.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">Cancel</Button>
          </DialogClose>
          <Button
            variant="destructive"
            onClick={async () => {
              await trigger({ id });
              toast.success("Approver removed successfully");
              setDialogOpen(false);
            }}
            disabled={isMutating}
          >
            {isMutating ? "Removing..." : "Remove"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
