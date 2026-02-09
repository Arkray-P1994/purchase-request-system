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
import { RotateCcw } from "lucide-react";
import { useResetPassword } from "../actions/reset";

export function ResetPassword({ Id }: { Id: String | Number }) {
  const [dialogOpen, setDialogOpen] = React.useState(false);
  const { trigger } = useResetPassword({ id: Id });
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
              className="h-8 w-8 p-0 hover:bg-red-50 hover:text-yellow-600 text-yellow-500"
              aria-label="Delete Asset"
              // Only open on hover/pointer; keep closed on focus
              onMouseEnter={() => setTooltipOpen(true)}
              onMouseLeave={() => setTooltipOpen(false)}
              onFocus={() => setTooltipOpen(false)}
            >
              <RotateCcw className="h-4 w-4" />
            </Button>
          </DialogTrigger>
        </TooltipTrigger>

        <TooltipContent side="bottom">
          <p>Reset Password</p>
        </TooltipContent>
      </Tooltip>

      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Are you absolutely sure?</DialogTitle>
          <DialogDescription>
            This action will set the password to "userPassword".{" "}
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
              variant="default"
              className="hover:opacity-70"
              onClick={async (e) => {
                e.preventDefault();

                try {
                  await trigger();
                  setDialogOpen(false);
                } catch (err) {}
              }}
            >
              Confirm
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
