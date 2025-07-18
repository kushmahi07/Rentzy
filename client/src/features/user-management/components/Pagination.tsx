
import { Button } from "@/components/ui/button";

interface PaginationProps {
  currentPage: number;
  pagination: {
    totalPages: number;
    totalUsers: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
  };
  onPageChange: (page: number) => void;
}

export default function Pagination({ currentPage, pagination, onPageChange }: PaginationProps) {
  if (pagination.totalPages <= 1) return null;

  return (
    <div className="flex items-center justify-between mt-4">
      <div className="text-sm text-gray-600">
        Showing {((currentPage - 1) * 10) + 1} to {Math.min(currentPage * 10, pagination.totalUsers)} of {pagination.totalUsers} users
      </div>
      <div className="flex gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(currentPage - 1)}
          disabled={!pagination.hasPrevPage}
        >
          Previous
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(currentPage + 1)}
          disabled={!pagination.hasNextPage}
        >
          Next
        </Button>
      </div>
    </div>
  );
}
