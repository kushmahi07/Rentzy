
import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { EventFestivalFiltersType } from '../types';
import { mockLocations } from '../mockData';

interface EventFestivalFiltersProps {
  filters: EventFestivalFiltersType;
  onFilterChange: (filters: EventFestivalFiltersType) => void;
}

export function EventFestivalFilters({ filters, onFilterChange }: EventFestivalFiltersProps) {
  const handleLocationChange = (value: string) => {
    onFilterChange({ ...filters, location: value });
  };

  const handleStartDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onFilterChange({ ...filters, startDate: e.target.value });
  };

  const handleEndDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onFilterChange({ ...filters, endDate: e.target.value });
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-gray-50 rounded-lg">
      {/* Location Filter */}
      <div className="space-y-2">
        <Label htmlFor="location-filter">Location</Label>
        <Select value={filters.location} onValueChange={handleLocationChange}>
          <SelectTrigger id="location-filter">
            <SelectValue placeholder="All Locations" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Locations</SelectItem>
            {mockLocations.map((location) => (
              <SelectItem key={location} value={location}>
                {location}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Start Date Filter */}
      <div className="space-y-2">
        <Label htmlFor="start-date-filter">Start Date (From)</Label>
        <Input
          id="start-date-filter"
          type="date"
          value={filters.startDate}
          onChange={handleStartDateChange}
        />
      </div>

      {/* End Date Filter */}
      <div className="space-y-2">
        <Label htmlFor="end-date-filter">End Date (To)</Label>
        <Input
          id="end-date-filter"
          type="date"
          value={filters.endDate}
          onChange={handleEndDateChange}
        />
      </div>
    </div>
  );
}
