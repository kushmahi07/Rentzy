
import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { PlatformFeeFiltersType } from '../types';

interface PlatformFeeFiltersProps {
  filters: PlatformFeeFiltersType;
  onFiltersChange: (filters: PlatformFeeFiltersType) => void;
}

export function PlatformFeeFilters({ filters, onFiltersChange }: PlatformFeeFiltersProps) {
  const handleFeeTypeChange = (value: string) => {
    onFiltersChange({ ...filters, feeType: value === 'all' ? '' : value });
  };

  const handleAppliesToChange = (value: string) => {
    onFiltersChange({ ...filters, appliesTo: value === 'all' ? '' : value });
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 mb-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="space-y-2">
          <Label className="text-sm font-medium">Fee Type</Label>
          <Select value={filters.feeType || 'all'} onValueChange={handleFeeTypeChange}>
            <SelectTrigger>
              <SelectValue placeholder="All Types" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="Flat">Flat</SelectItem>
              <SelectItem value="%">%</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label className="text-sm font-medium">Applies To</Label>
          <Select value={filters.appliesTo || 'all'} onValueChange={handleAppliesToChange}>
            <SelectTrigger>
              <SelectValue placeholder="All Categories" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              <SelectItem value="Residential">Residential</SelectItem>
              <SelectItem value="Commercial">Commercial</SelectItem>
              <SelectItem value="Both">Both</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
}
