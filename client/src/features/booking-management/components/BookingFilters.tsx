
import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { BookingFiltersType } from '../types';

interface BookingFiltersProps {
  filters: BookingFiltersType;
  onFilterChange: (key: keyof BookingFiltersType, value: any) => void;
}

export function BookingFilters({ filters, onFilterChange }: BookingFiltersProps) {
  const handleDateRangeChange = (key: 'start' | 'end', value: string) => {
    onFilterChange('dateRange', {
      ...filters.dateRange,
      [key]: value
    });
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 mb-6">
      <h3 className="text-lg font-medium text-gray-900 mb-4">Filters</h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Status Filter */}
        <div>
          <Label htmlFor="status-filter">Status</Label>
          <Select value={filters.status} onValueChange={(value) => onFilterChange('status', value)}>
            <SelectTrigger id="status-filter">
              <SelectValue placeholder="Select status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="confirmed">Confirmed</SelectItem>
              <SelectItem value="cancelled">Cancelled</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Date Range Start */}
        <div>
          <Label htmlFor="date-start">Start Date</Label>
          <Input
            id="date-start"
            type="date"
            value={filters.dateRange.start}
            onChange={(e) => handleDateRangeChange('start', e.target.value)}
            placeholder="Select start date"
          />
        </div>

        {/* Date Range End */}
        <div>
          <Label htmlFor="date-end">End Date</Label>
          <Input
            id="date-end"
            type="date"
            value={filters.dateRange.end}
            onChange={(e) => handleDateRangeChange('end', e.target.value)}
            placeholder="Select end date"
            min={filters.dateRange.start}
          />
        </div>
      </div>

      {/* Active Filters Summary */}
      {(filters.status !== 'all' || filters.dateRange.start || filters.dateRange.end) && (
        <div className="mt-4 pt-4 border-t border-gray-200">
          <p className="text-sm text-gray-600">
            Active filters: 
            {filters.status !== 'all' && (
              <span className="ml-1 inline-block bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs">
                Status: {filters.status}
              </span>
            )}
            {filters.dateRange.start && filters.dateRange.end && (
              <span className="ml-1 inline-block bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs">
                Date: {filters.dateRange.start} to {filters.dateRange.end}
              </span>
            )}
          </p>
        </div>
      )}
    </div>
  );
}
