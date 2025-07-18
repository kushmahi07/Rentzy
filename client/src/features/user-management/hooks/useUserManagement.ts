
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { userManagementApi, User, UserFilters } from '../../../services/userManagementApi';
import { RefundFormData } from '../types';

export function useUserManagement() {
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [kycFilter, setKycFilter] = useState("all");
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [showUserProfile, setShowUserProfile] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  // API filters
  const apiFilters: UserFilters = {
    page: currentPage,
    limit: 10,
    search: searchTerm || undefined,
    userType: roleFilter !== "all" ? roleFilter : undefined,
    kyc: kycFilter !== "all" ? kycFilter : undefined,
    sortBy: 'createdAt',
    sortOrder: 'desc'
  };

  // Fetch users from API
  const { data: usersData, isLoading, error } = useQuery({
    queryKey: ['users', apiFilters],
    queryFn: () => userManagementApi.getUsers(apiFilters),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  // Fetch individual user details when viewing profile
  const { data: userDetails, isLoading: isLoadingUserDetails } = useQuery({
    queryKey: ['user', selectedUser?._id],
    queryFn: () => userManagementApi.getUserById(selectedUser!._id),
    enabled: !!selectedUser?._id && showUserProfile,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  // Transform users to add computed properties for backward compatibility
  const users = (usersData?.users || []).map(user => ({
    ...user,
    kycStatus: user.kyc?.status,
    mobile: user.phone?.mobile,
    phoneNumber: user.phone?.mobile,
    fullName: user.name?.fullName,
    userRoles: user.userType
  }));

  const pagination = usersData?.pagination;

  const handleUserSelect = (user: User) => {
    setSelectedUser(user);
    setShowUserProfile(true);
  };

  const handleBackToUserList = () => {
    setSelectedUser(null);
    setShowUserProfile(false);
  };

  const downloadUserReport = (user: User) => {
    // Simulate PDF download
    console.log(`Downloading report for ${user.name.fullName}`);
  };

  return {
    // State
    searchTerm,
    setSearchTerm,
    roleFilter,
    setRoleFilter,
    kycFilter,
    setKycFilter,
    selectedUser,
    showUserProfile,
    currentPage,
    setCurrentPage,
    
    // Data
    users,
    pagination,
    userDetails,
    isLoading,
    isLoadingUserDetails,
    error,
    
    // Handlers
    handleUserSelect,
    handleBackToUserList,
    downloadUserReport
  };
}
