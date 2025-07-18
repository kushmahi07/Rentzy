
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { AlertTriangle } from 'lucide-react';
import { SubscriptionAgreement } from '../types';

interface DeleteConfirmationModalProps {
  isOpen: boolean;
  agreement: SubscriptionAgreement | null;
  onConfirm: () => void;
  onCancel: () => void;
  isDeleting?: boolean;
}

export function DeleteConfirmationModal({
  isOpen,
  agreement,
  onConfirm,
  onCancel,
  isDeleting = false,
}: DeleteConfirmationModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onCancel}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-red-500" />
            Delete Subscription Agreement
          </DialogTitle>
        </DialogHeader>
        
        <div className="py-4">
          <p className="text-gray-600">
            Are you sure you want to delete{' '}
            <span className="font-semibold">"{agreement?.agreementName}"</span>?
          </p>
          <p className="text-sm text-gray-500 mt-2">
            This action cannot be undone. Make sure no active subscriptions depend on this agreement.
          </p>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onCancel} disabled={isDeleting}>
            Cancel
          </Button>
          <Button
            variant="destructive"
            onClick={onConfirm}
            disabled={isDeleting}
          >
            {isDeleting ? 'Deleting...' : 'Delete'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
