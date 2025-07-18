
import React from 'react';
import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { LocationFilters } from '../types';
import { COUNTRIES } from '../types';

interface LocationFiltersProps {
  filters: LocationFilters;
  onFilterChange: (field: keyof LocationFilters, value: string) => void;
}

const LocationFiltersComponent: React.FC<LocationFiltersProps> = ({
  filters,
  onFilterChange
}) => {
  return (
    <div className="bg-white p-6 rounded-lg border border-gray-200 space-y-6">
      <h3 className="text-lg font-semibold text-gray-900">Filter Locations</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Search by City */}
        <div className="space-y-2">
          <Label htmlFor="search-city">Search by City</Label>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              id="search-city"
              placeholder="Search cities..."
              value={filters.searchQuery}
              onChange={(e) => onFilterChange('searchQuery', e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {/* Country Filter */}
        <div className="space-y-2">
          <Label>Country</Label>
          <Select
            value={filters.country || undefined}
            onValueChange={(value) => onFilterChange('country', value === 'all' ? '' : value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="All Countries" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Countries</SelectItem>
              {COUNTRIES.map((country) => (
                <SelectItem key={country.value} value={country.value}>
                  {country.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Status Filter */}
        <div className="space-y-2">
          <Label>Status</Label>
          <Select
            value={filters.status || undefined}
            onValueChange={(value) => onFilterChange('status', value === 'all' ? '' : value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="All Statuses" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="Active">Active</SelectItem>
              <SelectItem value="Inactive">Inactive</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
};

export default LocationFiltersComponent;
