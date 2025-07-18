import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogHeader, 
  DialogTitle,
  DialogFooter 
} from "@/components/ui/dialog";
import { 
  AlertDialog, 
  AlertDialogAction, 
  AlertDialogCancel, 
  AlertDialogContent, 
  AlertDialogDescription, 
  AlertDialogFooter, 
  AlertDialogHeader, 
  AlertDialogTitle 
} from "@/components/ui/alert-dialog";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { 
  Search, 
  Eye, 
  Snowflake, 
  Trash2, 
  FileText, 
  TrendingUp, 
  Activity, 
  DollarSign, 
  BarChart3,
  ArrowUpDown
} from "lucide-react";
import { useToast } from "@/shared/hooks/use-toast";

interface MarketplaceMetrics {
  totalListings: number;
  activeTrades: number;
  volumeTraded: number;
  averageTokenPrice: number;
}

interface MarketplaceListing {
  id: number;
  propertyId: number;
  tokenSymbol: string;
  tokenContractAddress: string;
  listedTokensCount: number;
  pricePerToken: number;
  status: "active" | "sold" | "cancelled" | "frozen";
  ownerWallet: string;
  lastTradedDate: string | null;
  createdAt: string;
  property: {
    id: number;
    name: string;
    address: string;
    secondaryTradingStatus?: 'enabled' | 'disabled' | 'frozen';
  };
}

interface TradeLog {
  id: number;
  listingId: number;
  tradeType: "buy" | "sell";
  tokensTraded: number;
  pricePerToken: number;
  totalAmount: number;
  buyerWallet: string | null;
  sellerWallet: string | null;
  transactionHash: string | null;
  createdAt: string;
}

