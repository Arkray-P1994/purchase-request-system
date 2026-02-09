"use client";

import * as React from "react";
import { TrendingUp } from "lucide-react";
import { Label, Pie, PieChart, Cell } from "recharts";

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
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

const chartConfig = {
  count: {
    label: "Count",
  },
  verified: {
    label: "Verified",
    color: "hsl(var(--chart-1))",
  },
  unverified: {
    label: "Unverified",
    color: "hsl(var(--chart-2))",
  },
  not_found: {
    label: "Not Found",
    color: "hsl(var(--chart-5))",
  },
} satisfies ChartConfig;

export function AssetDistribution({
  data: rawData,
}: {
  data: Record<string, { count: number; label: string }>;
}) {
  const chartData = React.useMemo(() => {
    return Object.entries(rawData).map(([key, value]) => ({
      status: key,
      count: value.count,
    }));
  }, [rawData]);

  const totalAssets = React.useMemo(() => {
    return chartData.reduce((acc, curr) => acc + curr.count, 0);
  }, [chartData]);

  return (
    <Card className="col-span-1 lg:col-span-2 border-none shadow-lg">
      <CardHeader className="items-center pb-0">
        <CardTitle className="text-xl font-bold">Asset Verification</CardTitle>
        <CardDescription>Current Audit Status</CardDescription>
      </CardHeader>
      <CardContent className="flex-1 pb-0">
        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-square max-h-[300px] min-h-[250px]"
        >
          <PieChart>
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Pie
              data={chartData}
              dataKey="count"
              nameKey="status"
              innerRadius={70}
              outerRadius={90}
              paddingAngle={5}
              stroke="none"
            >
              {chartData.map((entry, index) => {
                const config =
                  chartConfig[entry.status as keyof typeof chartConfig];
                return (
                  <Cell
                    key={`cell-${index}`}
                    fill={"color" in config ? config.color : "#775DD0"}
                    className="hover:opacity-80 transition-opacity duration-300"
                  />
                );
              })}
              <Label
                content={({ viewBox }) => {
                  if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                    return (
                      <text
                        x={viewBox.cx}
                        y={viewBox.cy}
                        textAnchor="middle"
                        dominantBaseline="middle"
                      >
                        <tspan
                          x={viewBox.cx}
                          y={viewBox.cy}
                          className="fill-foreground text-4xl font-black"
                        >
                          {totalAssets.toLocaleString()}
                        </tspan>
                        <tspan
                          x={viewBox.cx}
                          y={(viewBox.cy || 0) + 28}
                          className="fill-muted-foreground text-sm font-medium uppercase tracking-wider"
                        >
                          Total Assets
                        </tspan>
                      </text>
                    );
                  }
                }}
              />
            </Pie>
            <ChartLegend
              content={<ChartLegendContent nameKey="status" />}
              className="mt-6 flex-wrap justify-center gap-4"
            />
          </PieChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col gap-2 text-sm pt-6">
        <div className="flex items-center gap-2 font-semibold text-emerald-500 leading-none">
          Live audit tracking enabled <TrendingUp className="h-4 w-4" />
        </div>
      </CardFooter>
    </Card>
  );
}
