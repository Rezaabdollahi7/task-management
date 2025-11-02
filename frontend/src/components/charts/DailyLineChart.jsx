// src/components/charts/DailyLineChart.jsx
// Line chart for daily task creation

import { useEffect, useState } from "react";
import Chart from "react-apexcharts";

const DailyLineChart = ({ data }) => {
  const [chartOptions, setChartOptions] = useState({
    chart: {
      type: "line",
      fontFamily: "Inter, sans-serif",
      toolbar: {
        show: false,
      },
      zoom: {
        enabled: false,
      },
    },
    dataLabels: {
      enabled: false,
    },
    stroke: {
      curve: "smooth",
      width: 3,
    },
    xaxis: {
      categories: [],
      title: {
        text: "Date",
      },
    },
    yaxis: {
      title: {
        text: "Tasks Created",
      },
    },
    tooltip: {
      x: {
        format: "dd MMM yyyy",
      },
    },
    colors: ["#3B82F6"],
    markers: {
      size: 5,
      colors: ["#3B82F6"],
      strokeColors: "#fff",
      strokeWidth: 2,
      hover: {
        size: 7,
      },
    },
  });

  const [series, setSeries] = useState([
    {
      name: "Tasks",
      data: [],
    },
  ]);

  useEffect(() => {
    if (data && data.length > 0) {
      const dates = data.map((item) => {
        const date = new Date(item.date);
        return date.toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
        });
      });

      const values = data.map((item) => parseInt(item.count));

      setChartOptions((prev) => ({
        ...prev,
        xaxis: {
          ...prev.xaxis,
          categories: dates,
        },
      }));

      setSeries([
        {
          name: "Tasks Created",
          data: values,
        },
      ]);
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
      <Chart options={chartOptions} series={series} type="line" height={300} />
    </div>
  );
};

export default DailyLineChart;
