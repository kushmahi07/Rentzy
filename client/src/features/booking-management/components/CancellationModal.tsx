
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertTriangle } from 'lucide-react';
import { BookingData, CancellationData } from '../types';

interface CancellationModalProps {
  booking: BookingData | null;
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  cancellationData: CancellationData;
  onDataChange: (data: CancellationData) => void;
}

export function CancellationModal({
  booking,
  isOpen,
  onClose,
  onConfirm,
  cancellationData,
  onDataChange
}: CancellationModalProps) {
  const [error, setError] = React.useState<string | null>(null);

  const handleConfirm = () => {
    setError(null);
    
    if (!cancellationData.reason.trim()) {
      setError('Cancellation reason is required');
      return;
    }
    
    if (cancellationData.reason.length > 500) {
      setError('Cancellation reason cannot exceed 500 characters');
      return;
    }
    
    onConfirm();
  };

  const handleReasonChange = (value: string) => {
    onDataChange({ ...cancellationData, reason: value });
    if (error) setError(null);
  };

  if (!booking) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md" role="dialog">
        <DialogHeader>
          <DialogTitle>Cancel Booking</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <Alert>
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              You are about to cancel booking <strong>{booking.bookingId}</strong> for {booking.tenantName}. 
              This action cannot be undone.
            </AlertDescription>
          </Alert>

          <div>
            <Label htmlFor="cancellation-reason">
              Reason for Cancellation <span className="text-red-500">*</span>
            </Label>
            <Textarea
              id="cancellation-reason"
              placeholder="Please provide a reason for cancelling this booking..."
              value={cancellationData.reason}
              onChange={(e) => handleReasonChange(e.target.value)}
              className={`mt-1 ${error ? 'border-red-500' : ''}`}
              rows={4}
              maxLength={500}
            />
            <div className="flex justify-between mt-1">
              <span className="text-xs text-gray-500">
                {cancellationData.reason.length}/500 characters
              </span>
              {error && (
                <span className="text-xs text-red-500">{error}</span>
              )}
            </div>
          </div>

          <div className="flex gap-3 pt-4">
            <Button onClick={onClose} variant="outline" className="flex-1">
              Cancel
            </Button>
            <Button 
              onClick={handleConfirm} 
              className="flex-1 bg-red-600 hover:bg-red-700 text-white"
              disabled={!cancellationData.reason.trim()}
            >
              Confirm Cancellation
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
