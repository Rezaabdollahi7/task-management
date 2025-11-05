// src/components/skeletons/SkeletonCard.jsx
// Skeleton for dashboard stat cards

const SkeletonCard = () => {
  return (
    <div className="bg-white rounded-xl border border-gray-200 px-4 py-5 animate-pulse">
      <div className="flex flex-row-reverse items-start justify-between gap-3">
        <div className="flex-1">
          <div className="h-4 bg-gray-200 rounded w-24 mb-3"></div>
          <div className="h-8 bg-gray-200 rounded w-16"></div>
        </div>
        <div className="bg-gray-200 p-3 rounded-full w-14 h-14"></div>
      </div>
    </div>
  );
};

export default SkeletonCard;
