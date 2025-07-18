
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Eye } from "lucide-react";
import { User } from "../../../services/userManagementApi";
import UserAvatar from "./UserAvatar";
import KycStatusBadge from "./KycStatusBadge";
import { getUserDisplayName, getUserRoleDisplay } from "../utils";

interface UserTableProps {
  users: User[];
  onUserSelect: (user: User) => void;
  isLoading: boolean;
  error: any;
}

export default function UserTable({ users, onUserSelect, isLoading, error }: UserTableProps) {
  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="text-gray-500">Loading users...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="text-red-500">Error loading users. Please try again.</div>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b">
            <th className="text-left py-3 px-4 font-medium text-gray-600">User</th>
            <th className="text-left py-3 px-4 font-medium text-gray-600">Contact</th>
            <th className="text-left py-3 px-4 font-medium text-gray-600">User Type</th>
            <th className="text-left py-3 px-4 font-medium text-gray-600">KYC Status</th>
            <th className="text-left py-3 px-4 font-medium text-gray-600">Last Login</th>
            <th className="text-left py-3 px-4 font-medium text-gray-600">Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user._id} className="border-b hover:bg-gray-50">
              <td className="py-4 px-4">
                <div className="flex items-center gap-3">
                  <UserAvatar user={user} />
                  <div>
                    <p className="font-medium">{getUserDisplayName(user)}</p>
                    <p className="text-sm text-gray-600">ID: {user._id}</p>
                  </div>
                </div>
              </td>
              <td className="py-4 px-4">
                <div>
                  <p className="text-sm">{user.email}</p>
                  <p className="text-sm text-gray-600">{user.mobile || user.phoneNumber}</p>
                </div>
              </td>
              <td className="py-4 px-4">
                <Badge variant="outline">
                  {getUserRoleDisplay(user.userRoles)}
                </Badge>
              </td>
              <td className="py-4 px-4">
                <KycStatusBadge status={user.kycStatus || user.kyc?.status} showIcon />
              </td>
              <td className="py-4 px-4">
                <p className="text-sm text-gray-600">
                  {user.lastLogin ? new Date(user.lastLogin).toLocaleDateString() : 'Never'}
                </p>
              </td>
              <td className="py-4 px-4">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => onUserSelect(user)}
                  className="flex items-center gap-2"
                >
                  <Eye className="h-3 w-3" />
                  View Profile
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
