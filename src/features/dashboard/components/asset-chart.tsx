import React, { useState } from "react";
import {
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  Cell,
  LabelList,
  BarChart,
  Bar,
  CartesianGrid,
  PieChart,
  Pie,
  Legend,
  AreaChart,
  Area,
  LineChart,
  Line,
} from "recharts";
import { ASSET_DATA, COLORS as UI_COLORS } from "./constants";

const statusData = ASSET_DATA.breakdowns.status_distribution.map((s) => ({
  name: s.status_label.replace("_", " "),
  value: parseInt(s.count),
}));

const teamData = ASSET_DATA.breakdowns.by_team
  .map((t) => ({
    name: t.team_name,
    count: parseInt(t.count),
  }))
  .sort((a, b) => b.count - a.count);

const yearlyOverallData = [...ASSET_DATA.breakdowns.yearly_overall]
  .sort((a, b) => parseInt(a.year) - parseInt(b.year))
  .map((y) => ({
    name: y.year,
    spent: parseFloat(y.total_price),
  }));

const categories = Array.from(
  new Set(
    ASSET_DATA.breakdowns.yearly_by_category.map((item) => item.category_name),
  ),
);
const yearlyCategoryTrend = Array.from(
  new Set(ASSET_DATA.breakdowns.yearly_by_category.map((item) => item.year)),
)
  .sort((a, b) => parseInt(a) - parseInt(b))
  .map((year) => {
    const dataPoint: any = { year };
    categories.forEach((cat) => {
      const match = ASSET_DATA.breakdowns.yearly_by_category.find(
        (item) => item.year === year && item.category_name === cat,
      );
      dataPoint[cat] = match ? parseFloat(match.total_price) : 0;
    });
    return dataPoint;
  });

const aggregateCategoryData = ASSET_DATA.breakdowns.yearly_by_category
  .reduce(
    (acc, curr) => {
      const existing = acc.find((item) => item.name === curr.category_name);
      if (existing) {
        existing.value += parseFloat(curr.total_price);
      } else {
        acc.push({
          name: curr.category_name,
          value: parseFloat(curr.total_price),
        });
      }
      return acc;
    },
    [] as { name: string; value: number }[],
  )
  .sort((a, b) => b.value - a.value);

const COLORS = {
  verified: "#10b981",
  unverified: "#f59e0b",
  notFound: "#f43f5e",
  teams: UI_COLORS.chart,
};

const STATUS_COLORS: Record<string, string> = {
  Verified: COLORS.verified,
  Unverified: COLORS.unverified,
  "Not found": COLORS.notFound,
};

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-slate-900 text-white p-4 rounded-xl shadow-2xl border border-slate-700 flex flex-col gap-1 min-w-[200px]">
        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-800 pb-2 mb-2">
          {label || payload[0].payload.name || payload[0].payload.year}
        </p>
        {payload.map((entry: any, index: number) => (
          <p
            key={index}
            className="text-xs font-bold flex justify-between gap-4 py-0.5"
          >
            <span style={{ color: entry.color }} className="font-medium">
              {entry.name}:
            </span>
            <span>
              $
              {new Intl.NumberFormat("en-US", { notation: "compact" }).format(
                entry.value,
              )}
            </span>
          </p>
        ))}
      </div>
    );
  }
  return null;
};

// --- Custom Legend Components ---

const CategoryLegend = (props: any) => {
  const { payload } = props;
  return (
    <div className="flex flex-wrap justify-end gap-2 mb-6">
      {payload.map((entry: any, index: number) => (
        <div
          key={`item-${index}`}
          className="flex items-center space-x-2 bg-white border border-slate-100 px-3 py-1.5 rounded-full shadow-sm hover:border-slate-300 transition-all cursor-default group"
        >
          <div
            className="w-2.5 h-2.5 rounded-full"
            style={{ backgroundColor: entry.color }}
          />
          <span className="text-[10px] font-extrabold text-slate-600 uppercase tracking-tight group-hover:text-slate-900">
            {entry.value}
          </span>
        </div>
      ))}
    </div>
  );
};

