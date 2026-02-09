"use client";

import { TrendingUp } from "lucide-react";
import { CartesianGrid, Line, LineChart, XAxis, YAxis } from "recharts";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

const chartConfig = {
  total_price: {
    label: "Total Price",
    color: "hsl(var(--chart-2))",
  },
} satisfies ChartConfig;

export function Overview({
  data,
}: {
  data: { year: string; total_price: string }[];
}) {
  // 1. Parse and Sort: Ensure years are chronological and strings are numbers
  const formattedData = [...data]
    .map((item) => ({
      ...item,
      year: parseInt(item.year),
      total_price: parseFloat(item.total_price),
    }))
    .sort((a, b) => a.year - b.year);

  // 2. Formatting for Tooltip (optional but recommended)
  const formatter = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "JPY",
    maximumFractionDigits: 0,
  });

  return (
    <Card className="col-span-1 lg:col-span-4">
      <CardHeader>
        <CardTitle> Investment Timeline</CardTitle>
        <CardDescription>
          Historical capital expenditure (Total Spent) per year.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-60 w-full">
          <LineChart
            accessibilityLayer
            data={formattedData}
            margin={{
              left: 12,
              right: 12,
              top: 20,
            }}
          >
            <CartesianGrid vertical={false} strokeDasharray="3 3" />
            <XAxis
              dataKey="year"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
            />
            <YAxis hide domain={["auto", "auto"]} />
            <ChartTooltip
              cursor={{ stroke: "hsl(var(--muted))", strokeWidth: 1 }}
              content={
                <ChartTooltipContent
                  labelFormatter={(value) => `Year: ${value}`}
                  formatter={(value) => formatter.format(value as number)}
                />
              }
            />
            <Line
              dataKey="total_price"
              type="monotone"
              stroke="var(--color-total_price)"
              strokeWidth={2.5}
              dot={{
                r: 4,
                fill: "var(--color-total_price)",
                strokeWidth: 0,
              }}
              activeDot={{
                r: 6,
                strokeWidth: 0,
              }}
            />
          </LineChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col items-start gap-2 text-sm">
        <div className="flex gap-2 font-medium leading-none">
          Performance across {formattedData.length} years{" "}
          <TrendingUp className="h-4 w-4" />
        </div>
        <div className="leading-none text-muted-foreground">
          Displaying total calculated price per fiscal year
        </div>
      </CardFooter>
    </Card>
  );
}
