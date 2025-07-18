
import React from 'react';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { HelpCircle } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface PropertyAddressDetailsProps {
  formData: {
    buildingName: string;
    floorTower: string;
    areaLocalityPincode: string;
    city: string;
    nearbyLandmark: string;
  };
  onFormChange: (field: string, value: string) => void;
}

export const PropertyAddressDetails: React.FC<PropertyAddressDetailsProps> = ({
  formData,
  onFormChange
}) => {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <h3 className="text-xl font-semibold text-gray-900">Property Address Details</h3>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger>
              <HelpCircle className="h-4 w-4 text-gray-400" />
            </TooltipTrigger>
            <TooltipContent>
              <p>Provide detailed address information for the property location</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="building-name">Building Name</Label>
          <Input
            id="building-name"
            placeholder="e.g., Ocean View Apartments, Business Tower"
            value={formData.buildingName}
            onChange={(e) => onFormChange('buildingName', e.target.value)}
            className="text-lg"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="floor-tower">Floor / Tower</Label>
          <Input
            id="floor-tower"
            placeholder="e.g., 5th Floor, Tower A"
            value={formData.floorTower}
            onChange={(e) => onFormChange('floorTower', e.target.value)}
            className="text-lg"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="area-locality">Area / Sector / Locality</Label>
          <Input
            id="area-locality"
            placeholder="e.g., Downtown, Sector 15, Beverly Hills"
            value={formData.areaLocalityPincode}
            onChange={(e) => onFormChange('areaLocalityPincode', e.target.value)}
            className="text-lg"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="city">City</Label>
          <Input
            id="city"
            placeholder="e.g., Miami, New York, Los Angeles"
            value={formData.city}
            onChange={(e) => onFormChange('city', e.target.value)}
            className="text-lg"
          />
        </div>

        <div className="md:col-span-2 space-y-2">
          <Label htmlFor="nearby-landmark">Nearby Landmark</Label>
          <Input
            id="nearby-landmark"
            placeholder="e.g., Near Central Park, 5 minutes from Times Square"
            value={formData.nearbyLandmark}
            onChange={(e) => onFormChange('nearbyLandmark', e.target.value)}
            className="text-lg"
          />
        </div>
      </div>
    </div>
  );
};

export default PropertyAddressDetails;
