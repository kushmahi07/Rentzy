
import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { DocumentTypeFormData, ValidationErrors } from '../types';
import { FILE_TYPE_OPTIONS, PROPERTY_TYPE_OPTIONS } from '../mockData';

interface DocumentTypeFormProps {
  formData: DocumentTypeFormData;
  errors: ValidationErrors;
  isEdit: boolean;
  onInputChange: (field: string, value: any) => void;
  onSubmit: () => void;
  onCancel: () => void;
  isSubmitting: boolean;
}

const DocumentTypeForm: React.FC<DocumentTypeFormProps> = ({
  formData,
  errors,
  isEdit,
  onInputChange,
  onSubmit,
  onCancel,
  isSubmitting
}) => {
  const handleFileTypeChange = (fileType: string, checked: boolean) => {
    const updatedFileTypes = checked
      ? [...formData.acceptedFileTypes, fileType]
      : formData.acceptedFileTypes.filter(type => type !== fileType);
    
    onInputChange('acceptedFileTypes', updatedFileTypes);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900">
          {isEdit ? 'Edit Document Type' : 'Add New Document Type'}
        </h3>
      </div>

      <div className="space-y-4">
        {/* Document Name */}
        <div>
          <Label htmlFor="documentName" className="text-sm font-medium text-gray-700">
            Document Name <span className="text-red-500">*</span>
          </Label>
          <Input
            id="documentName"
            value={formData.documentName}
            onChange={(e) => onInputChange('documentName', e.target.value)}
            placeholder="Enter document name"
            className={`mt-1 ${errors.documentName ? 'border-red-500' : ''}`}
            maxLength={100}
          />
          {errors.documentName && (
            <p className="mt-1 text-sm text-red-500">{errors.documentName}</p>
          )}
        </div>

        {/* Property Type */}
        <div>
          <Label htmlFor="propertyType" className="text-sm font-medium text-gray-700">
            Property Type <span className="text-red-500">*</span>
          </Label>
          <Select
            value={formData.propertyType || undefined}
            onValueChange={(value) => onInputChange('propertyType', value)}
          >
            <SelectTrigger className={`mt-1 ${errors.propertyType ? 'border-red-500' : ''}`}>
              <SelectValue placeholder="Select property type" />
            </SelectTrigger>
            <SelectContent>
              {PROPERTY_TYPE_OPTIONS.filter(option => option.value && option.value.trim() !== '').map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.propertyType && (
            <p className="mt-1 text-sm text-red-500">{errors.propertyType}</p>
          )}
        </div>

        {/* Mandatory */}
        <div className="flex items-center space-x-2">
          <Switch
            id="mandatory"
            checked={formData.mandatory}
            onCheckedChange={(checked) => onInputChange('mandatory', checked)}
          />
          <Label htmlFor="mandatory" className="text-sm font-medium text-gray-700">
            Mandatory
          </Label>
        </div>

        {/* Accepted File Types */}
        <div>
          <Label className="text-sm font-medium text-gray-700">
            Accepted File Types <span className="text-red-500">*</span>
          </Label>
          <div className="mt-2 space-y-2">
            {FILE_TYPE_OPTIONS.map((fileType) => (
              <div key={fileType.value} className="flex items-center space-x-2">
                <Checkbox
                  id={fileType.value}
                  checked={formData.acceptedFileTypes.includes(fileType.value)}
                  onCheckedChange={(checked) => 
                    handleFileTypeChange(fileType.value, checked as boolean)
                  }
                />
                <Label
                  htmlFor={fileType.value}
                  className="text-sm font-medium text-gray-700"
                >
                  {fileType.label}
                </Label>
              </div>
            ))}
          </div>
          {errors.acceptedFileTypes && (
            <p className="mt-1 text-sm text-red-500">{errors.acceptedFileTypes}</p>
          )}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
        <Button
          variant="outline"
          onClick={onCancel}
          disabled={isSubmitting}
        >
          Cancel
        </Button>
        <Button
          onClick={onSubmit}
          disabled={isSubmitting}
          style={{ backgroundColor: '#004182' }}
          className="hover:opacity-90 text-white"
        >
          {isSubmitting ? 'Saving...' : (isEdit ? 'Update' : 'Save')}
        </Button>
      </div>
    </div>
  );
};

export default DocumentTypeForm;
