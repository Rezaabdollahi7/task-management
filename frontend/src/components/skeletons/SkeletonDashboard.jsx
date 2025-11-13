import React from "react";
import SkeletonChart from "./SkeletonChart";
import SkeletonCard from "./SkeletonCard";

export default function SkeletonDashboard() {
  return (
    <div className="space-y-6 sm:space-y-8">
      {/* Skeleton Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {Array.from({ length: 4 }).map((_, i) => (
          <SkeletonCard key={i} />
        ))}
      </div>

      {/* Skeleton Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
        <div className="bg-white rounded-lg border border-gray-200 p-4 sm:p-6">
          <SkeletonChart type="pie" />
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-4 sm:p-6">
          <SkeletonChart type="bar" />
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-4 sm:p-6">
          <SkeletonChart type="line" />
        </div>
      </div>

      {/* Skeleton Week Tasks */}
      <div className="bg-white rounded-lg border border-gray-200 p-4 sm:p-6">
        <div className="h-6 bg-gray-200 rounded w-64 mx-auto mb-6 animate-pulse"></div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div
              key={i}
              className="text-center p-3 sm:p-4 rounded-lg bg-gray-50 animate-pulse"
            >
              <div className="h-8 bg-gray-200 rounded w-12 mx-auto mb-2"></div>
              <div className="h-4 bg-gray-200 rounded w-20 mx-auto"></div>
            </div>
          ))}
        </div>
      </div>

      {/* Skeleton Recent Tasks */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="p-4 sm:p-6 border-b border-gray-200">
          <div className="h-6 bg-gray-200 rounded w-32 animate-pulse"></div>
        </div>
        <div className="divide-y divide-gray-200">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="p-4 animate-pulse">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                <div className="flex-1">
                  <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                </div>
                <div className="flex gap-2">
                  <div className="h-6 w-16 bg-gray-200 rounded-full"></div>
                  <div className="h-6 w-16 bg-gray-200 rounded-full"></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
