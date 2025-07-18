import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/shared/lib/queryClient";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, Eye, Check, X, Filter } from "lucide-react";

interface InvestorListing {
  id: number;
  propertyName: string;
  tokenId: string;
  sellerWallet: string;
  priceUSDT: number;
  dateListed: string;
  status: 'pending' | 'approved' | 'rejected';
  investorName: string;
  tokensListed: number;
  totalTokens: number;
  rejectionReason?: string;
}

// Sample data for investor listings
const sampleListings: InvestorListing[] = [
  {
    id: 1,
    propertyName: "Luxury Downtown Condo",
    tokenId: "TKN-001-LDC",
    sellerWallet: "0x742d35Cc6634C0532925a3b8D6c4b1F2c6Ef2d7A",
    priceUSDT: 2500,
    dateListed: "2024-06-28",
    status: "pending",
    investorName: "Alex Johnson",
    tokensListed: 50,
    totalTokens: 200
  },
  {
    id: 2,
    propertyName: "Beachfront Villa",
    tokenId: "TKN-002-BFV",
    sellerWallet: "0x8ba1f109551bD432803012645Hac189451c24d3",
    priceUSDT: 4800,
    dateListed: "2024-06-27",
    status: "approved",
    investorName: "Sarah Chen",
    tokensListed: 75,
    totalTokens: 300
  },
  {
    id: 3,
    propertyName: "Mountain Retreat",
    tokenId: "TKN-003-MR",
    sellerWallet: "0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0",
    priceUSDT: 1200,
    dateListed: "2024-06-26",
    status: "rejected",
    investorName: "Michael Brown",
    tokensListed: 25,
    totalTokens: 150,
    rejectionReason: "Incomplete documentation"
  },
  {
    id: 4,
    propertyName: "City Apartment",
    tokenId: "TKN-004-CA",
    sellerWallet: "0xdD2FD4581271e230360230F9337D5c0430BF44C0",
    priceUSDT: 1800,
    dateListed: "2024-06-25",
    status: "pending",
    investorName: "Emma Wilson",
    tokensListed: 40,
    totalTokens: 180
  },
  {
    id: 5,
    propertyName: "Suburban House",
    tokenId: "TKN-005-SH",
    sellerWallet: "0xbDA5747bFD65F08deb54cb465eB87D40e51B197E",
    priceUSDT: 3200,
    dateListed: "2024-06-24",
    status: "approved",
    investorName: "David Lee",
    tokensListed: 60,
    totalTokens: 240
  }
];

