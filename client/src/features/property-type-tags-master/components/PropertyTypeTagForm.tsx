
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { PropertyTypeTag, PropertyTypeTagFormData, ValidationErrors } from "../types";

interface PropertyTypeTagFormProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: PropertyTypeTagFormData) => void;
  editingTag: PropertyTypeTag | null;
  isSubmitting: boolean;
  existingTags: PropertyTypeTag[];
}

export function PropertyTypeTagForm({
  open,
  onClose,
  onSubmit,
  editingTag,
  isSubmitting,
  existingTags,
}: PropertyTypeTagFormProps) {
  const [formData, setFormData] = useState<PropertyTypeTagFormData>({
    tagName: '',
    description: '',
    sortOrder: '',
  });
  const [errors, setErrors] = useState<ValidationErrors>({});

  useEffect(() => {
    if (editingTag) {
      setFormData({
        tagName: editingTag.tagName,
        description: editingTag.description,
        sortOrder: editingTag.sortOrder,
      });
    } else {
      setFormData({
        tagName: '',
        description: '',
        sortOrder: '',
      });
    }
    setErrors({});
  }, [editingTag, open]);

  const validateForm = (): boolean => {
    const newErrors: ValidationErrors = {};

    // Tag Name validation
    if (!formData.tagName.trim()) {
      newErrors.tagName = 'Tag name is required';
    } else if (formData.tagName.length > 50) {
      newErrors.tagName = 'Tag name must be 50 characters or less';
    } else {
      // Check for duplicates
      const isDuplicate = existingTags.some(
        tag => 
          tag.tagName.toLowerCase() === formData.tagName.toLowerCase() && 
          tag.id !== editingTag?.id
      );
      if (isDuplicate) {
        newErrors.tagName = 'Tag name already exists';
      }
    }

    // Description validation
    if (formData.description && formData.description.length > 500) {
      newErrors.description = 'Description must be 500 characters or less';
    }

    // Sort Order validation
    if (!formData.sortOrder && formData.sortOrder !== 0) {
      newErrors.sortOrder = 'Sort order is required';
    } else {
      const sortOrderNum = Number(formData.sortOrder);
      if (isNaN(sortOrderNum) || !Number.isInteger(sortOrderNum)) {
        newErrors.sortOrder = 'Sort order must be an integer';
      } else if (sortOrderNum < 1 || sortOrderNum > 100) {
        newErrors.sortOrder = 'Sort order must be between 1 and 100';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      onSubmit({
        ...formData,
        sortOrder: Number(formData.sortOrder),
      });
    }
  };

  const handleInputChange = (field: keyof PropertyTypeTagFormData, value: string | number) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error for this field when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>
            {editingTag ? 'Edit Property Type Tag' : 'Add New Property Type Tag'}
          </DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="tagName">Tag Name *</Label>
            <Input
              id="tagName"
              value={formData.tagName}
              onChange={(e) => handleInputChange('tagName', e.target.value)}
              placeholder="e.g., Villa"
              className={errors.tagName ? 'border-red-500' : ''}
            />
            {errors.tagName && (
              <p className="text-sm text-red-500">{errors.tagName}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              placeholder="Describe this property type tag..."
              rows={3}
              className={errors.description ? 'border-red-500' : ''}
            />
            <div className="flex justify-between text-xs text-gray-500">
              <span>{errors.description && <span className="text-red-500">{errors.description}</span>}</span>
              <span>{formData.description.length}/500</span>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="sortOrder">Sort Order *</Label>
            <Input
              id="sortOrder"
              type="number"
              min="1"
              max="100"
              value={formData.sortOrder}
              onChange={(e) => handleInputChange('sortOrder', e.target.value)}
              placeholder="1-100"
              className={errors.sortOrder ? 'border-red-500' : ''}
            />
            {errors.sortOrder && (
              <p className="text-sm text-red-500">{errors.sortOrder}</p>
            )}
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Saving...' : editingTag ? 'Update' : 'Save'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
