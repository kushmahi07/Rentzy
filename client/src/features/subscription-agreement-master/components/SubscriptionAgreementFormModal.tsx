
import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Upload, FileText, Eye } from 'lucide-react';
import { SubscriptionAgreement, SubscriptionAgreementFormData, ValidationErrors } from '../types';

interface SubscriptionAgreementFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (formData: SubscriptionAgreementFormData) => void;
  agreement?: SubscriptionAgreement;
  isSubmitting?: boolean;
}

export function SubscriptionAgreementFormModal({
  isOpen,
  onClose,
  onSubmit,
  agreement,
  isSubmitting = false,
}: SubscriptionAgreementFormModalProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [formData, setFormData] = useState<SubscriptionAgreementFormData>({
    agreementName: agreement?.agreementName || '',
    document: null,
    version: agreement?.version || '',
  });
  const [errors, setErrors] = useState<ValidationErrors>({});
  const [dragOver, setDragOver] = useState(false);

  const validateForm = (): boolean => {
    const newErrors: ValidationErrors = {};

    if (!formData.agreementName.trim()) {
      newErrors.agreementName = 'Agreement name is required';
    } else if (formData.agreementName.length > 100) {
      newErrors.agreementName = 'Agreement name must not exceed 100 characters';
    }

    if (!agreement && !formData.document) {
      newErrors.document = 'Document is required';
    } else if (formData.document) {
      if (formData.document.type !== 'application/pdf') {
        newErrors.document = 'Only PDF files are allowed';
      } else if (formData.document.size > 5 * 1024 * 1024) {
        newErrors.document = 'File size must not exceed 5MB';
      }
    }

    if (!formData.version.trim()) {
      newErrors.version = 'Version is required';
    } else if (!/^\d+\.\d+$/.test(formData.version)) {
      newErrors.version = 'Version must follow X.Y format (e.g., 1.0)';
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

  const handleFileSelect = (file: File) => {
    setFormData(prev => ({ ...prev, document: file }));
    setErrors(prev => ({ ...prev, document: undefined }));
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      handleFileSelect(files[0]);
    }
  };

  const handlePreview = () => {
    if (agreement?.documentUrl) {
      window.open(agreement.documentUrl, '_blank');
    } else if (formData.document) {
      const url = URL.createObjectURL(formData.document);
      window.open(url, '_blank');
    }
  };

  const resetForm = () => {
    setFormData({
      agreementName: '',
      document: null,
      version: '',
    });
    setErrors({});
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>
            {agreement ? 'Edit Subscription Agreement' : 'Add New Subscription Agreement'}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="agreementName">
              Agreement Name <span className="text-red-500">*</span>
            </Label>
            <Input
              id="agreementName"
              value={formData.agreementName}
              onChange={(e) => setFormData(prev => ({ ...prev, agreementName: e.target.value }))}
              placeholder="e.g., Investor Agreement 2025"
              className={errors.agreementName ? 'border-red-500' : ''}
            />
            {errors.agreementName && (
              <p className="text-sm text-red-500">{errors.agreementName}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label>
              Document {!agreement && <span className="text-red-500">*</span>}
            </Label>
            <div
              className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
                dragOver
                  ? 'border-blue-400 bg-blue-50'
                  : errors.document
                  ? 'border-red-300 bg-red-50'
                  : 'border-gray-300 hover:border-gray-400'
              }`}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept=".pdf"
                onChange={(e) => {
                  if (e.target.files?.[0]) {
                    handleFileSelect(e.target.files[0]);
                  }
                }}
                className="hidden"
              />
              
              {formData.document || agreement?.documentFilename ? (
                <div className="flex items-center justify-center space-x-3">
                  <FileText className="h-8 w-8 text-red-500" />
                  <div className="text-left">
                    <p className="text-sm font-medium text-gray-900">
                      {formData.document?.name || agreement?.documentFilename}
                    </p>
                    <p className="text-xs text-gray-500">
                      {formData.document ? 
                        `${(formData.document.size / 1024 / 1024).toFixed(2)} MB` : 
                        'Current document'
                      }
                    </p>
                  </div>
                </div>
              ) : (
                <div className="space-y-2">
                  <Upload className="h-8 w-8 text-gray-400 mx-auto" />
                  <p className="text-sm text-gray-600">
                    Drag and drop a PDF file here, or{' '}
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="text-blue-600 hover:text-blue-700 font-medium"
                    >
                      browse
                    </button>
                  </p>
                  <p className="text-xs text-gray-500">
                    PDF only, max 5MB
                  </p>
                </div>
              )}
              
              {(formData.document || agreement?.documentFilename) && (
                <div className="mt-3 flex space-x-2 justify-center">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    Change File
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={handlePreview}
                  >
                    <Eye className="h-4 w-4 mr-1" />
                    Preview
                  </Button>
                </div>
              )}
            </div>
            {errors.document && (
              <p className="text-sm text-red-500">{errors.document}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="version">
              Version <span className="text-red-500">*</span>
            </Label>
            <Input
              id="version"
              value={formData.version}
              onChange={(e) => setFormData(prev => ({ ...prev, version: e.target.value }))}
              placeholder="e.g., 1.0"
              className={errors.version ? 'border-red-500' : ''}
            />
            <p className="text-xs text-gray-500">
              Format: X.Y (e.g., 1.0, 2.1, 3.0)
            </p>
            {errors.version && (
              <p className="text-sm text-red-500">{errors.version}</p>
            )}
          </div>

          <div className="flex space-x-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              className="flex-1"
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={handlePreview}
              disabled={!formData.document && !agreement?.documentUrl}
            >
              <Eye className="h-4 w-4 mr-1" />
              Preview
            </Button>
            <Button
              type="submit"
              className="flex-1"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Saving...' : 'Save'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
