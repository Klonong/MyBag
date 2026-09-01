import { Skeleton } from "@/components/ui/skeleton";

interface PageSkeletonProps {
  variant?: "default" | "product-detail";
  className?: string;
}

export function PageSkeleton({
  variant = "default",
  className = "",
}: PageSkeletonProps) {
  if (variant === "product-detail") {
    return (
      <div className={`w-full px-6 py-8 md:px-20 ${className}`}>
        <div className="mb-6 flex items-center gap-2">
          <Skeleton className="h-4 w-16 rounded-full" />
          <Skeleton className="h-4 w-4 rounded-full" />
          <Skeleton className="h-4 w-20 rounded-full" />
          <Skeleton className="h-4 w-4 rounded-full" />
          <Skeleton className="h-4 w-28 rounded-full" />
        </div>

        <div className="flex flex-col items-start gap-6 lg:flex-row lg:items-center lg:gap-10">
          <div className="flex items-center gap-3">
            <div className="hidden lg:flex lg:flex-col lg:gap-2">
              <Skeleton className="h-[100px] w-[90px] rounded-2xl" />
              <Skeleton className="h-[100px] w-[90px] rounded-2xl" />
              <Skeleton className="h-[100px] w-[90px] rounded-2xl" />
            </div>
            <Skeleton className="h-[440px] w-full rounded-[28px] lg:h-[520px] lg:w-[460px]" />
          </div>

          <div className="w-full max-w-[360px] space-y-4 lg:pt-0">
            <Skeleton className="h-3 w-20 rounded-full" />
            <Skeleton className="h-12 w-3/4 rounded-md" />
            <Skeleton className="h-4 w-full rounded-md" />
            <Skeleton className="h-4 w-5/6 rounded-md" />
            <Skeleton className="h-8 w-40 rounded-md" />
            <Skeleton className="h-9 w-32 rounded-full" />
            <Skeleton className="h-12 w-full rounded-full" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`w-full space-y-4 p-6 md:p-10 ${className}`}>
      <Skeleton className="h-8 w-1/3 rounded-md" />
      <Skeleton className="h-4 w-2/3 rounded-md" />
      <div className="grid gap-4 md:grid-cols-3">
        <Skeleton className="h-52 w-full rounded-2xl" />
        <Skeleton className="h-52 w-full rounded-2xl" />
        <Skeleton className="h-52 w-full rounded-2xl" />
      </div>
      <div className="space-y-3">
        <Skeleton className="h-4 w-full rounded-md" />
        <Skeleton className="h-4 w-5/6 rounded-md" />
        <Skeleton className="h-4 w-4/6 rounded-md" />
      </div>
    </div>
  );
}
