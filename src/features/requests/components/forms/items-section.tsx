import { useFieldArray, useFormContext } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Plus, Trash2 } from "lucide-react";
import { Field } from "@/components/forms/form-field";
import { CreateRequestValues } from "../schema";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export function ItemsSection() {
  const { control, watch } = useFormContext<CreateRequestValues>();
  const { fields, append, remove } = useFieldArray({
    control,
    name: "items",
  });

  const items = watch("items");
  const totalAmount = items?.reduce((sum, item) => sum + (Number(item.quantity || 0) * Number(item.unit_price || 0)), 0) || 0;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-xl font-bold tracking-tight">Request Items</h3>
          <p className="text-sm text-muted-foreground">List all items for this procurement request.</p>
        </div>
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="shadow-sm hover:shadow-md transition-all h-9"
          onClick={() =>
            append({
              item_title: "",
              item_name: "",
              quantity: 1,
              unit_price: 0,
              item_purpose: "",
              item_remarks: "",
              budget_code: "",
            })
          }
        >
          <Plus className="mr-2 h-4 w-4" />
          Add Item
        </Button>
      </div>

      <div className="border rounded-xl bg-card overflow-x-auto shadow-sm">
        <Table>
          <TableHeader className="bg-muted/50 border-b-2">
            <TableRow className="hover:bg-transparent">
              <TableHead className="w-[50px] text-center font-bold border-r">#</TableHead>
              <TableHead className="min-w-[150px] font-bold border-r">TITLE</TableHead>
              <TableHead className="min-w-[140px] font-bold border-r">BUDGET CODE</TableHead>
              <TableHead className="min-w-[150px] font-bold border-r">ITEM NAME</TableHead>
              <TableHead className="min-w-[150px] font-bold border-r">PURPOSE</TableHead>
              <TableHead className="w-[120px] font-bold border-r">UNIT PRICE</TableHead>
              <TableHead className="w-[80px] font-bold border-r">QTY</TableHead>
              <TableHead className="w-[120px] text-right font-bold border-r">TOTAL PRICE</TableHead>
              <TableHead className="min-w-[150px] font-bold border-r">REMARKS</TableHead>
              <TableHead className="w-[50px] text-center"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {fields.map((field, index) => (
              <TableRow key={field.id} className="group hover:bg-muted/30 transition-colors border-b">
                <TableCell className="text-center font-medium text-muted-foreground p-3 border-r">
                  {index + 1}
                </TableCell>
                <TableCell className="p-2 border-r">
                  <Field
                    control={control}
                    name={`items.${index}.item_title`}
                    label="Title"
                    placeholder="Title"
                    variant="input"
                    hideLabel
                    className="h-9 text-xs shadow-sm focus-visible:ring-1"
                  />
                </TableCell>
                <TableCell className="p-2 border-r">
                  <Field
                    control={control}
                    name={`items.${index}.budget_code`}
                    label="Budget Code"
                    placeholder="Code"
                    variant="input"
                    hideLabel
                    className="h-9 text-xs shadow-sm focus-visible:ring-1"
                  />
                </TableCell>
                <TableCell className="p-2 border-r">
                  <Field
                    control={control}
                    name={`items.${index}.item_name`}
                    label="Item Name"
                    placeholder="Name"
                    variant="input"
                    hideLabel
                    className="h-9 text-xs shadow-sm focus-visible:ring-1"
                  />
                </TableCell>
                <TableCell className="p-2 border-r">
                  <Field
                    control={control}
                    name={`items.${index}.item_purpose`}
                    label="Purpose"
                    placeholder="Purpose"
                    variant="input"
                    hideLabel
                    className="h-9 text-xs shadow-sm focus-visible:ring-1"
                  />
                </TableCell>
                <TableCell className="p-2 border-r">
                  <Field
                    control={control}
                    name={`items.${index}.unit_price`}
                    label="Price"
                    type="number"
                    variant="input"
                    hideLabel
                    className="h-9 text-xs shadow-sm focus-visible:ring-1 text-right font-mono"
                  />
                </TableCell>
                <TableCell className="p-2 border-r">
                  <Field
                    control={control}
                    name={`items.${index}.quantity`}
                    label="Qty"
                    type="number"
                    variant="input"
                    hideLabel
                    className="h-9 text-xs shadow-sm focus-visible:ring-1 text-center font-mono"
                  />
                </TableCell>
                <TableCell className="p-3 text-right font-bold text-xs whitespace-nowrap border-r bg-muted/5">
                  {new Intl.NumberFormat('en-PH', { style: 'currency', currency: 'PHP' }).format(
                    Number(items[index]?.quantity || 0) * Number(items[index]?.unit_price || 0)
                  )}
                </TableCell>
                <TableCell className="p-2">
                  <Field
                    control={control}
                    name={`items.${index}.item_remarks`}
                    label="Remarks"
                    placeholder="Remarks"
                    variant="input"
                    hideLabel
                    className="h-9 text-xs shadow-sm focus-visible:ring-1"
                  />
                </TableCell>
                <TableCell className="p-2 text-center">
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-muted-foreground hover:text-destructive hover:bg-destructive/10 opacity-0 group-hover:opacity-100 transition-all border shadow-sm"
                    onClick={() => remove(index)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}

            {fields.length === 0 && (
              <TableRow>
                <TableCell colSpan={10} className="h-40 text-center">
                   <div className="flex flex-col items-center justify-center space-y-3">
                    <p className="text-muted-foreground">No items added to this request yet.</p>
                    <Button
                      type="button"
                      variant="secondary"
                      size="sm"
                      onClick={() => append({
                        item_title: "",
                        budget_code: "",
                        item_name: "",
                        quantity: 1,
                        unit_price: 0,
                        item_purpose: "",
                        item_remarks: "",
                      })}
                    >
                      <Plus className="mr-2 h-4 w-4" />
                      Add First Item
                    </Button>
                   </div>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>

        {fields.length > 0 && (
          <div className="flex justify-end items-center p-6 bg-muted/30 border-t gap-6">
            <span className="text-sm font-bold uppercase tracking-wider text-muted-foreground">Total Estimated Amount</span>
            <span className="text-3xl font-extrabold text-primary">
              {new Intl.NumberFormat('en-PH', { style: 'currency', currency: 'PHP' }).format(totalAmount)}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
