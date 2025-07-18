
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { NotificationTemplateFilters as NotificationTemplateFiltersType } from '../types';

interface NotificationTemplateFiltersProps {
  filters: NotificationTemplateFiltersType;
  onFiltersChange: (filters: NotificationTemplateFiltersType) => void;
}

export function NotificationTemplateFilters({ 
  filters, 
  onFiltersChange 
}: NotificationTemplateFiltersProps) {
  const handleTriggerTypeChange = (value: string) => {
    onFiltersChange({
      ...filters,
      triggerType: value,
    });
  };

  const handleChannelChange = (value: string) => {
    onFiltersChange({
      ...filters,
      channel: value,
    });
  };

  return (
    <div className="flex items-center gap-4 mb-6">
      <div className="flex items-center gap-2">
        <label className="text-sm font-medium text-gray-700">Trigger Type:</label>
        <Select value={filters.triggerType} onValueChange={handleTriggerTypeChange}>
          <SelectTrigger className="w-40">
            <SelectValue placeholder="All Types" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Types</SelectItem>
            <SelectItem value="Booking">Booking</SelectItem>
            <SelectItem value="Payout">Payout</SelectItem>
            <SelectItem value="Tokenization">Tokenization</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="flex items-center gap-2">
        <label className="text-sm font-medium text-gray-700">Channel:</label>
        <Select value={filters.channel} onValueChange={handleChannelChange}>
          <SelectTrigger className="w-32">
            <SelectValue placeholder="All Channels" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Channels</SelectItem>
            <SelectItem value="Email">Email</SelectItem>
            <SelectItem value="Push">Push</SelectItem>
            <SelectItem value="SMS">SMS</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
