import React from "react";
import SkeletonTaskCard from "./SkeletonTaskCard";

export default function SkeletonTaskLists() {
  return (
    <div className="space-y-6">
      {/* Skeleton Filters */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="mb-6">
          <div className="h-10 bg-gray-200 rounded-lg animate-pulse"></div>
        </div>
        <div className="grid grid-cols-6 gap-3 gap-y-6">
          <div className="col-span-2 h-20 bg-gray-200 rounded-lg animate-pulse"></div>
          <div className="col-span-2 h-20 bg-gray-200 rounded-lg animate-pulse"></div>
          <div className="col-span-2 h-20 bg-gray-200 rounded-lg animate-pulse"></div>
          <div className="col-span-3 h-20 bg-gray-200 rounded-lg animate-pulse"></div>
          <div className="col-span-3 h-20 bg-gray-200 rounded-lg animate-pulse"></div>
        </div>
      </div>

      {/* Skeleton Task Cards */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="p-6">
          {Array.from({ length: 5 }).map((_, i) => (
            <SkeletonTaskCard key={i} />
          ))}
        </div>
      </div>
    </div>
  );
}
