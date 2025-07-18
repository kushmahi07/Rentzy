
import React from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';
import { BookingRule, BookingRuleFormData, ValidationErrors } from '../types';

interface BookingRuleFormModalProps {
  isOpen: boolean;
  editingRule: BookingRule | null;
  formData: BookingRuleFormData;
  validationErrors: ValidationErrors;
  onSubmit: () => void;
  onCancel: () => void;
  onChange: (field: keyof BookingRuleFormData, value: any) => void;
}

export function BookingRuleFormModal({
  isOpen,
  editingRule,
  formData,
  validationErrors,
  onSubmit,
  onCancel,
  onChange
}: BookingRuleFormModalProps) {
  const handleDateRangeChange = (key: 'start' | 'end', value: string) => {
    onChange('blackoutDates', {
      ...formData.blackoutDates,
      [key]: value
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={() => onCancel()}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>
            {editingRule ? 'Edit Booking Rule' : 'Add New Booking Rule'}
          </DialogTitle>
          <DialogDescription>
            Configure booking policies that will apply globally across all properties.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* General Error */}
          {validationErrors.general && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{validationErrors.general}</AlertDescription>
            </Alert>
          )}

          {/* Min Days */}
          <div className="space-y-2">
            <Label htmlFor="minDays">Min Days *</Label>
            <Input
              id="minDays"
              type="number"
              min={1}
              max={30}
              value={formData.minDays}
              onChange={(e) => onChange('minDays', parseInt(e.target.value) || 0)}
              className={validationErrors.minDays ? 'border-red-500' : ''}
            />
            {validationErrors.minDays && (
              <p className="text-sm text-red-500">{validationErrors.minDays}</p>
            )}
          </div>

          {/* Max Days */}
          <div className="space-y-2">
            <Label htmlFor="maxDays">Max Days *</Label>
            <Input
              id="maxDays"
              type="number"
              min={1}
              max={90}
              value={formData.maxDays}
              onChange={(e) => onChange('maxDays', parseInt(e.target.value) || 0)}
              className={validationErrors.maxDays ? 'border-red-500' : ''}
            />
            {validationErrors.maxDays && (
              <p className="text-sm text-red-500">{validationErrors.maxDays}</p>
            )}
          </div>

          {/* Blackout Dates */}
          <div className="space-y-2">
            <Label>Blackout Dates</Label>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <Label htmlFor="blackout-start" className="text-xs text-gray-500">From</Label>
                <Input
                  id="blackout-start"
                  type="date"
                  value={formData.blackoutDates.start}
                  onChange={(e) => handleDateRangeChange('start', e.target.value)}
                  className={validationErrors.blackoutDates ? 'border-red-500' : ''}
                />
              </div>
              <div>
                <Label htmlFor="blackout-end" className="text-xs text-gray-500">To</Label>
                <Input
                  id="blackout-end"
                  type="date"
                  value={formData.blackoutDates.end}
                  onChange={(e) => handleDateRangeChange('end', e.target.value)}
                  className={validationErrors.blackoutDates ? 'border-red-500' : ''}
                />
              </div>
            </div>
            {validationErrors.blackoutDates && (
              <p className="text-sm text-red-500">{validationErrors.blackoutDates}</p>
            )}
          </div>

          {/* Booking Buffer Period */}
          <div className="space-y-2">
            <Label htmlFor="bufferPeriod">Booking Buffer Period (days)</Label>
            <Input
              id="bufferPeriod"
              type="number"
              min={0}
              max={7}
              value={formData.bookingBufferPeriod}
              onChange={(e) => onChange('bookingBufferPeriod', parseInt(e.target.value) || 0)}
              className={validationErrors.bookingBufferPeriod ? 'border-red-500' : ''}
            />
            {validationErrors.bookingBufferPeriod && (
              <p className="text-sm text-red-500">{validationErrors.bookingBufferPeriod}</p>
            )}
          </div>

          {/* Property Level Toggle */}
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="propertyToggle">Property Level Toggle</Label>
              <p className="text-sm text-gray-500">
                Allow properties to override this global rule
              </p>
            </div>
            <Switch
              id="propertyToggle"
              checked={formData.propertyLevelToggle}
              onCheckedChange={(checked) => onChange('propertyLevelToggle', checked)}
            />
          </div>
        </div>

        {/* Actions */}
        <div className="flex justify-end space-x-2 pt-4 border-t">
          <Button variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button onClick={onSubmit}>
            {editingRule ? 'Update Rule' : 'Create Rule'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
