// src/components/charts/PriorityBarChart.jsx
// Priority distribution bar chart with shadcn/ui

import { useMemo } from "react";
import { Bar, BarChart, CartesianGrid, XAxis } from "recharts";
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
} from "@/components/ui/chart";
import { useTranslation } from "react-i18next";

const PriorityBarChart = ({ data }) => {
  const { t } = useTranslation();

  // Transform data
  const chartData = useMemo(() => {
    if (!data || data.length === 0) {
      return [
        { priority: "urgent", count: 0 },
        { priority: "high", count: 0 },
        { priority: "medium", count: 0 },
        { priority: "low", count: 0 },
      ];
    }

    // Sort by priority order
    const priorityOrder = { urgent: 1, high: 2, medium: 3, low: 4 };
    return data
      .map((item) => ({
        priority: item.priority,
        count: parseInt(item.count),
      }))
      .sort((a, b) => priorityOrder[a.priority] - priorityOrder[b.priority]);
  }, [data]);

  // Chart config
  const chartConfig = {
    count: {
      label: "Tasks",
      color: "hsl(var(--chart-2))",
    },
  };

  // Calculate total
  const totalTasks = useMemo(() => {
    return chartData.reduce((acc, curr) => acc + curr.count, 0);
  }, [chartData]);

  // Get color by priority
  const getBarColor = (priority) => {
    const colors = {
      urgent: "hsl(0, 84%, 60%)", // Red
      high: "hsl(25, 95%, 53%)", // Orange
      medium: "hsl(45, 93%, 47%)", // Yellow
      low: "hsl(142, 71%, 45%)", // Green
    };
    return colors[priority] || "hsl(var(--chart-2))";
  };

  // Format priority label
  const formatPriority = (priority) => {
    return priority.charAt(0).toUpperCase() + priority.slice(1);
  };

  return (
    <Card className="flex flex-col border-0 shadow-none">
      <CardHeader className="items-center pb-0">
        <CardTitle className="text-lg font-semibold">
          {t("dashboard.charts.priorityDistribution")}
        </CardTitle>
        <CardDescription className="text-xs">
          {totalTasks} {t("dashboard.activeTasks")}
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-1 pb-0 mt-4">
        <ChartContainer config={chartConfig} className="h-[280px] w-full">
          <BarChart accessibilityLayer data={chartData}>
            <CartesianGrid vertical={false} strokeDasharray="3 3" />
            <XAxis
              dataKey="priority"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              tickFormatter={formatPriority}
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Bar
              dataKey="count"
              radius={8}
              fill="hsl(var(--chart-2))"
              shape={(props) => {
                const { x, y, width, height, payload } = props;
                const fill = getBarColor(payload.priority);
                return (
                  <rect
                    x={x}
                    y={y}
                    width={width}
                    height={height}
                    fill={fill}
                    rx={8}
                    ry={8}
                  />
                );
              }}
            />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
};

export default PriorityBarChart;
