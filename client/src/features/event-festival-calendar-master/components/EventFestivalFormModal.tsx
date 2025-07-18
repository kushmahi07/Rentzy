
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { EventFestival, EventFestivalFormData, ValidationErrors } from '../types';
import { mockLocations } from '../mockData';

interface EventFestivalFormModalProps {
  isOpen: boolean;
  editingEvent?: EventFestival;
  formData: EventFestivalFormData;
  validationErrors: ValidationErrors;
  onSubmit: (e: React.FormEvent) => void;
  onCancel: () => void;
  onChange: (field: keyof EventFestivalFormData, value: string | number) => void;
}

export function EventFestivalFormModal({
  isOpen,
  editingEvent,
  formData,
  validationErrors,
  onSubmit,
  onCancel,
  onChange,
}: EventFestivalFormModalProps) {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(e);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onCancel}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>
            {editingEvent ? 'Edit Event' : 'Add New Event'}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {validationErrors.general && (
            <div className="bg-red-50 border border-red-200 rounded-md p-3">
              <p className="text-sm text-red-600">{validationErrors.general}</p>
            </div>
          )}

          {/* Event Name */}
          <div className="space-y-2">
            <Label htmlFor="eventName">Event Name *</Label>
            <Input
              id="eventName"
              type="text"
              value={formData.eventName}
              onChange={(e) => onChange('eventName', e.target.value)}
              placeholder="e.g., Aspen Food Festival"
              maxLength={100}
              className={validationErrors.eventName ? 'border-red-500' : ''}
            />
            {validationErrors.eventName && (
              <p className="text-sm text-red-600">{validationErrors.eventName}</p>
            )}
          </div>

          {/* Date Range */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="startDate">Start Date *</Label>
              <Input
                id="startDate"
                type="date"
                value={formData.startDate}
                onChange={(e) => onChange('startDate', e.target.value)}
                className={validationErrors.startDate ? 'border-red-500' : ''}
              />
              {validationErrors.startDate && (
                <p className="text-sm text-red-600">{validationErrors.startDate}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="endDate">End Date *</Label>
              <Input
                id="endDate"
                type="date"
                value={formData.endDate}
                onChange={(e) => onChange('endDate', e.target.value)}
                className={validationErrors.endDate ? 'border-red-500' : ''}
              />
              {validationErrors.endDate && (
                <p className="text-sm text-red-600">{validationErrors.endDate}</p>
              )}
            </div>
          </div>

          {/* Location */}
          <div className="space-y-2">
            <Label htmlFor="location">Location *</Label>
            <Select
              value={formData.location}
              onValueChange={(value) => onChange('location', value)}
            >
              <SelectTrigger className={validationErrors.location ? 'border-red-500' : ''}>
                <SelectValue placeholder="Select location" />
              </SelectTrigger>
              <SelectContent>
                {mockLocations.map((location) => (
                  <SelectItem key={location} value={location}>
                    {location}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {validationErrors.location && (
              <p className="text-sm text-red-600">{validationErrors.location}</p>
            )}
          </div>

          {/* Multiplier */}
          <div className="space-y-2">
            <Label htmlFor="multiplier">Price Multiplier *</Label>
            <Input
              id="multiplier"
              type="number"
              min="0.5"
              max="5.0"
              step="0.01"
              value={formData.multiplier}
              onChange={(e) => onChange('multiplier', parseFloat(e.target.value) || 0)}
              placeholder="e.g., 2.50"
              className={validationErrors.multiplier ? 'border-red-500' : ''}
            />
            <p className="text-xs text-gray-600">
              Range: 0.50 - 5.00 (up to 2 decimal places)
            </p>
            {validationErrors.multiplier && (
              <p className="text-sm text-red-600">{validationErrors.multiplier}</p>
            )}
          </div>

          {/* Actions */}
          <div className="flex justify-end space-x-3 pt-6">
            <Button type="button" variant="outline" onClick={onCancel}>
              Cancel
            </Button>
            <Button type="submit" style={{ backgroundColor: '#004182' }} className="hover:opacity-90 text-white">
              {editingEvent ? 'Update Event' : 'Save Event'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
