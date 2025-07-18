
import { useState, useMemo } from 'react';
import { Location, LocationFormData, LocationFilters, ValidationErrors } from '../types';
import { MOCK_LOCATIONS } from '../mockData';
import { useToast } from '@/shared/hooks/use-toast';

export const useLocationManagement = () => {
  const [locations, setLocations] = useState<Location[]>(MOCK_LOCATIONS);
  const [filters, setFilters] = useState<LocationFilters>({
    searchQuery: '',
    country: '',
    status: '',
  });
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [editingLocation, setEditingLocation] = useState<Location | null>(null);
  const [deletingLocation, setDeletingLocation] = useState<Location | null>(null);
  const [formData, setFormData] = useState<LocationFormData>({
    city: '',
    country: '',
    status: 'Active',
    tag: '',
  });
  const [errors, setErrors] = useState<ValidationErrors>({});
  const [loading, setLoading] = useState(false);

  const { toast } = useToast();

  // Filter locations based on current filters
  const filteredLocations = useMemo(() => {
    return locations.filter((location) => {
      const matchesSearch = !filters.searchQuery || 
        location.city.toLowerCase().includes(filters.searchQuery.toLowerCase());
      const matchesCountry = !filters.country || location.country === filters.country;
      const matchesStatus = !filters.status || location.status === filters.status;
      
      return matchesSearch && matchesCountry && matchesStatus;
    });
  }, [locations, filters]);

  // Validation function
  const validateForm = (data: LocationFormData): ValidationErrors => {
    const newErrors: ValidationErrors = {};

    // City validation
    if (!data.city.trim()) {
      newErrors.city = 'City is required';
    } else if (data.city.length > 100) {
      newErrors.city = 'City name cannot exceed 100 characters';
    } else if (!/^[a-zA-Z\s]+$/.test(data.city)) {
      newErrors.city = 'City name can only contain letters and spaces';
    }

    // Country validation
    if (!data.country) {
      newErrors.country = 'Please select a country';
    }

    // Tag validation
    if (data.tag && data.tag.length > 50) {
      newErrors.tag = 'Tag cannot exceed 50 characters';
    }

    // Check for duplicate city-country combination
    const isDuplicate = locations.some((location) => 
      location.city.toLowerCase() === data.city.toLowerCase() &&
      location.country === data.country &&
      location.id !== editingLocation?.id
    );

    if (isDuplicate) {
      newErrors.duplicate = 'A location with this city and country combination already exists';
    }

    return newErrors;
  };

  // Handle filter changes
  const handleFilterChange = (field: keyof LocationFilters, value: string) => {
    setFilters(prev => ({ ...prev, [field]: value }));
  };

  // Handle form input changes
  const handleInputChange = (field: keyof LocationFormData, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Clear related errors when user starts typing
    if (errors[field as keyof ValidationErrors]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
    if (errors.duplicate) {
      setErrors(prev => ({ ...prev, duplicate: undefined }));
    }
  };

  // Open form for adding new location
  const handleAddNew = () => {
    setEditingLocation(null);
    setFormData({
      city: '',
      country: '',
      status: 'Active',
      tag: '',
    });
    setErrors({});
    setIsFormOpen(true);
  };

  // Open form for editing location
  const handleEdit = (location: Location) => {
    setEditingLocation(location);
    setFormData({
      city: location.city,
      country: location.country,
      status: location.status,
      tag: location.tag || '',
    });
    setErrors({});
    setIsFormOpen(true);
  };

  // Handle form submission
  const handleSubmit = async () => {
    const validationErrors = validateForm(formData);
    
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setLoading(true);

    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));

      if (editingLocation) {
        // Update existing location
        setLocations(prev => prev.map(location => 
          location.id === editingLocation.id
            ? {
                ...location,
                city: formData.city.trim(),
                country: formData.country,
                status: formData.status,
                tag: formData.tag.trim() || undefined,
                updatedAt: new Date(),
              }
            : location
        ));
        toast({
          title: 'Location updated successfully',
          description: `${formData.city}, ${formData.country} has been updated.`,
        });
      } else {
        // Add new location
        const newLocation: Location = {
          id: Date.now().toString(),
          city: formData.city.trim(),
          country: formData.country,
          status: formData.status,
          tag: formData.tag.trim() || undefined,
          createdAt: new Date(),
          updatedAt: new Date(),
        };
        setLocations(prev => [newLocation, ...prev]);
        toast({
          title: 'Location added successfully',
          description: `${formData.city}, ${formData.country} has been added.`,
        });
      }

      setIsFormOpen(false);
      setFormData({
        city: '',
        country: '',
        status: 'Active',
        tag: '',
      });
      setErrors({});
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to save location. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  // Handle delete confirmation
  const handleDelete = (location: Location) => {
    setDeletingLocation(location);
    setIsDeleteModalOpen(true);
  };

  // Confirm deletion
  const handleConfirmDelete = async () => {
    if (!deletingLocation) return;

    setLoading(true);

    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));

      setLocations(prev => prev.filter(location => location.id !== deletingLocation.id));
      toast({
        title: 'Location deleted successfully',
        description: `${deletingLocation.city}, ${deletingLocation.country} has been removed.`,
      });
      
      setIsDeleteModalOpen(false);
      setDeletingLocation(null);
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to delete location. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  // Close modals
  const handleCloseForm = () => {
    setIsFormOpen(false);
    setEditingLocation(null);
    setFormData({
      city: '',
      country: '',
      status: 'Active',
      tag: '',
    });
    setErrors({});
  };

  const handleCloseDeleteModal = () => {
    setIsDeleteModalOpen(false);
    setDeletingLocation(null);
  };

  return {
    // Data
    locations: filteredLocations,
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
  };
};
