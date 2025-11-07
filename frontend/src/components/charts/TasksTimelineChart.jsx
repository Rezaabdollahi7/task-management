// src/components/charts/TasksTimelineChart.jsx
// Tasks timeline area chart with shadcn/ui

import { useMemo } from "react";
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts";
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

const TasksTimelineChart = ({ data }) => {
  // Transform data
  const chartData = useMemo(() => {
    if (!data || data.length === 0) {
      return [];
    }

    return data.map((item) => ({
      month: item.month,
      open: parseInt(item.open) || 0,
      in_progress: parseInt(item.in_progress) || 0,
      completed: parseInt(item.completed) || 0,
      cancelled: parseInt(item.cancelled) || 0,
    }));
  }, [data]);

  // Chart config
  const chartConfig = {
    open: {
      label: "Open",
      color: "hsl(45, 93%, 47%)",
    },
    in_progress: {
      label: "In Progress",
      color: "hsl(25, 95%, 53%)",
    },
    completed: {
      label: "Completed",
      color: "hsl(142, 71%, 45%)",
    },
    cancelled: {
      label: "Cancelled",
      color: "hsl(0, 84%, 60%)",
    },
  };

  // Calculate total tasks across all months
  const totalTasks = useMemo(() => {
    return chartData.reduce(
      (acc, curr) =>
        acc + curr.open + curr.in_progress + curr.completed + curr.cancelled,
      0
    );
  }, [chartData]);

  return (
    <Card className="flex flex-col border-0 shadow-none">
      <CardHeader className="items-center pb-0">
        <CardTitle className="text-lg font-semibold">
          Tasks Timeline (Last 3 Months)
        </CardTitle>
        <CardDescription className="text-xs">
          {totalTasks} tasks created in the last 3 months
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-1 pb-0">
        <ChartContainer config={chartConfig} className="h-[300px] w-full">
          <AreaChart
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
              dataKey="month"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
            />
            <YAxis tickLine={false} axisLine={false} tickMargin={8} />
            <ChartTooltip content={<ChartTooltipContent />} cursor={false} />
            <ChartLegend content={<ChartLegendContent />} />

            <Area
              dataKey="completed"
              type="monotone"
              fill="hsl(142, 71%, 45%)"
              fillOpacity={0.8}
              stroke="hsl(var(--chart-3))"
              stackId="2"
            />
            <Area
              dataKey="in_progress"
              type="monotone"
              fill="hsl(25, 95%, 53%)"
              fillOpacity={0.8}
              stroke="hsl(var(--chart-2))"
              stackId="2"
            />
            <Area
              dataKey="open"
              type="monotone"
              fill="#8DC4FE"
              fillOpacity={0.8}
              stroke="hsl(var(--chart-1))"
              stackId="2"
            />
            <Area
              dataKey="cancelled"
              type="monotone"
              fill="hsl(0, 84%, 60%)"
              fillOpacity={0.8}
              stroke="hsl(var(--chart-4))"
              stackId="2"
            />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
};

export default TasksTimelineChart;
