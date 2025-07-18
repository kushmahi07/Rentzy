import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useToast } from "@/shared/hooks/use-toast";
import { apiRequest, queryClient } from "@/shared/lib/queryClient";
import { Settings as SettingsIcon, Save, RefreshCw } from "lucide-react";

interface Setting {
  id: number;
  category: string;
  key: string;
  value: string;
  description: string;
  dataType: 'string' | 'number' | 'boolean';
  isEditable: boolean;
  lastUpdatedBy?: number;
  createdAt: Date;
  updatedAt: Date;
}

interface GroupedSettings {
  general: Setting[];
  admin_preferences: Setting[];
  security: Setting[];
}

export default function Settings() {
  const { toast } = useToast();
  const [formData, setFormData] = useState<Record<string, string>>({});

  // Fetch all settings
  const { data: settings, isLoading, refetch } = useQuery<GroupedSettings>({
    queryKey: ["/api/settings"],
    select: (data: any) => data.data || {}
  });

  // Update settings mutation
  const updateSettingsMutation = useMutation({
    mutationFn: async (updates: { key: string; value: string }[]) => {
      const response = await fetch("/api/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ settings: updates })
      });
      if (!response.ok) throw new Error('Failed to update settings');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/settings"] });
      toast({
        title: "Settings Updated",
        description: "Your settings have been saved successfully.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to update settings",
        variant: "destructive",
      });
    },
  });

  const handleInputChange = (key: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const handleSaveSettings = () => {
    if (Object.keys(formData).length === 0) {
      toast({
        title: "No Changes",
        description: "No settings have been modified.",
        variant: "destructive",
      });
      return;
    }

    const updates = Object.entries(formData).map(([key, value]) => ({
      key,
      value
    }));

    updateSettingsMutation.mutate(updates);
  };

  const renderSettingField = (setting: Setting) => {
    const currentValue = formData[setting.key] !== undefined ? formData[setting.key] : setting.value;

    if (!setting.isEditable) {
      return (
        <div className="flex items-center justify-between py-3 border-b border-gray-100 last:border-b-0">
          <div className="flex-1">
            <Label className="text-sm font-medium text-gray-700">{setting.description}</Label>
            <p className="text-xs text-gray-500 mt-1">Read-only setting</p>
          </div>
          <div className="text-sm text-gray-600 bg-gray-50 px-3 py-1 rounded">
            {setting.value}
          </div>
        </div>
      );
    }

    switch (setting.dataType) {
      case 'boolean':
        return (
          <div className="flex items-center justify-between py-3 border-b border-gray-100 last:border-b-0">
            <div className="flex-1">
              <Label className="text-sm font-medium text-gray-700">{setting.description}</Label>
              <p className="text-xs text-gray-500 mt-1">Key: {setting.key}</p>
            </div>
            <Switch
              checked={currentValue === 'true'}
              onCheckedChange={(checked) => handleInputChange(setting.key, checked.toString())}
            />
          </div>
        );
      
      case 'number':
        return (
          <div className="space-y-2 py-3 border-b border-gray-100 last:border-b-0">
            <Label className="text-sm font-medium text-gray-700">{setting.description}</Label>
            <p className="text-xs text-gray-500">Key: {setting.key}</p>
            <Input
              type="number"
              value={currentValue}
              onChange={(e) => handleInputChange(setting.key, e.target.value)}
              className="max-w-32"
            />
          </div>
        );
      
      default: // string
        return (
          <div className="space-y-2 py-3 border-b border-gray-100 last:border-b-0">
            <Label className="text-sm font-medium text-gray-700">{setting.description}</Label>
            <p className="text-xs text-gray-500">Key: {setting.key}</p>
            <Input
              type="text"
              value={currentValue}
              onChange={(e) => handleInputChange(setting.key, e.target.value)}
            />
          </div>
        );
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Settings</h2>
            <p className="text-gray-600">Manage your platform settings and preferences</p>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="animate-pulse">
              <CardHeader>
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                <div className="h-3 bg-gray-200 rounded w-1/2"></div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="h-3 bg-gray-200 rounded"></div>
                  <div className="h-3 bg-gray-200 rounded w-5/6"></div>
                  <div className="h-3 bg-gray-200 rounded w-4/6"></div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Settings</h2>
          <p className="text-gray-600">Manage your platform settings and preferences</p>
        </div>
        <div className="flex items-center gap-3">
          <Button
            onClick={() => refetch()}
            variant="outline"
            size="sm"
            disabled={isLoading}
            className="flex items-center gap-2"
          >
            <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
          <Button
            onClick={handleSaveSettings}
            disabled={updateSettingsMutation.isPending || Object.keys(formData).length === 0}
            className="flex items-center gap-2"
            style={{ backgroundColor: '#004182' }}
          >
            <Save className="h-4 w-4" />
            {updateSettingsMutation.isPending ? 'Saving...' : 'Save Changes'}
          </Button>
        </div>
      </div>

      {/* Settings Sections */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {/* General Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <SettingsIcon className="h-5 w-5 text-blue-600" />
              General Settings
            </CardTitle>
            <CardDescription>
              Basic platform configuration and general preferences
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-1">
              {settings?.general?.map((setting) => (
                <div key={setting.key}>
                  {renderSettingField(setting)}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Admin Preferences */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <SettingsIcon className="h-5 w-5 text-emerald-600" />
              Admin Preferences
            </CardTitle>
            <CardDescription>
              Customize your admin dashboard experience and workflow
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-1">
              {settings?.admin_preferences?.map((setting) => (
                <div key={setting.key}>
                  {renderSettingField(setting)}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Security Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <SettingsIcon className="h-5 w-5 text-red-600" />
              Security Settings
            </CardTitle>
            <CardDescription>
              Security policies and authentication requirements
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-1">
              {settings?.security?.map((setting) => (
                <div key={setting.key}>
                  {renderSettingField(setting)}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Save Changes Notice */}
      {Object.keys(formData).length > 0 && (
        <Card className="border-orange-200 bg-orange-50">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-orange-500 rounded-full animate-pulse"></div>
                <span className="text-sm text-orange-800">
                  You have {Object.keys(formData).length} unsaved change{Object.keys(formData).length > 1 ? 's' : ''}
                </span>
              </div>
              <Button
                onClick={handleSaveSettings}
                size="sm"
                className="bg-orange-600 hover:bg-orange-700"
              >
                Save Now
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}