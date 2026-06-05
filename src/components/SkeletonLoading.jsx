import React from 'react';

export const SkeletonCard = () => (
  <div className="glass-card p-6 flex flex-col justify-between relative overflow-hidden">
    <div className="absolute inset-0 -translate-x-full animate-[shimmer_1.5s_infinite] bg-gradient-to-r from-transparent via-white/10 dark:via-white/5 to-transparent z-10" />
    <div className="flex justify-between items-start">
      <div className="space-y-3">
        <div className="h-3 w-24 bg-slate-200 dark:bg-slate-700/50 rounded-full animate-pulse" />
        <div className="h-8 w-32 bg-slate-200 dark:bg-slate-700/50 rounded-lg animate-pulse mt-2" />
      </div>
      <div className="h-12 w-12 bg-slate-200 dark:bg-slate-700/50 rounded-xl animate-pulse" />
    </div>
    <div className="mt-6 space-y-2">
      <div className="flex justify-between">
        <div className="h-2 w-16 bg-slate-200 dark:bg-slate-700/50 rounded-full animate-pulse" />
        <div className="h-2 w-12 bg-slate-200 dark:bg-slate-700/50 rounded-full animate-pulse" />
      </div>
      <div className="h-1.5 w-full bg-slate-200 dark:bg-slate-700/50 rounded-full animate-pulse" />
    </div>
  </div>
);

export const DashboardSkeleton = () => (
  <div className="space-y-6">
    <div className="h-16 w-full bg-slate-200 dark:bg-slate-800/50 rounded-2xl animate-pulse" />
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      <SkeletonCard />
      <SkeletonCard />
      <SkeletonCard />
    </div>
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="h-72 w-full lg:col-span-2 bg-slate-200 dark:bg-slate-800/50 rounded-2xl animate-pulse" />
      <div className="h-72 w-full bg-slate-200 dark:bg-slate-800/50 rounded-2xl animate-pulse" />
    </div>
  </div>
);
