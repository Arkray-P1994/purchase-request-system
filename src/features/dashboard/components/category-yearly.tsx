"use client";

import * as React from "react";
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface DataItem {
  year: string;
  category_name: string;
  total_price: string;
}

interface ChartDataItem {
  year: string;
  [key: string]: string | number;
}

const categoryColors: Record<string, string> = {
  "16110 Building": "hsl(var(--chart-1))",
  "16120 Machineries & Equipment": "hsl(var(--chart-2))",
  "16130 Tools, Furnitures": "hsl(var(--chart-3))",
  "16140 Land & Building Improvements": "hsl(var(--chart-4))",
  "16150 Transportation Equipments": "hsl(var(--chart-5))",
  "16160 Office Equipment, Furnitures": "hsl(220, 70%, 50%)",
};

export function YearlyDistrubutionCategory({ data }: { data: DataItem[] }) {
  const [selectedCategory, setSelectedCategory] = React.useState<string>("all");

  const allCategories = React.useMemo(() => {
    return [...new Set(data.map((item) => item.category_name))].sort();
  }, [data]);

  const chartData = React.useMemo(() => {
    const years = [...new Set(data.map((item) => item.year))].sort();
    const categories =
      selectedCategory === "all" ? allCategories : [selectedCategory];

    const dataMap = new Map<string, number>();
    data.forEach((item) => {
      const key = `${item.year}-${item.category_name}`;
      dataMap.set(key, parseFloat(item.total_price));
    });

    return years.map((year) => {
      const yearData: ChartDataItem = { year };
      categories.forEach((category) => {
        const key = `${year}-${category}`;
        const categoryKey = category.split(" ").slice(1).join(" ");
        yearData[categoryKey] = dataMap.get(key) || 0;
      });
      return yearData;
    });
  }, [data, selectedCategory, allCategories]);

  const chartConfig = React.useMemo(() => {
    const categories =
      selectedCategory === "all" ? allCategories : [selectedCategory];
    const config: ChartConfig = {};
    categories.forEach((category, index) => {
      const categoryKey = category.split(" ").slice(1).join(" ");
      config[categoryKey] = {
        label: categoryKey,
        color:
          categoryColors[category] || `hsl(var(--chart-${(index % 5) + 1}))`,
      };
    });
    return config;
  }, [selectedCategory, allCategories]);

  const categoryKeys = React.useMemo(() => {
    const categories =
      selectedCategory === "all" ? allCategories : [selectedCategory];
    return categories.map((cat) => cat.split(" ").slice(1).join(" "));
  }, [selectedCategory, allCategories]);

  return (
    <Card>
      <CardHeader className="flex items-center gap-2 space-y-0 border-b py-5 sm:flex-row">
        <div className="grid flex-1 gap-1 text-center sm:text-left">
          <CardTitle>Capital Expenditure by Category</CardTitle>
          <CardDescription>
            {selectedCategory === "all"
              ? "Investment distribution across all categories by year"
              : `Investment in ${selectedCategory} by year`}
          </CardDescription>
        </div>
        <Select value={selectedCategory} onValueChange={setSelectedCategory}>
          <SelectTrigger className="w-[250px] rounded-lg sm:ml-auto">
            <SelectValue placeholder="All Categories" />
          </SelectTrigger>
          <SelectContent className="rounded-xl">
            <SelectItem value="all">All Categories</SelectItem>
            {allCategories.map((category) => (
              <SelectItem key={category} value={category}>
                {category}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </CardHeader>
      <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
        <ChartContainer
          config={chartConfig}
          className="aspect-auto h-[350px] w-full"
        >
          <AreaChart data={chartData} margin={{ left: 12, right: 12 }}>
            <defs>
              {categoryKeys.map((key) => (
                <linearGradient
                  key={key}
                  id={`fill${key.replace(/[^a-zA-Z0-9]/g, "")}`}
                  x1="0"
                  y1="0"
                  x2="0"
                  y2="1"
                >
                  <stop
                    offset="5%"
                    stopColor={chartConfig[key]?.color}
                    stopOpacity={0.3}
                  />
                  <stop
                    offset="95%"
                    stopColor={chartConfig[key]?.color}
                    stopOpacity={0}
                  />
                </linearGradient>
              ))}
            </defs>
            <CartesianGrid vertical={false} strokeDasharray="3 3" />
            <XAxis
              dataKey="year"
              tickLine={false}
              axisLine={false}
              tickMargin={12}
            />
            <YAxis
              tickLine={false}
              axisLine={false}
              tickMargin={12}
              tickFormatter={(value) =>
                new Intl.NumberFormat("en-US", {
                  notation: "compact",
                  compactDisplay: "short",
                }).format(value)
              }
            />
            <ChartTooltip
              cursor={{
                stroke: "hsl(var(--muted-foreground))",
                strokeWidth: 1,
              }}
              content={
                <ChartTooltipContent
                  className="w-[280px]"
                  labelFormatter={(value) => `Year: ${value}`}
                  formatter={(value, name, props) => (
                    <div className="flex w-full items-center justify-between gap-2">
                      <div className="flex items-center gap-1">
                        <div
                          className="h-2 w-2 shrink-0 rounded-[2px]"
                          style={{ backgroundColor: props.color }}
                        />
                        <span className="text-xs text-muted-foreground">
                          {name}
                        </span>
                      </div>
                      <span className="font-mono text-xs font-medium tabular-nums">
                        {new Intl.NumberFormat("en-US", {
                          style: "currency",
                          currency: "JPY",
                          maximumFractionDigits: 0,
                        }).format(Number(value))}
                      </span>
                    </div>
                  )}
                />
              }
            />
            {categoryKeys.map((key) => (
              <Area
                key={key}
                dataKey={key}
                type="monotone"
                fill={`url(#fill${key.replace(/[^a-zA-Z0-9]/g, "")})`}
                stroke={chartConfig[key]?.color}
                strokeWidth={2}
                connectNulls
              />
            ))}
            <ChartLegend content={<ChartLegendContent />} />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
