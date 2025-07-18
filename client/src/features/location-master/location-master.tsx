
import React from 'react';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  LocationFilters,
  LocationTable,
  LocationForm,
  DeleteConfirmationModal,
} from './components';
import { useLocationManagement } from './hooks/useLocationManagement';

export default function LocationMaster() {
  const {
    // Data
    locations,
    filters,
    formData,
    errors,
    loading,
    
    // Modal states
    isFormOpen,
    isDeleteModalOpen,
    editingLocation,
    deletingLocation,
    
    // Handlers
    handleFilterChange,
    handleInputChange,
    handleAddNew,
    handleEdit,
    handleSubmit,
    handleDelete,
    handleConfirmDelete,
    handleCloseForm,
    handleCloseDeleteModal,
  } = useLocationManagement();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Location Master</h2>
          <p className="text-gray-600">
            Manage supported cities and countries where Rentzy operates
          </p>
        </div>
        <Button onClick={handleAddNew} className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          Add New Location
        </Button>
      </div>

      {/* Filters */}
      <LocationFilters
        filters={filters}
        onFilterChange={handleFilterChange}
      />

      {/* Locations Table */}
      <Card>
        <CardHeader>
          <CardTitle>Locations ({locations.length})</CardTitle>
          <CardDescription>
            Manage cities and countries where your properties can be listed
          </CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <LocationTable
            locations={locations}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        </CardContent>
      </Card>

      {/* Location Form Modal */}
      <LocationForm
        isOpen={isFormOpen}
        onClose={handleCloseForm}
        formData={formData}
        onInputChange={handleInputChange}
        onSubmit={handleSubmit}
        errors={errors}
        isEditing={!!editingLocation}
        loading={loading}
      />

      {/* Delete Confirmation Modal */}
      <DeleteConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={handleCloseDeleteModal}
        onConfirm={handleConfirmDelete}
        location={deletingLocation}
        loading={loading}
      />
    </div>
  );
}