export default function SecondaryMarketplace() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedListing, setSelectedListing] = useState<MarketplaceListing | null>(null);
  const [tradeLogsDialogOpen, setTradeLogsDialogOpen] = useState(false);
  const [freezeDialogOpen, setFreezeDialogOpen] = useState(false);
  const [removeDialogOpen, setRemoveDialogOpen] = useState(false);
  const [sortField, setSortField] = useState<keyof MarketplaceListing>("createdAt");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");

  // Fetch marketplace metrics
  const { data: metricsData } = useQuery({
    queryKey: ["/api/marketplace/metrics"],
    refetchInterval: 3 * 60 * 1000, // Refresh every 3 minutes
  });

  // Fetch marketplace listings
  const { data: listingsData, isLoading } = useQuery({
    queryKey: ["/api/marketplace/listings"],
    refetchInterval: 30 * 1000, // Refresh every 30 seconds for real-time updates
  });

  // Fetch trade logs for selected listing
  const { data: tradeLogsData } = useQuery({
    queryKey: ["/api/marketplace/listings", selectedListing?.id, "trade-logs"],
    enabled: !!selectedListing && tradeLogsDialogOpen,
  });

  // Freeze/unfreeze listing mutation
  const freezeMutation = useMutation({
    mutationFn: async (listingId: number) => {
      const response = await fetch(`/api/marketplace/listings/${listingId}/freeze`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
      });
      return response.json();
    },
    onSuccess: (data) => {
      toast({
        title: "Success",
        description: data.message,
      });
      queryClient.invalidateQueries({ queryKey: ["/api/marketplace/listings"] });
      queryClient.invalidateQueries({ queryKey: ["/api/marketplace/metrics"] });
      setFreezeDialogOpen(false);
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to update listing status",
        variant: "destructive",
      });
    },
  });

  // Remove listing mutation
  const removeMutation = useMutation({
    mutationFn: async (listingId: number) => {
      const response = await fetch(`/api/marketplace/listings/${listingId}`, {
        method: "DELETE",
      });
      return response.json();
    },
    onSuccess: (data) => {
      toast({
        title: "Success",
        description: data.message,
      });
      queryClient.invalidateQueries({ queryKey: ["/api/marketplace/listings"] });
      queryClient.invalidateQueries({ queryKey: ["/api/marketplace/metrics"] });
      setRemoveDialogOpen(false);
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to remove listing",
        variant: "destructive",
      });
    },
  });

  const metrics = metricsData?.data || {
    totalListings: 0,
    activeTrades: 0,
    volumeTraded: 0,
    averageTokenPrice: 0,
  };

  const listings: MarketplaceListing[] = listingsData?.data || [];

  // Filter listings based on search term
  const filteredListings = listings.filter(listing =>
    listing.property.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    listing.tokenSymbol.toLowerCase().includes(searchTerm.toLowerCase()) ||
    listing.tokenContractAddress.toLowerCase().includes(searchTerm.toLowerCase()) ||
    listing.ownerWallet.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Sort listings
  const sortedListings = [...filteredListings].sort((a, b) => {
    const aValue = a[sortField];
    const bValue = b[sortField];
    
    if (sortDirection === "asc") {
      return aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
    } else {
      return aValue > bValue ? -1 : aValue < bValue ? 1 : 0;
    }
  });

  const handleSort = (field: keyof MarketplaceListing) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("desc");
    }
  };

  const getStatusBadge = (listing: MarketplaceListing) => {
    const status = listing.status;
    const isPropertyFrozen = listing.property.secondaryTradingStatus === 'frozen';
    
    const statusConfig = {
      active: { variant: "default" as const, color: "bg-green-100 text-green-800" },
      sold: { variant: "secondary" as const, color: "bg-gray-100 text-gray-800" },
      cancelled: { variant: "destructive" as const, color: "bg-red-100 text-red-800" },
      frozen: { variant: "outline" as const, color: "bg-blue-100 text-blue-800" },
    };
    
    if (isPropertyFrozen) {
      return (
        <div className="flex flex-col gap-1">
          <Badge variant="outline" className="bg-red-100 text-red-800 border-red-300">
            Trading Frozen
          </Badge>
          <Badge variant={statusConfig[status as keyof typeof statusConfig]?.variant || "default"} 
                 className={statusConfig[status as keyof typeof statusConfig]?.color || "bg-green-100 text-green-800"}>
            {status.charAt(0).toUpperCase() + status.slice(1)}
          </Badge>
        </div>
      );
    }
    
    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.active;
    return (
      <Badge variant={config.variant} className={config.color}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    );
  };

  const canFreeze = (listing: MarketplaceListing) => {
    const isPropertyFrozen = listing.property.secondaryTradingStatus === 'frozen';
    return !isPropertyFrozen && listing.status !== "sold" && listing.status !== "cancelled";
  };

  const handleViewTradeLogs = (listing: MarketplaceListing) => {
    setSelectedListing(listing);
    setTradeLogsDialogOpen(true);
  };

  const handleFreeze = (listing: MarketplaceListing) => {
    setSelectedListing(listing);
    setFreezeDialogOpen(true);
  };

  const handleRemove = (listing: MarketplaceListing) => {
    setSelectedListing(listing);
    setRemoveDialogOpen(true);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="border-b border-gray-200 pb-4">
        <h1 className="text-2xl font-bold text-gray-900">Secondary Marketplace</h1>
        <p className="text-gray-600 mt-1">
          Manage tokenized property listings and track marketplace activity
        </p>
      </div>

      {/* Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Listings</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.totalListings.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              Properties available for resale
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Trades</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.activeTrades.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              Currently active listings
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Volume Traded</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${metrics.volumeTraded.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              Total trade volume (USD)
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Token Price</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${metrics.averageTokenPrice.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">
              Average price per token
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filters */}
      <div className="flex justify-between items-center">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="Search listings, tokens, contracts, or wallets..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 w-96"
          />
        </div>
        <div className="text-sm text-gray-500">
          {filteredListings.length} of {listings.length} listings
        </div>
      </div>

      {/* Listings Table */}
      <div className="bg-white shadow rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  <button
                    onClick={() => handleSort("property" as any)}
                    className="flex items-center gap-1 hover:text-gray-700"
                  >
                    Property Name
                    <ArrowUpDown className="h-3 w-3" />
                  </button>
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  <button
                    onClick={() => handleSort("tokenSymbol")}
                    className="flex items-center gap-1 hover:text-gray-700"
                  >
                    Token Symbol
                    <ArrowUpDown className="h-3 w-3" />
                  </button>
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Contract Address
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  <button
                    onClick={() => handleSort("listedTokensCount")}
                    className="flex items-center gap-1 hover:text-gray-700"
                  >
                    Listed Tokens
                    <ArrowUpDown className="h-3 w-3" />
                  </button>
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  <button
                    onClick={() => handleSort("pricePerToken")}
                    className="flex items-center gap-1 hover:text-gray-700"
                  >
                    Price per Token
                    <ArrowUpDown className="h-3 w-3" />
                  </button>
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  <button
                    onClick={() => handleSort("status")}
                    className="flex items-center gap-1 hover:text-gray-700"
                  >
                    Status
                    <ArrowUpDown className="h-3 w-3" />
                  </button>
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Owner Wallet
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  <button
                    onClick={() => handleSort("lastTradedDate")}
                    className="flex items-center gap-1 hover:text-gray-700"
                  >
                    Last Traded
                    <ArrowUpDown className="h-3 w-3" />
                  </button>
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {isLoading ? (
                <tr>
                  <td colSpan={9} className="px-6 py-12 text-center text-gray-500">
                    Loading marketplace listings...
                  </td>
                </tr>
              ) : sortedListings.length === 0 ? (
                <tr>
                  <td colSpan={9} className="px-6 py-12 text-center text-gray-500">
                    {searchTerm ? "No listings match your search." : "No marketplace listings found."}
                  </td>
                </tr>
              ) : (
                sortedListings.map((listing) => (
                  <tr key={listing.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {listing.property.name}
                      </div>
                      <div className="text-sm text-gray-500">
                        {listing.property.address}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {listing.tokenSymbol}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900 font-mono">
                        {listing.tokenContractAddress.slice(0, 10)}...{listing.tokenContractAddress.slice(-8)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {listing.listedTokensCount.toLocaleString()}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        ${Number(listing.pricePerToken).toFixed(2)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getStatusBadge(listing)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900 font-mono">
                        {listing.ownerWallet.slice(0, 6)}...{listing.ownerWallet.slice(-4)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {listing.lastTradedDate 
                          ? new Date(listing.lastTradedDate).toLocaleDateString()
                          : "Never"
                        }
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex items-center gap-2">
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleViewTradeLogs(listing)}
                              >
                                <FileText className="h-4 w-4" />
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>View Trade Logs</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>

                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleFreeze(listing)}
                                disabled={!canFreeze(listing)}
                                className={listing.status === "frozen" ? "text-blue-600" : ""}
                              >
                                <Snowflake className="h-4 w-4" />
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>
                                {listing.status === "frozen" ? "Unfreeze Resale" : "Freeze Resale"}
                                {!canFreeze(listing) && " (Cannot freeze sold/cancelled listings)"}
                              </p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>

                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleRemove(listing)}
                                className="text-red-600 hover:text-red-700"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>Remove Listing</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Trade Logs Dialog */}
      <Dialog open={tradeLogsDialogOpen} onOpenChange={setTradeLogsDialogOpen}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>Trade Logs - {selectedListing?.property.name}</DialogTitle>
            <DialogDescription>
              Transaction history for {selectedListing?.tokenSymbol} tokens
            </DialogDescription>
          </DialogHeader>
          <div className="max-h-96 overflow-y-auto">
            {tradeLogsData?.data?.length > 0 ? (
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Type</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Tokens</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Price</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Total</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Buyer</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Seller</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {tradeLogsData.data.map((trade: TradeLog) => (
                    <tr key={trade.id}>
                      <td className="px-4 py-2 text-sm text-gray-900">
                        {new Date(trade.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-4 py-2 text-sm">
                        <Badge variant={trade.tradeType === "buy" ? "default" : "secondary"}>
                          {trade.tradeType?.toUpperCase() || "UNKNOWN"}
                        </Badge>
                      </td>
                      <td className="px-4 py-2 text-sm text-gray-900">
                        {trade.tokensTraded?.toLocaleString() || "0"}
                      </td>
                      <td className="px-4 py-2 text-sm text-gray-900">
                        ${Number(trade.pricePerToken || 0).toFixed(2)}
                      </td>
                      <td className="px-4 py-2 text-sm text-gray-900">
                        ${Number(trade.totalAmount || 0).toFixed(2)}
                      </td>
                      <td className="px-4 py-2 text-sm text-gray-900 font-mono">
                        {trade.buyerWallet ? `${trade.buyerWallet.slice(0, 6)}...${trade.buyerWallet.slice(-4)}` : "-"}
                      </td>
                      <td className="px-4 py-2 text-sm text-gray-900 font-mono">
                        {trade.sellerWallet ? `${trade.sellerWallet.slice(0, 6)}...${trade.sellerWallet.slice(-4)}` : "-"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <div className="text-center py-8 text-gray-500">
                No trade history available for this listing.
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* Freeze Confirmation Dialog */}
      <AlertDialog open={freezeDialogOpen} onOpenChange={setFreezeDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {selectedListing?.status === "frozen" ? "Unfreeze" : "Freeze"} Listing
            </AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to {selectedListing?.status === "frozen" ? "unfreeze" : "freeze"} the listing for {selectedListing?.property.name}?
              {selectedListing?.status === "frozen" 
                ? " This will allow trading to resume." 
                : " This will prevent any new trades until unfrozen."
              }
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => selectedListing && freezeMutation.mutate(selectedListing.id)}
              disabled={freezeMutation.isPending}
            >
              {freezeMutation.isPending ? "Processing..." : "Confirm"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Remove Confirmation Dialog */}
      <AlertDialog open={removeDialogOpen} onOpenChange={setRemoveDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Remove Listing</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to permanently remove the listing for {selectedListing?.property.name}?
              This action cannot be undone and will remove all associated trade history.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => selectedListing && removeMutation.mutate(selectedListing.id)}
              disabled={removeMutation.isPending}
              className="bg-red-600 hover:bg-red-700"
            >
              {removeMutation.isPending ? "Removing..." : "Remove"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}