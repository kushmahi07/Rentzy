
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, Calendar, TrendingUp } from 'lucide-react';

// Hooks
import { useEventFestivalManagement } from './hooks/useEventFestivalManagement';

// Components
import {
  EventFestivalTable,
  EventFestivalFilters,
  EventFestivalFormModal,
  DeleteConfirmationModal
} from './components';

export default function EventFestivalCalendarMaster() {
  const {
    // Data
    events,
    allEvents,
    loading,
    
    // Filters
    filters,
    
    // Form state
    showForm,
    editingEvent,
    formData,
    validationErrors,
    
    // Delete state
    showDeleteModal,
    eventToDelete,
    
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
  } = useEventFestivalManagement();

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading events...</p>
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
            <h1 className="text-2xl font-bold text-gray-900">Event/Festival Calendar Master</h1>
            <p className="text-gray-600">Manage pricing adjustments for high-demand events</p>
          </div>
        </div>
        <Button onClick={handleAddNew} className="flex items-center space-x-2">
          <Plus className="h-4 w-4" />
          <span>Add New Event</span>
        </Button>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="border-l-4 border-blue-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">Total Events</p>
                <p className="text-2xl font-bold text-gray-900">{allEvents.length}</p>
              </div>
              <div className="p-3 rounded-lg bg-blue-50">
                <Calendar className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-green-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">Active Events</p>
                <p className="text-2xl font-bold text-gray-900">
                  {allEvents.filter(event => new Date(event.endDate) >= new Date()).length}
                </p>
              </div>
              <div className="p-3 rounded-lg bg-green-50">
                <TrendingUp className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-purple-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">Avg Multiplier</p>
                <p className="text-2xl font-bold text-gray-900">
                  {allEvents.length > 0 
                    ? (allEvents.reduce((sum, event) => sum + event.multiplier, 0) / allEvents.length).toFixed(2)
                    : '0.00'
                  }x
                </p>
              </div>
              <div className="p-3 rounded-lg bg-purple-50">
                <TrendingUp className="h-6 w-6 text-purple-600" />
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
              <Calendar className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Event Pricing Management
              </h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                Configure pricing multipliers for special events and festivals to optimize revenue during high-demand periods. 
                Events must be linked to active locations and cannot overlap for the same location.
                The multiplier will automatically adjust property pricing during the event dates.
              </p>
              <div className="flex flex-wrap gap-2 mt-3">
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                  Multiplier Range: 0.5x - 5.0x
                </span>
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                  No Overlapping Events
                </span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Main Content */}
      <Card>
        <CardHeader>
          <CardTitle>Event Calendar</CardTitle>
          <CardDescription>
            Manage events and festivals that affect property pricing
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Filters */}
          <EventFestivalFilters 
            filters={filters} 
            onFilterChange={handleFilterChange} 
          />

          {/* Results Summary */}
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-600">
              Showing {events.length} of {allEvents.length} events
            </div>
          </div>

          {/* Table */}
          <EventFestivalTable
            events={events}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        </CardContent>
      </Card>

      {/* Form Modal */}
      <EventFestivalFormModal
        isOpen={showForm}
        editingEvent={editingEvent}
        formData={formData}
        validationErrors={validationErrors}
        onSubmit={handleFormSubmit}
        onCancel={handleFormCancel}
        onChange={handleFormChange}
      />

      {/* Delete Confirmation Modal */}
      <DeleteConfirmationModal
        isOpen={showDeleteModal}
        eventName={eventToDelete ? eventToDelete.eventName : ''}
        onConfirm={handleConfirmDelete}
        onCancel={handleCancelDelete}
      />
    </div>
  );
}
