
import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { PlatformFee } from '../types';
import { Edit, Trash2 } from 'lucide-react';

interface PlatformFeeTableProps {
  fees: PlatformFee[];
  onEdit: (fee: PlatformFee) => void;
  onDelete: (fee: PlatformFee) => void;
  isLoading?: boolean;
}

export function PlatformFeeTable({ fees, onEdit, onDelete, isLoading }: PlatformFeeTableProps) {
  const formatValue = (fee: PlatformFee) => {
    if (fee.feeType === 'Flat') {
      return `$${fee.value.toLocaleString()}`;
    } else {
      return `${fee.value}%`;
    }
  };

  const getAppliesToBadgeColor = (appliesTo: string) => {
    switch (appliesTo) {
      case 'Residential':
        return 'bg-blue-100 text-blue-800';
      case 'Commercial':
        return 'bg-green-100 text-green-800';
      case 'Both':
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getFeeTypeBadgeColor = (feeType: string) => {
    return feeType === 'Flat' 
      ? 'bg-orange-100 text-orange-800' 
      : 'bg-cyan-100 text-cyan-800';
  };

  if (isLoading) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="p-8 text-center">
          <div className="text-gray-500">Loading platform fees...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="text-left py-4 px-6 font-medium text-gray-700 text-sm">Fee Type</th>
              <th className="text-left py-4 px-6 font-medium text-gray-700 text-sm">Value</th>
              <th className="text-left py-4 px-6 font-medium text-gray-700 text-sm">Applies To</th>
              <th className="text-left py-4 px-6 font-medium text-gray-700 text-sm">Created</th>
              <th className="text-left py-4 px-6 font-medium text-gray-700 text-sm">Actions</th>
            </tr>
          </thead>
          <tbody>
            {fees.length === 0 ? (
              <tr>
                <td colSpan={5} className="py-16 px-6 text-center">
                  <div className="flex flex-col items-center space-y-3">
                    <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center">
                      <span className="text-2xl">💰</span>
                    </div>
                    <div className="text-center">
                      <p className="text-gray-600 font-medium">No platform fees found.</p>
                      <p className="text-gray-500 text-sm mt-1">
                        Create your first platform fee setting.
                      </p>
                    </div>
                  </div>
                </td>
              </tr>
            ) : (
              fees.map((fee) => (
                <tr key={fee.id} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="py-4 px-6">
                    <Badge className={getFeeTypeBadgeColor(fee.feeType)}>
                      {fee.feeType}
                    </Badge>
                  </td>
                  <td className="py-4 px-6">
                    <div className="font-medium text-gray-900">
                      {formatValue(fee)}
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <Badge className={getAppliesToBadgeColor(fee.appliesTo)}>
                      {fee.appliesTo}
                    </Badge>
                  </td>
                  <td className="py-4 px-6">
                    <div className="text-gray-600 text-sm">
                      {new Date(fee.createdAt).toLocaleDateString()}
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => onEdit(fee)}
                        className="flex items-center gap-1"
                      >
                        <Edit className="h-3 w-3" />
                        Edit
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => onDelete(fee)}
                        className="flex items-center gap-1 text-red-600 hover:text-red-700 hover:bg-red-50"
                      >
                        <Trash2 className="h-3 w-3" />
                        Delete
                      </Button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
