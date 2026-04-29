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

import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Trash2 } from "lucide-react";
import { useDeleteUser } from "../actions/mutate-users";

export function DeleteUser({ Id }: { Id: string | number }) {
  const [dialogOpen, setDialogOpen] = React.useState(false);
  const { trigger } = useDeleteUser();
  // Control tooltip manually so it only opens on hover
  const [tooltipOpen, setTooltipOpen] = React.useState(false);
  const triggerRef = React.useRef<HTMLButtonElement | null>(null);

  const handleDialogOpenChange = (open: boolean) => {
    setDialogOpen(open);

    if (!open) {
      // Close tooltip and blur after Radix returns focus to the trigger
      setTooltipOpen(false);
      requestAnimationFrame(() => triggerRef.current?.blur());
    }
  };

  return (
    <Dialog open={dialogOpen} onOpenChange={handleDialogOpenChange}>
      <Tooltip open={tooltipOpen} onOpenChange={() => {}}>
        <TooltipTrigger asChild>
          <DialogTrigger asChild>
            <Button
              ref={triggerRef}
              variant="ghost"
              size="sm"
              className="cursor-pointer h-8 w-8 p-0 hover:bg-red-50 hover:text-red-600 text-red-500"
              aria-label="Delete Asset"
              // Only open on hover/pointer; keep closed on focus
              onMouseEnter={() => setTooltipOpen(true)}
              onMouseLeave={() => setTooltipOpen(false)}
              onFocus={() => setTooltipOpen(false)}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </DialogTrigger>
        </TooltipTrigger>

        <TooltipContent side="bottom">
          <p>Delete</p>
        </TooltipContent>
      </Tooltip>

      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Are you absolutely sure?</DialogTitle>
          <DialogDescription>
            This action cannot be undone. This will permanently remove its data.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="sm:justify-end">
          <DialogClose asChild>
            <Button
              type="button"
              variant="secondary"
              className="hover:opacity-70"
            >
              Close
            </Button>
          </DialogClose>
          <DialogClose asChild>
            <Button
              type="button"
              variant="destructive"
              className="hover:opacity-70"
              onClick={async (e) => {
                e.preventDefault();

                try {
                  await trigger({ id: Id });
                  setDialogOpen(false);
                } catch (err) {}
              }}
            >
              Delete
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
