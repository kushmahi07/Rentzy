
import { useState, useMemo } from 'react';
import { InvestorEarningsFormat, InvestorEarningsFormatFilters, InvestorEarningsFormatFormData, FormErrors } from '../types';
import { mockInvestorEarningsFormats } from '../mockData';

const initialFilters: InvestorEarningsFormatFilters = {
  searchTerm: '',
  format: 'all'
};

const initialFormData: InvestorEarningsFormatFormData = {
  format: '',
  fieldsIncluded: [],
  quarterStart: '',
  quarterEnd: ''
};

export function useInvestorEarningsFormatManagement() {
  // Data state
  const [formats, setFormats] = useState<InvestorEarningsFormat[]>(mockInvestorEarningsFormats);
  const [filters, setFilters] = useState<InvestorEarningsFormatFilters>(initialFilters);
  const [formData, setFormData] = useState<InvestorEarningsFormatFormData>(initialFormData);
  const [errors, setErrors] = useState<FormErrors>({});
  const [loading, setLoading] = useState(false);

  // Modal states
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [editingFormat, setEditingFormat] = useState<InvestorEarningsFormat | null>(null);
  const [deletingFormat, setDeletingFormat] = useState<InvestorEarningsFormat | null>(null);

  // Filter formats based on search and filters
  const filteredFormats = useMemo(() => {
    return formats.filter(format => {
      const matchesSearch = !filters.searchTerm || 
        format.fieldsIncluded.some(field => 
          field.toLowerCase().includes(filters.searchTerm.toLowerCase())
        ) ||
        `${format.quarterStart} ${format.quarterEnd}`.toLowerCase().includes(filters.searchTerm.toLowerCase());

      const matchesFormat = filters.format === 'all' || format.format === filters.format;

      return matchesSearch && matchesFormat;
    });
  }, [formats, filters]);

  // Validation
  const validateForm = (data: InvestorEarningsFormatFormData): FormErrors => {
    const newErrors: FormErrors = {};

    if (!data.format) {
      newErrors.format = 'Format is required';
    }

    if (data.fieldsIncluded.length === 0) {
      newErrors.fieldsIncluded = 'At least one field must be selected';
    }

    if (!data.quarterStart) {
      newErrors.quarterStart = 'Quarter start date is required';
    }

    if (!data.quarterEnd) {
      newErrors.quarterEnd = 'Quarter end date is required';
    }

    if (data.quarterStart && data.quarterEnd) {
      const startDate = new Date(data.quarterStart);
      const endDate = new Date(data.quarterEnd);
      
      if (endDate <= startDate) {
        newErrors.quarterEnd = 'Quarter end date must be after start date';
      }

      // Check for duplicate format-quarter combinations
      const isDuplicate = formats.some(format => 
        format.id !== editingFormat?.id &&
        format.format === data.format &&
        format.quarterStart === data.quarterStart &&
        format.quarterEnd === data.quarterEnd
      );

      if (isDuplicate) {
        newErrors.general = 'A format for this quarter and type already exists';
      }
    }

    return newErrors;
  };

  // Handlers
  const handleFilterChange = (newFilters: InvestorEarningsFormatFilters) => {
    setFilters(newFilters);
  };

  const handleAddNew = () => {
    setEditingFormat(null);
    setFormData(initialFormData);
    setErrors({});
    setIsFormOpen(true);
  };

  const handleEdit = (format: InvestorEarningsFormat) => {
    setEditingFormat(format);
    setErrors({});
    setIsFormOpen(true);
  };

  const handleSubmit = (data: InvestorEarningsFormatFormData) => {
    const validationErrors = validateForm(data);
    
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      if (editingFormat) {
        // Update existing format
        setFormats(prev => prev.map(format => 
          format.id === editingFormat.id
            ? {
                ...format,
                format: data.format as 'PDF' | 'CSV',
                fieldsIncluded: data.fieldsIncluded,
                quarterStart: data.quarterStart,
                quarterEnd: data.quarterEnd,
                updatedAt: new Date().toISOString()
              }
            : format
        ));
      } else {
        // Add new format
        const newFormat: InvestorEarningsFormat = {
          id: Date.now().toString(),
          format: data.format as 'PDF' | 'CSV',
          fieldsIncluded: data.fieldsIncluded,
          quarterStart: data.quarterStart,
          quarterEnd: data.quarterEnd,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        };
        setFormats(prev => [newFormat, ...prev]);
      }
      
      setLoading(false);
      setIsFormOpen(false);
      setFormData(initialFormData);
      setErrors({});
    }, 1000);
  };

  const handleDelete = (format: InvestorEarningsFormat) => {
    setDeletingFormat(format);
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = () => {
    if (!deletingFormat) return;

    setLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setFormats(prev => prev.filter(format => format.id !== deletingFormat.id));
      setLoading(false);
      setIsDeleteModalOpen(false);
      setDeletingFormat(null);
    }, 500);
  };

  const handleCloseForm = () => {
    setIsFormOpen(false);
    setFormData(initialFormData);
    setErrors({});
    setEditingFormat(null);
  };

  const handleCloseDeleteModal = () => {
    setIsDeleteModalOpen(false);
    setDeletingFormat(null);
  };

  const handleFormChange = (data: InvestorEarningsFormatFormData) => {
    setFormData(data);
    setErrors({}); // Clear errors when form changes
  };

  return {
    // Data
    formats: filteredFormats,
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
  };
}
