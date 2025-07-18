
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';
import { SubscriptionAgreementFilters as SubscriptionAgreementFiltersType } from '../types';

interface SubscriptionAgreementFiltersProps {
  filters: SubscriptionAgreementFiltersType;
  onFiltersChange: (filters: SubscriptionAgreementFiltersType) => void;
}

export function SubscriptionAgreementFilters({ 
  filters, 
  onFiltersChange 
}: SubscriptionAgreementFiltersProps) {
  const handleSearchChange = (value: string) => {
    onFiltersChange({
      ...filters,
      searchTerm: value,
    });
  };

  return (
    <div className="flex flex-col sm:flex-row gap-4 mb-6">
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
        <Input
          placeholder="Search by Agreement Name..."
          value={filters.searchTerm}
          onChange={(e) => handleSearchChange(e.target.value)}
          className="pl-10"
        />
      </div>
    </div>
  );
}
