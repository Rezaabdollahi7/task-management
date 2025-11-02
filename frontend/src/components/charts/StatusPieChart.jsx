// src/components/charts/StatusPieChart.jsx
// Pie chart for task status distribution

import { useEffect, useState } from "react";
import Chart from "react-apexcharts";

const StatusPieChart = ({ data }) => {
  const [chartOptions, setChartOptions] = useState({
    chart: {
      type: "pie",
      fontFamily: "Inter, sans-serif",
    },
    labels: [],
    colors: ["#9CA3AF", "#3B82F6", "#10B981", "#EF4444"],
    legend: {
      position: "bottom",
    },
    dataLabels: {
      enabled: true,
      formatter: function (val) {
        return val.toFixed(1) + "%";
      },
    },
    responsive: [
      {
        breakpoint: 480,
        options: {
          chart: {
            width: 300,
          },
          legend: {
            position: "bottom",
          },
        },
      },
    ],
  });

  const [series, setSeries] = useState([]);

  useEffect(() => {
    if (data && data.length > 0) {
      const labels = data.map((item) => {
        const statusNames = {
          open: "Open",
          in_progress: "In Progress",
          completed: "Completed",
          cancelled: "Cancelled",
        };
        return statusNames[item.status] || item.status;
      });

      const values = data.map((item) => parseInt(item.count));

      setChartOptions((prev) => ({
        ...prev,
        labels: labels,
      }));

      setSeries(values);
    }
  }, [data]);

  if (!data || data.length === 0) {
    return (
      <div className="flex items-center justify-center h-64 text-gray-500">
        No data available
      </div>
    );
  }

  return (
    <div className="w-full">
      <Chart options={chartOptions} series={series} type="pie" height={300} />
    </div>
  );
};

export default StatusPieChart;
