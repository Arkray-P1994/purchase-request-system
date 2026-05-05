import { useFieldArray, useFormContext } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { CreateRequestValues } from "../schema";
import { useBudgetEntries } from "@/api/fetch-budget";
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useEffect } from "react";
import { ItemTableRow } from "./item-table-row";
import { ItemMobileCard } from "./item-mobile-card";

export function ItemsSection() {
  const { control, watch, setValue, setError, clearErrors, formState: { errors } } = useFormContext<CreateRequestValues>();
  const { fields, append, remove } = useFieldArray({
    control,
    name: "items",
  });

  const { data: budgetEntries } = useBudgetEntries();
  const items = watch("items") || [];
  const costCenter = watch("cost_center");

  const selectedEntry = budgetEntries?.find(
    (b: any) =>
      `${b.unq_code} - ${b.name}` === costCenter ||
      `${b.name} - ${b.unq_code}` === costCenter,
  );

  const budgetCodeOptions =
    selectedEntry?.budget_entries?.map((item: any) => ({
      id: item.id,
      name: `${item.account_code} - ${item.item_name}`,
      balance: Number(item.remaining || 0),
    })) || [];

  const totalAmount =
    items.reduce(
      (sum: number, item: any) =>
        sum + (Number(item.quantity) || 0) * (Number(item.unit_price) || 0),
      0,
    );

  useEffect(() => {
    // Calculate aggregate totals per budget code
    const aggregateTotals: Record<string, number> = {};
    items.forEach((item: any) => {
      if (item.budget_code) {
        const itemTotal = (Number(item.quantity) || 0) * (Number(item.unit_price) || 0);
        aggregateTotals[item.budget_code] = (aggregateTotals[item.budget_code] || 0) + itemTotal;
      }
    });

    items.forEach((item: any, index: number) => {
      const option = budgetCodeOptions.find((opt: any) => opt.name === item.budget_code);
      if (option) {
        const totalForThisBudget = aggregateTotals[item.budget_code];
        if (totalForThisBudget > option.balance) {
          setError(`items.${index}.unit_price` as any, {
            type: "manual",
            message: "Insufficient budget",
          });
        } else {
          const fieldError = errors?.items?.[index]?.unit_price;
          if (fieldError?.type === "manual") {
            clearErrors(`items.${index}.unit_price` as any);
          }
        }
      }
    });
  }, [items, budgetCodeOptions, setError, clearErrors, errors]);

  return (
    <div className="space-y-6 w-full min-w-0">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h3 className="text-xl font-bold tracking-tight text-foreground">Request Items</h3>
          <p className="text-sm text-muted-foreground">
            List all items for this procurement request.
          </p>
        </div>
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="shadow-sm hover:shadow-md transition-all h-9 w-full sm:w-auto"
          onClick={() =>
            append({
              item_title: "",
              quantity: 1,
              unit_price: 0,
              item_purpose: "",
              item_remarks: "",
              budget_code: "",
              budget_id: undefined,
            })
          }
        >
          <Plus className="mr-2 h-4 w-4" />
          Add Item
        </Button>
      </div>

      <div className="border rounded-xl bg-card shadow-sm overflow-hidden flex flex-col w-full">
        {/* Desktop View: Table */}
        <div className="hidden xl:block w-full overflow-x-auto relative">
          <div className="min-w-[1000px] w-full">
            <Table>
              <TableHeader className="bg-muted/50 border-b-2">
                <TableRow className="hover:bg-transparent">
                  <TableHead className="w-[50px] text-center font-bold border-r text-[10px] uppercase tracking-wider">#</TableHead>
                  <TableHead className="w-[200px] font-bold border-r text-[10px] uppercase tracking-wider">Item Title</TableHead>
                  <TableHead className="w-[200px] font-bold border-r text-[10px] uppercase tracking-wider text-primary">Budget Code</TableHead>
                  <TableHead className="w-[200px] font-bold border-r text-[10px] uppercase tracking-wider">Purpose</TableHead>
                  <TableHead className="w-[120px] font-bold border-r text-[10px] uppercase tracking-wider">Unit Price</TableHead>
                  <TableHead className="w-[80px] font-bold border-r text-[10px] uppercase tracking-wider">Qty</TableHead>
                  <TableHead className="w-[140px] text-right font-bold border-r text-[10px] uppercase tracking-wider bg-primary/5 text-primary">Total</TableHead>
                  <TableHead className="w-[200px] font-bold border-r text-[10px] uppercase tracking-wider">Remarks</TableHead>
                  <TableHead className="w-[60px] text-center"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {fields.map((field, index) => {
                  const item = items[index];
                  const selectedBudget = budgetCodeOptions.find((opt: any) => opt.name === item?.budget_code);
                  
                  // Calculate aggregate total for this item's budget code
                  const totalForThisBudget = items.reduce((sum: number, it: any) => {
                    if (it.budget_code && it.budget_code === item?.budget_code) {
                      return sum + (Number(it.quantity) || 0) * (Number(it.unit_price) || 0);
                    }
                    return sum;
                  }, 0);

                  const isOverBudget = selectedBudget && totalForThisBudget > selectedBudget.balance;

                  return (
                    <ItemTableRow
                      key={field.id}
                      index={index}
                      control={control}
                      item={item}
                      budgetCodeOptions={budgetCodeOptions}
                      selectedBudget={selectedBudget}
                      isOverBudget={!!isOverBudget}
                      onRemove={remove}
                      onBudgetSelect={(option: any) => {
                        setValue(`items.${index}.budget_id` as any, Number(option.id), { shouldDirty: true, shouldValidate: true });
                      }}
                    />
                  );
                })}
              </TableBody>
            </Table>
          </div>
        </div>

        {/* Mobile View: Cards */}
        <div className="xl:hidden divide-y divide-border">
          {fields.map((field, index) => {
            const item = items[index];
            const selectedBudget = budgetCodeOptions.find((opt: any) => opt.name === item?.budget_code);
            
            // Calculate aggregate total for this item's budget code
            const totalForThisBudget = items.reduce((sum: number, it: any) => {
              if (it.budget_code && it.budget_code === item?.budget_code) {
                return sum + (Number(it.quantity) || 0) * (Number(it.unit_price) || 0);
              }
              return sum;
            }, 0);

            const isOverBudget = selectedBudget && totalForThisBudget > selectedBudget.balance;

            return (
              <ItemMobileCard
                key={field.id}
                index={index}
                control={control}
                item={item}
                budgetCodeOptions={budgetCodeOptions}
                selectedBudget={selectedBudget}
                isOverBudget={!!isOverBudget}
                onRemove={remove}
                onBudgetSelect={(option: any) => {
                  setValue(`items.${index}.budget_id` as any, Number(option.id), { shouldDirty: true, shouldValidate: true });
                }}
              />
            );
          })}
        </div>

        {fields.length === 0 && (
          <div className="h-64 flex flex-col items-center justify-center space-y-4 p-8 text-center bg-muted/5">
            <div className="h-12 w-12 rounded-full bg-muted flex items-center justify-center text-muted-foreground mb-2">
              <Plus className="h-6 w-6" />
            </div>
            <div className="space-y-1">
              <p className="font-bold text-foreground">No items added yet</p>
              <p className="text-sm text-muted-foreground max-w-[240px]">
                Start adding items to your procurement request by clicking the button below.
              </p>
            </div>
            <Button
              type="button"
              variant="secondary"
              size="sm"
              className="mt-2"
              onClick={() =>
                append({
                  item_title: "",
                  budget_code: "",
                  quantity: 1,
                  unit_price: 0,
                  item_purpose: "",
                  item_remarks: "",
                  budget_id: undefined,
                })
              }
            >
              <Plus className="mr-2 h-4 w-4" />
              Add First Item
            </Button>
          </div>
        )}

        {fields.length > 0 && (
          <div className="flex flex-col sm:flex-row justify-between items-center p-6 bg-muted/30 border-t gap-4 w-full">
            <div className="flex items-center gap-2 text-muted-foreground">
              <span className="text-[10px] font-bold uppercase tracking-widest">{fields.length} {fields.length === 1 ? 'Item' : 'Items'}</span>
            </div>
            <div className="flex flex-col items-center sm:items-end gap-1">
              <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Total Estimated Amount</span>
              <span className="text-3xl font-black text-primary drop-shadow-sm">
                {new Intl.NumberFormat("en-PH", {
                  style: "currency",
                  currency: "PHP",
                }).format(totalAmount)}
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
