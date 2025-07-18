
import { useState, useMemo } from 'react';
import { EventFestival, EventFestivalFormData, EventFestivalFiltersType, ValidationErrors } from '../types';
import { mockEventFestivals } from '../mockData';

export function useEventFestivalManagement() {
  const [events, setEvents] = useState<EventFestival[]>(mockEventFestivals);
  const [filters, setFilters] = useState<EventFestivalFiltersType>({
    location: 'all',
    startDate: '',
    endDate: '',
  });
  const [showForm, setShowForm] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [editingEvent, setEditingEvent] = useState<EventFestival | undefined>();
  const [eventToDelete, setEventToDelete] = useState<EventFestival | null>(null);
  const [formData, setFormData] = useState<EventFestivalFormData>({
    eventName: '',
    startDate: '',
    endDate: '',
    location: '',
    multiplier: 1.0,
  });
  const [validationErrors, setValidationErrors] = useState<ValidationErrors>({});
  const [loading] = useState(false);

  // Filter events based on current filters
  const filteredEvents = useMemo(() => {
    return events.filter((event) => {
      const matchesLocation = filters.location === 'all' || event.location === filters.location;
      
      const matchesDateRange = (() => {
        if (!filters.startDate && !filters.endDate) return true;
        
        const eventStart = new Date(event.startDate);
        const eventEnd = new Date(event.endDate);
        const filterStart = filters.startDate ? new Date(filters.startDate) : null;
        const filterEnd = filters.endDate ? new Date(filters.endDate) : null;
        
        if (filterStart && filterEnd) {
          return eventStart <= filterEnd && eventEnd >= filterStart;
        } else if (filterStart) {
          return eventEnd >= filterStart;
        } else if (filterEnd) {
          return eventStart <= filterEnd;
        }
        
        return true;
      })();

      return matchesLocation && matchesDateRange;
    });
  }, [events, filters]);

  // Validation function
  const validateForm = (data: EventFestivalFormData): ValidationErrors => {
    const errors: ValidationErrors = {};

    if (!data.eventName.trim()) {
      errors.eventName = 'Event name is required';
    } else if (data.eventName.length > 100) {
      errors.eventName = 'Event name must be 100 characters or less';
    }

    if (!data.startDate) {
      errors.startDate = 'Start date is required';
    }

    if (!data.endDate) {
      errors.endDate = 'End date is required';
    }

    if (data.startDate && data.endDate && new Date(data.startDate) > new Date(data.endDate)) {
      errors.endDate = 'End date must be after start date';
    }

    if (!data.location) {
      errors.location = 'Location is required';
    }

    if (data.multiplier < 0.5 || data.multiplier > 5.0) {
      errors.multiplier = 'Multiplier must be between 0.5 and 5.0';
    }

    // Check for overlapping events in the same location
    const isOverlapping = events.some((event) => {
      if (editingEvent && event.id === editingEvent.id) return false;
      if (event.location !== data.location) return false;
      
      const existingStart = new Date(event.startDate);
      const existingEnd = new Date(event.endDate);
      const newStart = new Date(data.startDate);
      const newEnd = new Date(data.endDate);
      
      return newStart <= existingEnd && newEnd >= existingStart;
    });

    if (isOverlapping) {
      errors.general = 'An event already exists for this location during the selected dates';
    }

    return errors;
  };

  // Handlers
  const handleFilterChange = (newFilters: EventFestivalFiltersType) => {
    setFilters(newFilters);
  };

  const handleAddNew = () => {
    setEditingEvent(undefined);
    setFormData({
      eventName: '',
      startDate: '',
      endDate: '',
      location: '',
      multiplier: 1.0,
    });
    setValidationErrors({});
    setShowForm(true);
  };

  const handleEdit = (event: EventFestival) => {
    setEditingEvent(event);
    setFormData({
      eventName: event.eventName,
      startDate: event.startDate,
      endDate: event.endDate,
      location: event.location,
      multiplier: event.multiplier,
    });
    setValidationErrors({});
    setShowForm(true);
  };

  const handleDelete = (event: EventFestival) => {
    setEventToDelete(event);
    setShowDeleteModal(true);
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const errors = validateForm(formData);
    setValidationErrors(errors);

    if (Object.keys(errors).length === 0) {
      if (editingEvent) {
        // Update existing event
        setEvents(events.map(event => 
          event.id === editingEvent.id 
            ? { ...event, ...formData, updatedAt: new Date().toISOString() }
            : event
        ));
      } else {
        // Add new event
        const newEvent: EventFestival = {
          id: Math.random().toString(36).substr(2, 9),
          ...formData,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        setEvents([...events, newEvent]);
      }
      
      setShowForm(false);
      setEditingEvent(undefined);
      setFormData({
        eventName: '',
        startDate: '',
        endDate: '',
        location: '',
        multiplier: 1.0,
      });
      setValidationErrors({});
    }
  };

  const handleFormCancel = () => {
    setShowForm(false);
    setEditingEvent(undefined);
    setFormData({
      eventName: '',
      startDate: '',
      endDate: '',
      location: '',
      multiplier: 1.0,
    });
    setValidationErrors({});
  };

  const handleFormChange = (field: keyof EventFestivalFormData, value: string | number) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear validation error for this field
    if (validationErrors[field]) {
      setValidationErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  const handleConfirmDelete = () => {
    if (eventToDelete) {
      setEvents(events.filter(event => event.id !== eventToDelete.id));
      setShowDeleteModal(false);
      setEventToDelete(null);
    }
  };

  const handleCancelDelete = () => {
    setShowDeleteModal(false);
    setEventToDelete(null);
  };

  return {
    // Data
    events: filteredEvents,
    allEvents: events,
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
    handleCancelDelete,
  };
}
