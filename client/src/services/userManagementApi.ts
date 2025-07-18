import { API_ENDPOINTS } from '../constants/api';

export interface UserFilters {
  page?: number;
  limit?: number;
  search?: string;
  status?: string;
  userType?: string;
  role?: string;
  kyc?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface User {
  _id: string;
  name: {
    firstName: string;
    lastName: string;
    fullName: string;
  };
  email: string;
  phone: {
    countryCode: string;
    mobile: string;
  };
  userType: string[];
  kyc: {
    status: 'verified' | 'pending' | 'rejected';
  };
  status: string;
  createdAt: string;
  lastLogin?: string;
  // Add computed properties for backward compatibility
  kycStatus?: 'verified' | 'pending' | 'rejected';
  mobile?: string;
  phoneNumber?: string;
  fullName?: string;
  userRoles?: string[];
}

export interface UserResponse {
  users: User[];
  pagination: {
    currentPage: number;
    totalPages: number;
    totalUsers: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
  };
}

export const userManagementApi = {
  getUsers: async (filters: UserFilters = {}): Promise<UserResponse> => {
    const queryParams = new URLSearchParams();

    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        queryParams.append(key, value.toString());
      }
    });

    const response = await fetch(`${API_ENDPOINTS.USERS.BASE}?${queryParams}`);

    if (!response.ok) {
      throw new Error('Failed to fetch users');
    }

    const data = await response.json();
    return data.data;
  },

  getUserById: async (userId: string): Promise<User> => {
    const response = await fetch(`${API_ENDPOINTS.USERS.BASE}/${userId}`);

    if (!response.ok) {
      throw new Error('Failed to fetch user');
    }

    const data = await response.json();
    return data.data;
  }
};