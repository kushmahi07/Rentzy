import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Eye, Trash2, MapPin, User, Calendar, Coins, DollarSign, AlertCircle } from "lucide-react";
import { format } from "date-fns";

interface Property {
  id: number;
  name: string;
  address: string;
  status: 'live' | 'pending' | 'rejected';
  thumbnail: string | null;
  ownerName: string;
  liveDate: string | null;
  rejectedDate: string | null;
  rejectionReason: string | null;
  totalTokens: number;
  tokenPrice: number;
  tokensSold?: number;
  createdAt: Date;
}

interface PropertyCardProps {
  property: Property;
  onView: (property: Property) => void;
  onDelete: (id: number) => void;
}

export const PropertyCard: React.FC<PropertyCardProps> = ({ property, onView, onDelete }) => {
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
            <span>Live On: {format(new Date(property.liveDate), 'MMM dd, yyyy')}</span>
          </div>
        ) : null;
      case 'pending':
        return (
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Calendar className="h-4 w-4" />
            <span>Posted On: {format(property.createdAt, 'MMM dd, yyyy')}</span>
          </div>
        );
      case 'rejected':
        return property.rejectedDate ? (
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Calendar className="h-4 w-4" />
            <span>Rejected On: {format(new Date(property.rejectedDate), 'MMM dd, yyyy')}</span>
          </div>
        ) : null;
      default:
        return null;
    }
  };

  const getTokenInfo = () => {
    if (property.status === 'live' || property.status === 'pending') {
      return (
        <div className="flex items-center gap-4 text-sm text-gray-600">
          <div className="flex items-center gap-2">
            <Coins className="h-4 w-4" />
            <span>{property.totalTokens} Tokens</span>
          </div>
          <div className="flex items-center gap-2">
            <DollarSign className="h-4 w-4" />
            <span>${property.tokenPrice}</span>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <Card className="border border-gray-200 hover:shadow-md transition-shadow">
      <CardContent className="p-6">
        <div className="flex gap-4">
          {/* Thumbnail */}
          <div className="flex-shrink-0">
            <img
              src={property.thumbnail || "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=400&h=300&fit=crop"}
              alt={property.name}
              className="w-20 h-20 object-cover rounded-lg"
            />
          </div>

          {/* Property Details */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between mb-2">
              <div>
                <h3 className="font-semibold text-lg text-gray-900 truncate">{property.name}</h3>
                <div className="flex items-center gap-2 text-sm text-gray-600 mt-1">
                  <MapPin className="h-4 w-4" />
                  <span className="truncate">{property.address}</span>
                </div>
              </div>
              {getStatusBadge()}
            </div>

            <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
              <User className="h-4 w-4" />
              <span>{property.ownerName}</span>
            </div>

            {getDateInfo()}
            {getTokenInfo()}

            {/* Rejection Reason for Rejected Properties */}
            {property.status === 'rejected' && property.rejectionReason && (
              <div className="mt-2 p-3 bg-red-50 border border-red-200 rounded-md">
                <div className="flex items-start gap-2">
                  <AlertCircle className="h-4 w-4 text-red-600 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-red-800">Rejection Reason:</p>
                    <p className="text-sm text-red-700">{property.rejectionReason}</p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="flex flex-col gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => onView(property)}
              className="text-blue-600 border-blue-200 hover:bg-blue-50"
            >
              <Eye className="h-4 w-4 mr-2" />
              View
            </Button>
            
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  className="text-red-600 border-red-200 hover:bg-red-50"
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Delete Property</AlertDialogTitle>
                  <AlertDialogDescription>
                    Are you sure you want to delete "{property.name}"? This action cannot be undone.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={() => onDelete(property.id)}
                    className="bg-red-600 hover:bg-red-700"
                  >
                    Delete
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default PropertyCard;