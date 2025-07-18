import { useMemo } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import PropertyCard from "./PropertyCard";

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

interface PropertyTabsProps {
  properties: Property[];
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onViewProperty: (property: Property) => void;
  onDeleteProperty: (id: number) => void;
}

export const PropertyTabs: React.FC<PropertyTabsProps> = ({
  properties,
  searchQuery,
  onSearchChange,
  onViewProperty,
  onDeleteProperty
}) => {
  const filteredProperties = useMemo(() => {
    const filtered = properties.filter(property => 
      property.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      property.address.toLowerCase().includes(searchQuery.toLowerCase()) ||
      property.ownerName.toLowerCase().includes(searchQuery.toLowerCase())
    );
    
    return {
      live: filtered.filter(p => p.status === 'live'),
      pending: filtered.filter(p => p.status === 'pending'),
      rejected: filtered.filter(p => p.status === 'rejected')
    };
  }, [properties, searchQuery]);

  const getTabCounts = () => {
    return {
      live: properties.filter(p => p.status === 'live').length,
      pending: properties.filter(p => p.status === 'pending').length,
      rejected: properties.filter(p => p.status === 'rejected').length
    };
  };

  const tabCounts = getTabCounts();

  const renderEmptyState = (status: string) => (
    <div className="text-center py-12">
      <div className="bg-gray-50 rounded-lg p-8 max-w-md mx-auto">
        <p className="text-gray-600 text-lg mb-2">No {status} properties found</p>
        <p className="text-gray-500 text-sm">
          {searchQuery ? `No properties match "${searchQuery}"` : `No ${status} properties to display`}
        </p>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
        <Input
          placeholder="Search properties by name, location, or owner..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Tabs */}
      <Tabs defaultValue="live" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="live" className="relative">
            Live Properties
            {tabCounts.live > 0 && (
              <Badge className="ml-2 bg-green-100 text-green-800 border-green-200">
                {tabCounts.live}
              </Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="pending" className="relative">
            Pending Properties
            {tabCounts.pending > 0 && (
              <Badge className="ml-2 bg-yellow-100 text-yellow-800 border-yellow-200">
                {tabCounts.pending}
              </Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="rejected" className="relative">
            Rejected Properties
            {tabCounts.rejected > 0 && (
              <Badge className="ml-2 bg-red-100 text-red-800 border-red-200">
                {tabCounts.rejected}
              </Badge>
            )}
          </TabsTrigger>
        </TabsList>

        {/* Live Properties Tab */}
        <TabsContent value="live" className="space-y-4">
          {filteredProperties.live.length === 0 ? (
            renderEmptyState('live')
          ) : (
            <div className="space-y-4">
              {filteredProperties.live.map((property) => (
                <PropertyCard
                  key={property.id}
                  property={property}
                  onView={onViewProperty}
                  onDelete={onDeleteProperty}
                />
              ))}
            </div>
          )}
        </TabsContent>

        {/* Pending Properties Tab */}
        <TabsContent value="pending" className="space-y-4">
          {filteredProperties.pending.length === 0 ? (
            renderEmptyState('pending')
          ) : (
            <div className="space-y-4">
              {filteredProperties.pending.map((property) => (
                <PropertyCard
                  key={property.id}
                  property={property}
                  onView={onViewProperty}
                  onDelete={onDeleteProperty}
                />
              ))}
            </div>
          )}
        </TabsContent>

        {/* Rejected Properties Tab */}
        <TabsContent value="rejected" className="space-y-4">
          {filteredProperties.rejected.length === 0 ? (
            renderEmptyState('rejected')
          ) : (
            <div className="space-y-4">
              {filteredProperties.rejected.map((property) => (
                <PropertyCard
                  key={property.id}
                  property={property}
                  onView={onViewProperty}
                  onDelete={onDeleteProperty}
                />
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default PropertyTabs;