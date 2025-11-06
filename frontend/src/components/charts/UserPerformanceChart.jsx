// src/components/charts/UserPerformanceChart.jsx
// User performance stacked bar chart with shadcn/ui

import { useMemo } from "react";
import { Bar, BarChart, CartesianGrid, XAxis, YAxis, Legend } from "recharts";
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
} from "@/components/ui/chart";

const UserPerformanceChart = ({ data }) => {
  // Transform data
  const chartData = useMemo(() => {
    if (!data || data.length === 0) {
      return [];
    }

    return data.map((item) => ({
      name: item.name,
      completed: parseInt(item.completed) || 0,
      incomplete: parseInt(item.incomplete) || 0,
    }));
  }, [data]);

  // Chart config
  const chartConfig = {
    completed: {
      label: "Completed",
      color: "hsl(var(--chart-3))", // Green
    },
    incomplete: {
      label: "Incomplete",
      color: "hsl(var(--chart-4))", // Red/Orange
    },
  };

  // Calculate totals
  const totals = useMemo(() => {
    return chartData.reduce(
      (acc, curr) => ({
        completed: acc.completed + curr.completed,
        incomplete: acc.incomplete + curr.incomplete,
      }),
      { completed: 0, incomplete: 0 }
    );
  }, [chartData]);

  // Format name (first name only or truncate)
  const formatName = (name) => {
    if (!name) return "";
    const firstName = name.split(" ")[0];
    return firstName.length > 10
      ? firstName.substring(0, 8) + "..."
      : firstName;
  };

  return (
    <Card className="flex flex-col border-0 shadow-none">
      <CardHeader className="items-center pb-0">
        <CardTitle className="text-lg font-semibold">
          Employee Performance
        </CardTitle>
        <CardDescription className="text-xs">
          {totals.completed} completed, {totals.incomplete} incomplete tasks
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-1 pb-0">
        <ChartContainer config={chartConfig} className="h-[350px] w-full">
          <BarChart
            accessibilityLayer
            data={chartData}
            margin={{
              left: 12,
              right: 12,
              top: 12,
              bottom: 12,
            }}
          >
            <CartesianGrid vertical={false} strokeDasharray="3 3" />
            <XAxis
              dataKey="name"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              tickFormatter={formatName}
            />
            <YAxis tickLine={false} axisLine={false} tickMargin={8} />
            <ChartTooltip content={<ChartTooltipContent />} cursor={false} />
            <ChartLegend content={<ChartLegendContent />} />
            <Bar
              dataKey="completed"
              stackId="a"
              fill="#8DC4FE"
              radius={[0, 0, 4, 4]}
            />
            <Bar
              dataKey="incomplete"
              stackId="a"
              fill="#2B7FFF"
              radius={[4, 4, 0, 0]}
            />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
};

export default UserPerformanceChart;
