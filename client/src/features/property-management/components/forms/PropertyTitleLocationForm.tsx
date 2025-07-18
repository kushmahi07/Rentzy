import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { ChevronRight, HelpCircle, CheckCircle, XCircle, AlertTriangle, Info } from "lucide-react";
import Breadcrumb from "../shared/Breadcrumb";
import ProgressBar from "../shared/ProgressBar";

interface PropertyTitleLocationFormProps {
  formData: {
    title: string;
    address: string;
    zipCode: string;
    buildingName: string;
    floorTower: string;
    areaLocalityPincode: string;
    city: string;
    nearbyLandmark: string;
  };
  titleValidationError: string;
  zipCodeValidation: {
    isValidating: boolean;
    isValid: boolean | null;
    message: string;
  };
  onFormChange: (field: string, value: string) => void;
  onContinue: () => void;
  onBack: () => void;
  formProgress: number;
  isValid: boolean;
}

export const PropertyTitleLocationForm: React.FC<PropertyTitleLocationFormProps> = ({
  formData,
  titleValidationError,
  zipCodeValidation,
  onFormChange,
  onContinue,
  onBack,
  formProgress,
  isValid
}) => {
  const titleCharCount = formData.title?.length || 0;

  const breadcrumbItems = [
    { 
      label: "Add New Property", 
      onClick: onBack
    },
    { 
      label: "Property Title and Location", 
      isActive: true 
    }
  ];

  return (
    <div className="space-y-6">
      <Breadcrumb items={breadcrumbItems} />

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="max-w-2xl mx-auto space-y-8">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-900 mb-3">Property Title and Location</h1>
            <p className="text-gray-600 text-lg">
              Provide the basic details for your property
            </p>
          </div>

          <div className="space-y-8">
            {/* Property Title Section */}
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <h3 className="text-xl font-semibold text-gray-900">Property Title</h3>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger>
                      <HelpCircle className="h-4 w-4 text-gray-400" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Enter a descriptive name for your property that investors will see</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="property-title">Property Title *</Label>
                  <span className={`text-sm ${titleCharCount > 100 ? 'text-red-500' : 'text-gray-500'}`}>
                    {titleCharCount}/100 characters
                  </span>
                </div>
                <Input
                  id="property-title"
                  placeholder="e.g., Downtown Office Suite, Luxury Beachfront Villa"
                  value={formData.title}
                  onChange={(e) => onFormChange('title', e.target.value)}
                  className={`text-lg ${titleValidationError ? 'border-red-500' : ''}`}
                  maxLength={100}
                />
                {titleValidationError && (
                  <p className="text-sm text-red-500 flex items-center gap-1">
                    <AlertTriangle className="h-3 w-3" />
                    {titleValidationError}
                  </p>
                )}
                {!titleValidationError && titleCharCount >= 2 && (
                  <p className="text-sm text-green-600 flex items-center gap-1">
                    <CheckCircle className="h-3 w-3" />
                    Valid property title
                  </p>
                )}
              </div>
            </div>

            {/* Location Section */}
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <h3 className="text-xl font-semibold text-gray-900">Location</h3>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger>
                      <HelpCircle className="h-4 w-4 text-gray-400" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Select the property market and zip code for property verification</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Property Market */}
                <div className="md:col-span-2 space-y-2">
                  <Label htmlFor="property-market">Property Market *</Label>
                  <Select 
                    value={formData.address} 
                    onValueChange={(value) => onFormChange('address', value)}
                  >
                    <SelectTrigger className="text-base">
                      <SelectValue placeholder="Select property market" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Miami Beach, FL">Miami Beach, FL</SelectItem>
                      <SelectItem value="Manhattan, NY">Manhattan, NY</SelectItem>
                      <SelectItem value="Beverly Hills, CA">Beverly Hills, CA</SelectItem>
                      <SelectItem value="Chicago Downtown, IL">Chicago Downtown, IL</SelectItem>
                      <SelectItem value="San Francisco, CA">San Francisco, CA</SelectItem>
                      <SelectItem value="Boston Back Bay, MA">Boston Back Bay, MA</SelectItem>
                      <SelectItem value="Austin Downtown, TX">Austin Downtown, TX</SelectItem>
                      <SelectItem value="Seattle Capitol Hill, WA">Seattle Capitol Hill, WA</SelectItem>
                      <SelectItem value="Denver LoDo, CO">Denver LoDo, CO</SelectItem>
                      <SelectItem value="Nashville Music Row, TN">Nashville Music Row, TN</SelectItem>
                    </SelectContent>
                  </Select>
                  {formData.address.trim() === '' ? (
                    <p className="text-sm text-gray-500">Please select a property market</p>
                  ) : (
                    <p className="text-sm text-green-600 flex items-center gap-1">
                      <CheckCircle className="h-3 w-3" />
                      Market selected
                    </p>
                  )}
                </div>

                {/* Zip Code */}
                <div className="space-y-2">
                  <Label htmlFor="zip-code">Zip Code *</Label>
                  <div className="relative">
                    <Select 
                      value={formData.zipCode} 
                      onValueChange={(value) => onFormChange('zipCode', value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select zip code" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="33139">33139 (Miami Beach)</SelectItem>
                        <SelectItem value="10001">10001 (Manhattan)</SelectItem>
                        <SelectItem value="10002">10002 (Manhattan)</SelectItem>
                        <SelectItem value="90210">90210 (Beverly Hills)</SelectItem>
                        <SelectItem value="60601">60601 (Chicago)</SelectItem>
                        <SelectItem value="94102">94102 (San Francisco)</SelectItem>
                        <SelectItem value="02101">02101 (Boston)</SelectItem>
                        <SelectItem value="78701">78701 (Austin)</SelectItem>
                        <SelectItem value="98102">98102 (Seattle)</SelectItem>
                        <SelectItem value="80202">80202 (Denver)</SelectItem>
                        <SelectItem value="37203">37203 (Nashville)</SelectItem>
                      </SelectContent>
                    </Select>
                    {zipCodeValidation.isValidating && (
                      <div className="absolute right-8 top-1/2 transform -translate-y-1/2">
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                      </div>
                    )}
                  </div>

                  {zipCodeValidation.message && (
                    <div className={`flex items-center gap-2 text-sm ${
                      zipCodeValidation.isValid 
                        ? 'text-green-600' 
                        : 'text-red-600'
                    }`}>
                      {zipCodeValidation.isValid ? (
                        <CheckCircle className="h-4 w-4" />
                      ) : (
                        <XCircle className="h-4 w-4" />
                      )}
                      {zipCodeValidation.message}
                    </div>
                  )}

                  {formData.zipCode.trim() === '' && (
                    <p className="text-sm text-gray-500">Please select a zip code</p>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-center gap-4 pt-8">
            <Button
              variant="outline"
              onClick={onBack}
              className="flex items-center gap-2"
            >
              <ChevronRight className="h-4 w-4 rotate-180" />
              Back
            </Button>
            <Button
              className="bg-[#004182] hover:bg-[#003366] text-white flex items-center gap-2"
              onClick={onContinue}
              disabled={!isValid}
            >
              Continue
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>

          {/* Progress Info */}
          <div className="mt-8 p-4 bg-blue-50 rounded-lg">
            <div className="flex items-center justify-center gap-2 text-blue-700">
              <Info className="h-4 w-4" />
              <span className="text-sm font-medium">
                All fields are required to proceed to the next step
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PropertyTitleLocationForm;