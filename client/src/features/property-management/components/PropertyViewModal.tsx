import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { MapPin, User, Calendar, Coins, DollarSign, AlertCircle, X } from "lucide-react";
import { format } from "date-fns";

interface Property {
  id: number;
  name: string;
  address: string;
  description: string | null;
  status: 'live' | 'pending' | 'rejected';
  thumbnail: string | null;
  ownerName: string;
  ownerEmail: string;
  liveDate: string | null;
  rejectedDate: string | null;
  rejectionReason: string | null;
  totalTokens: number;
  tokenPrice: number;
  tokensSold?: number;
  createdAt: Date;
}

interface PropertyViewModalProps {
  property: Property | null;
  isOpen: boolean;
  onClose: () => void;
}

export const PropertyViewModal: React.FC<PropertyViewModalProps> = ({
  property,
  isOpen,
  onClose
}) => {
  if (!property) return null;

  const getStatusBadge = () => {
    switch (property.status) {
      case 'live':
        return <Badge className="bg-green-100 text-green-800 border-green-200">Live</Badge>;
      case 'pending':
        return <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200">Pending</Badge>;
      case 'rejected':
        return <Badge className="bg-red-100 text-red-800 border-red-200">Rejected</Badge>;
      default:
        return <Badge variant="secondary">{property.status}</Badge>;
    }
  };

  const getDateInfo = () => {
    switch (property.status) {
      case 'live':
        return property.liveDate ? (
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Calendar className="h-4 w-4" />
            <span>Live Since: {format(new Date(property.liveDate), 'MMMM dd, yyyy')}</span>
          </div>
        ) : null;
      case 'pending':
        return (
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Calendar className="h-4 w-4" />
            <span>Submitted On: {format(property.createdAt, 'MMMM dd, yyyy')}</span>
          </div>
        );
      case 'rejected':
        return property.rejectedDate ? (
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Calendar className="h-4 w-4" />
            <span>Rejected On: {format(new Date(property.rejectedDate), 'MMMM dd, yyyy')}</span>
          </div>
        ) : null;
      default:
        return null;
    }
  };

  const totalValue = property.totalTokens * property.tokenPrice;
  const tokensSold = property.tokensSold || 0;
  const saleProgress = property.status === 'live' ? (tokensSold / property.totalTokens) * 100 : 0;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle className="text-2xl font-bold text-gray-900">
              Property Details
            </DialogTitle>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        </DialogHeader>

        <div className="space-y-6">
          {/* Property Header */}
          <div className="flex gap-6">
            <div className="flex-shrink-0">
              <img
                src={property.thumbnail || "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=400&h=300&fit=crop"}
                alt={property.name}
                className="w-48 h-36 object-cover rounded-lg"
              />
            </div>
            <div className="flex-1">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">{property.name}</h2>
                  <div className="flex items-center gap-2 text-gray-600 mb-2">
                    <MapPin className="h-4 w-4" />
                    <span>{property.address}</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-600">
                    <User className="h-4 w-4" />
                    <span>{property.ownerName}</span>
                    <span className="text-gray-400">({property.ownerEmail})</span>
                  </div>
                </div>
                {getStatusBadge()}
              </div>
              {getDateInfo()}
            </div>
          </div>

          <Separator />

          {/* Property Description */}
          {property.description && (
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Description</h3>
              <p className="text-gray-700 leading-relaxed">{property.description}</p>
            </div>
          )}

          {/* Tokenization Details */}
          {(property.status === 'live' || property.status === 'pending') && (
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Tokenization Details</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-blue-50 p-4 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <Coins className="h-5 w-5 text-blue-600" />
                    <span className="text-sm font-medium text-blue-900">Total Tokens</span>
                  </div>
                  <p className="text-2xl font-bold text-blue-900">{property.totalTokens}</p>
                </div>
                <div className="bg-green-50 p-4 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <DollarSign className="h-5 w-5 text-green-600" />
                    <span className="text-sm font-medium text-green-900">Token Price</span>
                  </div>
                  <p className="text-2xl font-bold text-green-900">${property.tokenPrice}</p>
                </div>
                <div className="bg-purple-50 p-4 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <DollarSign className="h-5 w-5 text-purple-600" />
                    <span className="text-sm font-medium text-purple-900">Total Value</span>
                  </div>
                  <p className="text-2xl font-bold text-purple-900">${totalValue.toLocaleString()}</p>
                </div>
                {property.status === 'live' && (
                  <div className="bg-orange-50 p-4 rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <Coins className="h-5 w-5 text-orange-600" />
                      <span className="text-sm font-medium text-orange-900">Tokens Sold</span>
                    </div>
                    <p className="text-2xl font-bold text-orange-900">{tokensSold}</p>
                    <p className="text-sm text-orange-700">{saleProgress.toFixed(1)}% sold</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Rejection Details */}
          {property.status === 'rejected' && property.rejectionReason && (
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Rejection Details</h3>
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <AlertCircle className="h-5 w-5 text-red-600 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-red-800 mb-1">Rejection Reason:</p>
                    <p className="text-sm text-red-700">{property.rejectionReason}</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          <Separator />

          {/* Action Buttons */}
          <div className="flex justify-end gap-3">
            <Button variant="outline" onClick={onClose}>
              Close
            </Button>
            {property.status === 'pending' && (
              <div className="flex gap-2">
                <Button variant="outline" className="text-red-600 border-red-200 hover:bg-red-50">
                  Reject Property
                </Button>
                <Button className="bg-green-600 hover:bg-green-700">
                  Approve Property
                </Button>
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default PropertyViewModal;