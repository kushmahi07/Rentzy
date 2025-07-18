import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Plus, Edit, Trash2, Shield, ShieldCheck, ShieldX } from "lucide-react";
import { apiRequest } from "@/shared/lib/queryClient";
import { useToast } from "@/shared/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { propertyManagerSchema, PERMISSIONS, PERMISSION_LABELS, type PropertyManagerData } from "@shared/schema";

interface PropertyManager {
  id: number;
  name: string;
  email: string;
  mobile: string;
  permissions: string[];
  isActive: boolean;
  createdAt: string;
}

interface FormData {
  name: string;
  email: string;
  mobile: string;
  permissions: string[];
}

export default function RoleManagement() {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<PropertyManager | null>(null);
  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
    mobile: "",
    permissions: []
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch Property Managers
  const { data: propertyManagers, isLoading } = useQuery({
    queryKey: ["/api/property-managers"],
    select: (data: any) => data.data as PropertyManager[]
  });

  // Create Property Manager mutation
  const createMutation = useMutation({
    mutationFn: async (data: PropertyManagerData) => {
      const response = await fetch("/api/property-managers", {
        method: "POST",
        body: JSON.stringify(data),
        headers: { "Content-Type": "application/json" }
      });
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Failed to create Property Manager");
      }
      return await response.json();
    },
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: ["/api/property-managers"] });
      setIsCreateDialogOpen(false);
      resetForm();
      toast({
        title: "Success",
        description: `Property Manager created successfully. Default password: ${response.defaultPassword}`,
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to create Property Manager",
        variant: "destructive",
      });
    },
  });

  // Update Property Manager mutation
  const updateMutation = useMutation({
    mutationFn: async ({ id, data }: { id: number; data: PropertyManagerData }) => {
      const response = await fetch(`/api/property-managers/${id}`, {
        method: "PUT",
        body: JSON.stringify(data),
        headers: { "Content-Type": "application/json" }
      });
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Failed to update Property Manager");
      }
      return await response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/property-managers"] });
      setIsEditDialogOpen(false);
      setEditingUser(null);
      resetForm();
      toast({
        title: "Success",
        description: "Property Manager updated successfully",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to update Property Manager",
        variant: "destructive",
      });
    },
  });

  // Delete Property Manager mutation
  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      const response = await fetch(`/api/property-managers/${id}`, {
        method: "DELETE"
      });
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Failed to delete Property Manager");
      }
      return await response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/property-managers"] });
      toast({
        title: "Success",
        description: "Property Manager deleted successfully",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to delete Property Manager",
        variant: "destructive",
      });
    },
  });

  // Toggle status mutation
  const toggleStatusMutation = useMutation({
    mutationFn: async (id: number) => {
      const response = await fetch(`/api/property-managers/${id}/toggle-status`, {
        method: "PATCH"
      });
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Failed to update status");
      }
      return await response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/property-managers"] });
      toast({
        title: "Success",
        description: "Property Manager status updated successfully",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to update status",
        variant: "destructive",
      });
    },
  });

  const resetForm = () => {
    setFormData({
      name: "",
      email: "",
      mobile: "",
      permissions: []
    });
    setErrors({});
  };

  const validateForm = () => {
    try {
      propertyManagerSchema.parse({
        ...formData,
        role: "property_manager"
      });
      setErrors({});
      return true;
    } catch (error: any) {
      const newErrors: Record<string, string> = {};
      error.errors?.forEach((err: any) => {
        newErrors[err.path[0]] = err.message;
      });
      setErrors(newErrors);
      return false;
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    const data: PropertyManagerData = {
      ...formData,
      role: "property_manager"
    };

    if (editingUser) {
      updateMutation.mutate({ id: editingUser.id, data });
    } else {
      createMutation.mutate(data);
    }
  };

  const handleEdit = (user: PropertyManager) => {
    setEditingUser(user);
    setFormData({
      name: user.name,
      email: user.email,
      mobile: user.mobile,
      permissions: user.permissions
    });
    setIsEditDialogOpen(true);
  };

  const handlePermissionChange = (permission: string, checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      permissions: checked
        ? [...prev.permissions, permission]
        : prev.permissions.filter(p => p !== permission)
    }));
  };

  const openCreateDialog = () => {
    resetForm();
    setIsCreateDialogOpen(true);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <Shield className="h-8 w-8 text-blue-400" />
              <div>
                <h1 className="text-3xl font-bold text-white">Role Management</h1>
                <p className="text-gray-300">Create and manage Property Manager sub-admin accounts</p>
              </div>
            </div>
            <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
              <DialogTrigger asChild>
                <Button 
                  onClick={openCreateDialog}
                  size="lg"
                  className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-semibold px-8 py-3 rounded-lg shadow-lg transition-all duration-200 transform hover:scale-105"
                >
                  <Plus className="mr-2 h-5 w-5" />
                  Create Sub-Admin Account
                </Button>
              </DialogTrigger>
              <PropertyManagerDialog
                isOpen={isCreateDialogOpen}
                onClose={() => setIsCreateDialogOpen(false)}
                formData={formData}
                setFormData={setFormData}
                errors={errors}
                onSubmit={handleSubmit}
                handlePermissionChange={handlePermissionChange}
                isLoading={createMutation.isPending}
                title="Create Property Manager Sub-Admin"
                description="Create a new sub-admin account with delegated responsibilities and access rights"
              />
            </Dialog>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="bg-gray-800/50 border-gray-700 backdrop-blur-sm">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-300">Total Property Managers</CardTitle>
              <Shield className="h-4 w-4 text-blue-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">{propertyManagers?.length || 0}</div>
            </CardContent>
          </Card>
          <Card className="bg-gray-800/50 border-gray-700 backdrop-blur-sm">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-300">Active Accounts</CardTitle>
              <ShieldCheck className="h-4 w-4 text-green-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">
                {propertyManagers?.filter(pm => pm.isActive).length || 0}
              </div>
            </CardContent>
          </Card>
          <Card className="bg-gray-800/50 border-gray-700 backdrop-blur-sm">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-300">Inactive Accounts</CardTitle>
              <ShieldX className="h-4 w-4 text-red-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">
                {propertyManagers?.filter(pm => !pm.isActive).length || 0}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Information Card */}
        <Card className="bg-gradient-to-r from-blue-900/20 to-purple-900/20 border-blue-700/30 backdrop-blur-sm mb-8">
          <CardContent className="p-6">
            <div className="flex items-start gap-4">
              <div className="p-3 bg-blue-600/20 rounded-lg">
                <Shield className="h-6 w-6 text-blue-400" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-white mb-2">Delegate Administrative Tasks</h3>
                <p className="text-gray-300 text-sm leading-relaxed">
                  Create Property Manager sub-admin accounts to delegate specific responsibilities. 
                  Each account can be assigned targeted permissions and access rights that can be 
                  modified or revoked at any time.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Property Managers Table */}
        <Card className="bg-gray-800/30 border-gray-700 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-white">Property Managers</CardTitle>
            <CardDescription className="text-gray-300">
              Manage all Property Manager accounts and their permissions
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="rounded-md border border-gray-700 overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow className="border-gray-700 bg-gray-800/50">
                    <TableHead className="text-gray-300">Name</TableHead>
                    <TableHead className="text-gray-300">Email</TableHead>
                    <TableHead className="text-gray-300">Mobile</TableHead>
                    <TableHead className="text-gray-300">Permissions</TableHead>
                    <TableHead className="text-gray-300">Status</TableHead>
                    <TableHead className="text-gray-300">Created</TableHead>
                    <TableHead className="text-gray-300">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {propertyManagers?.map((user) => (
                    <TableRow key={user.id} className="border-gray-700 hover:bg-gray-800/30">
                      <TableCell className="font-medium text-white">{user.name}</TableCell>
                      <TableCell className="text-gray-300">{user.email}</TableCell>
                      <TableCell className="text-gray-300">{user.mobile}</TableCell>
                      <TableCell>
                        <div className="flex flex-wrap gap-1">
                          {user.permissions.map((permission) => (
                            <Badge
                              key={permission}
                              variant="secondary"
                              className="text-xs bg-blue-600/20 text-blue-300 border-blue-600/30"
                            >
                              {PERMISSION_LABELS[permission as keyof typeof PERMISSION_LABELS]}
                            </Badge>
                          ))}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={user.isActive ? "default" : "destructive"}
                          className={user.isActive 
                            ? "bg-green-600/20 text-green-300 border-green-600/30" 
                            : "bg-red-600/20 text-red-300 border-red-600/30"
                          }
                        >
                          {user.isActive ? "Active" : "Inactive"}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-gray-300">
                        {new Date(user.createdAt).toLocaleDateString()}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleEdit(user)}
                            className="border-gray-600 text-gray-300 hover:bg-gray-700 hover:text-white"
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => toggleStatusMutation.mutate(user.id)}
                            className={`border-gray-600 hover:bg-gray-700 ${
                              user.isActive ? "text-yellow-400 hover:text-yellow-300" : "text-green-400 hover:text-green-300"
                            }`}
                          >
                            {user.isActive ? <ShieldX className="h-4 w-4" /> : <ShieldCheck className="h-4 w-4" />}
                          </Button>
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button
                                variant="outline"
                                size="sm"
                                className="border-gray-600 text-red-400 hover:bg-red-900/20 hover:text-red-300"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent className="bg-gray-800 border-gray-700">
                              <AlertDialogHeader>
                                <AlertDialogTitle className="text-white">Delete Property Manager</AlertDialogTitle>
                                <AlertDialogDescription className="text-gray-300">
                                  Are you sure you want to delete {user.name}? This action cannot be undone.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel className="bg-gray-700 text-gray-300 border-gray-600 hover:bg-gray-600">
                                  Cancel
                                </AlertDialogCancel>
                                <AlertDialogAction
                                  onClick={() => deleteMutation.mutate(user.id)}
                                  className="bg-red-600 hover:bg-red-700 text-white"
                                >
                                  Delete
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                  {(!propertyManagers || propertyManagers.length === 0) && (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center py-8 text-gray-400">
                        No Property Managers found. Create your first Property Manager account.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>

        {/* Edit Dialog */}
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <PropertyManagerDialog
            isOpen={isEditDialogOpen}
            onClose={() => {
              setIsEditDialogOpen(false);
              setEditingUser(null);
            }}
            formData={formData}
            setFormData={setFormData}
            errors={errors}
            onSubmit={handleSubmit}
            handlePermissionChange={handlePermissionChange}
            isLoading={updateMutation.isPending}
            title="Edit Property Manager"
            description="Update Property Manager account details and permissions"
          />
        </Dialog>
      </div>
    </div>
  );
}

// Property Manager Dialog Component
interface PropertyManagerDialogProps {
  isOpen: boolean;
  onClose: () => void;
  formData: FormData;
  setFormData: React.Dispatch<React.SetStateAction<FormData>>;
  errors: Record<string, string>;
  onSubmit: (e: React.FormEvent) => void;
  handlePermissionChange: (permission: string, checked: boolean) => void;
  isLoading: boolean;
  title: string;
  description: string;
}

function PropertyManagerDialog({
  isOpen,
  onClose,
  formData,
  setFormData,
  errors,
  onSubmit,
  handlePermissionChange,
  isLoading,
  title,
  description
}: PropertyManagerDialogProps) {
  const permissionDescriptions = {
    [PERMISSIONS.VIEW_EDIT_LISTINGS]: "Allow viewing and editing property listings in the system",
    [PERMISSIONS.APPROVE_LISTINGS]: "Grant authority to approve or reject new property listings",
    [PERMISSIONS.FREEZE_TOKEN_SALE]: "Enable freezing or unfreezing token sales for properties",
    [PERMISSIONS.VIEW_BOOKINGS]: "Provide access to view all property booking information",
    [PERMISSIONS.APPROVE_TRADES]: "Allow approval of property token trades and transactions"
  };

  return (
    <DialogContent className="bg-gray-800 border-gray-700 text-white max-w-3xl max-h-[90vh] overflow-y-auto">
      <DialogHeader>
        <DialogTitle className="text-xl font-semibold text-white flex items-center gap-2">
          <Shield className="h-5 w-5 text-blue-400" />
          {title}
        </DialogTitle>
        <DialogDescription className="text-gray-300">
          {description}
        </DialogDescription>
      </DialogHeader>
      
      <form onSubmit={onSubmit} className="space-y-6">
        {/* Account Details Section */}
        <div className="bg-gray-900/50 rounded-lg p-4 space-y-4">
          <h3 className="text-lg font-medium text-white mb-3">Account Details</h3>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name" className="text-gray-300 font-medium">Full Name *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                className="bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:border-blue-500 focus:ring-blue-500"
                placeholder="Enter full name"
              />
              {errors.name && <p className="text-red-400 text-sm">{errors.name}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="email" className="text-gray-300 font-medium">Email Address *</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                className="bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:border-blue-500 focus:ring-blue-500"
                placeholder="Enter email address"
              />
              {errors.email && <p className="text-red-400 text-sm">{errors.email}</p>}
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="mobile" className="text-gray-300 font-medium">Mobile Number *</Label>
            <Input
              id="mobile"
              value={formData.mobile}
              onChange={(e) => setFormData(prev => ({ ...prev, mobile: e.target.value }))}
              className="bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:border-blue-500 focus:ring-blue-500"
              placeholder="Enter mobile number with country code"
            />
            {errors.mobile && <p className="text-red-400 text-sm">{errors.mobile}</p>}
          </div>

          {/* Role Information */}
          <div className="bg-blue-900/20 border border-blue-700/30 rounded-lg p-3">
            <div className="flex items-center gap-2 mb-2">
              <Shield className="h-4 w-4 text-blue-400" />
              <span className="text-sm font-medium text-blue-300">Role Assignment</span>
            </div>
            <p className="text-sm text-gray-300">
              This account will be assigned the <span className="font-semibold text-blue-300">Property Manager</span> role 
              with delegated administrative responsibilities based on selected permissions.
            </p>
          </div>
        </div>

        {/* Permissions Section */}
        <div className="bg-gray-900/50 rounded-lg p-4 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-medium text-white">Access Rights & Permissions</h3>
            <span className="text-sm text-gray-400">Select at least one permission</span>
          </div>
          
          <div className="space-y-4">
            {Object.entries(PERMISSIONS).map(([key, value]) => (
              <div key={value} className="bg-gray-800/50 rounded-lg p-4 border border-gray-700">
                <div className="flex items-start space-x-3">
                  <Checkbox
                    id={value}
                    checked={formData.permissions.includes(value)}
                    onCheckedChange={(checked) => handlePermissionChange(value, !!checked)}
                    className="border-gray-600 data-[state=checked]:bg-blue-600 data-[state=checked]:border-blue-600 mt-1"
                  />
                  <div className="flex-1">
                    <Label 
                      htmlFor={value}
                      className="text-white font-medium cursor-pointer block mb-1"
                    >
                      {PERMISSION_LABELS[key as keyof typeof PERMISSION_LABELS]}
                    </Label>
                    <p className="text-sm text-gray-400 leading-relaxed">
                      {permissionDescriptions[value]}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
          {errors.permissions && <p className="text-red-400 text-sm mt-2">{errors.permissions}</p>}
        </div>

        {/* Important Notes */}
        <div className="bg-amber-900/20 border border-amber-700/30 rounded-lg p-4">
          <h4 className="text-amber-300 font-medium mb-2">Important Notes</h4>
          <ul className="text-sm text-amber-200/80 space-y-1">
            <li>• A default password will be generated and shared upon account creation</li>
            <li>• The user will be required to change their password on first login</li>
            <li>• Permissions can be modified or revoked at any time</li>
            <li>• All account activities will be logged and auditable</li>
          </ul>
        </div>

        <DialogFooter className="flex gap-3 pt-4">
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            className="border-gray-600 text-gray-300 hover:bg-gray-700 hover:text-white"
          >
            Cancel
          </Button>
          <Button
            type="submit"
            disabled={isLoading || formData.permissions.length === 0}
            className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-semibold min-w-[120px]"
          >
            {isLoading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Creating...
              </>
            ) : (
              title.includes("Create") ? "Create Account" : "Update Account"
            )}
          </Button>
        </DialogFooter>
      </form>
    </DialogContent>
  );
}