const DonutLegend = (props: any) => {
  const { payload } = props;
  return (
    <div className="flex flex-col gap-3 pt-6">
      {payload.map((entry: any, index: number) => {
        const value = statusData.find((d) => d.name === entry.value)?.value;
        return (
          <div
            key={`item-${index}`}
            className="flex items-center justify-between group"
          >
            <div className="flex items-center space-x-3">
              <div
                className="w-3 h-3 rounded-sm"
                style={{ backgroundColor: entry.color }}
              />
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider group-hover:text-slate-900 transition-colors">
                {entry.value}
              </span>
            </div>
            <span className="text-xs font-black text-slate-400 group-hover:text-indigo-600 transition-colors">
              {value?.toLocaleString()} items
            </span>
          </div>
        );
      })}
    </div>
  );
};

export const VerificationDonut: React.FC = () => {
  const verifiedPct = Math.round(
    (parseInt(ASSET_DATA.breakdowns.status_distribution[0].count) /
      ASSET_DATA.summary.total_assets) *
      100,
  );

  return (
    <div className="h-[420px] w-full relative">
      <div className="absolute top-[38%] left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center justify-center pointer-events-none">
        <span className="text-4xl font-black text-slate-900 leading-none">
          {verifiedPct}%
        </span>
        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">
          Overall Verified
        </span>
      </div>
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={statusData}
            cx="50%"
            cy="40%"
            innerRadius={80}
            outerRadius={105}
            paddingAngle={8}
            dataKey="value"
            strokeWidth={0}
          >
            {statusData.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={STATUS_COLORS[entry.name] || "#e2e8f0"}
                style={{ filter: "drop-shadow(0 4px 6px rgba(0,0,0,0.05))" }}
              />
            ))}
          </Pie>
          <Tooltip content={<CustomTooltip />} />
          <Legend content={<DonutLegend />} />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};

export const YearlyTrendLineChart: React.FC = () => (
  <div className="h-[350px] w-full">
    <ResponsiveContainer width="100%" height="100%">
      <AreaChart
        data={yearlyOverallData}
        margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
      >
        <defs>
          <linearGradient id="colorSpent" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#6366f1" stopOpacity={0.2} />
            <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid
          strokeDasharray="3 3"
          vertical={false}
          stroke="#f1f5f9"
        />
        <XAxis
          dataKey="name"
          axisLine={false}
          tickLine={false}
          tick={{ fontSize: 10, fontWeight: 700, fill: "#94a3b8" }}
        />
        <YAxis hide />
        <Tooltip
          cursor={{ stroke: "#e2e8f0", strokeWidth: 2 }}
          content={<CustomTooltip />}
        />
        <Area
          type="monotone"
          dataKey="spent"
          name="Total Spent"
          stroke="#4338ca"
          strokeWidth={3}
          fillOpacity={1}
          fill="url(#colorSpent)"
          activeDot={{ r: 6, strokeWidth: 0, fill: "#4338ca" }}
        />
      </AreaChart>
    </ResponsiveContainer>
  </div>
);

