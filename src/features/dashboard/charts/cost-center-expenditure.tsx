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
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";
import { ExpenditureByCostCenter } from "@/api/fetch-dashboard";
import { useAuth } from "@/features/auth/auth";

interface CostCenterExpenditureProps {
  data?: ExpenditureByCostCenter[];
}

const chartConfig = {
  total: {
    label: "Total Expenditure",
    color: "hsl(var(--chart-3))",
  },
} satisfies ChartConfig;

export function CostCenterExpenditure({ data }: CostCenterExpenditureProps) {
  const { user } = useAuth();

  const chartData = React.useMemo(() => {
    if (!data) return [];

    const userTeamsCodes = user?.teams?.map((t) => t.unq_code) || [];
    const isAdmin =
      user?.role?.toLowerCase() === "admin" ||
      user?.position?.toLowerCase() === "superadmin";

    return data
      .filter((item) => {
        if (!item.cost_center || item.cost_center === "null") return false;
        if (isAdmin) return true;

        // Filter by user's team unq_codes
        return userTeamsCodes.some(
          (code) => code && item.cost_center.startsWith(code),
        );
      })
      .map((item) => ({
        costCenter:
          item.cost_center === "N/A" ? "Other / N/A" : item.cost_center,
        total: parseFloat(item.total as string) || 0,
      }))
      .sort((a, b) => b.total - a.total)
      .slice(0, 10); // Show top 10
  }, [data, user]);

  return (
    <Card className="lg:col-span-3">
      <CardHeader>
        <CardTitle>Expenditure by Cost Center</CardTitle>
        <CardDescription>Top cost centers by total approved amount</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-[300px] w-full">
          <BarChart
            data={chartData}
            layout="vertical"
            margin={{
              top: 5,
              right: 30,
              left: 40,
              bottom: 5,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" horizontal={false} />
            <XAxis type="number" hide />
            <YAxis
              dataKey="costCenter"
              type="category"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              width={150}
              tick={{ fontSize: 10 }}
            />
            <ChartTooltip
              content={
                <ChartTooltipContent
                  labelFormatter={(value) => value}
                  formatter={(value: any) =>
                    new Intl.NumberFormat("en-US", {
                      style: "currency",
                      currency: "PHP",
                    }).format(value)
                  }
                />
              }
            />
            <Bar
              dataKey="total"
              fill="var(--color-total)"
              radius={[0, 4, 4, 0]}
              barSize={20}
            />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
