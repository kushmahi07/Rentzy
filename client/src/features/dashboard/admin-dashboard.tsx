import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient } from "@/utils/queryClient";
import { useToast } from "@/shared/hooks/use-toast";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import {
  Calendar,
  Home,
  TrendingUp,
  Activity,
  Users,
  Star,
  CheckCircle,
  DollarSign,
  BarChart3,
} from "lucide-react";
import UserManagement from "@/features/user-management/user-management";
import PropertyManagement from "@/features/property-management/property-management";
import SecondaryMarketplace from "@/features/secondary-marketplace/secondary-marketplace";
import BookingManagement from "@/features/booking-management/booking-management";
import PropertyDocumentMaster from "@/features/property-document-master/property-document-master";
import LocationMaster from "@/features/location-master/location-master";
import AmenityMaster from "@/features/amenity-master/amenity-master";
import PropertyTypeTagsMaster from "@/features/property-type-tags-master/property-type-tags-master";
import PlatformFeeSettings from "@/features/platform-fee-settings/platform-fee-settings";
import InvestmentOversight from "@/features/investment-oversight/investment-oversight";
import TokenizationDashboard from "@/features/tokenization/tokenization-dashboard";
import SettingsPage from "@/features/settings/settings";
import ProfilePage from "@/features/profile/profile";
import rentziLogo from "@assets/Rentzi logo 2_1751542644537.png";
import {
  LogOut,
  User,
  Shield,
  Settings,
  Bell,
  TrendingDown,
  Database,
  Server,
  Coins,
  Clock,
  RefreshCw,
  Building2,
  FileText,
  ChevronDown,
  FolderOpen,
  Tag,
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { LocationMasterPage } from '@/features/location-master';
import { PropertyDocumentMasterPage } from '@/features/property-document-master';
import { PlatformFeeSettingsPage } from '@/features/platform-fee-settings';
import { BookingCalendarMasterPage } from '@/features/booking-calendar-master';
import { EventFestivalCalendarMasterPage } from '@/features/event-festival-calendar-master';
import { SubscriptionAgreementMasterPage } from '@/features/subscription-agreement-master';
import { InvestorEarningsFormatMasterPage } from '@/features/investor-earnings-format-master';
import { NotificationTemplateMasterPage } from '@/features/notification-template-master';

interface User {
  id: number;
  email: string;
  role: string;
}

interface PlatformMetrics {
  totalPropertyListed: number;
  totalPendingRequest: number;
  totalBookings: number;
  totalRenters: number;
  totalInvestors: number;
  bookingsToday: number;
}

export default function AdminDashboard() {
  const [, navigate] = useLocation();
  const [user, setUser] = useState<User | null>(null);
  const { toast } = useToast();
  const [lastRefresh, setLastRefresh] = useState<Date>(new Date());
  const [investmentFilter, setInvestmentFilter] = useState<string>("weekly");
  const [propertiesFilter, setPropertiesFilter] = useState<string>("weekly");
  const [bookingsFilter, setBookingsFilter] = useState<string>("weekly");
  const [payoutsFilter, setPayoutsFilter] = useState<string>("monthly");
  const [activeMenuItem, setActiveMenuItem] = useState<string>("dashboard");
  const [expandedSection, setExpandedSection] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [editingManager, setEditingManager] = useState<any>(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    mobile: "",
    role: "property_manager",
    permissions: [] as string[],
    notes: "",
  });

  // State for Document Master collapsible menu
  const [isDocumentMasterOpen, setIsDocumentMasterOpen] = useState(false);

  // Define document master items
  const documentMasterItems = [
    { id: "property-document-master", label: "Property Document Master" },
    { id: "location-master", label: "Location Master" },
    { id: "amenity-master", label: "Amenity Master" },
    { id: "property-type-tags-master", label: "Property Type Tags Master" },
    { id: "platform-fee-settings", label: "Platform Fee Settings" },
    { id: "booking-calendar-master", label: "Booking Calendar Master" },
    { id: "event-festival-calendar-master", label: "Event/Festival Calendar Master" },
    { id: "subscription-agreement-master", label: "Subscription Agreement Master" },
    { id: "investor-earnings-format-master", label: "Investor Earnings Format Master" },
    { id: "notification-template-master", label: "Notification Template Master" },
  ];

  useEffect(() => {
    // Check if user is authenticated
    const userData = localStorage.getItem("user");
    if (!userData) {
      navigate("/login");
      return;
    }

    try {
      const parsedUser = JSON.parse(userData);
      setUser(parsedUser);
    } catch (error) {
      console.error("Invalid user data");
      localStorage.removeItem("user");
      navigate("/login");
    }
  }, [navigate]);

  // Fetch platform metrics with auto-refresh every 3 minutes
  const {
    data: metrics,
    isLoading: metricsLoading,
    refetch,
  } = useQuery({
    queryKey: ["/api/dashboard/metrics"],
    refetchInterval: 3 * 60 * 1000, // 3 minutes
    refetchIntervalInBackground: true,
    select: (data: any) => data.data as PlatformMetrics,
  });

  // Fetch property managers data
  const { data: propertyManagers, isLoading: propertyManagersLoading } =
    useQuery({
      queryKey: ["/api/property-managers"],
      select: (data: any) => data.data || [],
    });

  // Toggle property manager status mutation
  const toggleStatusMutation = useMutation({
    mutationFn: async (managerId: number) => {
      const response = await fetch(
        `/api/property-managers/${managerId}/toggle-status`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
        },
      );
      if (!response.ok) throw new Error("Failed to toggle status");
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/property-managers"] });
      toast({ title: "Status updated successfully" });
    },
    onError: () => {
      toast({ title: "Failed to update status", variant: "destructive" });
    },
  });

  // Handler functions for property manager actions
  const handleEditManager = (manager: any) => {
    setEditingManager(manager);
    setFormData({
      name: manager.name || "",
      email: manager.email || "",
      mobile: manager.mobile || "",
      role: "property_manager",
      permissions:
        typeof manager.permissions === "string"
          ? JSON.parse(manager.permissions)
          : manager.permissions || [],
      notes: "",
    });
    setIsModalOpen(true);
  };

  const handleToggleStatus = (managerId: number) => {
    toggleStatusMutation.mutate(managerId);
  };

  // Update last refresh time when data is fetched
  useEffect(() => {
    if (metrics) {
      setLastRefresh(new Date());
    }
  }, [metrics]);

  const handleManualRefresh = () => {
    refetch();
    setLastRefresh(new Date());
  };

  // Sidebar menu items
  const menuItems = [
    {
      id: "dashboard",
      label: "Dashboard",
      icon: BarChart3,
      active: true,
    },
    {
      id: "user-management",
      label: "User Management",
      icon: Users,
      active: false,
    },
    {
      id: "booking-management",
      label: "Booking Management",
      icon: Calendar,
      active: false,
    },
    {
      id: "role-management",
      label: "Role Management",
      icon: Shield,
      active: false,
    },
    {
      id: "document-master",
      label: "Document Master",
      icon: FolderOpen,
      active: false,
    },
    {
      id: "properties",
      label: "Properties",
      icon: Building2,
      active: false,
    },
    {
      id: "secondary-marketplace",
      label: "Secondary Marketplace",
      icon: TrendingUp,
      active: false,
    },
    {
      id: "investment-oversight",
      label: "Investment Oversight",
      icon: TrendingDown,
      active: false,
    },
    {
      id: "tokenization-dashboard",
      label: "Tokenization Dashboard",
      icon: Coins,
      active: false,
    },
    {
      id: "reports",
      label: "Reports",
      icon: FileText,
      active: false,
    },
    {
      id: "settings",
      label: "Settings",
      icon: Settings,
      active: false,
    },
    {
      id: "profile",
      label: "Profile",
      icon: User,
      active: false,
    },
  ];

  const handleMenuClick = (itemId: string) => {
    if (
      itemId === "role-management" ||
      itemId === "user-management"
    ) {
      // Toggle expanded section for expandable items
      setExpandedSection(
        expandedSection === itemId ? null : itemId,
      );
      setActiveMenuItem(itemId);
    } else if (itemId === "document-master") {
      // Toggle Document Master collapsible menu
      setIsDocumentMasterOpen(!isDocumentMasterOpen);
      setActiveMenuItem(itemId);
    } else if (itemId === "properties") {
      // Show properties section within dashboard
      setExpandedSection("properties");
      setActiveMenuItem(itemId);
    } else if (itemId === "secondary-marketplace") {
      // Show secondary marketplace section within dashboard
      setExpandedSection("secondary-marketplace");
      setActiveMenuItem(itemId);
    } else if (itemId === "investment-oversight") {
      // Show investment oversight section within dashboard
      setExpandedSection("investment-oversight");
      setActiveMenuItem(itemId);
    } else if (itemId === "tokenization-dashboard") {
      // Show tokenization dashboard section within dashboard
      setExpandedSection("tokenization-dashboard");
      setActiveMenuItem(itemId);
    } else if (itemId === "settings") {
      // Show settings section within dashboard
      setExpandedSection("settings");
      setActiveMenuItem(itemId);
    } else if (itemId === "profile") {
      // Show profile section within dashboard
      setExpandedSection("profile");
      setActiveMenuItem(itemId);
    } else if (itemId === "booking-management") {
      // Show booking management section within dashboard
      setExpandedSection("booking-management");
      setActiveMenuItem(itemId);
    } else {
      setActiveMenuItem(itemId);
      setExpandedSection(null);
    }
  };

  // Generate chart data based on time filters
  const generateInvestmentData = (filter: string) => {
    const baseData = [
      { period: "Week 1", investment: 1245000 },
      { period: "Week 2", investment: 1523000 },
      { period: "Week 3", investment: 1876000 },
      { period: "Week 4", investment: 2189000 },
      { period: "Week 5", investment: 1932000 },
      { period: "Week 6", investment: 2345000 },
    ];

    switch (filter) {
      case "bi-weekly":
        return [
          { period: "Bi-Week 1", investment: 2768000 },
          { period: "Bi-Week 2", investment: 3765000 },
          { period: "Bi-Week 3", investment: 4277000 },
        ];
      case "monthly":
        return [
          { period: "Jan", investment: 8954000 },
          { period: "Feb", investment: 7623000 },
          { period: "Mar", investment: 9568000 },
          { period: "Apr", investment: 11234000 },
          { period: "May", investment: 9875000 },
          { period: "Jun", investment: 12589000 },
        ];
      case "yearly":
        return [
          { period: "2022", investment: 124589000 },
          { period: "2023", investment: 158943000 },
          { period: "2024", investment: 172365000 },
        ];
      default:
        return baseData;
    }
  };

  const generatePropertiesListedData = (filter: string) => {
    const baseData = [
      { period: "Week 1", properties: 45 },
      { period: "Week 2", properties: 52 },
      { period: "Week 3", properties: 38 },
      { period: "Week 4", properties: 67 },
      { period: "Week 5", properties: 43 },
      { period: "Week 6", properties: 58 },
    ];

    switch (filter) {
      case "bi-weekly":
        return [
          { period: "Bi-Week 1", properties: 97 },
          { period: "Bi-Week 2", properties: 105 },
          { period: "Bi-Week 3", properties: 101 },
        ];
      case "monthly":
        return [
          { period: "Jan", properties: 234 },
          { period: "Feb", properties: 198 },
          { period: "Mar", properties: 267 },
          { period: "Apr", properties: 289 },
          { period: "May", properties: 245 },
          { period: "Jun", properties: 312 },
        ];
      case "yearly":
        return [
          { period: "2022", properties: 2890 },
          { period: "2023", properties: 3456 },
          { period: "2024", properties: 3892 },
        ];
      default:
        return baseData;
    }
  };

  const generateBookingsData = (filter: string) => {
    switch (filter) {
      case "monthly":
        return [
          { period: "Jan", bookings: 245 },
          { period: "Feb", bookings: 189 },
          { period: "Mar", bookings: 312 },
          { period: "Apr", bookings: 278 },
          { period: "May", bookings: 334 },
          { period: "Jun", bookings: 398 },
        ];
      case "yearly":
        return [
          { period: "2022", bookings: 2890 },
          { period: "2023", bookings: 3456 },
          { period: "2024", bookings: 3892 },
        ];
      default:
        return [
          { period: "Week 1", bookings: 67 },
          { period: "Week 2", bookings: 89 },
          { period: "Week 3", bookings: 124 },
          { period: "Week 4", bookings: 156 },
          { period: "Week 5", bookings: 134 },
          { period: "Week 6", bookings: 178 },
        ];
    }
  };

  const generatePayoutsData = (filter: string) => {
    switch (filter) {
      case "quarterly":
        return [
          { period: "Q1 2024", payouts: 847593 },
          { period: "Q2 2024", payouts: 923847 },
          { period: "Q3 2024", payouts: 1089432 },
          { period: "Q4 2024", payouts: 987312 },
        ];
      case "yearly":
        return [
          { period: "2022", payouts: 2456789 },
          { period: "2023", payouts: 3123456 },
          { period: "2024", payouts: 3847593 },
        ];
      default:
        return [
          { period: "Jan", payouts: 245890 },
          { period: "Feb", payouts: 198320 },
          { period: "Mar", payouts: 312450 },
          { period: "Apr", payouts: 278930 },
          { period: "May", payouts: 334210 },
          { period: "Jun", payouts: 398760 },
        ];
    }
  };

  // Available permissions for Property Managers
  const availablePermissions = [
    {
      id: "view_edit_listings",
      label: "View / Edit Listings",
      description: "Access and modify property listings",
    },
    {
      id: "approve_listings",
      label: "Approve Listings",
      description: "Review and approve new property listings",
    },
    {
      id: "freeze_token_sale",
      label: "Freeze Token Sale",
      description: "Temporarily halt token sales for properties",
    },
    {
      id: "view_bookings",
      label: "View Bookings",
      description: "Access booking information and details",
    },
    {
      id: "approve_trades",
      label: "Approve Trades",
      description: "Review and approve property token trades",
    },
  ];

  const handlePermissionChange = (permissionId: string, checked: boolean) => {
    setFormData((prev) => ({
      ...prev,
      permissions: checked
        ? [...prev.permissions, permissionId]
        : prev.permissions.filter((p) => p !== permissionId),
    }));
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  // Create property manager mutation
  const createManagerMutation = useMutation({
    mutationFn: async (data: any) => {
      const response = await fetch("/api/property-managers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!response.ok) throw new Error("Failed to create property manager");
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/property-managers"] });
      toast({ title: "Property Manager created successfully" });
      setIsModalOpen(false);
      resetForm();
    },
    onError: () => {
      toast({
        title: "Failed to create property manager",
        variant: "destructive",
      });
    },
  });

  // Update property manager mutation
  const updateManagerMutation = useMutation({
    mutationFn: async ({ id, data }: { id: number; data: any }) => {
      const response = await fetch(`/api/property-managers/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!response.ok) throw new Error("Failed to update property manager");
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/property-managers"] });
      toast({ title: "Property Manager updated successfully" });
      setIsModalOpen(false);
      resetForm();
    },
    onError: () => {
      toast({
        title: "Failed to update property manager",
        variant: "destructive",
      });
    },
  });

  const resetForm = () => {
    setFormData({
      name: "",
      email: "",
      mobile: "",
      role: "property_manager",
      permissions: [],
      notes: "",
    });
    setEditingManager(null);
  };

  const handleCreateSubAdmin = async () => {
    // Validate form
    if (
      !formData.name ||
      !formData.email ||
      !formData.mobile ||
      formData.permissions.length === 0
    ) {
      toast({
        title:
          "Please fill in all required fields and select at least one permission.",
        variant: "destructive",
      });
      return;
    }

    const data = {
      name: formData.name,
      email: formData.email,
      mobile: formData.mobile,
      role: "property_manager",
      permissions: formData.permissions,
    };

    if (editingManager) {
      updateManagerMutation.mutate({ id: editingManager.id, data });
    } else {
      createManagerMutation.mutate(data);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/login");
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <div className="w-64 bg-white shadow-sm border-r border-gray-200 flex flex-col fixed h-full z-10">
        {/* Logo/Brand */}
        <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-white to-gray-50/50">
          <div className="flex items-center justify-center">
            <div className="bg-white rounded-lg p-2 shadow-sm">
              <img
                src={rentziLogo}
                alt="Rentzi Logo"
                className="w-16 h-auto flex-shrink-0 drop-shadow-sm filter brightness-105"
              />
            </div>
          </div>
        </div>

        {/* Navigation Menu */}
        <nav className="flex-1 p-4 overflow-y-auto scrollbar-hide">
          <ul className="space-y-2">
            {menuItems.map((item) => (
              <li key={item.id}>
                {item.id === "document-master" ? (
                  <Collapsible 
                    open={isDocumentMasterOpen} 
                    onOpenChange={setIsDocumentMasterOpen}
                  >
                    <CollapsibleTrigger asChild>
                      <button
                        onClick={() => handleMenuClick(item.id)}
                        className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-left transition-colors ${
                          activeMenuItem === item.id
                            ? "bg-blue-50 text-blue-600 border-r-2 border-blue-600"
                            : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                        }`}
                      >
                        <item.icon className="h-5 w-5" />
                        <span className="font-medium flex-1">{item.label}</span>
                        <ChevronDown 
                          className={`h-4 w-4 transition-transform ${
                            isDocumentMasterOpen ? "rotate-180" : ""
                          }`} 
                        />
                      </button>
                    </CollapsibleTrigger>
                    <CollapsibleContent className="space-y-1 mt-1">
                      <div className="pl-8 space-y-1">
                        {documentMasterItems.map((subItem) => (
                          <button
                            key={subItem.id}
                            onClick={() => {
                              // Handle submenu item clicks
                              setActiveMenuItem(subItem.id);
                              if (subItem.id === 'property-document-master') {
                                setExpandedSection('property-document-master');
                              } else if (subItem.id === 'location-master') {
                                setExpandedSection('location-master');
                              } else if (subItem.id === 'amenity-master') {
                                setExpandedSection('amenity-master');
                              } else if (subItem.id === 'property-type-tags-master') {
                                setExpandedSection('property-type-tags-master');
                              } else if (subItem.id === 'platform-fee-settings') {
                                setExpandedSection('platform-fee-settings');
                              } else if (subItem.id === 'booking-calendar-master') {
                                setExpandedSection('booking-calendar-master');
                              } else if (subItem.id === 'event-festival-calendar-master') {
                                setExpandedSection('event-festival-calendar-master');
                              } else if (subItem.id === 'subscription-agreement-master') {
                                setExpandedSection('subscription-agreement-master');
                              } else if (subItem.id === 'investor-earnings-format-master') {
                                setExpandedSection('investor-earnings-format-master');
                              } else if (subItem.id === 'notification-template-master') {
                                setExpandedSection('notification-template-master');
                              }
                            }}
                            className={`w-full text-left px-3 py-2 text-sm transition-colors rounded-md ${
                              activeMenuItem === subItem.id
                                ? 'bg-blue-50 text-blue-600'
                                : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                            }`}
                          >
                            {subItem.label}
                          </button>
                        ))}
                      </div>
                    </CollapsibleContent>
                  </Collapsible>
                ) : (
                  <button
                    onClick={() => handleMenuClick(item.id)}
                    className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-left transition-colors ${
                      activeMenuItem === item.id
                        ? "bg-blue-50 text-blue-600 border-r-2 border-blue-600"
                        : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                    }`}
                  >
                    <item.icon className="h-5 w-5" />
                    <span className="font-medium">{item.label}</span>
                  </button>
                )}
              </li>
            ))}
          </ul>
        </nav>

        {/* User Profile Section */}
        <div className="p-4 border-t border-gray-200">
          <div className="flex items-center space-x-3">
            <Avatar>
              <AvatarFallback className="bg-blue-100 text-blue-600">
                {user?.email?.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 truncate">
                John Admin
              </p>
              <p className="text-xs text-gray-500">Admin</p>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleLogout}
              className="p-2"
            >
              <LogOut className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col ml-64">
        {/* Top Header */}
        <header className="bg-white shadow-sm border-b border-gray-200">
          <div className="px-6 py-4">
            <div className="flex justify-between items-center">
              <div className="flex items-center space-x-3">
                <h2 className="text-xl font-semibold text-gray-900">
                  {expandedSection === "role-management"
                    ? "Role Management"
                    : expandedSection === "user-management"
                      ? "User Management"
                      : expandedSection === "properties"
                        ? "Property Management"
                        : expandedSection === "secondary-marketplace"
                          ? "Secondary Marketplace"
                          : expandedSection === "investment-oversight"
                            ? "Investment Oversight"
                            : expandedSection === "tokenization-dashboard"
                              ? "Tokenization Dashboard"
                              : expandedSection === "settings"
                                ? "Settings"
                                : expandedSection === "profile"
                                  ? "Profile"
                                  : expandedSection === "booking-management"
                                    ? "Booking Management"
                                    : expandedSection === "property-document-master"
                                      ? "Property Document Master"
                                      : expandedSection === "location-master"
                                        ? "Location Master"
                                        : expandedSection === "amenity-master"
                                          ? "Amenity Master"
                                          : expandedSection === "property-type-tags-master"
                                            ? "Property Type Tags Master"
                                            : expandedSection === "platform-fee-settings"
                                              ? "Platform Fee Settings"
                                              : expandedSection === "booking-calendar-master"
                                                ? "Booking Calendar Master"
                                                : expandedSection === "event-festival-calendar-master"
                                                  ? "Event/Festival Calendar Master"
                                                  : expandedSection === "subscription-agreement-master"
                                                    ? "Subscription Agreement Master"
                                                    : expandedSection === "investor-earnings-format-master"
                                                      ? "Investor Earnings Format Master"
                                                      : expandedSection === "notification-template-master"
                                                        ? "Notification Template Master"
                                        : "Dashboard Overview"}
                </h2>
                <Badge className="bg-green-100 text-green-800 text-xs">
                  Live
                </Badge>
              </div>

              <div className="flex items-center space-x-4">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search..."
                    className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  <div className="absolute left-3 top-2.5">
                    <svg
                      className="h-4 w-4 text-gray-400"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                      />
                    </svg>
                  </div>
                </div>

                <div className="relative">
                  <Bell className="h-5 w-5 text-gray-400" />
                  <div className="absolute -top-1 -right-1 h-2 w-2 bg-red-500 rounded-full"></div>
                </div>

                <div className="flex items-center space-x-2">
                  <span className="text-sm text-gray-700">Profile</span>
                  <Avatar className="h-8 w-8">
                    <AvatarFallback className="bg-blue-100 text-blue-600">
                      {user?.email?.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 p-6">
          {/* Dynamic Content Based on Expanded Section */}
          {expandedSection === "role-management" ? (
            <div className="space-y-6">
              {/* Header Section */}
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm">
                    Create and manage Property Manager sub-admin accounts
                  </p>
                </div>
                <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
                  <DialogTrigger asChild>
                    <Button
                      style={{ backgroundColor: "#004182" }}
                      className="hover:opacity-90 text-white"
                    >
                      <svg
                        className="h-4 w-4 mr-2"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                        />
                      </svg>
                      Add New Admin
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto bg-white">
                    <DialogHeader>
                      <DialogTitle className="text-xl flex items-center gap-2">
                        <Shield className="h-6 w-6 text-blue-600" />
                        {editingManager
                          ? "Edit Property Manager"
                          : "Create Sub-Admin Account"}
                      </DialogTitle>
                    </DialogHeader>

                    <div className="mt-6">
                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        {/* Account Details Section */}
                        <div className="space-y-6">
                          <div>
                            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                              <Users className="h-5 w-5 text-blue-600" />
                              Account Details
                            </h3>

                            <div className="space-y-4">
                              <div>
                                <Label
                                  htmlFor="name"
                                  className="text-sm font-medium text-gray-700"
                                >
                                  Full Name *
                                </Label>
                                <Input
                                  id="name"
                                  value={formData.name}
                                  onChange={(e) =>
                                    handleInputChange("name", e.target.value)
                                  }
                                  placeholder="Enter full name"
                                  className="mt-1"
                                />
                              </div>

                              <div>
                                <Label
                                  htmlFor="email"
                                  className="text-sm font-medium text-gray-700"
                                >
                                  Email Address *
                                </Label>
                                <Input
                                  id="email"
                                  type="email"
                                  value={formData.email}
                                  onChange={(e) =>
                                    handleInputChange("email", e.target.value)
                                  }
                                  placeholder="Enter email address"
                                  className="mt-1"
                                />
                              </div>

                              <div>
                                <Label
                                  htmlFor="mobile"
                                  className="text-sm font-medium text-gray-700"
                                >
                                  Mobile Number *
                                </Label>
                                <Input
                                  id="mobile"
                                  value={formData.mobile}
                                  onChange={(e) =>
                                    handleInputChange("mobile", e.target.value)
                                  }
                                  placeholder="Enter mobile number"
                                  className="mt-1"
                                />
                              </div>

                              <div>
                                <Label
                                  htmlFor="role"
                                  className="text-sm font-medium text-gray-700"
                                >
                                  Role Assignment
                                </Label>
                                <Select
                                  value={formData.role}
                                  onValueChange={(value) =>
                                    handleInputChange("role", value)
                                  }
                                >
                                  <SelectTrigger className="mt-1">
                                    <SelectValue />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="property_manager">
                                      Property Manager
                                    </SelectItem>
                                  </SelectContent>
                                </Select>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Access Rights Section */}
                        <div className="space-y-6">
                          <div>
                            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                              <Shield className="h-5 w-5 text-green-600" />
                              Access Rights & Permissions
                            </h3>

                            <div className="space-y-4">
                              <p className="text-sm text-gray-600 mb-4">
                                Select the permissions this Property Manager
                                will have. You can modify these later.
                              </p>

                              {availablePermissions.map((permission) => (
                                <div
                                  key={permission.id}
                                  className="flex items-start space-x-3 p-3 border border-gray-200 rounded-lg"
                                >
                                  <Checkbox
                                    id={permission.id}
                                    checked={formData.permissions.includes(
                                      permission.id,
                                    )}
                                    onCheckedChange={(checked) =>
                                      handlePermissionChange(
                                        permission.id,
                                        checked as boolean,
                                      )
                                    }
                                    className="mt-1"
                                  />
                                  <div className="flex-1">
                                    <Label
                                      htmlFor={permission.id}
                                      className="text-sm font-medium text-gray-900 cursor-pointer"
                                    >
                                      {permission.label}
                                    </Label>
                                    <p className="text-xs text-gray-600 mt-1">
                                      {permission.description}
                                    </p>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Additional Notes */}
                      <div className="mt-8 pt-6 border-t border-gray-200">
                        <Label
                          htmlFor="notes"
                          className="text-sm font-medium text-gray-700"
                        >
                          Additional Notes (Optional)
                        </Label>
                        <Textarea
                          id="notes"
                          value={formData.notes}
                          onChange={(e) =>
                            handleInputChange("notes", e.target.value)
                          }
                          placeholder="Add any additional notes about this Property Manager's role or responsibilities..."
                          className="mt-2"
                          rows={3}
                        />
                      </div>

                      {/* Important Information */}
                      <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                        <h4 className="text-sm font-semibold text-blue-900 mb-2">
                          Important Notes:
                        </h4>
                        <ul className="text-xs text-blue-800 space-y-1">
                          <li>
                            • The Property Manager will receive login
                            credentials via email
                          </li>
                          <li>
                            • All permissions can be modified or revoked later
                            from this interface
                          </li>
                          <li>
                            • Account activity will be logged and monitored for
                            security
                          </li>
                          <li>
                            • Property Managers can only access designated
                            platform sections
                          </li>
                        </ul>
                      </div>

                      {/* Action Buttons */}
                      <div className="flex items-center justify-end space-x-4 mt-8 pt-6 border-t border-gray-200">
                        <Button
                          variant="outline"
                          onClick={() => setIsModalOpen(false)}
                          className="px-6"
                        >
                          Cancel
                        </Button>
                        <Button
                          onClick={handleCreateSubAdmin}
                          style={{ backgroundColor: "#004182" }}
                          className="hover:opacity-90 text-white px-8"
                          disabled={
                            !formData.name ||
                            !formData.email ||
                            !formData.mobile ||
                            formData.permissions.length === 0 ||
                            createManagerMutation.isPending ||
                            updateManagerMutation.isPending
                          }
                        >
                          {editingManager
                            ? "Update Manager"
                            : "Create Account & Apply Access Rights"}
                        </Button>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>

              {/* Statistics Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="bg-white border-gray-200">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-gray-600 text-sm font-medium">
                          Total Property Managers
                        </p>
                        <p className="text-gray-900 text-3xl font-bold mt-2">
                          {propertyManagersLoading
                            ? "..."
                            : propertyManagers?.length || 0}
                        </p>
                      </div>
                      <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                        <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-white border-gray-200">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-gray-600 text-sm font-medium">
                          Active Accounts
                        </p>
                        <p className="text-gray-900 text-3xl font-bold mt-2">
                          {propertyManagersLoading
                            ? "..."
                            : propertyManagers?.filter((pm: any) => pm.isActive)
                                .length || 0}
                        </p>
                      </div>
                      <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                        <div className="w-2 h-2 bg-green-600 rounded-full"></div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-white border-gray-200">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-gray-600 text-sm font-medium">
                          Total Roles
                        </p>
                        <p className="text-gray-900 text-3xl font-bold mt-2">
                          {propertyManagersLoading
                            ? "..."
                            : "1"}
                        </p>
                      </div>
                      <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                        <div className="w-2 h-2 bg-purple-600 rounded-full"></div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Delegate Administrative Tasks */}
              <Card className="bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200">
                <CardContent className="p-8">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                      <Shield className="h-6 w-6 text-blue-600" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-900 mb-1">
                        Delegate Administrative Tasks
                      </h3>
                      <p className="text-gray-600 text-sm">
                        Empower trusted team members with Property Manager roles
                        to help manage platform operations efficiently
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Property Managers Table */}
              <Card className="bg-white border-gray-200">
                <CardHeader className="border-b border-gray-200">
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-gray-900 text-lg">
                        Property Managers
                      </CardTitle>
                      <CardDescription className="text-gray-600">
                        Manage all Property Manager accounts and their
                        permissions
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="p-0">
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-gray-50 border-b border-gray-200">
                        <tr>
                          <th className="text-left py-4 px-6 font-medium text-gray-700 text-sm">
                            Name
                          </th>
                          <th className="text-left py-4 px-6 font-medium text-gray-700 text-sm">
                            Email
                          </th>
                          <th className="text-left py-4 px-6 font-medium text-gray-700 text-sm">
                            Mobile
                          </th>
                          <th className="text-left py-4 px-6 font-medium text-gray-700 text-sm">
                            Permissions
                          </th>
                          <th className="text-left py-4 px-6 font-medium text-gray-700 text-sm">
                            Status
                          </th>
                          <th className="text-left py-4 px-6 font-medium text-gray-700 text-sm">
                            Created
                          </th>
                          <th className="text-left py-4 px-6 font-medium text-gray-700 text-sm">
                            Actions
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {propertyManagersLoading ? (
                          <tr>
                            <td colSpan={7} className="py-8 px-6 text-center">
                              <div className="text-gray-500">
                                Loading property managers...
                              </div>
                            </td>
                          </tr>
                        ) : propertyManagers && propertyManagers.length > 0 ? (
                          propertyManagers.map((manager: any) => (
                            <tr
                              key={manager.id}
                              className="border-b border-gray-100 hover:bg-gray-50"
                            >
                              <td className="py-4 px-6">
                                <div className="font-medium text-gray-900">
                                  {manager.name}
                                </div>
                              </td>
                              <td className="py-4 px-6">
                                <div className="text-gray-600">
                                  {manager.email}
                                </div>
                              </td>
                              <td className="py-4 px-6">
                                <div className="text-gray-600">
                                  {manager.mobile}
                                </div>
                              </td>
                              <td className="py-4 px-6">
                                <div className="flex flex-wrap gap-1">
                                  {(() => {
                                    try {
                                      const permissions =
                                        typeof manager.permissions === "string"
                                          ? JSON.parse(manager.permissions)
                                          : manager.permissions || [];
                                      return permissions.map(
                                        (permission: string) => (
                                          <Badge
                                            key={permission}
                                            variant="outline"
                                            className="text-xs"
                                          >
                                            {permission
                                              .replace(/_/g, " ")
                                              .replace(/\b\w/g, (l) =>
                                                l.toUpperCase(),
                                              )}
                                          </Badge>
                                        ),
                                      );
                                    } catch (error) {
                                      return (
                                        <Badge
                                          variant="outline"
                                          className="text-xs"
                                        >
                                          Invalid permissions
                                        </Badge>
                                      );
                                    }
                                  })()}
                                </div>
                              </td>
                              <td className="py-4 px-6">
                                <Badge
                                  variant={
                                    manager.isActive ? "default" : "secondary"
                                  }
                                  className={
                                    manager.isActive
                                      ? "bg-green-100 text-green-800"
                                      : "bg-red-100 text-red-800"
                                  }
                                >
                                  {manager.isActive ? "Active" : "Inactive"}
                                </Badge>
                              </td>
                              <td className="py-4 px-6">
                                <div className="text-gray-600 text-sm">
                                  {new Date(
                                    manager.createdAt,
                                  ).toLocaleDateString()}
                                </div>
                              </td>
                              <td className="py-4 px-6">
                                <div className="flex space-x-2">
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    className="text-xs"
                                    onClick={() => handleEditManager(manager)}
                                  >
                                    Edit
                                  </Button>
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    className="text-xs"
                                    onClick={() =>
                                      handleToggleStatus(manager.id)
                                    }
                                    disabled={toggleStatusMutation.isPending}
                                  >
                                    {manager.isActive
                                      ? "Deactivate"
                                      : "Activate"}
                                  </Button>
                                </div>
                              </td>
                            </tr>
                          ))
                        ) : (
                          <tr>
                            <td colSpan={7} className="py-16 px-6 text-center">
                              <div className="flex flex-col items-center space-y-3">
                                <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center">
                                  <Users className="h-8 w-8 text-gray-400" />
                                </div>
                                <div className="text-center">
                                  <p className="text-gray-600 font-medium">
                                    No Property Managers found.
                                  </p>
                                  <p className="text-gray-500 text-sm mt-1">
                                    Create your first Property Manager account.
                                  </p>
                                </div>
                              </div>
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>
            </div>
          ) : expandedSection === "user-management" ? (
            <UserManagement />
          ) : expandedSection === "properties" ? (
            <PropertyManagement />
          ) : expandedSection === "secondary-marketplace" ? (
            <SecondaryMarketplace />
          ) : expandedSection === "investment-oversight" ? (
            <InvestmentOversight />
          ) : expandedSection === "tokenization-dashboard" ? (
            <TokenizationDashboard />
          ) : expandedSection === "settings" ? (
            <SettingsPage />
          ) : expandedSection === "profile" ? (
            <ProfilePage />
          ) : expandedSection === "booking-management" ? (
            <div>
              <BookingManagement />
            </div>
          ) : expandedSection === "property-document-master" ? (
            <PropertyDocumentMaster />
          ) : expandedSection === "location-master" ? (
            <LocationMaster />
          ) : expandedSection === "amenity-master" ? (
            <AmenityMaster />
          ) : expandedSection === "property-type-tags-master" ? (
            <PropertyTypeTagsMaster />
          ) : expandedSection === "platform-fee-settings" ? (
            <PlatformFeeSettings />
          ) : expandedSection === "booking-calendar-master" ? (
            <BookingCalendarMasterPage />
          ) : expandedSection === "event-festival-calendar-master" ? (
            <EventFestivalCalendarMasterPage />
          ) : expandedSection === "subscription-agreement-master" ? (
            <SubscriptionAgreementMasterPage />
          ) : expandedSection === "investor-earnings-format-master" ? (
            <InvestorEarningsFormatMasterPage />
          ) : expandedSection === "notification-template-master" ? (
            <NotificationTemplateMasterPage />
          ) : (
            <>
              {/* Welcome Section */}
              <div className="mb-8">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">
                      Metrics Summary
                    </h2>
                    <p className="text-gray-600">
                      Monitor key platform performance metrics and activity in
                      real-time
                    </p>
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className="text-sm text-gray-500">
                      Last updated: {lastRefresh.toLocaleTimeString()}
                    </div>
                    <Button
                      onClick={handleManualRefresh}
                      variant="outline"
                      size="sm"
                      disabled={metricsLoading}
                      className="flex items-center gap-2"
                    >
                      <RefreshCw
                        className={`h-4 w-4 ${metricsLoading ? "animate-spin" : ""}`}
                      />
                      Refresh
                    </Button>
                  </div>
                </div>
              </div>

              {/* Key Metrics Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6 mb-8">
                <Card className="border-l-4 border-blue-200 hover:shadow-lg transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <div className="p-2 rounded-lg bg-blue-50">
                            <Home className="h-5 w-5 text-blue-600" />
                          </div>
                        </div>
                        <p className="text-sm font-medium text-gray-600 mb-1">
                          Total Properties Listed
                        </p>
                        <p className="text-2xl font-bold text-gray-900 mb-2">
                          {metricsLoading
                            ? "Loading..."
                            : metrics?.totalPropertyListed?.toLocaleString() ||
                              "0"}
                        </p>
                        <p className="text-xs text-gray-500 leading-tight">
                          Properties available on the platform
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-l-4 border-green-200 hover:shadow-lg transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <div className="p-2 rounded-lg bg-green-50">
                            <Calendar className="h-5 w-5 text-green-600" />
                          </div>
                        </div>
                        <p className="text-sm font-medium text-gray-600 mb-1">
                          Total Bookings
                        </p>
                        <p className="text-2xl font-bold text-gray-900 mb-2">
                          {metricsLoading
                            ? "Loading..."
                            : metrics?.totalBookings?.toLocaleString() ||
                              "0"}
                        </p>
                        <p className="text-xs text-gray-500 leading-tight">
                          All bookings on the platform
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-l-4 border-purple-200 hover:shadow-lg transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <div className="p-2 rounded-lg bg-purple-50">
                            <Users className="h-5 w-5 text-purple-600" />
                          </div>
                        </div>
                        <p className="text-sm font-medium text-gray-600 mb-1">
                          Total Renters
                        </p>
                        <p className="text-2xl font-bold text-gray-900 mb-2">
                          {metricsLoading
                            ? "Loading..."
                            : metrics?.totalRenters?.toLocaleString() ||
                              "0"}
                        </p>
                        <p className="text-xs text-gray-500 leading-tight">
                          Registered renter users
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-l-4 border-indigo-200 hover:shadow-lg transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <div className="p-2 rounded-lg bg-indigo-50">
                            <TrendingUp className="h-5 w-5 text-indigo-600" />
                          </div>
                        </div>
                        <p className="text-sm font-medium text-gray-600 mb-1">
                          Total Investors
                        </p>
                        <p className="text-2xl font-bold text-gray-900 mb-2">
                          {metricsLoading
                            ? "Loading..."
                            : metrics?.totalInvestors?.toLocaleString() ||
                              "0"}
                        </p>
                        <p className="text-xs text-gray-500 leading-tight">
                          Registered investor users
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-l-4 border-cyan-200 hover:shadow-lg transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <div className="p-2 rounded-lg bg-cyan-50">
                            <Activity className="h-5 w-5 text-cyan-600" />
                          </div>
                        </div>
                        <p className="text-sm font-medium text-gray-600 mb-1">
                          Bookings Today
                        </p>
                        <p className="text-2xl font-bold text-gray-900 mb-2">
                          {metricsLoading
                            ? "Loading..."
                            : metrics?.bookingsToday?.toLocaleString() ||
                              "0"}
                        </p>
                        <p className="text-xs text-gray-500 leading-tight">
                          New bookings created today
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-l-4 border-orange-200 hover:shadow-lg transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <div className="p-2 rounded-lg bg-orange-50">
                            <Clock className="h-5 w-5 text-orange-600" />
                          </div>
                        </div>
                        <p className="text-sm font-medium text-gray-600 mb-1">
                          Pending Approvals
                        </p>
                        <p className="text-2xl font-bold text-gray-900 mb-2">
                          {metricsLoading
                            ? "Loading..."
                            : metrics?.totalPendingRequest?.toLocaleString() ||
                              "0"}
                        </p>
                        <p className="text-xs text-gray-500 leading-tight">
                          Items waiting for admin approval
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Interactive Charts */}
              <div className="grid grid-cols-1 gap-6 mb-8">
                {/* Investment Chart */}
                <Card className="col-span-1">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="flex items-center gap-2">
                        <TrendingUp className="h-5 w-5 text-blue-600" />
                        Investment
                      </CardTitle>
                      <Select
                        value={investmentFilter}
                        onValueChange={setInvestmentFilter}
                      >
                        <SelectTrigger className="w-32">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="weekly">Weekly</SelectItem>
                          <SelectItem value="bi-weekly">Bi-Weekly</SelectItem>
                          <SelectItem value="monthly">Monthly</SelectItem>
                          <SelectItem value="yearly">Yearly</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={300}>
                      <LineChart data={generateInvestmentData(investmentFilter)}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="period" />
                        <YAxis />
                        <Tooltip
                          formatter={(value) => [
                            `$${value.toLocaleString()}`,
                            "Investment",
                          ]}
                        />
                        <Line
                          type="monotone"
                          dataKey="investment"
                          stroke="#2563eb"
                          strokeWidth={2}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>

                {/* Total Properties Listed Chart */}
                <Card className="col-span-1">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="flex items-center gap-2">
                        <Building2 className="h-5 w-5 text-emerald-600" />
                        Total Properties Listed
                      </CardTitle>
                      <Select
                        value={propertiesFilter}
                        onValueChange={setPropertiesFilter}
                      >
                        <SelectTrigger className="w-32">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="weekly">Weekly</SelectItem>
                          <SelectItem value="bi-weekly">Bi-Weekly</SelectItem>
                          <SelectItem value="monthly">Monthly</SelectItem>
                          <SelectItem value="yearly">Yearly</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={300}>
                      <BarChart data={generatePropertiesListedData(propertiesFilter)}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="period" />
                        <YAxis />
                        <Tooltip
                          formatter={(value) => [
                            value.toLocaleString(),
                            "Properties",
                          ]}
                        />
                        <Bar dataKey="properties" fill="#059669" />
                      </BarChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>

                {/* Total Bookings Chart */}
                <Card className="col-span-1">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="flex items-center gap-2">
                        <Calendar className="h-5 w-5 text-purple-600" />
                        Total Bookings
                      </CardTitle>
                      <Select
                        value={bookingsFilter}
                        onValueChange={setBookingsFilter}
                      >
                        <SelectTrigger className="w-32">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="weekly">Weekly</SelectItem>
                          <SelectItem value="monthly">Monthly</SelectItem>
                          <SelectItem value="yearly">Yearly</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={300}>
                      <BarChart data={generateBookingsData(bookingsFilter)}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="period" />
                        <YAxis />
                        <Tooltip
                          formatter={(value) => [
                            value.toLocaleString(),
                            "Bookings",
                          ]}
                        />
                        <Bar dataKey="bookings" fill="#9333ea" />
                      </BarChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>

                {/* Rental Payouts Chart */}
                <Card className="col-span-1">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="flex items-center gap-2">
                        <DollarSign className="h-5 w-5 text-emerald-600" />
                        Rental Payouts
                      </CardTitle>
                      <Select
                        value={payoutsFilter}
                        onValueChange={setPayoutsFilter}
                      >
                        <SelectTrigger className="w-32">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="monthly">Monthly</SelectItem>
                          <SelectItem value="quarterly">Quarterly</SelectItem>
                          <SelectItem value="yearly">Yearly</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={300}>
                      <LineChart data={generatePayoutsData(payoutsFilter)}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="period" />
                        <YAxis />
                        <Tooltip
                          formatter={(value) => [
                            `$${value.toLocaleString()}`,
                            "Payouts",
                          ]}
                        />
                        <Line
                          type="monotone"
                          dataKey="payouts"
                          stroke="#059669"
                          strokeWidth={2}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>
              </div>
            </>
          )}
        </main>
      </div>
    </div>
  );
}