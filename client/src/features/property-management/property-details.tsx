import { useQuery } from "@tanstack/react-query";
import { useRoute } from "wouter";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  ChevronLeft,
  MapPin,
  User,
  Coins,
  DollarSign,
  TrendingUp,
  Calendar,
  Activity,
  Clock
} from "lucide-react";
import { Link } from "wouter";

interface PropertyDetails {
  id: number;
  name: string;
  address: string;
  ownerName: string;
  tokenName: string;
  tokenSymbol: string;
  tokenContractAddress: string;
  totalTokens: number;
  tokensSold: number;
  tokenPrice: number;
  expectedROI: number;
  investmentStartDate: string;
  investmentEndDate: string;
  tokenSaleStatus: string;
  lastUpdated: string;
  description?: string;
  imageUrl?: string;
}

export default function PropertyDetails() {
  const [match, params] = useRoute("/property-details/:id");
  const propertyId = params?.id ? parseInt(params.id) : null;

  const { data: property, isLoading, error } = useQuery({
    queryKey: ["/api/tokenization/properties", propertyId],
    queryFn: async () => {
      if (!propertyId) throw new Error("Property ID is required");
      const response = await fetch(`/api/tokenization/properties/${propertyId}`);
      if (!response.ok) throw new Error("Failed to fetch property details");
      const result = await response.json();
      return result.data;
    },
    enabled: !!propertyId,
  });

  const getTokenStatusBadge = (status: string) => {
    const statusConfig = {
      active: { className: "bg-green-100 text-green-800", label: "Live" },
      paused: { className: "bg-yellow-100 text-yellow-800", label: "Paused" },
      frozen: { className: "bg-red-100 text-red-800", label: "Frozen" },
      completed: { className: "bg-blue-100 text-blue-800", label: "Sold Out" },
      not_started: { className: "bg-gray-100 text-gray-800", label: "Closed" }
    };
    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.not_started;
    return <Badge variant="secondary" className={config.className}>{config.label}</Badge>;
  };

  const calculateProgress = () => {
    if (!property || property.totalTokens === 0) return 0;
    return Math.round((property.tokensSold / property.totalTokens) * 100);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (isLoading) {
    return (
      <div className="p-6 w-full">
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-1/4 mb-6"></div>
          <div className="h-8 bg-gray-200 rounded w-1/2 mb-4"></div>
          <div className="space-y-4">
            <div className="h-4 bg-gray-200 rounded"></div>
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !property) {
    return (
      <div className="p-6 w-full">
        <nav className="flex items-center space-x-2 text-sm text-gray-600 mb-6">
          <Link href="/admin-dashboard" className="hover:text-blue-600">Tokenization Dashboard</Link>
          <span>→</span>
          <span className="text-gray-900">Tokenization Properties Details</span>
        </nav>
        
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <h3 className="text-lg font-semibold text-red-800 mb-2">Error Loading Property Details</h3>
          <p className="text-red-600 mb-4">Failed to load property information. Please try again.</p>
          <Link href="/admin-dashboard">
            <Button variant="outline" size="sm">
              <ChevronLeft className="w-4 h-4 mr-2" />
              Back to Dashboard
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  const progress = calculateProgress();

  return (
    <div className="p-6 w-full max-w-6xl mx-auto">
      {/* Breadcrumb Navigation */}
      <nav className="flex items-center space-x-2 text-sm text-gray-600 mb-6">
        <Link href="/admin-dashboard" className="hover:text-blue-600 transition-colors">
          Tokenization Dashboard
        </Link>
        <span>→</span>
        <span className="text-gray-900">Tokenization Properties Details</span>
      </nav>

      {/* Header with Back Button */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{property.name}</h1>
          <p className="text-gray-600 mt-1">Detailed view of tokenized property information</p>
        </div>
        <Link href="/admin-dashboard">
          <Button variant="outline" size="sm">
            <ChevronLeft className="w-4 h-4 mr-2" />
            Back to Dashboard
          </Button>
        </Link>
      </div>

      {/* Property Details Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Main Property Information */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Basic Property Info */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <MapPin className="w-5 h-5 mr-2 text-blue-600" />
                Property Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-600">Property Title</label>
                  <p className="text-lg font-semibold text-gray-900">{property.name}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Location</label>
                  <p className="text-gray-900">{property.address}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Owner Name</label>
                  <div className="flex items-center">
                    <User className="w-4 h-4 mr-2 text-gray-500" />
                    <p className="text-gray-900">{property.ownerName}</p>
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Last Updated</label>
                  <div className="flex items-center">
                    <Clock className="w-4 h-4 mr-2 text-gray-500" />
                    <p className="text-gray-900">{formatDate(property.lastUpdated)}</p>
                  </div>
                </div>
              </div>
              {property.description && (
                <div>
                  <label className="text-sm font-medium text-gray-600">Description</label>
                  <p className="text-gray-900 mt-1">{property.description}</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Token Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Coins className="w-5 h-5 mr-2 text-blue-600" />
                Token Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-600">Token Name</label>
                  <p className="text-lg font-semibold text-gray-900">{property.tokenName}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Token Symbol</label>
                  <p className="text-gray-900 font-mono bg-gray-100 px-2 py-1 rounded inline-block">
                    {property.tokenSymbol}
                  </p>
                </div>
                <div className="md:col-span-2">
                  <label className="text-sm font-medium text-gray-600">Token Contract Address</label>
                  <p className="text-gray-900 font-mono bg-gray-100 px-3 py-2 rounded mt-1 break-all">
                    {property.tokenContractAddress}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Token Count</label>
                  <p className="text-lg font-semibold text-gray-900">
                    {property.totalTokens.toLocaleString()}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Token Price</label>
                  <div className="flex items-center">
                    <DollarSign className="w-4 h-4 mr-1 text-green-600" />
                    <p className="text-lg font-semibold text-gray-900">
                      {formatCurrency(property.tokenPrice)}
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Investment Duration */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Calendar className="w-5 h-5 mr-2 text-blue-600" />
                Investment Duration
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-600">Start Date</label>
                  <p className="text-gray-900">{formatDate(property.investmentStartDate)}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">End Date</label>
                  <p className="text-gray-900">{formatDate(property.investmentEndDate)}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar - Status and Progress */}
        <div className="space-y-6">
          
          {/* Token Status */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Activity className="w-5 h-5 mr-2 text-blue-600" />
                Token Status
              </CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              {getTokenStatusBadge(property.tokenSaleStatus)}
            </CardContent>
          </Card>

          {/* ROI Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <TrendingUp className="w-5 h-5 mr-2 text-blue-600" />
                Expected ROI
              </CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <p className="text-3xl font-bold text-green-600">
                {property.expectedROI}%
              </p>
            </CardContent>
          </Card>

          {/* Investment Progress */}
          <Card>
            <CardHeader>
              <CardTitle>Investment Progress</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-center">
                <p className="text-2xl font-bold text-blue-600">{progress}%</p>
                <p className="text-sm text-gray-600">tokens sold</p>
              </div>
              <Progress value={progress} className="h-3" />
              <div className="flex justify-between text-sm text-gray-600">
                <span>{property.tokensSold.toLocaleString()} sold</span>
                <span>{property.totalTokens.toLocaleString()} total</span>
              </div>
              <div className="text-center pt-2">
                <p className="text-sm text-gray-600">
                  Total Value: <span className="font-semibold text-gray-900">
                    {formatCurrency(property.totalTokens * property.tokenPrice)}
                  </span>
                </p>
                <p className="text-sm text-gray-600">
                  Raised: <span className="font-semibold text-green-600">
                    {formatCurrency(property.tokensSold * property.tokenPrice)}
                  </span>
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}