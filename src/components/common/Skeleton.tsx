import React from 'react';

export const PromptCardSkeleton: React.FC = () => {
  return (
    <div className="bg-white border border-[#E7E7E3] rounded-xl overflow-hidden animate-pulse">
      <div className="aspect-[16/10] bg-neutral-200" />
      <div className="p-4 space-y-3">
        <div className="flex items-center justify-between">
          <div className="h-3 w-16 bg-neutral-200 rounded" />
          <div className="h-3 w-12 bg-neutral-200 rounded" />
        </div>
        <div className="h-4 w-3/4 bg-neutral-200 rounded" />
        <div className="h-3 w-full bg-neutral-100 rounded" />
        <div className="pt-3 border-t border-neutral-100 flex items-center justify-between">
          <div className="h-3 w-16 bg-neutral-200 rounded" />
          <div className="h-4 w-12 bg-neutral-200 rounded" />
        </div>
      </div>
    </div>
  );
};

export const TableSkeleton: React.FC<{ rows?: number }> = ({ rows = 5 }) => {
  return (
    <div className="w-full bg-white border border-[#E7E7E3] rounded-xl overflow-hidden animate-pulse p-4 space-y-3">
      <div className="h-8 bg-neutral-100 rounded w-full mb-4" />
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="h-10 bg-neutral-50 rounded flex items-center px-4 gap-4">
          <div className="h-4 w-1/4 bg-neutral-200 rounded" />
          <div className="h-4 w-1/6 bg-neutral-200 rounded" />
          <div className="h-4 w-1/6 bg-neutral-200 rounded" />
          <div className="h-4 w-1/8 bg-neutral-200 rounded ml-auto" />
        </div>
      ))}
    </div>
  );
};
