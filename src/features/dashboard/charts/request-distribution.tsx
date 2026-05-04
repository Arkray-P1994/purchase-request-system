import * as React from "react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  LabelList,
  XAxis,
  YAxis,
} from "recharts";

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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { RequestDistribution as RequestDistributionData } from "@/api/fetch-dashboard";

export const description = "An interactive area chart for request volume";

interface RequestDistributionProps {
  data?: RequestDistributionData;
}

const chartConfig = {
  requests: {
    label: "Requests",
    color: "hsl(var(--chart-2))",
  },
} satisfies ChartConfig;

export function RequestDistribution({ data }: RequestDistributionProps) {
  const [timeRange, setTimeRange] = React.useState("seven_days");

  const chartData = React.useMemo(() => {
    if (!data) return [];
    const source =
      timeRange === "seven_days"
        ? data.seven_days
        : timeRange === "thirty_days"
          ? data.thirty_days
          : data.yearly;

    return source.map((item: any) => ({
      label: item.date || item.month,
      requests: item.count,
    }));
  }, [data, timeRange]);

  return (
    <Card className="lg:col-span-4">
      <CardHeader className="flex items-center gap-2 space-y-0 border-b py-5 sm:flex-row">
        <div className="grid flex-1 gap-1">
          <CardTitle>Request Distribution</CardTitle>
          <CardDescription>
            Showing total purchase requests for the selected period
          </CardDescription>
        </div>
        <Select value={timeRange} onValueChange={setTimeRange}>
          <SelectTrigger
            className="w-[160px] rounded-lg sm:ml-auto"
            aria-label="Select a value"
          >
            <SelectValue placeholder="Last 7 days" />
          </SelectTrigger>
          <SelectContent className="rounded-xl">
            <SelectItem value="yearly" className="rounded-lg">
              Yearly (Monthly)
            </SelectItem>
            <SelectItem value="thirty_days" className="rounded-lg">
              Last 30 days
            </SelectItem>
            <SelectItem value="seven_days" className="rounded-lg">
              Last 7 days
            </SelectItem>
          </SelectContent>
        </Select>
      </CardHeader>
      <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
        <ChartContainer
          config={chartConfig}
          className="aspect-auto h-[400px] w-full"
        >
          <AreaChart
            data={chartData}
            margin={{
              top: 30,
              left: 12,
              right: 12,
              bottom: 30,
            }}
          >
            <defs>
              <linearGradient id="fillRequests" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor="var(--color-requests)"
                  stopOpacity={0.8}
                />
                <stop
                  offset="95%"
                  stopColor="var(--color-requests)"
                  stopOpacity={0.1}
                />
              </linearGradient>
            </defs>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="label"
              tickLine={true}
              axisLine={true}
              tickMargin={8}
              minTickGap={32}
              interval={0}
              angle={-45}
              textAnchor="end"
              height={60}
              tickFormatter={(value) => {
                if (timeRange === "yearly") return value;
                const date = new Date(value);
                return date.toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                });
              }}
            />
            <YAxis
              tickLine={true}
              axisLine={true}
              tickMargin={8}
              domain={[0, (dataMax: number) => Math.round(dataMax * 1.2) || 5]}
            />
            <ChartTooltip
              cursor={false}
              content={
                <ChartTooltipContent
                  labelFormatter={(value) => {
                    if (timeRange === "yearly") return value;
                    return new Date(value).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    });
                  }}
                  indicator="dot"
                />
              }
            />
            <Area
              dataKey="requests"
              type="natural"
              fill="url(#fillRequests)"
              stroke="var(--color-requests)"
              stackId="a"
              dot={{
                fill: "var(--color-requests)",
              }}
              activeDot={{
                r: 6,
              }}
            >
              <LabelList
                dataKey="requests"
                position="top"
                offset={12}
                className="fill-foreground"
                fontSize={12}
              />
            </Area>
            <ChartLegend content={<ChartLegendContent />} />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
