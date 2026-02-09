"use client";

import { Button } from "@/components/ui/button";

import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Edit, Eye, FileCog, Plus } from "lucide-react";
import * as React from "react";
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip";

export function LedgerActionsSheet({
  children,
  buttonName,
  title,
  description,
  buttonType = "create",
  open,
  setOpen,
}: {
  children: React.ReactNode;
  buttonName?: string;
  title?: string;
  description?: string;
  buttonType?: string;
  open?: boolean;
  setOpen?: (open: boolean) => void;
}) {
  const [tooltipOpen, setTooltipOpen] = React.useState(false);
  const triggerRef = React.useRef<HTMLButtonElement | null>(null);

  const handleSheetOpenChange = (open: boolean) => {
    setOpen?.(open);

    if (!open) {
      setTooltipOpen(false);
      requestAnimationFrame(() => triggerRef.current?.blur());
    }
  };

  return (
    <Sheet open={open} onOpenChange={handleSheetOpenChange}>
      <Tooltip open={tooltipOpen} onOpenChange={() => {}}>
        <TooltipTrigger asChild>
          <SheetTrigger asChild>
            {buttonType === "create" ? (
              <Button
                ref={triggerRef}
                size="sm"
                onMouseEnter={() => setTooltipOpen(true)}
                onMouseLeave={() => setTooltipOpen(false)}
                onFocus={() => setTooltipOpen(false)}
              >
                <Plus size={18} />
                {buttonName}
              </Button>
            ) : buttonType === "edit" ? (
              <Button
                ref={triggerRef}
                variant="ghost"
                size="sm"
                className="cursor-pointer h-8 w-8 p-0 hover:bg-green-50 hover:text-green-600 text-green-500"
                onMouseEnter={() => setTooltipOpen(true)}
                onMouseLeave={() => setTooltipOpen(false)}
                onFocus={() => setTooltipOpen(false)}
              >
                <Edit className="h-4 w-4" />
              </Button>
            ) : buttonType === "file-edit" ? (
              <Button
                ref={triggerRef}
                variant="ghost"
                size="sm"
                className="cursor-pointer h-8 w-8 p-0 hover:bg-green-50 hover:text-yellow-600 text-yellow-500"
                onMouseEnter={() => setTooltipOpen(true)}
                onMouseLeave={() => setTooltipOpen(false)}
                onFocus={() => setTooltipOpen(false)}
              >
                <FileCog className="h-4 w-4" />
              </Button>
            ) : (
              <Button
                ref={triggerRef}
                variant="ghost"
                size="sm"
                className="cursor-pointer h-8 w-8 p-0 hover:bg-blue-50 hover:text-blue-600 text-blue-500"
                onMouseEnter={() => setTooltipOpen(true)}
                onMouseLeave={() => setTooltipOpen(false)}
                onFocus={() => setTooltipOpen(false)}
              >
                <Eye className="h-4 w-4" />
              </Button>
            )}
          </SheetTrigger>
        </TooltipTrigger>
        <TooltipContent side="bottom">
          {buttonType === "create" ? (
            <p>create</p>
          ) : buttonType === "edit" ? (
            <p>Edit</p>
          ) : buttonType === "file-edit" ? (
            <p>Edit File</p>
          ) : (
            <p>Views</p>
          )}
        </TooltipContent>
      </Tooltip>
      <SheetContent
        className="min-h-screen overflow-y-scroll w-full md:min-w-md "
        // [direction:rtl]
        // side="left"
      >
        {/* <div className="[direction:ltr]"> */}
        <div>
          <SheetHeader className=" bg-gray-200 dark:bg-muted mb-4">
            <SheetTitle className="text-xl p-4">{title}</SheetTitle>
            <SheetDescription className="text-gray-900 dark:text-foreground">
              {description}
            </SheetDescription>
          </SheetHeader>
          {children}
        </div>
      </SheetContent>
    </Sheet>
  );
}
