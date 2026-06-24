import Link from "next/link";

type Props = {
  currentPage: number;
  totalItems: number;
  pageSize: number;
  basePath: string;
};

export function JobsPagination({ currentPage, totalItems, pageSize, basePath }: Props) {
  const totalPages = Math.ceil(totalItems / pageSize);
  const startItem = (currentPage - 1) * pageSize + 1;
  const endItem = Math.min(currentPage * pageSize, totalItems);

  if (totalPages <= 1) return null;

  const pages: number[] = [];
  for (let i = 1; i <= totalPages; i++) {
    pages.push(i);
  }

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4">
      <span className="text-sm text-text-secondary">
        Showing {startItem} to {endItem} of {totalItems} results
      </span>

      <div className="flex items-center gap-1">
        {currentPage > 1 ? (
          <Link
            href={`${basePath}?page=${currentPage - 1}`}
            className="px-3 py-1.5 text-sm font-medium text-text-secondary hover:text-text-primary transition-colors rounded-md hover:bg-surface-secondary"
          >
            Previous
          </Link>
        ) : (
          <span className="px-3 py-1.5 text-sm font-medium text-text-secondary opacity-40 cursor-not-allowed">
            Previous
          </span>
        )}

        {pages.map((page) => (
          <Link
            key={page}
            href={`${basePath}?page=${page}`}
            className={`w-8 h-8 text-sm font-medium rounded-md transition-colors flex items-center justify-center ${
              page === currentPage
                ? "bg-accent text-accent-foreground"
                : "text-text-secondary hover:bg-surface-secondary"
            }`}
          >
            {page}
          </Link>
        ))}

        {currentPage < totalPages ? (
          <Link
            href={`${basePath}?page=${currentPage + 1}`}
            className="px-3 py-1.5 text-sm font-medium text-text-secondary hover:text-text-primary transition-colors rounded-md hover:bg-surface-secondary"
          >
            Next
          </Link>
        ) : (
          <span className="px-3 py-1.5 text-sm font-medium text-text-secondary opacity-40 cursor-not-allowed">
            Next
          </span>
        )}
      </div>
    </div>
  );
}
