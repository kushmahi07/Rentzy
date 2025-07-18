
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { PropertyTypeTagFiltersType } from "../types";

interface PropertyTypeTagFiltersProps {
  filters: PropertyTypeTagFiltersType;
  onFiltersChange: (filters: PropertyTypeTagFiltersType) => void;
}

export function PropertyTypeTagFilters({ filters, onFiltersChange }: PropertyTypeTagFiltersProps) {
  const handleSearchChange = (value: string) => {
    onFiltersChange({ ...filters, search: value });
  };

  return (
    <div className="flex flex-col sm:flex-row gap-4 mb-6">
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
        <Input
          placeholder="Search by tag name..."
          value={filters.search}
          onChange={(e) => handleSearchChange(e.target.value)}
          className="pl-10"
        />
      </div>
    </div>
  );
}
