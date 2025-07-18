
import React, { useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { FileText, Table, Calendar } from 'lucide-react';
import { InvestorEarningsFormat, InvestorEarningsFormatFormData, FormErrors, AVAILABLE_FIELDS } from '../types';

interface InvestorEarningsFormatFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: InvestorEarningsFormatFormData) => void;
  editingFormat?: InvestorEarningsFormat | null;
  formData: InvestorEarningsFormatFormData;
  onFormChange: (data: InvestorEarningsFormatFormData) => void;
  errors: FormErrors;
  loading?: boolean;
}

export function InvestorEarningsFormatFormModal({
  isOpen,
  onClose,
  onSave,
  editingFormat,
  formData,
  onFormChange,
  errors,
  loading
}: InvestorEarningsFormatFormModalProps) {
  useEffect(() => {
    if (editingFormat && isOpen) {
      onFormChange({
        format: editingFormat.format,
        fieldsIncluded: editingFormat.fieldsIncluded,
        quarterStart: editingFormat.quarterStart,
        quarterEnd: editingFormat.quarterEnd
      });
    }
  }, [editingFormat, isOpen, onFormChange]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  const handleFieldToggle = (field: string, checked: boolean) => {
    const updatedFields = checked
      ? [...formData.fieldsIncluded, field]
      : formData.fieldsIncluded.filter(f => f !== field);
    
    onFormChange({
      ...formData,
      fieldsIncluded: updatedFields
    });
  };

  const getFormatIcon = (format: string) => {
    return format === 'PDF' ? <FileText className="h-4 w-4" /> : <Table className="h-4 w-4" />;
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5 text-blue-600" />
            {editingFormat ? 'Edit Earnings Format' : 'Add New Earnings Format'}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {errors.general && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-md">
              <p className="text-sm text-red-600">{errors.general}</p>
            </div>
          )}

          {/* Format Selection */}
          <div className="space-y-2">
            <Label htmlFor="format" className="text-sm font-medium text-gray-700">
              Format *
            </Label>
            <Select
              value={formData.format}
              onValueChange={(value: 'PDF' | 'CSV') => 
                onFormChange({ ...formData, format: value })
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Select format type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="PDF">
                  <div className="flex items-center gap-2">
                    <FileText className="h-4 w-4" />
                    PDF
                  </div>
                </SelectItem>
                <SelectItem value="CSV">
                  <div className="flex items-center gap-2">
                    <Table className="h-4 w-4" />
                    CSV
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
            {errors.format && (
              <p className="text-sm text-red-600">{errors.format}</p>
            )}
          </div>

          {/* Fields Included */}
          <div className="space-y-2">
            <Label className="text-sm font-medium text-gray-700">
              Fields to Include *
            </Label>
            <div className="grid grid-cols-2 gap-3 max-h-48 overflow-y-auto border border-gray-200 rounded-md p-4">
              {AVAILABLE_FIELDS.map((field) => (
                <div key={field} className="flex items-center space-x-2">
                  <Checkbox
                    id={field}
                    checked={formData.fieldsIncluded.includes(field)}
                    onCheckedChange={(checked) => 
                      handleFieldToggle(field, checked as boolean)
                    }
                  />
                  <Label 
                    htmlFor={field} 
                    className="text-sm text-gray-700 cursor-pointer"
                  >
                    {field}
                  </Label>
                </div>
              ))}
            </div>
            <div className="text-sm text-gray-500">
              Selected: {formData.fieldsIncluded.length} field(s)
            </div>
            {errors.fieldsIncluded && (
              <p className="text-sm text-red-600">{errors.fieldsIncluded}</p>
            )}
          </div>

          {/* Quarter Date Range */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="quarterStart" className="text-sm font-medium text-gray-700">
                Quarter Start Date *
              </Label>
              <Input
                id="quarterStart"
                type="date"
                value={formData.quarterStart}
                onChange={(e) => 
                  onFormChange({ ...formData, quarterStart: e.target.value })
                }
                className={errors.quarterStart ? 'border-red-500' : ''}
              />
              {errors.quarterStart && (
                <p className="text-sm text-red-600">{errors.quarterStart}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="quarterEnd" className="text-sm font-medium text-gray-700">
                Quarter End Date *
              </Label>
              <Input
                id="quarterEnd"
                type="date"
                value={formData.quarterEnd}
                onChange={(e) => 
                  onFormChange({ ...formData, quarterEnd: e.target.value })
                }
                className={errors.quarterEnd ? 'border-red-500' : ''}
              />
              {errors.quarterEnd && (
                <p className="text-sm text-red-600">{errors.quarterEnd}</p>
              )}
            </div>
          </div>

          {/* Format Preview */}
          {formData.format && formData.fieldsIncluded.length > 0 && (
            <div className="p-4 bg-gray-50 rounded-md">
              <h4 className="text-sm font-medium text-gray-700 mb-2">Preview</h4>
              <div className="flex items-center gap-2 mb-2">
                {getFormatIcon(formData.format)}
                <span className="text-sm font-medium">{formData.format} Format</span>
              </div>
              <div className="text-sm text-gray-600">
                <span className="font-medium">Fields: </span>
                {formData.fieldsIncluded.join(', ')}
              </div>
              {formData.quarterStart && formData.quarterEnd && (
                <div className="text-sm text-gray-600 mt-1">
                  <span className="font-medium">Period: </span>
                  {new Date(formData.quarterStart).toLocaleDateString()} - {new Date(formData.quarterEnd).toLocaleDateString()}
                </div>
              )}
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
            <Button 
              type="button" 
              variant="outline" 
              onClick={onClose}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button 
              type="submit" 
              disabled={loading}
              className="bg-blue-600 hover:bg-blue-700"
            >
              {loading ? 'Saving...' : editingFormat ? 'Update Format' : 'Create Format'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
