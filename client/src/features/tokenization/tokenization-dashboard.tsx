import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useToast } from "@/shared/hooks/use-toast";
import { apiRequest } from "@/shared/lib/queryClient";
import {
  Search,
  Filter,
  ArrowUpDown,
  Eye,
  Snowflake,
  Shield,
  Ban,
  AlertTriangle,
  RefreshCw,
  ChevronLeft,
  Building2,
  TrendingUp,
  Users,
  Clock,
  MapPin,
  User,
  DollarSign,
  Calendar,
  Coins
} from "lucide-react";

// Type definitions based on enhanced schema
interface TokenizedProperty {
  id: number;
  name: string;
  address: string;
  ownerName: string;
  thumbnail?: string;
  tokenName?: string;
  tokenSymbol?: string;
  tokenContractAddress?: string;
  totalTokens: number;
  tokensSold: number;
  tokenPrice: number;
  tokenizationStatus: "completed" | "not_started" | "in_progress" | "failed";
  tokenSaleStatus: "active" | "paused" | "frozen" | "completed" | "not_started";
  secondaryTradingStatus: "enabled" | "frozen" | "disabled";
  mintingStatus: "enabled" | "disabled";
  saleStartDate?: string;
  saleEndDate?: string;
  lastActionAt?: string;
  lastActionBy?: number;
  createdAt: string;
  updatedAt: string;
}

interface ActionModalState {
  isOpen: boolean;
  action: string;
  property: TokenizedProperty | null;
  reason: string;
}

