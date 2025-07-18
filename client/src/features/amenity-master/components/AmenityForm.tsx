
import { useState, useRef } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Upload, X } from "lucide-react";
import { Amenity, AmenityFormData } from "../types";

interface AmenityFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: AmenityFormData) => void;
  amenity?: Amenity;
  existingAmenities: Amenity[];
}

export function AmenityForm({ 
  isOpen, 
  onClose, 
  onSubmit, 
  amenity, 
  existingAmenities 
}: AmenityFormProps) {
  const [formData, setFormData] = useState<AmenityFormData>({
    name: amenity?.name || '',
    type: amenity?.type || '',
    icon: amenity?.icon || '',
    iconFile: undefined,
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const fileInputRef = useRef<HTMLInputElement>(null);

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    // Validate name
    if (!formData.name.trim()) {
      newErrors.name = 'Amenity name is required';
    } else if (formData.name.length > 150) {
      newErrors.name = 'Amenity name must not exceed 150 characters';
    } else {
      // Check for duplicate names (excluding current amenity when editing)
      const isDuplicate = existingAmenities.some(
        (a) => a.name.toLowerCase() === formData.name.toLowerCase() && a.id !== amenity?.id
      );
      if (isDuplicate) {
        newErrors.name = 'An amenity with this name already exists';
      }
    }

    // Validate type
    if (!formData.type) {
      newErrors.type = 'Type is required';
    }

    // Validate icon file if uploaded
    if (formData.iconFile) {
      const file = formData.iconFile;
      const validTypes = ['image/jpeg', 'image/jpg', 'image/png'];
      const maxSize = 1024 * 1024; // 1MB

      if (!validTypes.includes(file.type)) {
        newErrors.icon = 'Icon must be in JPG or PNG format';
      } else if (file.size > maxSize) {
        newErrors.icon = 'Icon file size must not exceed 1MB';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      onSubmit(formData);
      handleClose();
    }
  };

  const handleClose = () => {
    setFormData({
      name: '',
      type: '',
      icon: '',
      iconFile: undefined,
    });
    setErrors({});
    onClose();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData({ ...formData, iconFile: file });
      setErrors({ ...errors, icon: '' });
    }
  };

  const removeFile = () => {
    setFormData({ ...formData, iconFile: undefined });
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>
            {amenity ? 'Edit Amenity' : 'Add New Amenity'}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Amenity Name */}
          <div className="space-y-2">
            <Label htmlFor="name">
              Amenity Name <span className="text-red-500">*</span>
            </Label>
            <Input
              id="name"
              placeholder="e.g., Swimming Pool"
              value={formData.name}
              onChange={(e) => {
                setFormData({ ...formData, name: e.target.value });
                if (errors.name) setErrors({ ...errors, name: '' });
              }}
              className={errors.name ? 'border-red-500' : ''}
            />
            {errors.name && (
              <p className="text-sm text-red-500">{errors.name}</p>
            )}
          </div>

          {/* Type */}
          <div className="space-y-2">
            <Label htmlFor="type">
              Type <span className="text-red-500">*</span>
            </Label>
            <Select
              value={formData.type}
              onValueChange={(value) => {
                setFormData({ ...formData, type: value as 'Indoor' | 'Outdoor' });
                if (errors.type) setErrors({ ...errors, type: '' });
              }}
            >
              <SelectTrigger className={errors.type ? 'border-red-500' : ''}>
                <SelectValue placeholder="Select type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Indoor">Indoor</SelectItem>
                <SelectItem value="Outdoor">Outdoor</SelectItem>
              </SelectContent>
            </Select>
            {errors.type && (
              <p className="text-sm text-red-500">{errors.type}</p>
            )}
          </div>

          {/* Icon Upload */}
          <div className="space-y-2">
            <Label htmlFor="icon">Icon (Optional)</Label>
            <div className="space-y-2">
              {!formData.iconFile ? (
                <div
                  onClick={() => fileInputRef.current?.click()}
                  className={`border-2 border-dashed rounded-lg p-4 text-center cursor-pointer hover:bg-gray-50 transition-colors ${
                    errors.icon ? 'border-red-500' : 'border-gray-300'
                  }`}
                >
                  <Upload className="h-6 w-6 mx-auto mb-2 text-gray-400" />
                  <p className="text-sm text-gray-600">
                    Click to upload icon
                  </p>
                  <p className="text-xs text-gray-500">
                    JPG or PNG, max 1MB
                  </p>
                </div>
              ) : (
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <span className="text-sm text-gray-700 truncate">
                    {formData.iconFile.name}
                  </span>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={removeFile}
                    className="h-6 w-6 p-0"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              )}
              <input
                ref={fileInputRef}
                type="file"
                accept=".jpg,.jpeg,.png"
                onChange={handleFileChange}
                className="hidden"
              />
            </div>
            {errors.icon && (
              <p className="text-sm text-red-500">{errors.icon}</p>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="flex-1 bg-blue-600 hover:bg-blue-700"
            >
              {amenity ? 'Update' : 'Save'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
