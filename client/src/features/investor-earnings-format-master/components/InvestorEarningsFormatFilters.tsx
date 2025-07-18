
import React from 'react';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search } from 'lucide-react';
import { InvestorEarningsFormatFilters as InvestorEarningsFormatFiltersType } from '../types';

interface InvestorEarningsFormatFiltersProps {
  filters: InvestorEarningsFormatFiltersType;
  onFiltersChange: (filters: InvestorEarningsFormatFiltersType) => void;
}

export function InvestorEarningsFormatFilters({ 
  filters, 
  onFiltersChange 
}: InvestorEarningsFormatFiltersProps) {
  const handleSearchChange = (value: string) => {
    onFiltersChange({ ...filters, searchTerm: value });
  };

  const handleFormatChange = (value: string) => {
    onFiltersChange({ ...filters, format: value });
  };

  return (
    <div className="flex flex-col sm:flex-row gap-4 bg-white p-4 rounded-lg border border-gray-200">
      <div className="flex-1">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="Search by quarter or fields..."
            value={filters.searchTerm}
            onChange={(e) => handleSearchChange(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>
      
      <div className="w-full sm:w-48">
        <Select value={filters.format} onValueChange={handleFormatChange}>
          <SelectTrigger>
            <SelectValue placeholder="Filter by Format" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Formats</SelectItem>
            <SelectItem value="PDF">PDF</SelectItem>
            <SelectItem value="CSV">CSV</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
