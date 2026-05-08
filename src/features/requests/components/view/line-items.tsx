import { Package } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { formatCurrency } from "@/lib/utils";
import { RequestItem } from "@/types/request";

interface LineItemsProps {
  items: RequestItem[];
  currency?: string;
}

export function LineItems({ items, currency = "PHP" }: LineItemsProps) {
  return (
    <Card className="border-none shadow-sm bg-card/60 backdrop-blur-sm overflow-hidden">
      <CardHeader>
        <CardTitle className="text-lg font-bold flex items-center gap-2">
          <Package className="h-5 w-5 text-primary" />
          Line Items
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <Table>
          <TableHeader className="bg-muted/50 border-b-2">
            <TableRow>
              <TableHead className="w-[50px] text-center font-bold text-[10px] uppercase border-r">
                #
              </TableHead>
              <TableHead className="font-bold text-[10px] uppercase min-w-[120px] border-r">
                Title
              </TableHead>
              <TableHead className="font-bold text-[10px] uppercase border-r">
                Budget Code
              </TableHead>
              <TableHead className="font-bold text-[10px] uppercase min-w-[120px] border-r">
                Purpose
              </TableHead>
              <TableHead className="w-[60px] text-center font-bold text-[10px] uppercase border-r">
                Qty
              </TableHead>
              <TableHead className="w-[100px] text-right font-bold text-[10px] uppercase border-r">
                Unit Price
              </TableHead>
              <TableHead className="w-[110px] text-right font-bold text-[10px] uppercase border-r">
                Total
              </TableHead>
              <TableHead className="font-bold text-[10px] uppercase min-w-[120px]">
                Remarks
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {items?.map((item, index) => (
              <TableRow
                key={item.id || index}
                className="group hover:bg-muted/30 transition-colors border-b"
              >
                <TableCell className="text-center text-muted-foreground font-medium border-r">
                  {index + 1}
                </TableCell>
                <TableCell className="border-r">
                  <p className="font-bold text-sm leading-none text-foreground">
                    {item.item_title}
                  </p>
                </TableCell>
                <TableCell className="border-r">
                  <code className="text-[10px] font-mono px-2 py-0.5 bg-primary/5 text-primary rounded-md border border-primary/10 font-bold">
                    {item.budget_code || "N/A"}
                  </code>
                </TableCell>
                <TableCell className="border-r">
                  <span
                    className="text-xs font-medium text-muted-foreground line-clamp-2"
                    title={item.item_purpose}
                  >
                    {item.item_purpose || "—"}
                  </span>
                </TableCell>
                <TableCell className="text-center font-bold text-sm border-r">
                  {item.quantity || 0}
                </TableCell>
                <TableCell className="text-right font-semibold text-sm border-r">
                  {formatCurrency(item.unit_price || 0, currency)}
                </TableCell>
                <TableCell className="text-right font-black text-sm text-primary border-r">
                  {formatCurrency((item.quantity || 0) * (item.unit_price || 0), currency)}
                </TableCell>
                <TableCell>
                  <span
                    className="text-xs italic text-muted-foreground/80 line-clamp-2"
                    title={item.item_remarks}
                  >
                    {item.item_remarks || "—"}
                  </span>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
