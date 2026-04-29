import { Field } from "@/components/forms/form-field";
import { Button } from "@/components/ui/button";
import { Trash2, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";

interface ItemMobileCardProps {
  index: number;
  control: any;
  item: any;
  budgetCodeOptions: any[];
  selectedBudget: any;
  isOverBudget: boolean;
  onRemove: (index: number) => void;
  onBudgetSelect: (option: any) => void;
}

export function ItemMobileCard({
  index,
  control,
  item,
  budgetCodeOptions,
  selectedBudget,
  isOverBudget,
  onRemove,
  onBudgetSelect,
}: ItemMobileCardProps) {
  return (
    <div className={cn("p-4 space-y-4 bg-background transition-colors", isOverBudget && "bg-destructive/5")}>
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <span className="flex items-center justify-center h-6 w-6 rounded-full bg-muted text-[10px] font-bold text-muted-foreground border">
            {index + 1}
          </span>
          <h4 className="font-bold text-sm text-foreground">Item Details</h4>
        </div>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className="h-8 w-8 p-0 text-muted-foreground hover:text-destructive hover:bg-destructive/10 border"
          onClick={() => onRemove(index)}
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>

      <div className="grid grid-cols-1 gap-4">
        <Field
          control={control}
          name={`items.${index}.item_title` as any}
          label="Item Title"
          placeholder="What are you buying?"
          variant="input"
        />
        <div className="space-y-2">
          <Field
            control={control}
            name={`items.${index}.budget_code` as any}
            label="Budget Code"
            placeholder="Select budget code"
            variant="combobox"
            selectOptions={budgetCodeOptions}
            onSelect={onBudgetSelect}
          />
          {selectedBudget && (
            <div className="flex items-center justify-between px-3 py-2 rounded-lg bg-muted/50 border border-border/50 text-xs">
              <span className="font-medium text-muted-foreground uppercase tracking-wider text-[10px]">Available Budget:</span>
              <span className={cn("font-mono font-bold", isOverBudget ? "text-destructive" : "text-emerald-600")}>
                {new Intl.NumberFormat("en-PH", { style: "currency", currency: "PHP" }).format(selectedBudget.balance)}
              </span>
            </div>
          )}
        </div>
        <Field
          control={control}
          name={`items.${index}.item_purpose` as any}
          label="Purpose"
          placeholder="Why is this needed?"
          variant="input"
        />
        
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Field
              control={control}
              name={`items.${index}.unit_price` as any}
              label="Unit Price"
              type="number"
              variant="input"
              className={cn(isOverBudget && "border-destructive text-destructive")}
            />
          </div>
          <Field
            control={control}
            name={`items.${index}.quantity` as any}
            label="Quantity"
            type="number"
            variant="input"
          />
        </div>

        <div className="p-3 rounded-xl bg-primary/5 border border-primary/10 flex items-center justify-between">
          <span className="text-[10px] font-bold text-primary uppercase tracking-widest">Subtotal</span>
          <div className="text-right">
            <span className={cn("text-lg font-black", isOverBudget ? "text-destructive" : "text-primary")}>
              {new Intl.NumberFormat("en-PH", { style: "currency", currency: "PHP" }).format((Number(item?.quantity) || 0) * (Number(item?.unit_price) || 0))}
            </span>
            {isOverBudget && (
              <div className="flex items-center justify-end gap-1 text-[9px] text-destructive font-bold uppercase mt-0.5">
                <AlertCircle className="h-3 w-3" /> Over Budget
              </div>
            )}
          </div>
        </div>

        <Field
          control={control}
          name={`items.${index}.item_remarks` as any}
          label="Remarks"
          placeholder="Optional details"
          variant="input"
        />
      </div>
    </div>
  );
}
