
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Building, Home, CheckCircle, ChevronRight, HelpCircle, Info } from "lucide-react";
import Breadcrumb from "../shared/Breadcrumb";


interface CategorySelectionProps {
  selectedCategory: 'commercial' | 'residential' | null;
  onCategorySelect: (category: 'commercial' | 'residential') => void;
  onContinue: () => void;
  onBack: () => void;
  formProgress: number;
}

export const CategorySelection: React.FC<CategorySelectionProps> = ({
  selectedCategory,
  onCategorySelect,
  onContinue,
  onBack,
  formProgress
}) => {
  const breadcrumbItems = [
    { label: "Add New Property", isActive: true }
  ];

  return (
    <div className="space-y-6">
      <Breadcrumb items={breadcrumbItems} onBack={onBack} />

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="text-center space-y-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-3">Select Property Category</h1>
            <p className="text-gray-600 text-lg">Choose the type of property you want to add to the platform</p>
          </div>

          <div className="flex flex-col md:flex-row gap-6 justify-center items-center max-w-4xl mx-auto">
            <TooltipProvider>
              {/* Commercial Property Card */}
              <Tooltip>
                <TooltipTrigger asChild>
                  <div 
                    className={`relative cursor-pointer rounded-xl border-2 p-8 transition-all duration-200 hover:shadow-lg ${
                      selectedCategory === 'commercial' 
                        ? 'border-[#004182] bg-blue-50 shadow-md' 
                        : 'border-gray-200 bg-white hover:border-gray-300'
                    }`}
                    onClick={() => onCategorySelect('commercial')}
                  >
                    {selectedCategory === 'commercial' && (
                      <div className="absolute top-4 right-4">
                        <CheckCircle className="h-6 w-6 text-[#004182]" />
                      </div>
                    )}
                    <div className="text-center space-y-4">
                      <div className="flex justify-center">
                        <Building className="h-16 w-16 text-[#004182]" />
                      </div>
                      <h3 className="text-xl font-bold text-gray-900">Add Commercial Property</h3>
                      <p className="text-gray-600">List your commercial space</p>
                      <p className="text-sm text-gray-500">Perfect for office buildings, retail spaces, warehouses, and other commercial real estate</p>
                    </div>
                  </div>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Select this for office buildings, retail spaces, and commercial properties</p>
                </TooltipContent>
              </Tooltip>

              {/* Residential Property Card */}
              <Tooltip>
                <TooltipTrigger asChild>
                  <div 
                    className={`relative cursor-pointer rounded-xl border-2 p-8 transition-all duration-200 hover:shadow-lg ${
                      selectedCategory === 'residential' 
                        ? 'border-[#004182] bg-blue-50 shadow-md' 
                        : 'border-gray-200 bg-white hover:border-gray-300'
                    }`}
                    onClick={() => onCategorySelect('residential')}
                  >
                    {selectedCategory === 'residential' && (
                      <div className="absolute top-4 right-4">
                        <CheckCircle className="h-6 w-6 text-[#004182]" />
                      </div>
                    )}
                    <div className="text-center space-y-4">
                      <div className="flex justify-center">
                        <Home className="h-16 w-16 text-[#004182]" />
                      </div>
                      <h3 className="text-xl font-bold text-gray-900">Add Residential Property</h3>
                      <p className="text-gray-600">List your residential property</p>
                      <p className="text-sm text-gray-500">Perfect for houses, apartments, condos, and other residential real estate</p>
                    </div>
                  </div>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Select this for houses, apartments, condos, and residential properties</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>

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
              disabled={!selectedCategory}
            >
              Continue
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>

          <div className="mt-8 p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center justify-center gap-2 text-gray-600">
              <HelpCircle className="h-4 w-4" />
              <span className="text-sm">Need help choosing? Contact support for assistance</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CategorySelection;
