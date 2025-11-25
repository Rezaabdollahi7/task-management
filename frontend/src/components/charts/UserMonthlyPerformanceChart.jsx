// src/components/charts/UserMonthlyPerformanceChart.jsx
import { TrendingUp, TrendingDown } from "lucide-react";
import { Bar, BarChart, CartesianGrid, XAxis, Legend, Tooltip } from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ChartContainer } from "@/components/ui/chart";
import { useTranslation } from "react-i18next";
import moment from "moment-jalaali";

const UserMonthlyPerformanceChart = ({ data, userName }) => {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === "fa";

  const formatMonth = (gregorianMonth) => {
    if (!gregorianMonth) return "";

    try {
      const m = moment(gregorianMonth, "YYYY-MM");

      if (isRTL) {
        return m.format("jYYYY/jMM");
      } else {
        return m.format("YYYY/MM");
      }
    } catch (error) {
      console.error("Error formatting month:", error);
      return gregorianMonth;
    }
  };

  const getMonthName = (gregorianMonth) => {
    if (!gregorianMonth) return "";

    try {
      const m = moment(gregorianMonth, "YYYY-MM");

      if (isRTL) {
        return m.format("jMMMM jYYYY");
      } else {
        return m.format("MMMM YYYY");
      }
    } catch (error) {
      return gregorianMonth;
    }
  };

  const calculateTrend = () => {
    if (!data || data.length < 2) return { value: 0, isUp: true };

    const latestMonth = data[0];
    const previousMonth = data[1];

    const latestCompleted = parseInt(latestMonth.completed) || 0;
    const previousCompleted = parseInt(previousMonth.completed) || 0;

    if (previousCompleted === 0) return { value: 0, isUp: true };

    const percentChange =
      ((latestCompleted - previousCompleted) / previousCompleted) * 100;

    return {
      value: Math.abs(percentChange).toFixed(1),
      isUp: percentChange >= 0,
    };
  };

  const trend = calculateTrend();

  const chartData =
    data?.map((item) => ({
      month: item.month,
      monthDisplay: formatMonth(item.month),
      monthName: getMonthName(item.month),
      completed: parseInt(item.completed) || 0,
      in_progress: parseInt(item.in_progress) || 0,
      open: parseInt(item.open) || 0,
    })) || [];

  // تنظیمات نمودار
  const chartConfig = {
    completed: {
      label: t("tasks.statuses.completed"),
      color: "#10b981", // green
    },
    in_progress: {
      label: t("tasks.statuses.in_progress"),
      color: "#3b82f6", // blue
    },
    open: {
      label: t("tasks.statuses.open"),
      color: "#f59e0b", // orange
    },
  };

  
  // Custom Tooltip
  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white border border-gray-200 rounded-lg shadow-lg p-3">
          <p className="font-medium text-gray-900 mb-2">
            {payload[0].payload.monthName}
          </p>
          {payload.map((entry, index) => (
            <div key={index} className="flex items-center gap-2 text-sm">
              <div
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: entry.color }}
              />
              <span className="text-gray-600">{entry.name}:</span>
              <span className="font-medium text-gray-900">{entry.value}</span>
            </div>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          {t("dashboard.monthlyPerformance") || "Monthly Performance"}
        </CardTitle>
        <CardDescription>
          {isRTL
            ? `عملکرد ${userName} در ۶ ماه گذشته`
            : `${userName}'s task completion over the last 6 months`}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-[300px] w-full">
          <BarChart
            data={chartData}
            margin={{ top: 20, right: 30, left: 0, bottom: 0 }}
          >
            <CartesianGrid
              strokeDasharray="3 3"
              vertical={false}
              stroke="#e5e7eb"
            />
            <XAxis
              dataKey="monthDisplay"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              tick={{ fill: "#6b7280", fontSize: 12 }}
            />
            <Tooltip
              content={<CustomTooltip />}
              cursor={{ fill: "rgba(0, 0, 0, 0.05)" }}
            />
            <Legend
              wrapperStyle={{ paddingTop: "20px" }}
              iconType="circle"
              formatter={(value) => (
                <span className="text-sm text-gray-700 mx-1">{value}</span>
              )}
            />
            <Bar
              dataKey="completed"
              fill={chartConfig.completed.color}
              radius={[8, 8, 0, 0]}
              name={chartConfig.completed.label}
            />
            <Bar
              dataKey="in_progress"
              fill={chartConfig.in_progress.color}
              radius={[8, 8, 0, 0]}
              name={chartConfig.in_progress.label}
            />
            <Bar
              dataKey="open"
              fill={chartConfig.open.color}
              radius={[8, 8, 0, 0]}
              name={chartConfig.open.label}
            />
          </BarChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col items-start gap-2 text-sm">
        {trend.value > 0 && (
          <div className="flex gap-2 font-medium leading-none">
            {trend.isUp ? (
              <>
                <span className="text-green-600">
                  {isRTL
                    ? `روند صعودی ${trend.value}٪ در این ماه`
                    : `Trending up by ${trend.value}% this month`}
                </span>
                <TrendingUp className="h-4 w-4 text-green-600" />
              </>
            ) : (
              <>
                <span className="text-red-600">
                  {isRTL
                    ? `روند نزولی ${trend.value}٪ در این ماه`
                    : `Trending down by ${trend.value}% this month`}
                </span>
                <TrendingDown className="h-4 w-4 text-red-600" />
              </>
            )}
          </div>
        )}
      </CardFooter>
    </Card>
  );
};

export default UserMonthlyPerformanceChart;
