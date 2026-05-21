// Skeleton gives gallery and dashboard async states a polished loading surface.
export const Skeleton = ({ className = "" }: { className?: string }) => (
  <div className={`animate-pulse rounded-2xl bg-white/10 ${className}`} />
);
