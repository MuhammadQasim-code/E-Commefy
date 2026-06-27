const SkeletonBox = ({ className = '' }) => (
  <div className={`bg-slate-200 dark:bg-slate-700 rounded-lg animate-shimmer ${className}`} />
);

export const ProductCardSkeleton = () => (
  <div className="bg-white dark:bg-slate-800 rounded-2xl overflow-hidden border border-slate-100 dark:border-slate-700/50">
    <SkeletonBox className="h-56 w-full rounded-none" />
    <div className="p-4 space-y-3">
      <SkeletonBox className="h-3 w-20" />
      <SkeletonBox className="h-5 w-3/4" />
      <SkeletonBox className="h-3 w-24" />
      <div className="flex items-center justify-between pt-2">
        <SkeletonBox className="h-6 w-20" />
        <SkeletonBox className="h-9 w-28 rounded-xl" />
      </div>
    </div>
  </div>
);

export const ProductDetailsSkeleton = () => (
  <div className="max-w-7xl mx-auto px-4 py-8">
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
      <div className="space-y-4">
        <SkeletonBox className="h-96 w-full rounded-2xl" />
        <div className="flex gap-3">
          {[1, 2, 3, 4].map((i) => (
            <SkeletonBox key={i} className="h-20 w-20 rounded-xl" />
          ))}
        </div>
      </div>
      <div className="space-y-4">
        <SkeletonBox className="h-4 w-24" />
        <SkeletonBox className="h-8 w-3/4" />
        <SkeletonBox className="h-4 w-32" />
        <SkeletonBox className="h-8 w-28" />
        <SkeletonBox className="h-20 w-full" />
        <div className="flex gap-4 pt-4">
          <SkeletonBox className="h-12 w-40 rounded-xl" />
          <SkeletonBox className="h-12 w-40 rounded-xl" />
        </div>
      </div>
    </div>
  </div>
);

export const TableSkeleton = ({ rows = 5, cols = 5 }) => (
  <div className="space-y-3">
    <div className="flex gap-4 p-4">
      {Array.from({ length: cols }).map((_, i) => (
        <SkeletonBox key={i} className="h-4 flex-1" />
      ))}
    </div>
    {Array.from({ length: rows }).map((_, row) => (
      <div key={row} className="flex gap-4 p-4 border-t border-slate-100 dark:border-slate-700/50">
        {Array.from({ length: cols }).map((_, col) => (
          <SkeletonBox key={col} className="h-4 flex-1" />
        ))}
      </div>
    ))}
  </div>
);

export default SkeletonBox;
