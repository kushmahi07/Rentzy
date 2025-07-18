
import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Edit, Trash2 } from 'lucide-react';
import { BookingRule } from '../types';

interface BookingRuleTableProps {
  rules: BookingRule[];
  onEdit: (rule: BookingRule) => void;
  onDelete: (rule: BookingRule) => void;
}

export function BookingRuleTable({ rules, onEdit, onDelete }: BookingRuleTableProps) {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const formatDateRange = (start: string, end: string) => {
    if (start === end) {
      return formatDate(start);
    }
    return `${formatDate(start)} - ${formatDate(end)}`;
  };

  if (rules.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">No booking rules found</p>
      </div>
    );
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[100px]">Min Days</TableHead>
            <TableHead className="w-[100px]">Max Days</TableHead>
            <TableHead className="w-[200px]">Blackout Dates</TableHead>
            <TableHead className="w-[150px]">Booking Buffer Period</TableHead>
            <TableHead className="w-[150px]">Property Level Toggle</TableHead>
            <TableHead className="w-[120px] text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {rules.map((rule) => (
            <TableRow key={rule.id}>
              <TableCell className="font-medium">{rule.minDays}</TableCell>
              <TableCell>{rule.maxDays}</TableCell>
              <TableCell>
                {formatDateRange(rule.blackoutDates.start, rule.blackoutDates.end)}
              </TableCell>
              <TableCell>
                {rule.bookingBufferPeriod} {rule.bookingBufferPeriod === 1 ? 'day' : 'days'}
              </TableCell>
              <TableCell>
                <Badge 
                  variant={rule.propertyLevelToggle ? 'default' : 'secondary'}
                  className={rule.propertyLevelToggle ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}
                >
                  {rule.propertyLevelToggle ? 'On' : 'Off'}
                </Badge>
              </TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end space-x-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => onEdit(rule)}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => onDelete(rule)}
                    className="text-red-600 hover:text-red-700"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
