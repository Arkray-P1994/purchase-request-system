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
import { TeamDistribution as TeamDistributionData } from "@/api/fetch-dashboard";
import { useAuth } from "@/features/auth/auth";

interface TeamDistributionProps {
  data?: TeamDistributionData[];
}

const chartConfig = {
  count: {
    label: "Requests",
    color: "hsl(var(--chart-1))",
  },
} satisfies ChartConfig;

export function TeamDistribution({ data }: TeamDistributionProps) {
  const { user } = useAuth();

  const chartData = React.useMemo(() => {
    if (!data) return [];

    const userTeamNames = user?.teams?.map((t) => t.name) || [];
    const isAdmin =
      user?.role?.toLowerCase() === "admin" ||
      user?.position?.toLowerCase() === "superadmin";

    return data
      .filter((item) => {
        if (isAdmin) return true;
        return userTeamNames.includes(item.team_name);
      })
      .map((item) => ({
        team: item.team_name,
        count: item.count,
      }));
  }, [data, user]);

  return (
    <Card className="lg:col-span-3">
      <CardHeader>
        <CardTitle>Team Distribution</CardTitle>
        <CardDescription>Requests submitted by each team</CardDescription>
      </CardHeader>
      <CardContent>
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
            <Bar
              dataKey="count"
              fill="var(--color-count)"
              radius={[4, 4, 0, 0]}
              barSize={40}
            />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
