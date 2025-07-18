
import React from 'react';
import { AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { DocumentType } from '../types';

interface DeleteConfirmationModalProps {
  isOpen: boolean;
  documentType: DocumentType | null;
  onConfirm: () => void;
  onCancel: () => void;
  isDeleting: boolean;
}

const DeleteConfirmationModal: React.FC<DeleteConfirmationModalProps> = ({
  isOpen,
  documentType,
  onConfirm,
  onCancel,
  isDeleting
}) => {
  if (!documentType) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onCancel}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-red-500" />
            Confirm Delete
          </DialogTitle>
        </DialogHeader>
        
        <div className="py-4">
          <p className="text-sm text-gray-600">
            Are you sure you want to delete the document type{' '}
            <span className="font-semibold">"{documentType.documentName}"</span>?
          </p>
          <p className="text-sm text-gray-500 mt-2">
            This action cannot be undone and will remove this document type from all {documentType.propertyType.toLowerCase()} property listings.
          </p>
        </div>

        <div className="flex justify-end space-x-3">
          <Button
            variant="outline"
            onClick={onCancel}
            disabled={isDeleting}
          >
            Cancel
          </Button>
          <Button
            variant="destructive"
            onClick={onConfirm}
            disabled={isDeleting}
          >
            {isDeleting ? 'Deleting...' : 'Delete'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default DeleteConfirmationModal;
