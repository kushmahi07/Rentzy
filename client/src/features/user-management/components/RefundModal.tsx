
import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "../../../components/ui/dialog";
import { Label } from "../../../components/ui/label";
import { Input } from "../../../components/ui/input";
import { Button } from "../../../components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../../components/ui/select";
import { RefundFormData, BookingData } from '../types';

interface RefundModalProps {
  isOpen: boolean;
  onClose: () => void;
  refundFormData: RefundFormData;
  onFormChange: (field: string, value: string) => void;
  onProcessRefund: () => void;
  selectedBooking: BookingData | null;
}

const RefundModal: React.FC<RefundModalProps> = ({
  isOpen,
  onClose,
  refundFormData,
  onFormChange,
  onProcessRefund,
  selectedBooking
}) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Refund Amount Details</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <Label htmlFor="refund-amount">Enter Amount</Label>
            <Input
              id="refund-amount"
              type="number"
              placeholder="Enter refund amount"
              value={refundFormData.amount}
              onChange={(e) => onFormChange("amount", e.target.value)}
            />
          </div>
          <div>
            <Label htmlFor="payment-type">Payment Type</Label>
            <Select value={refundFormData.paymentType} onValueChange={(value) => onFormChange("paymentType", value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select payment type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="fiat">Fiat</SelectItem>
                <SelectItem value="crypto">Crypto</SelectItem>
              </SelectContent>
            </Select>
          </div>
          {refundFormData.paymentType === "crypto" && (
            <div>
              <Label htmlFor="wallet-address">Enter Wallet Address</Label>
              <Input
                id="wallet-address"
                placeholder="Enter wallet address"
                value={refundFormData.walletAddress}
                onChange={(e) => onFormChange("walletAddress", e.target.value)}
              />
            </div>
          )}
          {refundFormData.paymentType === "fiat" && (
            <div className="space-y-4">
              <div>
                <Label htmlFor="bank-account">Enter Bank Account Number</Label>
                <Input
                  id="bank-account"
                  placeholder="Enter bank account number"
                  value={refundFormData.bankAccountNumber}
                  onChange={(e) => onFormChange("bankAccountNumber", e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="swift-code">Enter Swift Code</Label>
                <Input
                  id="swift-code"
                  placeholder="Enter SWIFT code"
                  value={refundFormData.swiftCode}
                  onChange={(e) => onFormChange("swiftCode", e.target.value)}
                />
              </div>
            </div>
          )}
          <div className="flex gap-3 pt-4">
            <Button onClick={onClose} variant="outline" className="flex-1">
              Cancel
            </Button>
            <Button onClick={onProcessRefund} className="flex-1 bg-orange-600 hover:bg-orange-700 text-white">
              Process Refund
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default RefundModal;
