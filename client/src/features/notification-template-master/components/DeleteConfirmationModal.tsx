
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { AlertTriangle } from 'lucide-react';
import { NotificationTemplate } from '../types';

interface DeleteConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  template?: NotificationTemplate | null;
}

export function DeleteConfirmationModal({
  isOpen,
  onClose,
  onConfirm,
  template,
}: DeleteConfirmationModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center">
              <AlertTriangle className="h-5 w-5 text-red-600" />
            </div>
            <div>
              <DialogTitle>Delete Notification Template</DialogTitle>
              <DialogDescription className="mt-1">
                This action cannot be undone.
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="mt-4">
          <p className="text-sm text-gray-600">
            Are you sure you want to delete the notification template "{template?.title}"? 
            This will permanently remove the template and it cannot be recovered.
          </p>
        </div>

        <div className="flex items-center justify-end space-x-3 mt-6">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button
            onClick={() => {
              onConfirm();
              onClose();
            }}
            className="bg-red-600 hover:bg-red-700 text-white"
          >
            Delete Template
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
