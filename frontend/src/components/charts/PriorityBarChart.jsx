// src/components/charts/PriorityBarChart.jsx
// Bar chart for task priority distribution

import { useEffect, useState } from "react";
import Chart from "react-apexcharts";

const PriorityBarChart = ({ data }) => {
  const [chartOptions, setChartOptions] = useState({
    chart: {
      type: "bar",
      fontFamily: "Inter, sans-serif",
      toolbar: {
        show: false,
      },
    },
    plotOptions: {
      bar: {
        horizontal: false,
        columnWidth: "55%",
        borderRadius: 5,
      },
    },
    dataLabels: {
      enabled: false,
    },
    stroke: {
      show: true,
      width: 2,
      colors: ["transparent"],
    },
    xaxis: {
      categories: [],
    },
    yaxis: {
      title: {
        text: "Number of Tasks",
      },
    },
    fill: {
      opacity: 1,
    },
    tooltip: {
      y: {
        formatter: function (val) {
          return val + " tasks";
        },
      },
    },
    colors: ["#EF4444", "#F97316", "#EAB308", "#10B981"],
  });

  const [series, setSeries] = useState([
    {
      name: "Tasks",
      data: [],
    },
  ]);

  useEffect(() => {
    if (data && data.length > 0) {
      const categories = data.map((item) => {
        const priorityNames = {
          urgent: "Urgent",
          high: "High",
          medium: "Medium",
          low: "Low",
        };
        return priorityNames[item.priority] || item.priority;
      });

      const values = data.map((item) => parseInt(item.count));

      setChartOptions((prev) => ({
        ...prev,
        xaxis: {
          categories: categories,
        },
      }));

      setSeries([
        {
          name: "Active Tasks",
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
      <Chart options={chartOptions} series={series} type="bar" height={300} />
    </div>
  );
};

export default PriorityBarChart;
