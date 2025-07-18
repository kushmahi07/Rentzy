
import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { LocationFormData, ValidationErrors, COUNTRIES } from '../types';

interface LocationFormProps {
  isOpen: boolean;
  onClose: () => void;
  formData: LocationFormData;
  onInputChange: (field: keyof LocationFormData, value: string | boolean) => void;
  onSubmit: () => void;
  errors: ValidationErrors;
  isEditing: boolean;
  loading?: boolean;
}

const LocationForm: React.FC<LocationFormProps> = ({
  isOpen,
  onClose,
  formData,
  onInputChange,
  onSubmit,
  errors,
  isEditing,
  loading = false
}) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold text-gray-900">
            {isEditing ? 'Edit Location' : 'Add New Location'}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* City Field */}
          <div className="space-y-2">
            <Label htmlFor="city">
              City <span className="text-red-500">*</span>
            </Label>
            <Input
              id="city"
              placeholder="Enter city name (e.g., Aspen)"
              value={formData.city}
              onChange={(e) => onInputChange('city', e.target.value)}
              className={errors.city ? 'border-red-500' : ''}
            />
            {errors.city && (
              <p className="text-sm text-red-600">{errors.city}</p>
            )}
          </div>

          {/* Country Field */}
          <div className="space-y-2">
            <Label>
              Country <span className="text-red-500">*</span>
            </Label>
            <Select
              value={formData.country || undefined}
              onValueChange={(value) => onInputChange('country', value)}
            >
              <SelectTrigger className={errors.country ? 'border-red-500' : ''}>
                <SelectValue placeholder="Select a country" />
              </SelectTrigger>
              <SelectContent>
                {COUNTRIES.map((country) => (
                  <SelectItem key={country.value} value={country.value}>
                    {country.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.country && (
              <p className="text-sm text-red-600">{errors.country}</p>
            )}
          </div>

          {/* Tag Field */}
          <div className="space-y-2">
            <Label htmlFor="tag">Tag (Optional)</Label>
            <Input
              id="tag"
              placeholder="Enter tag (e.g., Ski Resort)"
              value={formData.tag}
              onChange={(e) => onInputChange('tag', e.target.value)}
              className={errors.tag ? 'border-red-500' : ''}
            />
            {errors.tag && (
              <p className="text-sm text-red-600">{errors.tag}</p>
            )}
            <p className="text-sm text-gray-500">
              Optional field for marketing and search categorization
            </p>
          </div>

          {/* Status Field */}
          <div className="space-y-2">
            <Label>Status</Label>
            <div className="flex items-center space-x-3">
              <Switch
                checked={formData.status === 'Active'}
                onCheckedChange={(checked) => onInputChange('status', checked ? 'Active' : 'Inactive')}
              />
              <span className="text-sm font-medium text-gray-700">
                {formData.status === 'Active' ? 'Active' : 'Inactive'}
              </span>
            </div>
            <p className="text-sm text-gray-500">
              Only active locations can be used in listings
            </p>
          </div>

          {/* Duplicate Error */}
          {errors.duplicate && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-md">
              <p className="text-sm text-red-600">{errors.duplicate}</p>
            </div>
          )}
        </div>

        {/* Form Actions */}
        <div className="flex justify-end space-x-3 pt-4 border-t">
          <Button
            variant="outline"
            onClick={onClose}
            disabled={loading}
          >
            Cancel
          </Button>
          <Button
            onClick={onSubmit}
            disabled={loading}
            className="min-w-[80px]"
          >
            {loading ? 'Saving...' : 'Save'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default LocationForm;
