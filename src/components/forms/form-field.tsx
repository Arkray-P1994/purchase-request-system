import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
  FormDescription,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { Control, FieldValues, Path } from "react-hook-form";
import { cn } from "@/lib/utils";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Check, ChevronsUpDown, X } from "lucide-react";
import * as React from "react";

interface FieldProps<T extends FieldValues> {
  control: Control<any>;
  name: Path<T>;
  label: string;
  placeholder?: string;
  description?: string;
  type?: "text" | "number" | "email" | "password";
  variant?: "input" | "textarea" | "select" | "select_by_name" | "select_by_id" | "combobox" | "multi-select";
  rows?: number;
  options?: SelectOption[];
  selectOptions?: SelectOptionByName[] | SelectOption[];
  hideLabel?: boolean;
  className?: string;
  onSelect?: (value: any) => void;
  readOnly?: boolean;
}
type SelectOption = {
  id: number;
  name: string;
};

type SelectOptionByName = {
  name: string;
};

export function Field<T extends FieldValues>({
  control,
  name,
  label,
  placeholder,
  description,
  type = "text",
  variant = "input",
  rows = 4,
  options = [],
  selectOptions = [],
  hideLabel = false,
  className = "",
  onSelect,
  readOnly = false,
}: FieldProps<T>) {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem className={hideLabel ? "space-y-0" : ""}>
          {!hideLabel && <FormLabel className="text-xs font-semibold">{label}</FormLabel>}
          <FormControl>
            {variant === "textarea" ? (
              <Textarea
                placeholder={placeholder}
                rows={rows}
                {...field}
                className={cn("min-h-24 text-base border-muted-foreground resize-none", className)}
              />
            ) : variant === "select" ? (
              <Select
                value={String(field.value)}
                onValueChange={(v) => field.onChange(Number(v))}
              >
                <SelectTrigger className="w-full border-muted-foreground">
                  <SelectValue placeholder={placeholder} />
                </SelectTrigger>

                <SelectContent>
                  {options.map((option) => (
                    <SelectItem
                      key={option.id}
                      value={String(option.id)}
                      className="cursor-pointer"
                    >
                      {option.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            ) : variant === "select_by_name" ? (
              <Select value={field.value} onValueChange={field.onChange}>
                <SelectTrigger className="w-full border-muted-foreground">
                  <SelectValue placeholder={placeholder} />
                </SelectTrigger>

                <SelectContent>
                  {selectOptions.map((option) => (
                    <SelectItem
                      key={option.name}
                      value={option.name}
                      className="cursor-pointer"
                    >
                      {option.name[0].toUpperCase()}
                      {option.name.slice(1)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            ) : variant === "select_by_id" ? (
              <Select value={String(field.value)} onValueChange={(v) => field.onChange(v)}>
                <SelectTrigger className="w-full border-muted-foreground">
                  <SelectValue placeholder={placeholder} />
                </SelectTrigger>
                <SelectContent>
                  {(selectOptions as SelectOption[]).map((option) => (
                    <SelectItem
                      key={option.id}
                      value={String(option.id)}
                      className="cursor-pointer"
                    >
                      {option.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            ) : variant === "combobox" ? (
              <ComboboxField
                field={field}
                placeholder={placeholder}
                label={label}
                selectOptions={selectOptions}
                className={className}
                onSelect={onSelect}
              />
            ) : variant === "multi-select" ? (
              <MultiSelectField
                field={field}
                placeholder={placeholder}
                label={label}
                options={options}
                className={className}
              />
            ) : (
              <Input
                type={type}
                placeholder={placeholder}
                {...field}
                value={type === "number" && field.value === 0 ? "" : (field.value ?? "")}
                onChange={(e) => {
                  if (type === "number") {
                    const val = e.target.value;
                    field.onChange(val === "" ? 0 : Number(val));
                  } else {
                    field.onChange(e.target.value);
                  }
                }}
                onFocus={(e) => {
                  if (type === "number" && field.value === 0) {
                    e.target.select();
                  }
                }}
                readOnly={readOnly}
                className={cn("text-xs border-muted-foreground", className)}
              />
            )}
          </FormControl>
          {description && <FormDescription>{description}</FormDescription>}
          <FormMessage />
        </FormItem>
      )}
    />
  );
}

function ComboboxField({
  field,
  placeholder,
  label,
  selectOptions,
  className,
  onSelect,
}: {
  field: any;
  placeholder?: string;
  label: string;
  selectOptions: any[];
  className?: string;
  onSelect?: (value: any) => void;
}) {
  const [open, setOpen] = React.useState(false);

  return (
    <Popover open={open} onOpenChange={setOpen} modal={true}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className={cn(
            "w-full justify-between font-normal border-muted-foreground h-auto py-2 px-3 text-left",
            !field.value && "text-muted-foreground",
            className
          )}
        >
          <span className="flex-1 whitespace-normal break-words">
            {field.value
              ? selectOptions.find((option) => option.name === field.value)?.name || field.value
              : placeholder}
          </span>
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[var(--radix-popover-trigger-width)] p-0">
        <Command>
          <CommandInput placeholder={`Search ${label.toLowerCase()}...`} />
          <CommandList>
            <CommandEmpty>No {label.toLowerCase()} found.</CommandEmpty>
            <CommandGroup>
              {selectOptions.map((option) => (
                <CommandItem
                  key={option.name}
                  value={option.name}
                  onSelect={() => {
                    onSelect?.(option);
                    field.onChange(option.name);
                    setOpen(false);
                  }}
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      option.name === field.value ? "opacity-100" : "opacity-0"
                    )}
                  />
                  {option.name}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}

function MultiSelectField({
  field,
  placeholder,
  label,
  options,
  className,
}: {
  field: any;
  placeholder?: string;
  label: string;
  options: any[];
  className?: string;
}) {
  const [open, setOpen] = React.useState(false);
  const selected = field.value || [];

  const handleUnselect = (item: any) => {
    field.onChange(selected.filter((i: any) => i !== item));
  };

  return (
    <Popover open={open} onOpenChange={setOpen} modal={true}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className={cn(
            "w-full justify-between border-muted-foreground h-auto min-h-10 py-2 px-3 text-left font-normal",
            className
          )}
        >
          <div className="flex flex-wrap gap-1">
            {selected.length > 0 ? (
              selected.map((item: any) => {
                const option = options.find((o) => o.id === item);
                return (
                  <Badge variant="secondary" key={item} className="mr-1 font-normal">
                    {option ? option.name : item}
                    <button
                      type="button"
                      className="ml-1 ring-offset-background rounded-full outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          handleUnselect(item);
                        }
                      }}
                      onMouseDown={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                      }}
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        handleUnselect(item);
                      }}
                    >
                      <X className="h-3 w-3 text-muted-foreground hover:text-foreground" />
                    </button>
                  </Badge>
                );
              })
            ) : (
              <span className="text-muted-foreground">{placeholder}</span>
            )}
          </div>
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[var(--radix-popover-trigger-width)] p-0">
        <Command>
          <CommandInput placeholder={`Search ${label.toLowerCase()}...`} />
          <CommandList>
            <CommandEmpty>No {label.toLowerCase()} found.</CommandEmpty>
            <CommandGroup>
              {options.map((option) => (
                <CommandItem
                  key={option.id}
                  value={option.name}
                  onSelect={() => {
                    if (selected.includes(option.id)) {
                      field.onChange(selected.filter((i: any) => i !== option.id));
                    } else {
                      field.onChange([...selected, option.id]);
                    }
                  }}
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      selected.includes(option.id) ? "opacity-100" : "opacity-0"
                    )}
                  />
                  {option.name}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
