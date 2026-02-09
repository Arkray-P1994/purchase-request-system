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

interface FieldProps<T extends FieldValues> {
  control: Control<T>;
  name: Path<T>;
  label: string;
  placeholder?: string;
  description?: string;
  type?: "text" | "number" | "email" | "password";
  variant?: "input" | "textarea" | "select" | "select_by_name";
  rows?: number;
  options?: SelectOption[]; // for select dropdown
  selectOptions?: SelectOptionByName[]; // for select dropdown
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
}: FieldProps<T>) {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormLabel className="text-xs font-semibold">{label}</FormLabel>
          <FormControl>
            {variant === "textarea" ? (
              <Textarea
                placeholder={placeholder}
                rows={rows}
                {...field}
                className="min-h-24 text-base border-muted-foreground resize-none"
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
                onChange={(e) => {
                  if (type === "number") {
                    // convert string → number (or empty)
                    field.onChange(
                      e.target.value === ""
                        ? undefined
                        : Number(e.target.value),
                    );
                  } else {
                    field.onChange(e.target.value);
                  }
                }}
                className=" text-xs border-muted-foreground"
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
