// src/components/charts/StatusPieChart.jsx
// Status distribution donut chart with shadcn/ui

import { useMemo } from "react";
import { Label, Pie, PieChart } from "recharts";
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

const StatusPieChart = ({ data }) => {
  const { t } = useTranslation();

  // Transform data
  const chartData = useMemo(() => {
    if (!data || data.length === 0) {
      return [
        { status: "open", count: 0, fill: "hsl(var(--chart-1))" },
        { status: "in_progress", count: 0, fill: "hsl(var(--chart-2))" },
        { status: "completed", count: 0, fill: "hsl(var(--chart-3))" },
        { status: "cancelled", count: 0, fill: "hsl(var(--chart-4))" },
      ];
    }

    return data.map((item) => {
      const statusColorMap = {
        open: "#FFD66B",
        in_progress: "#5B93FF",
        completed: "hsl(var(--chart-3))",
        cancelled: "#EF4444",
      };

      return {
        status: item.status,
        count: parseInt(item.count),
        fill: statusColorMap[item.status] || "hsl(var(--chart-5))",
      };
    });
  }, [data]);

  // Chart config
  const chartConfig = {
    count: {
      label: "Tasks",
    },
    open: {
      label: "Open",
      color: "hsl(var(--chart-1))",
    },
    in_progress: {
      label: "In Progress",
      color: "hsl(var(--chart-2))",
    },
    completed: {
      label: "Completed",
      color: "hsl(var(--chart-3))",
    },
    cancelled: {
      label: "Cancelled",
      color: "hsl(var(--chart-4))",
    },
  };

  // Calculate total
  const totalTasks = useMemo(() => {
    return chartData.reduce((acc, curr) => acc + curr.count, 0);
  }, [chartData]);

  return (
    <Card className="flex flex-col border-0 shadow-none">
      <CardHeader className="items-center pb-0">
        <CardTitle className="text-lg font-semibold">
          {t("dashboard.charts.statusDistribution")}
        </CardTitle>
        <CardDescription className="text-xs">
          {t("dashboard.charts.tasksStatus")}
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-1 pb-0">
        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-square max-h-[300px]"
        >
          <PieChart>
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Pie
              data={chartData}
              dataKey="count"
              nameKey="status"
              innerRadius={60}
              strokeWidth={5}
            >
              <Label
                content={({ viewBox }) => {
                  if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                    return (
                      <text
                        x={viewBox.cx}
                        y={viewBox.cy}
                        textAnchor="middle"
                        dominantBaseline="middle"
                      >
                        <tspan
                          x={viewBox.cx}
                          y={viewBox.cy}
                          className="fill-foreground text-3xl font-bold"
                        >
                          {totalTasks.toLocaleString()}
                        </tspan>
                        <tspan
                          x={viewBox.cx}
                          y={(viewBox.cy || 0) + 24}
                          className="fill-muted-foreground text-sm"
                        >
                          {t("dashboard.totalTasks")}
                        </tspan>
                      </text>
                    );
                  }
                }}
              />
            </Pie>
          </PieChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
};

export default StatusPieChart;
