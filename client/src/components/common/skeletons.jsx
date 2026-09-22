import { Skeleton } from "@/components/ui/skeleton";
import { TableCell, TableRow } from "@/components/ui/table";

export function ProductCardSkeleton() {
  return (
    <div
      aria-hidden="true"
      className="mx-auto flex w-full max-w-sm flex-col overflow-hidden rounded-xl border bg-card shadow-sm"
    >
      <Skeleton className="aspect-4/3 w-full rounded-none" />
      <div className="flex flex-1 flex-col gap-4 p-4">
        <div className="space-y-2">
          <Skeleton className="h-4 w-3/4" />
          <Skeleton className="h-3 w-1/2" />
        </div>
        <Skeleton className="h-5 w-20" />
      </div>
      <div className="border-t border-border/70 p-4 pt-3">
        <Skeleton className="h-8 w-full" />
      </div>
    </div>
  );
}

export function ProductGridSkeleton({ count = 8, columns = 4 }) {
  const columnClasses = {
    3: "sm:grid-cols-2 md:grid-cols-3",
    4: "sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4",
  };

  return (
    <div className="col-span-full">
      <span role="status" className="sr-only">
        Loading products
      </span>
      <div
        className={`grid grid-cols-1 gap-4 ${columnClasses[columns] || columnClasses[4]}`}
      >
        {Array.from({ length: count }).map((_, index) => (
          <ProductCardSkeleton key={index} />
        ))}
      </div>
    </div>
  );
}

export function TableRowsSkeleton({ rows = 5, columns = 5, label = "Loading" }) {
  const widths = ["w-40", "w-24", "w-20", "w-16", "w-24"];

  return (
    <>
      {/* This renders inside <tbody>, so the live region must live in a <tr>/<td>. */}
      <TableRow>
        <TableCell colSpan={columns} className="sr-only">
          <span role="status">{label}</span>
        </TableCell>
      </TableRow>
      {Array.from({ length: rows }).map((_, rowIndex) => (
        <TableRow key={rowIndex} aria-hidden="true">
          {Array.from({ length: columns }).map((_, columnIndex) => (
            <TableCell key={columnIndex}>
              <Skeleton
                className={`h-5 ${widths[columnIndex] || "w-24"}`}
              />
            </TableCell>
          ))}
        </TableRow>
      ))}
    </>
  );
}

export function ReviewListSkeleton({ count = 3 }) {
  return (
    <div className="grid gap-4">
      <span role="status" className="sr-only">
        Loading reviews
      </span>
      {Array.from({ length: count }).map((_, index) => (
        <div
          key={index}
          aria-hidden="true"
          className="rounded-lg border bg-card p-4 shadow-sm"
        >
          <div className="flex items-start gap-3">
            <Skeleton className="size-10 shrink-0 rounded-full" />
            <div className="flex-1 space-y-3">
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-4 w-28" />
              <Skeleton className="h-3 w-full" />
              <Skeleton className="h-3 w-2/3" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export function PageSkeleton() {
  return (
    <div className="flex min-h-screen w-full flex-col" role="status">
      <span className="sr-only">Loading</span>
      <div className="flex h-16 items-center justify-between border-b px-4 md:px-6">
        <Skeleton className="h-6 w-32" />
        <Skeleton className="h-9 w-24" />
      </div>
      <div className="container mx-auto grid gap-6 p-6">
        <Skeleton className="h-9 w-64" />
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {Array.from({ length: 8 }).map((_, index) => (
            <ProductCardSkeleton key={index} />
          ))}
        </div>
      </div>
    </div>
  );
}
