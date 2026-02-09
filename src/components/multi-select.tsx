"use client";

import * as React from "react";
import { Check, PlusCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";

interface QueryMultiSelectProps {
  title: string;
  queryKey: string;
  options: {
    label: string;
    value: string;
    icon?: React.ComponentType<{ className?: string }>;
  }[];
  query: Record<string, string[]>;
  setQuery: (next: Record<string, string[]>) => void;
}

export function QueryMultiSelect({
  title,
  queryKey,
  options,
  query,
  setQuery,
}: QueryMultiSelectProps) {
  const [open, setOpen] = React.useState(false);

  // Read from shared query state
  const selected = query[queryKey] ?? [];

  // Local temp state (Apply pattern preserved)
  const [tempSelected, setTempSelected] = React.useState<string[]>(selected);

  // Sync temp state when opened
  React.useEffect(() => {
    if (open) {
      setTempSelected(selected);
    }
  }, [open, selected]);

  const handleApply = () => {
    setQuery({
      ...query,
      [queryKey]: tempSelected.length > 0 ? tempSelected : [],
    });
    setOpen(false);
  };

  const handleClear = () => {
    setTempSelected([]);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="h-8 w-full justify-between border-dashed lg:w-fit min-w-[150px]"
        >
          <div className="flex items-center">
            <PlusCircle className="mr-2 h-4 w-4 opacity-50" />
            <span className="text-sm font-medium">{title}</span>

            {selected.length > 0 && (
              <>
                <Separator orientation="vertical" className="mx-2 h-4" />
                <Badge
                  variant="secondary"
                  className="rounded-sm px-1 font-normal lg:hidden"
                >
                  {selected.length}
                </Badge>

                <div className="hidden space-x-1 lg:flex">
                  {selected.length > 2 ? (
                    <Badge
                      variant="secondary"
                      className="rounded-sm px-1 font-normal"
                    >
                      {selected.length} selected
                    </Badge>
                  ) : (
                    options
                      .filter((option) => selected.includes(option.value))
                      .map((option) => (
                        <Badge
                          variant="secondary"
                          key={option.value}
                          className="rounded-sm px-1 font-normal"
                        >
                          {option.label}
                        </Badge>
                      ))
                  )}
                </div>
              </>
            )}
          </div>
        </Button>
      </PopoverTrigger>

      <PopoverContent className="w-[200px] p-0" align="start">
        <Command>
          <CommandInput placeholder={`Search ${title.toLowerCase()}...`} />

          {/* FIX: Removed manual overflow from CommandGroup.
            CommandList now handles the max-height and scrolling correctly.
          */}
          <CommandList className="max-h-64 overflow-y-auto">
            <CommandEmpty>No results found.</CommandEmpty>
            <CommandGroup>
              {options.map((option) => {
                const isSelected = tempSelected.includes(option.value);

                return (
                  <CommandItem
                    key={option.value}
                    onSelect={() => {
                      if (isSelected) {
                        setTempSelected(
                          tempSelected.filter((s) => s !== option.value)
                        );
                      } else {
                        setTempSelected([...tempSelected, option.value]);
                      }
                    }}
                  >
                    <div
                      className={cn(
                        "mr-2 flex h-4 w-4 items-center justify-center rounded-sm border border-primary",
                        isSelected
                          ? "bg-primary text-primary-foreground"
                          : "opacity-50 [&_svg]:invisible"
                      )}
                    >
                      <Check className="h-4 w-4" />
                    </div>

                    {option.icon && (
                      <option.icon className="mr-2 h-4 w-4 text-muted-foreground" />
                    )}

                    <span>{option.label}</span>
                  </CommandItem>
                );
              })}
            </CommandGroup>
          </CommandList>

          {/* FOOTER: Moved outside of CommandList so it stays fixed 
            at the bottom while items scroll above it.
          */}
          <div className="flex flex-col">
            <Separator />
            <div className="flex items-center justify-between p-1">
              <Button
                variant="ghost"
                size="sm"
                onClick={handleClear}
                className="flex-1 text-xs"
              >
                Clear
              </Button>
              <Separator orientation="vertical" className="mx-1 h-4" />
              <Button
                size="sm"
                onClick={handleApply}
                className="flex-1 text-xs"
              >
                Apply
              </Button>
            </div>
          </div>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
