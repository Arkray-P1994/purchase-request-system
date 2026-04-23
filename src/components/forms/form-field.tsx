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

interface FieldProps<T extends FieldValues> {
  control: Control<any>;
  name: Path<T>;
  label: string;
  placeholder?: string;
  description?: string;
  type?: "text" | "number" | "email" | "password";
  variant?: "input" | "textarea" | "select" | "select_by_name";
  rows?: number;
  options?: SelectOption[]; // for select dropdown
  selectOptions?: SelectOptionByName[]; // for select dropdown
  hideLabel?: boolean;
  className?: string;
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
