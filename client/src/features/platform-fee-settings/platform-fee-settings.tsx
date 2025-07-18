
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Plus, DollarSign, Percent, Settings } from 'lucide-react';
import {
  PlatformFeeFilters,
  PlatformFeeTable,
  PlatformFeeForm,
  DeleteConfirmationModal,
} from './components';
import { usePlatformFeeManagement } from './hooks/usePlatformFeeManagement';

export default function PlatformFeeSettings() {
  const {
    fees,
    allFees,
    filters,
    setFilters,
    isFormOpen,
    isDeleteModalOpen,
    editingFee,
    feeToDelete,
    handleAddNew,
    handleEdit,
    handleDelete,
    handleFormSubmit,
    handleDeleteConfirm,
    handleFormClose,
    handleDeleteModalClose,
  } = usePlatformFeeManagement();

  // Calculate statistics
  const totalFees = allFees.length;
  const flatFees = allFees.filter(fee => fee.feeType === 'Flat').length;
  const percentageFees = allFees.filter(fee => fee.feeType === '%').length;

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Platform Fee Settings</h1>
          <p className="text-gray-600 mt-1">
            Manage maintenance fees for properties across the platform
          </p>
        </div>
        <Button
          onClick={handleAddNew}
          style={{ backgroundColor: '#004182' }}
          className="hover:opacity-90 text-white flex items-center gap-2"
        >
          <Plus className="h-4 w-4" />
          Add New Fee
        </Button>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="border-l-4 border-blue-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">Total Fees</p>
                <p className="text-2xl font-bold text-gray-900">{totalFees}</p>
              </div>
              <div className="p-3 rounded-lg bg-blue-50">
                <Settings className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-green-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">Flat Fees</p>
                <p className="text-2xl font-bold text-gray-900">{flatFees}</p>
              </div>
              <div className="p-3 rounded-lg bg-green-50">
                <DollarSign className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-purple-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">Percentage Fees</p>
                <p className="text-2xl font-bold text-gray-900">{percentageFees}</p>
              </div>
              <div className="p-3 rounded-lg bg-purple-50">
                <Percent className="h-6 w-6 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Info Card */}
      <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
        <CardContent className="p-6">
          <div className="flex items-start space-x-4">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
              <Settings className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Platform Fee Management
              </h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                Configure maintenance fees that will be applied to properties across the platform. 
                Flat fees represent fixed amounts, while percentage fees are calculated based on booking values. 
                Fees apply to all listings of the specified type unless specific overrides are configured.
              </p>
              <div className="flex flex-wrap gap-2 mt-3">
                <Badge variant="outline" className="text-xs">
                  Flat Fees: Fixed amounts up to $100,000
                </Badge>
                <Badge variant="outline" className="text-xs">
                  Percentage Fees: 0-100% of booking value
                </Badge>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Filters */}
      <PlatformFeeFilters
        filters={filters}
        onFiltersChange={setFilters}
      />

      {/* Results Summary */}
      <div className="flex items-center justify-between">
        <div className="text-sm text-gray-600">
          Showing {fees.length} of {allFees.length} platform fees
        </div>
      </div>

      {/* Table */}
      <PlatformFeeTable
        fees={fees}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

      {/* Form Modal */}
      <PlatformFeeForm
        isOpen={isFormOpen}
        onClose={handleFormClose}
        onSubmit={handleFormSubmit}
        editingFee={editingFee}
        existingFees={allFees}
      />

      {/* Delete Confirmation Modal */}
      <DeleteConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={handleDeleteModalClose}
        onConfirm={handleDeleteConfirm}
        fee={feeToDelete}
      />
    </div>
  );
}
