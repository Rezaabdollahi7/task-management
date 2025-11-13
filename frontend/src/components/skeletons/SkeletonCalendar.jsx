// src/components/skeletons/SkeletonCalendar.jsx
// Skeleton loader for calendar view

const SkeletonCalendar = () => {
  return (
    <div className="animate-pulse">
      {/* Toolbar Skeleton */}
      <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 bg-gray-200 rounded-lg"></div>
          <div className="w-20 h-10 bg-gray-200 rounded-lg"></div>
          <div className="w-10 h-10 bg-gray-200 rounded-lg"></div>
        </div>

        <div className="h-6 bg-gray-200 rounded w-48"></div>

        <div className="w-32 h-10 bg-gray-200 rounded-lg"></div>
      </div>

      {/* Calendar Grid Skeleton */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 sm:p-6">
        {/* Week Days Header */}
        <div className="grid grid-cols-7 gap-1 mb-4">
          {Array.from({ length: 7 }).map((_, i) => (
            <div key={i} className="text-center py-2">
              <div className="h-4 bg-gray-200 rounded mx-auto w-3/4"></div>
            </div>
          ))}
        </div>

        {/* Calendar Days Grid */}
        <div className="grid grid-cols-7 gap-1">
          {Array.from({ length: 35 }).map((_, i) => (
            <div key={i} className="aspect-square p-1">
              <div className="w-full h-full border border-gray-100 rounded-lg bg-gray-50 flex flex-col items-center justify-center">
                {/* Day Number */}
                <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>

                {/* Task Dots */}
                <div className="flex gap-1 justify-center">
                  <div className="w-2 h-2 bg-gray-300 rounded-full"></div>
                  <div className="w-2 h-2 bg-gray-300 rounded-full"></div>
                  <div className="w-2 h-2 bg-gray-300 rounded-full"></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Legend Skeleton */}
      <div className="mt-6 bg-white rounded-lg shadow-sm border border-gray-200 p-4">
        <div className="h-6 bg-gray-200 rounded w-24 mb-4"></div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="flex items-center gap-2">
              <div className="w-3 h-3 bg-gray-200 rounded-full"></div>
              <div className="h-4 bg-gray-200 rounded w-16"></div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SkeletonCalendar;
