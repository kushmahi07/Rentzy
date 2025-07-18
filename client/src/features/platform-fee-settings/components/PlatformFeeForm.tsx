
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { PlatformFee, PlatformFeeFormData } from '../types';
import { AlertTriangle, CheckCircle } from 'lucide-react';

interface PlatformFeeFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (formData: PlatformFeeFormData) => void;
  editingFee?: PlatformFee | null;
  existingFees: PlatformFee[];
}

export function PlatformFeeForm({ 
  isOpen, 
  onClose, 
  onSubmit, 
  editingFee, 
  existingFees 
}: PlatformFeeFormProps) {
  const [formData, setFormData] = useState<PlatformFeeFormData>({
    feeType: '',
    value: '',
    appliesTo: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (editingFee) {
      setFormData({
        feeType: editingFee.feeType,
        value: editingFee.value.toString(),
        appliesTo: editingFee.appliesTo,
      });
    } else {
      setFormData({
        feeType: '',
        value: '',
        appliesTo: '',
      });
    }
    setErrors({});
  }, [editingFee, isOpen]);

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    // Fee Type validation
    if (!formData.feeType) {
      newErrors.feeType = 'Fee Type is required';
    }

    // Applies To validation
    if (!formData.appliesTo) {
      newErrors.appliesTo = 'Applies To is required';
    }

    // Value validation
    if (!formData.value) {
      newErrors.value = 'Value is required';
    } else {
      const numValue = parseFloat(formData.value);
      if (isNaN(numValue) || numValue <= 0) {
        newErrors.value = 'Value must be a positive number';
      } else if (formData.feeType === 'Flat' && numValue > 100000) {
        newErrors.value = 'Flat fee cannot exceed $100,000';
      } else if (formData.feeType === '%' && numValue > 100) {
        newErrors.value = 'Percentage fee cannot exceed 100%';
      }
    }

    // Duplicate check
    if (formData.feeType && formData.appliesTo) {
      const isDuplicate = existingFees.some(fee => 
        fee.feeType === formData.feeType && 
        fee.appliesTo === formData.appliesTo && 
        (!editingFee || fee.id !== editingFee.id)
      );

      if (isDuplicate) {
        newErrors.duplicate = `A ${formData.feeType} fee for ${formData.appliesTo} already exists`;
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      onSubmit(formData);
    }
  };

  const handleInputChange = (field: keyof PlatformFeeFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg max-w-md w-full mx-4">
        <div className="p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">
            {editingFee ? 'Edit Platform Fee' : 'Add New Platform Fee'}
          </h2>

          {errors.duplicate && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md">
              <p className="text-sm text-red-600 flex items-center gap-2">
                <AlertTriangle className="h-4 w-4" />
                {errors.duplicate}
              </p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="feeType" className="text-sm font-medium text-gray-700">
                Fee Type *
              </Label>
              <Select value={formData.feeType} onValueChange={(value) => handleInputChange('feeType', value)}>
                <SelectTrigger className={errors.feeType ? 'border-red-500' : ''}>
                  <SelectValue placeholder="Select fee type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Flat">Flat</SelectItem>
                  <SelectItem value="%">%</SelectItem>
                </SelectContent>
              </Select>
              {errors.feeType && (
                <p className="text-sm text-red-500 flex items-center gap-1">
                  <AlertTriangle className="h-3 w-3" />
                  {errors.feeType}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="value" className="text-sm font-medium text-gray-700">
                Value *
              </Label>
              <div className="relative">
                {formData.feeType === 'Flat' && (
                  <span className="absolute left-3 top-3 text-gray-400">$</span>
                )}
                {formData.feeType === '%' && (
                  <span className="absolute right-3 top-3 text-gray-400">%</span>
                )}
                <Input
                  id="value"
                  type="number"
                  step={formData.feeType === '%' ? '0.1' : '1'}
                  min="0"
                  max={formData.feeType === 'Flat' ? '100000' : '100'}
                  placeholder={formData.feeType === 'Flat' ? 'e.g., 50' : 'e.g., 3.5'}
                  value={formData.value}
                  onChange={(e) => handleInputChange('value', e.target.value)}
                  className={`${errors.value ? 'border-red-500' : ''} ${
                    formData.feeType === 'Flat' ? 'pl-8' : formData.feeType === '%' ? 'pr-8' : ''
                  }`}
                />
              </div>
              {errors.value && (
                <p className="text-sm text-red-500 flex items-center gap-1">
                  <AlertTriangle className="h-3 w-3" />
                  {errors.value}
                </p>
              )}
              {!errors.value && formData.value && formData.feeType && (
                <p className="text-sm text-green-600 flex items-center gap-1">
                  <CheckCircle className="h-3 w-3" />
                  Valid {formData.feeType === 'Flat' ? 'flat fee' : 'percentage fee'}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="appliesTo" className="text-sm font-medium text-gray-700">
                Applies To *
              </Label>
              <Select value={formData.appliesTo} onValueChange={(value) => handleInputChange('appliesTo', value)}>
                <SelectTrigger className={errors.appliesTo ? 'border-red-500' : ''}>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Residential">Residential</SelectItem>
                  <SelectItem value="Commercial">Commercial</SelectItem>
                  <SelectItem value="Both">Both</SelectItem>
                </SelectContent>
              </Select>
              {errors.appliesTo && (
                <p className="text-sm text-red-500 flex items-center gap-1">
                  <AlertTriangle className="h-3 w-3" />
                  {errors.appliesTo}
                </p>
              )}
            </div>

            <div className="flex items-center justify-end space-x-4 pt-4 border-t border-gray-200">
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                style={{ backgroundColor: '#004182' }}
                className="hover:opacity-90 text-white"
              >
                {editingFee ? 'Update Fee' : 'Create Fee'}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