export default function TokenizationDashboard() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  // All state management at the top
  const [selectedProperty, setSelectedProperty] = useState<TokenizedProperty | null>(null);
  const [showPropertyDetails, setShowPropertyDetails] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [dateFilter, setDateFilter] = useState("all");
  const [sortBy, setSortBy] = useState("created_date");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(10);
  const [actionModal, setActionModal] = useState<ActionModalState>({
    isOpen: false,
    action: "",
    property: null,
    reason: ""
  });

  // Fetch tokenized properties
  const { data: properties = [], isLoading, error, refetch } = useQuery({
    queryKey: ["/api/tokenization/properties", statusFilter, dateFilter, sortBy, sortOrder, currentPage, pageSize],
    queryFn: async () => {
      const params = new URLSearchParams({
        status: statusFilter,
        dateFilter,
        sortBy,
        sortOrder,
        page: currentPage.toString(),
        limit: pageSize.toString()
      });
      const response = await fetch(`/api/tokenization/properties?${params}`);
      if (!response.ok) throw new Error("Failed to fetch properties");
      const result = await response.json();
      return result.data || [];
    },
  });

  // Action mutations
  const actionMutation = useMutation({
    mutationFn: async ({ propertyId, action, reason }: { propertyId: number; action: string; reason?: string }) => {
      return apiRequest(`/api/tokenization/properties/${propertyId}/actions`, {
        method: "POST",
        body: { action, reason }
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/tokenization/properties"] });
      toast({ title: "Action completed successfully" });
      setActionModal({ isOpen: false, action: "", property: null, reason: "" });
    },
    onError: (error: any) => {
      toast({ 
        title: "Action failed", 
        description: error.message || "An error occurred",
        variant: "destructive" 
      });
    }
  });
  
  const handlePropertySelect = (property: TokenizedProperty) => {
    setSelectedProperty(property);
    setShowPropertyDetails(true);
  };

  const handleBackToPropertyList = () => {
    setSelectedProperty(null);
    setShowPropertyDetails(false);
  };

  // Render property details modal view
  if (showPropertyDetails && selectedProperty) {
    return (
      <div className="space-y-6">
        {/* Breadcrumb */}
        <div className="flex items-center space-x-2 text-gray-600">
          <button 
            onClick={handleBackToPropertyList}
            className="hover:text-blue-600 transition-colors"
          >
            Tokenization Dashboard
          </button>
          <ChevronLeft className="h-4 w-4 transform rotate-180" />
          <span className="text-gray-900 font-medium">Tokenization Properties Details</span>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Property Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* Property Information */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Property Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <p className="text-sm font-medium text-gray-600">Property Title</p>
                  <p className="text-gray-900">{selectedProperty.name}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-medium text-gray-600">Location</p>
                  <div className="flex items-center text-gray-900">
                    <MapPin className="w-4 h-4 mr-1 text-gray-500" />
                    {selectedProperty.address}
                  </div>
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-medium text-gray-600">Owner Name</p>
                  <div className="flex items-center text-gray-900">
                    <User className="w-4 h-4 mr-1 text-gray-500" />
                    {selectedProperty.ownerName || "Unknown Owner"}
                  </div>
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-medium text-gray-600">Last Updated</p>
                  <div className="flex items-center text-gray-900">
                    <Clock className="w-4 h-4 mr-1 text-gray-500" />
                    {new Date(selectedProperty.updatedAt).toLocaleDateString()}
                  </div>
                </div>
              </div>
            </div>

            {/* Token Details */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Token Details</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <p className="text-sm font-medium text-gray-600">Token Name</p>
                  <p className="text-gray-900">{selectedProperty.tokenName || `${selectedProperty.name} Token`}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-medium text-gray-600">Token Symbol</p>
                  <p className="text-gray-900">{selectedProperty.tokenSymbol || selectedProperty.name.substring(0, 3).toUpperCase()}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-medium text-gray-600">Token Contract Address</p>
                  <p className="text-gray-900 font-mono text-sm break-all">
                    {selectedProperty.tokenContractAddress || "0x" + Math.random().toString(16).substring(2, 42)}
                  </p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-medium text-gray-600">Token Count</p>
                  <div className="flex items-center text-gray-900">
                    <Coins className="w-4 h-4 mr-1 text-gray-500" />
                    {selectedProperty.totalTokens?.toLocaleString()} tokens
                  </div>
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-medium text-gray-600">Token Price</p>
                  <div className="flex items-center text-gray-900">
                    <DollarSign className="w-4 h-4 mr-1 text-gray-500" />
                    ${selectedProperty.tokenPrice?.toFixed(2)} USDT
                  </div>
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-medium text-gray-600">ROI%</p>
                  <div className="flex items-center text-green-600">
                    <TrendingUp className="w-4 h-4 mr-1" />
                    8.5% Expected ROI
                  </div>
                </div>
              </div>
            </div>

            {/* Investment Duration */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Investment Duration</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <p className="text-sm font-medium text-gray-600">Start Date</p>
                  <div className="flex items-center text-gray-900">
                    <Calendar className="w-4 h-4 mr-1 text-gray-500" />
                    {new Date(selectedProperty.createdAt).toLocaleDateString()}
                  </div>
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-medium text-gray-600">End Date</p>
                  <div className="flex items-center text-gray-900">
                    <Calendar className="w-4 h-4 mr-1 text-gray-500" />
                    {new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toLocaleDateString()}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Status and Progress */}
          <div className="space-y-6">
            {/* Token Status */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Token Status</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-600">Sale Status</span>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    selectedProperty.tokenSaleStatus === 'frozen' ? 'bg-red-100 text-red-800' :
                    selectedProperty.tokenSaleStatus === 'active' ? 'bg-green-100 text-green-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {selectedProperty.tokenSaleStatus === 'frozen' ? 'Frozen' :
                     selectedProperty.tokenSaleStatus === 'active' ? 'Live' : 'Closed'}
                  </span>
                </div>
              </div>
            </div>

            {/* Expected ROI */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Expected ROI</h3>
              <div className="text-center">
                <div className="text-3xl font-bold text-green-600">8.5%</div>
                <p className="text-sm text-gray-600 mt-1">Annual Return</p>
              </div>
            </div>

            {/* Investment Progress */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Investment Progress</h3>
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Tokens Sold</span>
                  <span className="font-medium text-gray-900">
                    {selectedProperty.tokensSold || 0} / {selectedProperty.totalTokens}
                  </span>
                </div>
                <Progress 
                  value={selectedProperty.totalTokens ? ((selectedProperty.tokensSold || 0) / selectedProperty.totalTokens) * 100 : 0} 
                  className="h-2"
                />
                <div className="text-center">
                  <span className="text-2xl font-bold text-blue-600">
                    {selectedProperty.totalTokens ? 
                      (((selectedProperty.tokensSold || 0) / selectedProperty.totalTokens) * 100).toFixed(1) : 0}%
                  </span>
                  <p className="text-sm text-gray-600">Complete</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Filter and sort properties
  const filteredProperties = properties.filter((property: TokenizedProperty) => {
    const matchesSearch = property.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         property.ownerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         property.tokenName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         property.tokenSymbol?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         property.address.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === "all" || property.tokenizationStatus === statusFilter;
    
    const matchesDate = dateFilter === "all" || (() => {
      const propertyDate = new Date(property.createdAt);
      const now = new Date();
      switch (dateFilter) {
        case "today":
          return propertyDate.toDateString() === now.toDateString();
        case "week":
          const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
          return propertyDate >= weekAgo;
        case "month":
          const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
          return propertyDate >= monthAgo;
        default:
          return true;
      }
    })();

    return matchesSearch && matchesStatus && matchesDate;
  });

  // Pagination logic
  const totalPages = Math.ceil(filteredProperties.length / pageSize);
  const startIndex = (currentPage - 1) * pageSize;
  const paginatedProperties = filteredProperties.slice(startIndex, startIndex + pageSize);

  // Helper functions
  const getStatusBadge = (status: string) => {
    const statusConfig = {
      completed: { variant: "default" as const, className: "bg-green-100 text-green-800", label: "Completed" },
      in_progress: { variant: "secondary" as const, className: "bg-blue-100 text-blue-800", label: "In Progress" },
      not_started: { variant: "secondary" as const, className: "bg-gray-100 text-gray-800", label: "Not Started" },
      failed: { variant: "destructive" as const, className: "bg-red-100 text-red-800", label: "Failed" }
    };
    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.not_started;
    return <Badge variant={config.variant} className={config.className}>{config.label}</Badge>;
  };

  const getTokenSaleStatusBadge = (status: string) => {
    const statusConfig = {
      active: { className: "bg-green-100 text-green-800", label: "Active" },
      paused: { className: "bg-yellow-100 text-yellow-800", label: "Paused" },
      frozen: { className: "bg-red-100 text-red-800", label: "Frozen" },
      completed: { className: "bg-blue-100 text-blue-800", label: "Completed" },
      not_started: { className: "bg-gray-100 text-gray-800", label: "Not Started" }
    };
    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.not_started;
    return <Badge variant="secondary" className={config.className}>{config.label}</Badge>;
  };

  const calculateProgress = (property: TokenizedProperty) => {
    if (property.totalTokens === 0) return 0;
    return Math.round((property.tokensSold / property.totalTokens) * 100);
  };

  const isActionAvailable = (property: TokenizedProperty, action: string) => {
    switch (action) {
      case "freeze_token_sale":
        return property.tokenSaleStatus === "active";
      case "freeze_secondary_trading":
        return property.secondaryTradingStatus === "enabled";
      case "disable_minting":
        return property.mintingStatus === "enabled" && 
               property.tokenizationStatus === "completed" &&
               property.tokenSaleStatus === "active" &&
               property.tokensSold > 0;
      default:
        return true;
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const handleAction = (property: TokenizedProperty, action: string) => {
    setActionModal({
      isOpen: true,
      action,
      property,
      reason: ""
    });
  };

  const handleActionSubmit = async () => {
    if (!actionModal.property || !actionModal.reason.trim()) {
      toast({
        title: "Error",
        description: "Please provide a reason for this action",
        variant: "destructive"
      });
      return;
    }

    actionMutation.mutate({
      propertyId: actionModal.property.id,
      action: actionModal.action,
      reason: actionModal.reason
    });
  };

  // Main dashboard render
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Tokenization Dashboard</h1>
          <p className="text-gray-600">Manage tokenized properties and their lifecycle</p>
        </div>
        <Button 
          onClick={() => refetch()} 
          variant="outline" 
          size="sm"
          className="flex items-center gap-2"
        >
          <RefreshCw className="w-4 h-4" />
          Refresh
        </Button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Properties</CardTitle>
            <Building2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{properties.length}</div>
            <p className="text-xs text-muted-foreground">Active tokenization</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Token Value</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatCurrency(properties.reduce((acc, p) => acc + (p.totalTokens * p.tokenPrice), 0))}
            </div>
            <p className="text-xs text-muted-foreground">Combined value</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tokens Sold</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {properties.reduce((acc, p) => acc + p.tokensSold, 0).toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">Total circulation</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Sales</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {properties.filter(p => p.tokenSaleStatus === 'active').length}
            </div>
            <p className="text-xs text-muted-foreground">Currently selling</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Search */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Search properties, owners, tokens..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>
        
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-full md:w-[200px]">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Statuses</SelectItem>
            <SelectItem value="completed">Completed</SelectItem>
            <SelectItem value="in_progress">In Progress</SelectItem>
            <SelectItem value="not_started">Not Started</SelectItem>
            <SelectItem value="failed">Failed</SelectItem>
          </SelectContent>
        </Select>
        
        <Select value={dateFilter} onValueChange={setDateFilter}>
          <SelectTrigger className="w-full md:w-[200px]">
            <SelectValue placeholder="Filter by date" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Time</SelectItem>
            <SelectItem value="today">Today</SelectItem>
            <SelectItem value="week">This Week</SelectItem>
            <SelectItem value="month">This Month</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Properties Table */}
      <Card>
        <CardHeader>
          <CardTitle>Tokenized Properties</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex items-center justify-center h-32">
              <RefreshCw className="w-8 h-8 animate-spin text-gray-400" />
            </div>
          ) : error ? (
            <div className="text-center text-red-600 py-8">
              Failed to load properties. Please try again.
            </div>
          ) : paginatedProperties.length === 0 ? (
            <div className="text-center py-8">
              <Building2 className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No properties found</h3>
              <p className="text-gray-600">Try adjusting your search or filter criteria.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Property
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Token Details
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status & Progress
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Financial
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {paginatedProperties.map((property) => (
                    <tr key={property.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-start space-x-3">
                          <div className="w-16 h-16 bg-gray-200 rounded-lg flex-shrink-0 overflow-hidden">
                            {property.thumbnail ? (
                              <img 
                                src={property.thumbnail} 
                                alt={property.name}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center">
                                <Building2 className="w-6 h-6 text-gray-400" />
                              </div>
                            )}
                          </div>
                          <div className="flex-1">
                            <div className="text-sm font-medium text-gray-900">{property.name}</div>
                            <div className="text-sm text-gray-500">{property.address}</div>
                            <div className="text-xs text-gray-500 mt-1">Owner: {property.ownerName}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="space-y-1">
                          <div className="text-sm font-medium text-gray-900">
                            {property.tokenName || `${property.name} Token`}
                          </div>
                          <div className="text-xs text-gray-500">
                            Symbol: {property.tokenSymbol || 'N/A'}
                          </div>
                          <div className="text-xs text-gray-500">
                            Total: {property.totalTokens.toLocaleString()} tokens
                          </div>
                          <div className="text-xs text-gray-500">
                            Price: {formatCurrency(property.tokenPrice)} per token
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="space-y-2">
                          {getStatusBadge(property.tokenizationStatus)}
                          {getTokenSaleStatusBadge(property.tokenSaleStatus)}
                          <div className="w-full">
                            <div className="flex justify-between text-xs text-gray-600 mb-1">
                              <span>Progress</span>
                              <span>{calculateProgress(property)}%</span>
                            </div>
                            <Progress value={calculateProgress(property)} className="h-2" />
                            <div className="text-xs text-gray-500 mt-1">
                              {property.tokensSold.toLocaleString()} / {property.totalTokens.toLocaleString()} sold
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="space-y-1">
                          <div className="text-sm font-medium text-gray-900">
                            {formatCurrency(property.totalTokens * property.tokenPrice)}
                          </div>
                          <div className="text-xs text-gray-500">Total Value</div>
                          <div className="text-sm text-green-600 font-medium">
                            {formatCurrency(property.tokensSold * property.tokenPrice)}
                          </div>
                          <div className="text-xs text-gray-500">Raised</div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex flex-wrap gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handlePropertySelect(property)}
                            className="flex items-center gap-1"
                          >
                            <Eye className="w-3 h-3" />
                            View
                          </Button>
                          
                          {isActionAvailable(property, "freeze_token_sale") && (
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleAction(property, "freeze_token_sale")}
                              className="flex items-center gap-1 text-orange-600 hover:text-orange-700"
                            >
                              <Snowflake className="w-3 h-3" />
                              Freeze Sale
                            </Button>
                          )}
                          
                          {isActionAvailable(property, "freeze_secondary_trading") && (
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleAction(property, "freeze_secondary_trading")}
                              className="flex items-center gap-1 text-blue-600 hover:text-blue-700"
                            >
                              <Shield className="w-3 h-3" />
                              Freeze Trading
                            </Button>
                          )}
                          
                          {isActionAvailable(property, "disable_minting") && (
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleAction(property, "disable_minting")}
                              className="flex items-center gap-1 text-red-600 hover:text-red-700"
                            >
                              <Ban className="w-3 h-3" />
                              Disable Minting
                            </Button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Action Confirmation Modal */}
      <Dialog open={actionModal.isOpen} onOpenChange={(open) => setActionModal(prev => ({ ...prev, isOpen: open }))}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              {actionModal.action === 'freeze_token_sale' && <Snowflake className="h-5 w-5 text-orange-600" />}
              {actionModal.action === 'freeze_secondary_trading' && <Shield className="h-5 w-5 text-blue-600" />}
              {actionModal.action === 'disable_minting' && <Ban className="h-5 w-5 text-red-600" />}
              Confirm Action
            </DialogTitle>
            <DialogDescription>
              {actionModal.action === 'freeze_token_sale' && 
                'This will immediately halt all primary token sales for this property. Users will not be able to purchase tokens until unfrozen.'}
              {actionModal.action === 'freeze_secondary_trading' && 
                'This will immediately halt all secondary trading for this property. Users will not be able to trade tokens on the marketplace until unfrozen.'}
              {actionModal.action === 'disable_minting' && 
                'This will PERMANENTLY disable token minting for this property. No additional tokens can ever be created. This action is IRREVERSIBLE.'}
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            {actionModal.action === 'disable_minting' && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-3 flex items-start gap-2">
                <AlertTriangle className="h-4 w-4 text-red-600 flex-shrink-0 mt-0.5" />
                <div className="text-sm text-red-800">
                  <strong>IRREVERSIBLE ACTION:</strong> Once minting is disabled, the token supply will be permanently locked at the current amount. This cannot be undone by any administrator.
                </div>
              </div>
            )}
            
            <div>
              <Label htmlFor="reason" className="text-sm font-medium">
                Reason for Action <span className="text-red-500">*</span>
              </Label>
              <Textarea
                id="reason"
                placeholder={
                  actionModal.action === 'freeze_token_sale' ? 
                    "Enter the reason for freezing token sales (e.g., regulatory review, security concern, etc.)" : 
                  actionModal.action === 'freeze_secondary_trading' ?
                    "Enter the reason for freezing secondary trading (e.g., market manipulation concern, compliance issue, etc.)" :
                  actionModal.action === 'disable_minting' ?
                    "Enter the reason for permanently disabling minting (e.g., token distribution complete, regulatory requirement, etc.)" :
                    "Provide a reason for this action..."
                }
                value={actionModal.reason}
                onChange={(e) => setActionModal(prev => ({ ...prev, reason: e.target.value }))}
                className="mt-1"
                rows={3}
              />
            </div>
            
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
              <p className="text-sm text-yellow-800">
                <strong>Warning:</strong> This action will be logged with your Admin ID and timestamp for audit purposes.
                {actionModal.action === 'freeze_token_sale' && ' The sale will remain frozen until manually unfrozen by an administrator.'}
                {actionModal.action === 'freeze_secondary_trading' && ' Trading will remain frozen until manually unfrozen by an administrator.'}
                {actionModal.action === 'disable_minting' && ' This action is IRREVERSIBLE and cannot be undone by any administrator.'}
              </p>
            </div>
          </div>
          
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setActionModal({ isOpen: false, action: "", property: null, reason: "" })}
            >
              Cancel
            </Button>
            <Button
              onClick={handleActionSubmit}
              disabled={!actionModal.reason.trim() || actionMutation.isPending}
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              {actionMutation.isPending ? "Processing..." : 
               actionModal.action === 'freeze_token_sale' ? "Freeze Token Sale" :
               actionModal.action === 'freeze_secondary_trading' ? "Freeze Secondary Trading" : 
               "Confirm Action"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}