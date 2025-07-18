
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import { User } from "../../../services/userManagementApi";
import UserAvatar from "./UserAvatar";
import { getUserDisplayName } from "../utils";

interface UserProfileHeaderProps {
  user: User | null;
  userDetails: any;
  isLoading: boolean;
  onDownloadReport: (user: any) => void;
}

export default function UserProfileHeader({ 
  user, 
  userDetails, 
  isLoading, 
  onDownloadReport 
}: UserProfileHeaderProps) {
  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="text-gray-500">Loading user details...</div>
      </div>
    );
  }

  const displayUser = userDetails || user;

  return (
    <div className="flex items-center gap-4">
      <UserAvatar user={displayUser} size="lg" />
      <div>
        <h1 className="text-2xl font-bold text-gray-900">
          {getUserDisplayName(displayUser) || 'System Administrator'}
        </h1>
        <p className="text-gray-600">{displayUser?.email}</p>
      </div>
      <div className="ml-auto">
        <Button
          onClick={() => onDownloadReport(displayUser)}
          className="bg-blue-600 hover:bg-blue-700 text-white"
        >
          <Download className="h-4 w-4 mr-2" />
          Download Report
        </Button>
      </div>
    </div>
  );
}
