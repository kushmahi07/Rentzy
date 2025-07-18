
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { BookingData } from '../types';
import { formatDateTime } from '../utils';

interface DisputeChatModalProps {
  booking: BookingData | null;
  isOpen: boolean;
  onClose: () => void;
}

export function DisputeChatModal({
  booking,
  isOpen,
  onClose
}: DisputeChatModalProps) {
  if (!booking || !booking.chatHistory) return null;

  const getAvatarColor = (sender: string) => {
    switch (sender) {
      case 'tenant':
        return 'bg-blue-500';
      case 'admin':
        return 'bg-green-500';
      case 'bot':
        return 'bg-gray-500';
      default:
        return 'bg-gray-400';
    }
  };

  const getAvatarInitials = (sender: string) => {
    switch (sender) {
      case 'tenant':
        return 'T';
      case 'admin':
        return 'A';
      case 'bot':
        return 'B';
      default:
        return '?';
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[80vh]" role="dialog">
        <DialogHeader>
          <DialogTitle>Dispute Chat - {booking.bookingId}</DialogTitle>
          <p className="text-sm text-gray-600">
            Dispute Reason: {booking.disputeReason}
          </p>
        </DialogHeader>
        
        <div className="flex flex-col h-[500px]">
          {/* Chat Messages */}
          <ScrollArea className="flex-1 p-4 border rounded-lg bg-gray-50">
            <div className="space-y-4">
              {booking.chatHistory.map((message) => (
                <div key={message.id} className="flex gap-3">
                  <Avatar className="h-8 w-8 flex-shrink-0">
                    <AvatarFallback className={`text-white text-xs ${getAvatarColor(message.sender)}`}>
                      {getAvatarInitials(message.sender)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-sm font-medium text-gray-900 capitalize">
                        {message.sender}
                      </span>
                      <span className="text-xs text-gray-500">
                        {formatDateTime(message.timestamp)}
                      </span>
                    </div>
                    <div className="bg-white rounded-lg px-3 py-2 shadow-sm border">
                      <p className="text-sm text-gray-800">{message.message}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>

          {/* Chat Info */}
          <div className="mt-4 p-3 bg-blue-50 rounded-lg">
            <p className="text-sm text-blue-800">
              <strong>Note:</strong> This is a read-only view of the dispute chat. 
              All communication is handled through the dispute resolution system.
            </p>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-4">
            <Button onClick={onClose} variant="outline" className="flex-1">
              Close
            </Button>
            <Button className="flex-1 bg-blue-600 hover:bg-blue-700 text-white">
              View Full Dispute Details
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
