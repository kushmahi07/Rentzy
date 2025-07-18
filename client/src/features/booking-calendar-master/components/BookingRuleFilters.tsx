
import React from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';
import { BookingRuleFilters as FiltersType } from '../types';

interface BookingRuleFiltersProps {
  filters: FiltersType;
  onFilterChange: (key: keyof FiltersType, value: any) => void;
}

export function BookingRuleFilters({ filters, onFilterChange }: BookingRuleFiltersProps) {
  const handleDateRangeChange = (key: 'start' | 'end', value: string) => {
    onFilterChange('blackoutDateRange', {
      ...filters.blackoutDateRange,
      [key]: value
    });
  };

  const clearFilters = () => {
    onFilterChange('blackoutDateRange', { start: '', end: '' });
  };

  const hasActiveFilters = filters.blackoutDateRange.start || filters.blackoutDateRange.end;

  return (
    <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-medium text-gray-900">Filter Rules</h3>
        {hasActiveFilters && (
          <Button
            variant="ghost"
            size="sm"
            onClick={clearFilters}
            className="text-gray-500 hover:text-gray-700"
          >
            <X className="h-4 w-4 mr-1" />
            Clear Filters
          </Button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Blackout Date Range Filter */}
        <div className="space-y-2">
          <Label className="text-sm font-medium">Blackout Date Range</Label>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <Label htmlFor="start-date" className="text-xs text-gray-500">From</Label>
              <Input
                id="start-date"
                type="date"
                value={filters.blackoutDateRange.start}
                onChange={(e) => handleDateRangeChange('start', e.target.value)}
                className="text-sm"
              />
            </div>
            <div>
              <Label htmlFor="end-date" className="text-xs text-gray-500">To</Label>
              <Input
                id="end-date"
                type="date"
                value={filters.blackoutDateRange.end}
                onChange={(e) => handleDateRangeChange('end', e.target.value)}
                className="text-sm"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
