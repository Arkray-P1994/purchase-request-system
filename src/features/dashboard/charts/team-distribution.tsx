import * as React from "react";
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";

import {
  Card,
  CardContent,
  CardDescription,
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
import { TeamDistribution as TeamDistributionData } from "@/api/fetch-dashboard";
import { useAuth } from "@/features/auth/auth";

interface TeamDistributionProps {
  data?: TeamDistributionData[];
  fullWidth?: boolean;
}

const baseChartConfig = {
  Pending: { label: "Pending", color: "hsl(var(--chart-1))" },
  "Under Approval": { label: "Under Approval", color: "hsl(var(--chart-2))" },
  Approved: { label: "Approved", color: "hsl(var(--chart-3))" },
  "For Cash Release": { label: "For Cash Release", color: "hsl(var(--chart-4))" },
  "Cash Released": { label: "Cash Released", color: "hsl(var(--chart-5))" },
  Released: { label: "Released", color: "hsl(var(--primary))" },
  Disapproved: { label: "Disapproved", color: "hsl(var(--destructive))" },
  Cancelled: { label: "Cancelled", color: "hsl(var(--muted-foreground))" },
  Draft: { label: "Draft", color: "hsl(var(--muted))" },
} as const;

const fallbackColors = [
  "hsl(var(--chart-1))",
  "hsl(var(--chart-2))",
  "hsl(var(--chart-3))",
  "hsl(var(--chart-4))",
  "hsl(var(--chart-5))",
];

export function TeamDistribution({ data, fullWidth }: TeamDistributionProps) {
  const { user } = useAuth();

  const { chartData, uniqueStatuses, chartConfig } = React.useMemo(() => {
    if (!data) return { chartData: [], uniqueStatuses: [], chartConfig: {} };

    const userTeamNames = user?.teams?.map((t) => t.name) || [];
    const isAdmin =
      user?.role?.toLowerCase() === "admin" ||
      user?.position?.toLowerCase() === "superadmin";

    const filteredData = data.filter((item) => {
      if (isAdmin) return true;
      return userTeamNames.includes(item.team_name);
    });

    const statusSet = new Set<string>();

    // Collect unique statuses (excluding Draft)
    filteredData.forEach((item) => {
      item.statuses?.forEach((s) => {
        if (s.status_name && s.status_name !== "Draft" && s.count > 0) {
          statusSet.add(s.status_name);
        }
      });
    });

    const statuses = Array.from(statusSet);
    const mappedStatuses = statuses.map((s) => ({
      original: s,
      key: s.replace(/ /g, "-"),
    }));

    // Transform data for stacked chart
    const transformedData = filteredData.map((item) => {
      const row: Record<string, any> = { team: item.team_name };

      // Initialize to 0
      mappedStatuses.forEach((s) => {
        row[s.key] = 0;
      });

      // Populate counts
      item.statuses?.forEach((s) => {
        if (s.status_name !== "Draft") {
          row[s.status_name.replace(/ /g, "-")] = s.count;
        }
      });

      return row;
    });

    // Build dynamic chart config
    const dynamicConfig: ChartConfig = {};
    mappedStatuses.forEach(({ original, key }, index) => {
      const baseKey = original as keyof typeof baseChartConfig;

      dynamicConfig[key] = {
        label: baseChartConfig[baseKey]?.label || original,
        color:
          baseChartConfig[baseKey]?.color ||
          fallbackColors[index % fallbackColors.length],
      };
    });

    return {
      chartData: transformedData,
      uniqueStatuses: mappedStatuses,
      chartConfig: dynamicConfig,
    };
  }, [data, user]);

  return (
    <Card className={fullWidth ? "lg:col-span-6" : "lg:col-span-3"}>
      <CardHeader>
        <CardTitle>Team Distribution</CardTitle>
        <CardDescription>Requests submitted by each team</CardDescription>
      </CardHeader>
      <CardContent>
        {chartData.length > 0 ? (
          <ChartContainer config={chartConfig} className="h-[300px] w-full">
            <BarChart
              data={chartData}
              margin={{
                top: 20,
                right: 30,
                left: 20,
                bottom: 5,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis
                dataKey="team"
                tickLine={false}
                tickMargin={10}
                axisLine={false}
              />
              <YAxis tickLine={false} axisLine={false} tickMargin={10} />
              <ChartTooltip content={<ChartTooltipContent />} />
              <ChartLegend content={<ChartLegendContent />} className="flex-wrap" />
              {uniqueStatuses.map(({ key }) => (
                <Bar
                  key={key}
                  dataKey={key}
                  stackId="a"
                  fill={`var(--color-${key})`}
                  radius={[2, 2, 0, 0]}
                  barSize={40}
                />
              ))}
            </BarChart>
          </ChartContainer>
        ) : (
          <div className="flex h-[300px] items-center justify-center text-muted-foreground">
            No data available.
          </div>
        )}
      </CardContent>
    </Card>
  );
}
