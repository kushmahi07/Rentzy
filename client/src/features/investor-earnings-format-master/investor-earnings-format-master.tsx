
import React from 'react';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  InvestorEarningsFormatFilters,
  InvestorEarningsFormatTable,
  InvestorEarningsFormatFormModal,
  DeleteConfirmationModal,
} from './components';
import { useInvestorEarningsFormatManagement } from './hooks/useInvestorEarningsFormatManagement';

export default function InvestorEarningsFormatMaster() {
  const {
    // Data
    formats,
    filters,
    formData,
    errors,
    loading,
    
    // Modal states
    isFormOpen,
    isDeleteModalOpen,
    editingFormat,
    deletingFormat,
    
    // Handlers
    handleFilterChange,
    handleFormChange,
    handleAddNew,
    handleEdit,
    handleSubmit,
    handleDelete,
    handleConfirmDelete,
    handleCloseForm,
    handleCloseDeleteModal,
  } = useInvestorEarningsFormatManagement();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Investor Earnings Format Master</h2>
          <p className="text-gray-600">
            Manage earnings statement formats for customized investor reports
          </p>
        </div>
        <Button onClick={handleAddNew} className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          Add New Format
        </Button>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Formats</p>
                <p className="text-2xl font-bold text-gray-900">{formats.length}</p>
              </div>
              <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">PDF Formats</p>
                <p className="text-2xl font-bold text-gray-900">
                  {formats.filter(f => f.format === 'PDF').length}
                </p>
              </div>
              <div className="w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center">
                <div className="w-2 h-2 bg-red-600 rounded-full"></div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">CSV Formats</p>
                <p className="text-2xl font-bold text-gray-900">
                  {formats.filter(f => f.format === 'CSV').length}
                </p>
              </div>
              <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                <div className="w-2 h-2 bg-green-600 rounded-full"></div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <InvestorEarningsFormatFilters
        filters={filters}
        onFiltersChange={handleFilterChange}
      />

      {/* Table */}
      <Card>
        <CardHeader>
          <CardTitle>Earnings Formats</CardTitle>
          <CardDescription>
            Manage all investor earnings statement formats and their configurations
          </CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <InvestorEarningsFormatTable
            formats={formats}
            onEdit={handleEdit}
            onDelete={handleDelete}
            loading={loading}
          />
        </CardContent>
      </Card>

      {/* Form Modal */}
      <InvestorEarningsFormatFormModal
        isOpen={isFormOpen}
        onClose={handleCloseForm}
        onSave={handleSubmit}
        editingFormat={editingFormat}
        formData={formData}
        onFormChange={handleFormChange}
        errors={errors}
        loading={loading}
      />

      {/* Delete Modal */}
      <DeleteConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={handleCloseDeleteModal}
        onConfirm={handleConfirmDelete}
        format={deletingFormat}
        loading={loading}
      />
    </div>
  );
}