export const YearlyCategoryLineChart: React.FC = () => {
  const [hoveredCategory, setHoveredCategory] = useState<string | null>(null);

  return (
    <div className="h-[450px] w-full mt-4">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          data={yearlyCategoryTrend}
          margin={{ top: 10, right: 30, left: 20, bottom: 20 }}
          onMouseMove={(e: any) => {
            if (e.activeTooltipIndex === undefined) setHoveredCategory(null);
          }}
          onMouseLeave={() => setHoveredCategory(null)}
        >
          <CartesianGrid
            strokeDasharray="3 3"
            vertical={false}
            stroke="#f1f5f9"
          />
          <XAxis
            dataKey="year"
            axisLine={false}
            tickLine={false}
            tick={{ fontSize: 10, fontWeight: 700, fill: "#94a3b8" }}
          />
          <YAxis
            axisLine={false}
            tickLine={false}
            tick={{ fontSize: 10, fill: "#94a3b8" }}
            tickFormatter={(val) =>
              `$${new Intl.NumberFormat("en-US", { notation: "compact" }).format(val)}`
            }
          />
          <Tooltip content={<CustomTooltip />} />
          <Legend
            verticalAlign="top"
            align="right"
            content={<CategoryLegend />}
          />
          {categories.map((cat, idx) => (
            <Line
              key={cat}
              type="monotone"
              dataKey={cat}
              name={cat}
              stroke={COLORS.teams[idx % COLORS.teams.length]}
              strokeWidth={hoveredCategory === cat ? 4 : 2}
              strokeOpacity={
                hoveredCategory && hoveredCategory !== cat ? 0.2 : 1
              }
              dot={{
                r: 3,
                fillOpacity:
                  hoveredCategory && hoveredCategory !== cat ? 0.2 : 1,
              }}
              activeDot={{ r: 6 }}
              onMouseEnter={() => setHoveredCategory(cat)}
              onMouseLeave={() => setHoveredCategory(null)}
            />
          ))}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export const TeamBarChart: React.FC = () => (
  <div className="h-[400px] w-full">
    <ResponsiveContainer width="100%" height="100%">
      <BarChart
        data={teamData}
        layout="vertical"
        margin={{ left: 20, right: 60, top: 20, bottom: 20 }}
      >
        <CartesianGrid
          strokeDasharray="3 3"
          horizontal={false}
          stroke="#f1f5f9"
        />
        <XAxis type="number" hide />
        <YAxis
          dataKey="name"
          type="category"
          width={120}
          axisLine={false}
          tickLine={false}
          tick={{ fontSize: 10, fontWeight: 700, fill: "#64748b" }}
        />
        <Tooltip cursor={{ fill: "#f8fafc" }} content={<CustomTooltip />} />
        <Bar
          dataKey="count"
          name="Asset Count"
          radius={[0, 8, 8, 0]}
          barSize={24}
        >
          {teamData.map((_, index) => (
            <Cell
              key={`cell-${index}`}
              fill={COLORS.teams[index % COLORS.teams.length]}
            />
          ))}
          <LabelList
            dataKey="count"
            position="right"
            style={{ fontSize: "10px", fontWeight: "bold", fill: "#64748b" }}
            offset={10}
          />
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  </div>
);

export const CategorySpendingBarChart: React.FC = () => (
  <div className="h-[400px] w-full">
    <ResponsiveContainer width="100%" height="100%">
      <BarChart
        data={aggregateCategoryData}
        layout="vertical"
        margin={{ left: 20, right: 100, top: 20, bottom: 20 }}
      >
        <CartesianGrid
          strokeDasharray="3 3"
          horizontal={false}
          stroke="#f1f5f9"
        />
        <XAxis
          type="number"
          axisLine={false}
          tickLine={false}
          tick={{ fontSize: 10, fill: "#94a3b8" }}
          tickFormatter={(value) =>
            `$${new Intl.NumberFormat("en-US", { notation: "compact" }).format(value)}`
          }
        />
        <YAxis
          dataKey="name"
          type="category"
          width={180}
          axisLine={false}
          tickLine={false}
          tick={{ fontSize: 10, fontWeight: 700, fill: "#64748b" }}
        />
        <Tooltip cursor={{ fill: "#f8fafc" }} content={<CustomTooltip />} />
        <Bar
          dataKey="value"
          name="Total Value"
          radius={[0, 10, 10, 0]}
          barSize={28}
        >
          {aggregateCategoryData.map((_, index) => (
            <Cell
              key={`cell-${index}`}
              fill={COLORS.teams[index % COLORS.teams.length]}
            />
          ))}
          <LabelList
            dataKey="value"
            position="right"
            offset={10}
            formatter={(val: number) =>
              `$${new Intl.NumberFormat("en-US", { notation: "compact" }).format(val)}`
            }
            style={{ fontSize: "11px", fontWeight: "800", fill: "#1e293b" }}
          />
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  </div>
);
