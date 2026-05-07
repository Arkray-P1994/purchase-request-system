import * as React from "react";
import { Label, LabelList, Pie, PieChart } from "recharts";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";
import { DashboardStatistics } from "@/api/fetch-dashboard";

interface StatusDistributionProps {
  data?: DashboardStatistics;
}

const chartConfig = {
  count: {
    label: "Requests",
  },
  Pending: {
    label: "Pending",
    color: "hsl(var(--chart-1))",
  },
  "Under Approval": {
    label: "Under Approval",
    color: "hsl(var(--chart-2))",
  },
  Approved: {
    label: "Approved",
    color: "hsl(var(--chart-3))",
  },
  "For Cash Release": {
    label: "For Cash Release",
    color: "hsl(var(--chart-4))",
  },
  "Cash Released": {
    label: "Cash Released",
    color: "hsl(var(--chart-5))",
  },
  Released: {
    label: "Released",
    color: "hsl(var(--primary))",
  },
  Disapproved: {
    label: "Disapproved",
    color: "hsl(var(--destructive))",
  },
  Cancelled: {
    label: "Cancelled",
    color: "hsl(var(--muted-foreground))",
  },
  Draft: {
    label: "Draft",
    color: "hsl(var(--muted))",
  },
} satisfies ChartConfig;

export function StatusDistribution({ data }: StatusDistributionProps) {
  const chartData = React.useMemo(() => {
    if (!data) return [];
    
    // Filter out 'Total' and only include keys that have values > 0
    return Object.entries(data)
      .filter(([key, value]) => key !== "Total" && value > 0)
      .map(([key, value]) => ({
        status: key,
        count: value,
        fill: `var(--color-${key.replace(/ /g, "-")})`,
      }));
  }, [data]);

  // Update chartConfig colors for keys with spaces
  const dynamicChartConfig = React.useMemo(() => {
    const config = { ...chartConfig } as any;
    Object.keys(data || {}).forEach(key => {
      if (key !== "Total" && key.includes(" ")) {
        const hyphenated = key.replace(/ /g, "-");
        if (config[key]) {
          config[hyphenated] = config[key];
        }
      }
    });
    return config;
  }, [data]);

  const total = data?.Total ?? 0;

  return (
    <Card className="flex flex-col lg:col-span-2">
      <CardHeader className="items-center pb-0">
        <CardTitle>Status Distribution</CardTitle>
        <CardDescription>Current request status breakdown</CardDescription>
      </CardHeader>
      <CardContent className="flex-1 pb-0">
        <ChartContainer
          config={dynamicChartConfig}
          className="mx-auto aspect-square max-h-[350px]"
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
              innerRadius={80}
              outerRadius={110}
              strokeWidth={5}
            >
              <LabelList
                dataKey="count"
                position="inside"
                fill="white"
                stroke="none"
                fontSize={12}
                fontWeight="bold"
                formatter={(value: number) => (value > 0 ? value : "")}
              />
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
                          className="fill-foreground text-3xl font-bold"
                        >
                          {total.toLocaleString()}
                        </tspan>
                        <tspan
                          x={viewBox.cx}
                          y={(viewBox.cy || 0) + 24}
                          className="fill-muted-foreground text-xs"
                        >
                          Total Requests
                        </tspan>
                      </text>
                    );
                  }
                }}
              />
            </Pie>
            <ChartLegend
              content={<ChartLegendContent nameKey="status" />}
              className="-translate-y-2 flex-wrap"
            />
          </PieChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col gap-2 text-sm">
        <div className="flex items-center gap-2 leading-none font-medium">
          Total active requests: {total}
        </div>
        <div className="leading-none text-muted-foreground">
          Showing distribution by current status
        </div>
      </CardFooter>
    </Card>
  );
}
