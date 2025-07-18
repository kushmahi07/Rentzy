
import { useState, useMemo } from 'react';
import { BookingRule, BookingRuleFilters, BookingRuleFormData, ValidationErrors } from '../types';
import { mockBookingRules } from '../mockData';

export function useBookingCalendarManagement() {
  // State
  const [rules, setRules] = useState<BookingRule[]>(mockBookingRules);
  const [loading] = useState(false);
  const [filters, setFilters] = useState<BookingRuleFilters>({
    blackoutDateRange: { start: '', end: '' }
  });

  // Form state
  const [showForm, setShowForm] = useState(false);
  const [editingRule, setEditingRule] = useState<BookingRule | null>(null);
  const [formData, setFormData] = useState<BookingRuleFormData>({
    minDays: 1,
    maxDays: 7,
    blackoutDates: { start: '', end: '' },
    bookingBufferPeriod: 0,
    propertyLevelToggle: false
  });
  const [validationErrors, setValidationErrors] = useState<ValidationErrors>({});

  // Delete state
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [ruleToDelete, setRuleToDelete] = useState<BookingRule | null>(null);

  // Filter rules
  const filteredRules = useMemo(() => {
    return rules.filter(rule => {
      // Filter by blackout date range
      if (filters.blackoutDateRange.start || filters.blackoutDateRange.end) {
        const filterStart = filters.blackoutDateRange.start;
        const filterEnd = filters.blackoutDateRange.end;
        const ruleStart = rule.blackoutDates.start;
        const ruleEnd = rule.blackoutDates.end;

        if (filterStart && filterEnd) {
          // Check if rule's blackout dates overlap with filter range
          return (ruleStart <= filterEnd && ruleEnd >= filterStart);
        } else if (filterStart) {
          // Check if rule's blackout dates are on or after filter start
          return ruleEnd >= filterStart;
        } else if (filterEnd) {
          // Check if rule's blackout dates are on or before filter end
          return ruleStart <= filterEnd;
        }
      }
      return true;
    });
  }, [rules, filters]);

  // Validation
  const validateForm = (): boolean => {
    const errors: ValidationErrors = {};

    // Min Days validation
    if (!formData.minDays || formData.minDays < 1 || formData.minDays > 30) {
      errors.minDays = 'Min Days must be between 1 and 30';
    }

    // Max Days validation
    if (!formData.maxDays || formData.maxDays < 1 || formData.maxDays > 90) {
      errors.maxDays = 'Max Days must be between 1 and 90';
    } else if (formData.maxDays <= formData.minDays) {
      errors.maxDays = 'Max Days must be greater than Min Days';
    }

    // Booking Buffer validation
    if (formData.bookingBufferPeriod < 0 || formData.bookingBufferPeriod > 7) {
      errors.bookingBufferPeriod = 'Booking Buffer Period must be between 0 and 7 days';
    }

    // Blackout Dates validation
    if (formData.blackoutDates.start && formData.blackoutDates.end) {
      if (new Date(formData.blackoutDates.start) > new Date(formData.blackoutDates.end)) {
        errors.blackoutDates = 'End date must be after start date';
      }

      // Check for overlapping blackout dates (duplicate check)
      const hasOverlap = rules.some(rule => {
        if (editingRule && rule.id === editingRule.id) return false;
        
        const existingStart = new Date(rule.blackoutDates.start);
        const existingEnd = new Date(rule.blackoutDates.end);
        const newStart = new Date(formData.blackoutDates.start);
        const newEnd = new Date(formData.blackoutDates.end);

        return (newStart <= existingEnd && newEnd >= existingStart);
      });

      if (hasOverlap) {
        errors.blackoutDates = 'Blackout dates overlap with an existing rule';
      }
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Handlers
  const handleFilterChange = (key: keyof BookingRuleFilters, value: any) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const handleAddNew = () => {
    setEditingRule(null);
    setFormData({
      minDays: 1,
      maxDays: 7,
      blackoutDates: { start: '', end: '' },
      bookingBufferPeriod: 0,
      propertyLevelToggle: false
    });
    setValidationErrors({});
    setShowForm(true);
  };

  const handleEdit = (rule: BookingRule) => {
    setEditingRule(rule);
    setFormData({
      minDays: rule.minDays,
      maxDays: rule.maxDays,
      blackoutDates: rule.blackoutDates,
      bookingBufferPeriod: rule.bookingBufferPeriod,
      propertyLevelToggle: rule.propertyLevelToggle
    });
    setValidationErrors({});
    setShowForm(true);
  };

  const handleDelete = (rule: BookingRule) => {
    setRuleToDelete(rule);
    setShowDeleteModal(true);
  };

  const handleFormSubmit = () => {
    if (!validateForm()) return;

    const now = new Date().toISOString();

    if (editingRule) {
      // Update existing rule
      setRules(prev => prev.map(rule =>
        rule.id === editingRule.id
          ? { ...rule, ...formData, updatedAt: now }
          : rule
      ));
    } else {
      // Add new rule
      const newRule: BookingRule = {
        id: Date.now().toString(),
        ...formData,
        createdAt: now,
        updatedAt: now
      };
      setRules(prev => [...prev, newRule]);
    }

    setShowForm(false);
    setEditingRule(null);
  };

  const handleFormCancel = () => {
    setShowForm(false);
    setEditingRule(null);
    setValidationErrors({});
  };

  const handleFormChange = (field: keyof BookingRuleFormData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear validation error for this field
    if (validationErrors[field]) {
      setValidationErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  const handleConfirmDelete = () => {
    if (ruleToDelete) {
      setRules(prev => prev.filter(rule => rule.id !== ruleToDelete.id));
      setShowDeleteModal(false);
      setRuleToDelete(null);
    }
  };

  const handleCancelDelete = () => {
    setShowDeleteModal(false);
    setRuleToDelete(null);
  };

  return {
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
  };
}
