
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, Calendar } from 'lucide-react';

// Hooks
import { useBookingCalendarManagement } from './hooks/useBookingCalendarManagement';

// Components
import {
  BookingRuleTable,
  BookingRuleFilters,
  BookingRuleFormModal,
  DeleteConfirmationModal
} from './components';

export default function BookingCalendarMaster() {
  const {
    // Data
    rules,
    filteredRules,
    loading,
    
    // Filters
    filters,
    
    // Form state
    showForm,
    editingRule,
    formData,
    validationErrors,
    
    // Delete state
    showDeleteModal,
    ruleToDelete,
    
    // Handlers
    handleFilterChange,
    handleAddNew,
    handleEdit,
    handleDelete,
    handleFormSubmit,
    handleFormCancel,
    handleFormChange,
    handleConfirmDelete,
    handleCancelDelete
  } = useBookingCalendarManagement();

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading booking rules...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <Calendar className="h-8 w-8 text-blue-600" />
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Booking Calendar Master</h1>
            <p className="text-gray-600">Manage global booking rules and policies</p>
          </div>
        </div>
        <Button onClick={handleAddNew} className="flex items-center space-x-2">
          <Plus className="h-4 w-4" />
          <span>Add New Rule</span>
        </Button>
      </div>

      {/* Main Content */}
      <Card>
        <CardHeader>
          <CardTitle>Booking Rules</CardTitle>
          <CardDescription>
            Configure global booking policies that apply across all properties
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Filters */}
          <BookingRuleFilters 
            filters={filters} 
            onFilterChange={handleFilterChange} 
          />

          {/* Table */}
          <BookingRuleTable
            rules={filteredRules}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        </CardContent>
      </Card>

      {/* Form Modal */}
      <BookingRuleFormModal
        isOpen={showForm}
        editingRule={editingRule}
        formData={formData}
        validationErrors={validationErrors}
        onSubmit={handleFormSubmit}
        onCancel={handleFormCancel}
        onChange={handleFormChange}
      />

      {/* Delete Confirmation Modal */}
      <DeleteConfirmationModal
        isOpen={showDeleteModal}
        ruleName={ruleToDelete ? `Rule ${ruleToDelete.id}` : ''}
        onConfirm={handleConfirmDelete}
        onCancel={handleCancelDelete}
      />
    </div>
  );
}
