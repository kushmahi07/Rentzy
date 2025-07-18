
export const getKycStatusBadge = (status: string) => {
  switch (status) {
    case 'verified':
      return 'bg-green-100 text-green-800';
    case 'pending':
      return 'bg-yellow-100 text-yellow-800';
    case 'rejected':
      return 'bg-red-100 text-red-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

export const getUserRoleDisplay = (userRoles: string[]) => {
  if (!userRoles || userRoles.length === 0) return 'No Role';
  if (userRoles.length === 1) return userRoles[0].charAt(0).toUpperCase() + userRoles[0].slice(1);
  if (userRoles.includes('renter') && userRoles.includes('investor')) return 'Renter & Investor';
  return userRoles.map(type => type.charAt(0).toUpperCase() + type.slice(1)).join(', ');
};

export const calculateGainLoss = (purchaseValue: number, currentValue: number) => {
  const difference = currentValue - purchaseValue;
  const percentage = (difference / purchaseValue) * 100;
  return {
    amount: Math.abs(difference),
    percentage: percentage.toFixed(2),
    isPositive: percentage >= 0
  };
};

export const getUserDisplayName = (user: any) => {
  return user?.fullName || user?.name?.fullName || 'Unknown User';
};

export const getUserInitials = (user: any) => {
  const name = getUserDisplayName(user);
  return (name + '').split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
};
