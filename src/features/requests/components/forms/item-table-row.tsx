import { Field } from "@/components/forms/form-field";
import { TableCell, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Trash2, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";

interface ItemTableRowProps {
  index: number;
  control: any;
  item: any;
  budgetCodeOptions: any[];
  selectedBudget: any;
  isOverBudget: boolean;
  onRemove: (index: number) => void;
  onBudgetSelect: (option: any) => void;
}

export function ItemTableRow({
  index,
  control,
  item,
  budgetCodeOptions,
  selectedBudget,
  isOverBudget,
  onRemove,
  onBudgetSelect,
}: ItemTableRowProps) {
  return (
    <TableRow className={cn("group hover:bg-muted/30 transition-colors border-b", isOverBudget && "bg-destructive/5 hover:bg-destructive/10")}>
      <TableCell className="text-center font-medium text-muted-foreground p-3 border-r">{index + 1}</TableCell>
      <TableCell className="p-3 border-r align-top">
        <Field
          control={control}
          name={`items.${index}.item_title` as any}
          label="Title"
          placeholder="What are you buying?"
          variant="input"
          hideLabel
          className="h-9 text-xs font-semibold shadow-sm focus-visible:ring-1"
        />
      </TableCell>
      <TableCell className="p-3 border-r align-top">
        <div className="space-y-1.5">
          <Field
            control={control}
            name={`items.${index}.budget_code` as any}
            label="Budget Code"
            placeholder="Select budget..."
            variant="combobox"
            selectOptions={budgetCodeOptions}
            onSelect={onBudgetSelect}
            hideLabel
            className="text-xs shadow-sm focus-visible:ring-1"
          />
          {selectedBudget && (
            <div className="px-2 py-1 bg-muted/50 rounded-md flex items-center justify-between border border-border/50">
              <span className="text-[9px] font-bold text-muted-foreground uppercase tracking-tight">Available:</span>
              <span className={cn("text-[10px] font-mono font-bold", isOverBudget ? "text-destructive" : "text-emerald-600")}>
                {new Intl.NumberFormat("en-PH", { style: "currency", currency: "PHP" }).format(selectedBudget.balance)}
              </span>
            </div>
          )}
        </div>
      </TableCell>
      <TableCell className="p-3 border-r align-top">
        <Field
          control={control}
          name={`items.${index}.item_purpose` as any}
          label="Purpose"
          placeholder="Why is this needed?"
          variant="input"
          hideLabel
          className="h-9 text-xs shadow-sm focus-visible:ring-1"
        />
      </TableCell>
      <TableCell className="p-3 border-r align-top">
        <div className="space-y-1">
          <Field
            control={control}
            name={`items.${index}.unit_price` as any}
            label="Price"
            type="number"
            variant="input"
            hideLabel
            className={cn("h-9 text-xs shadow-sm focus-visible:ring-1 text-right font-mono", isOverBudget && "border-destructive focus-visible:ring-destructive text-destructive")}
          />
          {isOverBudget && (
            <div className="flex items-center gap-1 text-[9px] text-destructive font-bold px-1 uppercase mt-1">
              <AlertCircle className="h-3 w-3" /> Over Budget
            </div>
          )}
        </div>
      </TableCell>
      <TableCell className="p-3 border-r align-top">
        <Field
          control={control}
          name={`items.${index}.quantity` as any}
          label="Qty"
          type="number"
          variant="input"
          hideLabel
          className="h-9 text-xs shadow-sm focus-visible:ring-1 text-center font-mono"
        />
      </TableCell>
      <TableCell className="p-3 text-right font-bold text-sm whitespace-nowrap border-r bg-primary/5 align-middle">
        <span className={cn(isOverBudget ? "text-destructive" : "text-primary")}>
          {new Intl.NumberFormat("en-PH", { style: "currency", currency: "PHP" }).format((Number(item?.quantity) || 0) * (Number(item?.unit_price) || 0))}
        </span>
      </TableCell>
      <TableCell className="p-3 border-r align-top">
        <Field
          control={control}
          name={`items.${index}.item_remarks` as any}
          label="Remarks"
          placeholder="Any extra details?"
          variant="input"
          hideLabel
          className="h-9 text-xs shadow-sm focus-visible:ring-1"
        />
      </TableCell>
      <TableCell className="p-3 text-center align-middle">
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="h-8 w-8 text-muted-foreground hover:text-destructive hover:bg-destructive/10 opacity-0 group-hover:opacity-100 transition-all border border-transparent hover:border-destructive/20"
          onClick={() => onRemove(index)}
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </TableCell>
    </TableRow>
  );
}