export default function InvestmentOversight() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [sortBy, setSortBy] = useState<string>("date");
  const [selectedListing, setSelectedListing] = useState<InvestorListing | null>(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [rejectionReason, setRejectionReason] = useState("");
  const queryClient = useQueryClient();

  // Fetch investor listings
  const { data: response, isLoading } = useQuery({
    queryKey: ["/api/investment-oversight/listings"],
  });

  const listings = response?.data || [];

  // Approve listing mutation
  const approveMutation = useMutation({
    mutationFn: (listingId: number) => 
      apiRequest(`/api/investment-oversight/listings/${listingId}/approve`, "PUT"),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/investment-oversight/listings"] });
    },
  });

  // Reject listing mutation
  const rejectMutation = useMutation({
    mutationFn: ({ listingId, rejectionReason }: { listingId: number; rejectionReason: string }) => 
      apiRequest(`/api/investment-oversight/listings/${listingId}/reject`, "PUT", { rejectionReason }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/investment-oversight/listings"] });
    },
  });

  // Filter and sort listings
  const filteredListings = (listings || [])
    .filter((listing: any) => {
      const propertyName = listing.property?.name || '';
      const investorName = listing.user?.name || listing.user?.email || '';
      const tokenId = listing.tokenId || '';
      
      const matchesSearch = propertyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          investorName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          tokenId.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = statusFilter === "all" || listing.status === statusFilter;
      return matchesSearch && matchesStatus;
    })
    .sort((a: any, b: any) => {
      switch (sortBy) {
        case "date":
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        case "price":
          return b.priceUSDT - a.priceUSDT;
        case "property":
          return (a.property?.name || '').localeCompare(b.property?.name || '');
        default:
          return 0;
      }
    });

  const handleApproveListing = (listingId: number) => {
    approveMutation.mutate(listingId);
  };

  const handleRejectListing = (listingId: number, reason: string) => {
    rejectMutation.mutate({
      listingId,
      rejectionReason: reason
    });
    setShowRejectModal(false);
    setRejectionReason("");
    setSelectedListing(null);
  };

  const handleViewDetails = (listing: InvestorListing) => {
    setSelectedListing(listing);
    setShowDetailsModal(true);
  };

  const handleOpenRejectModal = (listing: InvestorListing) => {
    setSelectedListing(listing);
    setShowRejectModal(true);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">Pending</Badge>;
      case 'approved':
        return <Badge variant="secondary" className="bg-green-100 text-green-800">Approved</Badge>;
      case 'rejected':
        return <Badge variant="secondary" className="bg-red-100 text-red-800">Rejected</Badge>;
      default:
        return <Badge variant="secondary">Unknown</Badge>;
    }
  };

  const pendingCount = listings.filter(l => l.status === 'pending').length;
  const approvedCount = listings.filter(l => l.status === 'approved').length;
  const rejectedCount = listings.filter(l => l.status === 'rejected').length;

  return (
    <div className="p-6 w-full">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Investment Oversight</h1>
          <p className="text-gray-600 mt-1">Review and approve investor listings for secondary marketplace</p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Pending Review</p>
              <p className="text-2xl font-bold text-yellow-600">{pendingCount}</p>
            </div>
            <div className="w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center">
              <Filter className="w-4 h-4 text-yellow-600" />
            </div>
          </div>
        </div>
        
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Approved</p>
              <p className="text-2xl font-bold text-green-600">{approvedCount}</p>
            </div>
            <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
              <Check className="w-4 h-4 text-green-600" />
            </div>
          </div>
        </div>
        
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Rejected</p>
              <p className="text-2xl font-bold text-red-600">{rejectedCount}</p>
            </div>
            <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center">
              <X className="w-4 h-4 text-red-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="bg-white p-4 rounded-lg border border-gray-200 mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Search by property name, investor, or token ID..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
          
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="approved">Approved</SelectItem>
              <SelectItem value="rejected">Rejected</SelectItem>
            </SelectContent>
          </Select>
          
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="date">Date Listed</SelectItem>
              <SelectItem value="price">Price (USDT)</SelectItem>
              <SelectItem value="property">Property Name</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Listings Table */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Property Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Token ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Seller Wallet
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Price (USDT)
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date Listed
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredListings.map((listing: any) => (
                <tr key={listing.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-900">{listing.property?.name || 'N/A'}</div>
                      <div className="text-sm text-gray-500">by {listing.user?.name || listing.user?.email || 'N/A'}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-mono text-gray-900">{listing.tokenId}</div>
                    <div className="text-xs text-gray-500">{listing.tokensListed}/{listing.totalTokens} tokens</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-mono text-gray-900">
                      {listing.sellerWallet.slice(0, 6)}...{listing.sellerWallet.slice(-4)}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-semibold text-gray-900">${listing.priceUSDT.toLocaleString()}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{new Date(listing.createdAt).toLocaleDateString()}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {getStatusBadge(listing.status)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex space-x-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleViewDetails(listing)}
                        className="text-xs"
                      >
                        <Eye className="w-3 h-3 mr-1" />
                        View Details
                      </Button>
                      
                      {listing.status === 'pending' && (
                        <>
                          <Button
                            size="sm"
                            onClick={() => handleApproveListing(listing.id)}
                            className="text-xs bg-green-600 hover:bg-green-700 text-white"
                          >
                            <Check className="w-3 h-3 mr-1" />
                            Approve
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleOpenRejectModal(listing)}
                            className="text-xs text-red-600 hover:text-red-700"
                          >
                            <X className="w-3 h-3 mr-1" />
                            Reject
                          </Button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* View Details Modal */}
      <Dialog open={showDetailsModal} onOpenChange={setShowDetailsModal}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Listing Details</DialogTitle>
          </DialogHeader>
          
          {selectedListing && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-600">Property Name</label>
                  <p className="text-sm text-gray-900">{selectedListing.propertyName}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Investor Name</label>
                  <p className="text-sm text-gray-900">{selectedListing.investorName}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Token ID</label>
                  <p className="text-sm font-mono text-gray-900">{selectedListing.tokenId}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Tokens Listed</label>
                  <p className="text-sm text-gray-900">{selectedListing.tokensListed} / {selectedListing.totalTokens}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Seller Wallet</label>
                  <p className="text-sm font-mono text-gray-900">{selectedListing.sellerWallet}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Price (USDT)</label>
                  <p className="text-sm font-semibold text-gray-900">${selectedListing.priceUSDT.toLocaleString()}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Date Listed</label>
                  <p className="text-sm text-gray-900">{new Date(selectedListing.dateListed).toLocaleDateString()}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Status</label>
                  <div className="mt-1">{getStatusBadge(selectedListing.status)}</div>
                </div>
              </div>
              
              {selectedListing.rejectionReason && (
                <div>
                  <label className="text-sm font-medium text-gray-600">Rejection Reason</label>
                  <p className="text-sm text-red-600">{selectedListing.rejectionReason}</p>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Reject Modal */}
      <Dialog open={showRejectModal} onOpenChange={setShowRejectModal}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Reject Listing</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium text-gray-600">Rejection Reason</label>
              <textarea
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
                placeholder="Please provide a reason for rejection..."
                className="w-full mt-1 p-2 border border-gray-300 rounded-md text-sm"
                rows={3}
              />
            </div>
            
            <div className="flex gap-3">
              <Button
                onClick={() => setShowRejectModal(false)}
                variant="outline"
                className="flex-1"
              >
                Cancel
              </Button>
              <Button
                onClick={() => selectedListing && handleRejectListing(selectedListing.id, rejectionReason)}
                className="flex-1 bg-red-600 hover:bg-red-700 text-white"
                disabled={!rejectionReason.trim()}
              >
                Reject Listing
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}