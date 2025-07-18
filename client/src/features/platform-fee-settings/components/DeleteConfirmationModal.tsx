
import React from 'react';
import { Button } from '@/components/ui/button';
import { AlertTriangle } from 'lucide-react';
import { PlatformFee } from '../types';

interface DeleteConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  fee: PlatformFee | null;
}

export function DeleteConfirmationModal({ 
  isOpen, 
  onClose, 
  onConfirm, 
  fee 
}: DeleteConfirmationModalProps) {
  if (!isOpen || !fee) return null;

  const formatValue = () => {
    if (fee.feeType === 'Flat') {
      return `$${fee.value.toLocaleString()}`;
    } else {
      return `${fee.value}%`;
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg max-w-md w-full mx-4">
        <div className="p-6">
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
              <AlertTriangle className="h-5 w-5 text-red-600" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-gray-900">Delete Platform Fee</h2>
              <p className="text-sm text-gray-600">This action cannot be undone</p>
            </div>
          </div>

          <div className="mb-6 p-4 bg-gray-50 rounded-lg">
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm font-medium text-gray-600">Fee Type:</span>
                <span className="text-sm text-gray-900">{fee.feeType}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm font-medium text-gray-600">Value:</span>
                <span className="text-sm text-gray-900">{formatValue()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm font-medium text-gray-600">Applies To:</span>
                <span className="text-sm text-gray-900">{fee.appliesTo}</span>
              </div>
            </div>
          </div>

          <p className="text-sm text-gray-600 mb-6">
            Are you sure you want to delete this platform fee? This action will permanently remove 
            the fee from the system.
          </p>

          <div className="flex items-center justify-end space-x-4">
            <Button
              variant="outline"
              onClick={onClose}
            >
              Cancel
            </Button>
            <Button
              onClick={onConfirm}
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              Delete Fee
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
