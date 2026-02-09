"use client";

import { TrendingUp } from "lucide-react";
import { Bar, BarChart, CartesianGrid, XAxis, LabelList } from "recharts";

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

interface TeamStatus {
  count: number;
}

interface TeamData {
  team_total: number;
  statuses: {
    verified?: TeamStatus;
    unverified?: TeamStatus;
    not_found?: TeamStatus;
  };
}

const chartConfig = {
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
    color: "hsl(var(--chart-3))",
  },
} satisfies ChartConfig;

export function TeamChart({ data }: { data: Record<string, TeamData> }) {
  const chartData = Object.entries(data)
    .filter(([_, value]) => value.team_total > 0)
    .map(([key, value]) => ({
      team: key,
      verified: value.statuses?.verified?.count || 0,
      unverified: value.statuses?.unverified?.count || 0,
      not_found: value.statuses?.not_found?.count || 0,
      total: value.team_total,
    }));

  return (
    <Card className="col-span-1 lg:col-span-3">
      <CardHeader>
        <CardTitle>Team Verification Status</CardTitle>
        <CardDescription>Departmental breakdown of data status</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <BarChart
            accessibilityLayer
            data={chartData}
            margin={{ top: 25, left: 12, right: 12, bottom: 10 }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="team"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              interval={0}
            />
            <ChartTooltip content={<ChartTooltipContent />} />
            <ChartLegend content={<ChartLegendContent />} />
            <Bar
              dataKey="verified"
              stackId="a"
              fill="var(--color-verified)"
              radius={[0, 0, 0, 0]}
            />
            <Bar
              dataKey="unverified"
              stackId="a"
              fill="var(--color-unverified)"
              radius={[0, 0, 0, 0]}
            />
            <Bar
              dataKey="not_found"
              stackId="a"
              fill="var(--color-not_found)"
              radius={[4, 4, 0, 0]}
            >
              <LabelList
                dataKey="total"
                position="top"
                offset={10}
                className="fill-foreground font-bold"
                fontSize={12}
              />
            </Bar>
          </BarChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col items-start gap-2 text-sm">
        <div className="flex gap-2 font-medium leading-none">
          Active departments tracked: {chartData.length}{" "}
          <TrendingUp className="h-4 w-4" />
        </div>
        <div className="leading-none text-muted-foreground">
          Showing real-time status counts per team
        </div>
      </CardFooter>
    </Card>
  );
}
