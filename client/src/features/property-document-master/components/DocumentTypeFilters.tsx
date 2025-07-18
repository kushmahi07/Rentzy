import React from 'react';
import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { DocumentTypeFilters } from '../types';

interface DocumentTypeFiltersProps {
  filters: DocumentTypeFilters;
  onFilterChange: (field: string, value: string) => void;
}

const PROPERTY_TYPE_OPTIONS = [
    { value: 'Residential', label: 'Residential' },
    { value: 'Commercial', label: 'Commercial' },
  ];

const DocumentTypeFiltersComponent: React.FC<DocumentTypeFiltersProps> = ({
  filters,
  onFilterChange
}) => {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Property Type Filter */}
        <div>
          <Label htmlFor="propertyTypeFilter" className="text-sm font-medium text-gray-700">
            Property Type
          </Label>
          <Select
            value={filters.propertyType || undefined}
            onValueChange={(value) => onFilterChange('propertyType', value === 'all' ? '' : value)}
          >
            <SelectTrigger className="mt-1">
              <SelectValue placeholder="All Property Types" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Property Types</SelectItem>
              {PROPERTY_TYPE_OPTIONS.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Document Name Search */}
        <div>
          <Label htmlFor="searchTerm" className="text-sm font-medium text-gray-700">
            Search by Document Name
          </Label>
          <div className="relative mt-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              id="searchTerm"
              value={filters.searchTerm}
              onChange={(e) => onFilterChange('searchTerm', e.target.value)}
              placeholder="Search document name..."
              className="pl-10"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default DocumentTypeFiltersComponent;