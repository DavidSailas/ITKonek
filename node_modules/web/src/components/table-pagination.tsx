import type { Table } from "@tanstack/react-table";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

interface TablePaginationProps<TData> {
  table: Table<TData>;
}

export function TablePagination<TData>({ table }: TablePaginationProps<TData>) {
  const currentPage = table.getState().pagination.pageIndex + 1;
  const totalPages = table.getPageCount();

  return (
  
    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 px-2 py-2 w-full">
      <div className="text-sm text-description whitespace-nowrap">
        <span className="font-medium text-foreground">
          {table.getFilteredSelectedRowModel().rows.length}
        </span>
        {" of "}
        <span className="font-medium text-foreground">
          {table.getFilteredRowModel().rows.length}
        </span>
        {" row(s) selected."}
      </div>
  
      <Pagination className="w-full sm:w-auto justify-end mx-0">
        <PaginationContent className="w-full justify-end gap-1">
          <PaginationItem>
            <PaginationPrevious
              href="#"
              onClick={(e) => { e.preventDefault(); table.previousPage() }}
              className={!table.getCanPreviousPage() ? "pointer-events-none opacity-50" : "cursor-pointer"}
            />
          </PaginationItem>

          {[...Array(totalPages)].map((_, i) => {
            const page = i + 1;
            if (page === 1 || page === totalPages || (page >= currentPage - 1 && page <= currentPage + 1)) {
              return (
                <PaginationItem key={page}>
                  <PaginationLink
                    href="#"
                    isActive={currentPage === page}
                    onClick={(e) => { e.preventDefault(); table.setPageIndex(i) }}
                  >
                    {page}
                  </PaginationLink>
                </PaginationItem>
              );
            }
            if (page === currentPage - 2 || page === currentPage + 2) {
              return <PaginationItem key={page}><PaginationEllipsis /></PaginationItem>;
            }
            return null;
          })}

          <PaginationItem>
            <PaginationNext
              href="#"
              onClick={(e) => { e.preventDefault(); table.nextPage() }}
              className={!table.getCanNextPage() ? "pointer-events-none opacity-50" : "cursor-pointer"}
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </div>
  );
}