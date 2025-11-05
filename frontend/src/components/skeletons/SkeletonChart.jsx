// src/components/skeletons/SkeletonChart.jsx
// Skeleton for charts

const SkeletonChart = ({ type = "bar" }) => {
  return (
    <div className="animate-pulse">
      {/* Title */}
      <div className="h-5 bg-gray-200 rounded w-48 mx-auto mb-6"></div>

      {/* Chart area */}
      {type === "pie" ? (
        <div className="flex justify-center items-center h-64">
          <div className="w-48 h-48 bg-gray-200 rounded-full"></div>
        </div>
      ) : type === "line" ? (
        <div className="h-64 flex items-end justify-between gap-2">
          {Array.from({ length: 7 }).map((_, i) => (
            <div
              key={i}
              className="bg-gray-200 rounded-t"
              style={{
                width: "100%",
                height: `${Math.random() * 60 + 40}%`,
              }}
            ></div>
          ))}
        </div>
      ) : (
        // Bar chart
        <div className="h-64 flex items-end justify-between gap-2">
          {Array.from({ length: 4 }).map((_, i) => (
            <div
              key={i}
              className="bg-gray-200 rounded-t"
              style={{
                width: "100%",
                height: `${Math.random() * 60 + 40}%`,
              }}
            ></div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SkeletonChart;
