
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { AlertTriangle } from 'lucide-react';
import { InvestorEarningsFormat } from '../types';

interface DeleteConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  format: InvestorEarningsFormat | null;
  loading?: boolean;
}

export function DeleteConfirmationModal({
  isOpen,
  onClose,
  onConfirm,
  format,
  loading
}: DeleteConfirmationModalProps) {
  if (!format) return null;

  const formatQuarter = (start: string, end: string) => {
    const startDate = new Date(start);
    return `Q${Math.ceil((startDate.getMonth() + 1) / 3)} ${startDate.getFullYear()}`;
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-red-600">
            <AlertTriangle className="h-5 w-5" />
            Delete Earnings Format
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <p className="text-gray-600">
            Are you sure you want to delete this earnings format? This action cannot be undone.
          </p>
          
          <div className="bg-gray-50 p-4 rounded-lg space-y-2">
            <div className="flex justify-between">
              <span className="font-medium text-gray-700">Format:</span>
              <span className="text-gray-900">{format.format}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-medium text-gray-700">Quarter:</span>
              <span className="text-gray-900">
                {formatQuarter(format.quarterStart, format.quarterEnd)}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="font-medium text-gray-700">Fields:</span>
              <span className="text-gray-900">{format.fieldsIncluded.length} fields</span>
            </div>
          </div>

          <div className="flex justify-end space-x-3 pt-4">
            <Button 
              variant="outline" 
              onClick={onClose}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button 
              variant="destructive" 
              onClick={onConfirm}
              disabled={loading}
            >
              {loading ? 'Deleting...' : 'Delete Format'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
