// src/components/skeletons/SkeletonNotification.jsx
// Skeleton for notification items

const SkeletonNotification = () => {
  return (
    <div className="p-4 border-b border-gray-100 animate-pulse">
      <div className="flex items-start gap-3">
        {/* Icon */}
        <div className="w-5 h-5 bg-gray-200 rounded-full mt-1"></div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
          <div className="h-3 bg-gray-200 rounded w-full mb-2"></div>
          <div className="h-3 bg-gray-200 rounded w-5/6 mb-2"></div>
          <div className="h-3 bg-gray-200 rounded w-24"></div>
        </div>

        {/* Badge */}
        <div className="w-2 h-2 bg-gray-200 rounded-full mt-2"></div>
      </div>
    </div>
  );
};

export default SkeletonNotification;
