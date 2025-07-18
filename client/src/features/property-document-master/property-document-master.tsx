
import React, { useState, useEffect } from 'react';
import { Plus, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { useToast } from '@/shared/hooks/use-toast';
import {
  DocumentTypeTable,
  DocumentTypeForm,
  DocumentTypeFilters,
  Pagination,
  DeleteConfirmationModal
} from './components';
import { DocumentType, DocumentTypeFormData, DocumentTypeFilters as FilterType, ValidationErrors } from './types';
import { MOCK_DOCUMENT_TYPES } from './mockData';

const PropertyDocumentMaster: React.FC = () => {
  const { toast } = useToast();
  const [documentTypes, setDocumentTypes] = useState<DocumentType[]>(MOCK_DOCUMENT_TYPES);
  const [filteredDocumentTypes, setFilteredDocumentTypes] = useState<DocumentType[]>(MOCK_DOCUMENT_TYPES);
  const [filters, setFilters] = useState<FilterType>({
    propertyType: '',
    searchTerm: ''
  });
  
  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const totalPages = Math.ceil(filteredDocumentTypes.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedDocumentTypes = filteredDocumentTypes.slice(startIndex, endIndex);

  // Form state
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [editingDocumentType, setEditingDocumentType] = useState<DocumentType | null>(null);
  const [formData, setFormData] = useState<DocumentTypeFormData>({
    documentName: '',
    propertyType: '',
    mandatory: false,
    acceptedFileTypes: []
  });
  const [errors, setErrors] = useState<ValidationErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Delete state
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deletingDocumentType, setDeletingDocumentType] = useState<DocumentType | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Filter documents
  useEffect(() => {
    let filtered = documentTypes;

    if (filters.propertyType) {
      filtered = filtered.filter(doc => doc.propertyType === filters.propertyType);
    }

    if (filters.searchTerm) {
      filtered = filtered.filter(doc =>
        doc.documentName.toLowerCase().includes(filters.searchTerm.toLowerCase())
      );
    }

    setFilteredDocumentTypes(filtered);
    setCurrentPage(1);
  }, [filters, documentTypes]);

  const handleFilterChange = (field: string, value: string) => {
    setFilters(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const validateForm = (): boolean => {
    const newErrors: ValidationErrors = {};

    // Document Name validation
    if (!formData.documentName.trim()) {
      newErrors.documentName = 'Document name is required';
    } else if (formData.documentName.length > 100) {
      newErrors.documentName = 'Document name must be 100 characters or less';
    } else if (!/^[a-zA-Z0-9\s]+$/.test(formData.documentName)) {
      newErrors.documentName = 'Document name must contain only alphanumeric characters and spaces';
    }

    // Property Type validation
    if (!formData.propertyType) {
      newErrors.propertyType = 'Property type is required';
    }

    // Accepted File Types validation
    if (formData.acceptedFileTypes.length === 0) {
      newErrors.acceptedFileTypes = 'At least one file type must be selected';
    }

    // Check for duplicates
    const isDuplicate = documentTypes.some(doc => 
      doc.documentName.toLowerCase() === formData.documentName.toLowerCase() &&
      doc.propertyType === formData.propertyType &&
      (!isEdit || doc.id !== editingDocumentType?.id)
    );

    if (isDuplicate) {
      newErrors.documentName = 'A document with this name already exists for this property type';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));

    // Clear error for this field
    if (errors[field as keyof ValidationErrors]) {
      setErrors(prev => ({
        ...prev,
        [field]: undefined
      }));
    }
  };

  const handleAddNew = () => {
    setIsEdit(false);
    setEditingDocumentType(null);
    setFormData({
      documentName: '',
      propertyType: '',
      mandatory: false,
      acceptedFileTypes: []
    });
    setErrors({});
    setIsFormOpen(true);
  };

  const handleEdit = (documentType: DocumentType) => {
    setIsEdit(true);
    setEditingDocumentType(documentType);
    setFormData({
      documentName: documentType.documentName,
      propertyType: documentType.propertyType,
      mandatory: documentType.mandatory,
      acceptedFileTypes: [...documentType.acceptedFileTypes]
    });
    setErrors({});
    setIsFormOpen(true);
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));

      if (isEdit && editingDocumentType) {
        // Update existing document type
        const updatedDocumentTypes = documentTypes.map(doc =>
          doc.id === editingDocumentType.id
            ? {
                ...doc,
                documentName: formData.documentName,
                propertyType: formData.propertyType as 'Residential' | 'Commercial',
                mandatory: formData.mandatory,
                acceptedFileTypes: formData.acceptedFileTypes,
                updatedAt: new Date()
              }
            : doc
        );
        setDocumentTypes(updatedDocumentTypes);
        toast({
          title: 'Success',
          description: 'Document type updated successfully',
        });
      } else {
        // Add new document type
        const newDocumentType: DocumentType = {
          id: Date.now().toString(),
          documentName: formData.documentName,
          propertyType: formData.propertyType as 'Residential' | 'Commercial',
          mandatory: formData.mandatory,
          acceptedFileTypes: formData.acceptedFileTypes,
          createdAt: new Date(),
          updatedAt: new Date()
        };
        setDocumentTypes(prev => [...prev, newDocumentType]);
        toast({
          title: 'Success',
          description: 'Document type added successfully',
        });
      }

      setIsFormOpen(false);
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Something went wrong. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = (documentType: DocumentType) => {
    setDeletingDocumentType(documentType);
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!deletingDocumentType) return;

    setIsDeleting(true);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));

      const updatedDocumentTypes = documentTypes.filter(doc => doc.id !== deletingDocumentType.id);
      setDocumentTypes(updatedDocumentTypes);
      
      toast({
        title: 'Success',
        description: 'Document type deleted successfully',
      });

      setIsDeleteModalOpen(false);
      setDeletingDocumentType(null);
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to delete document type. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsDeleting(false);
    }
  };

  const handleCancelDelete = () => {
    setIsDeleteModalOpen(false);
    setDeletingDocumentType(null);
  };

  const handleFormCancel = () => {
    setIsFormOpen(false);
    setErrors({});
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <FileText className="h-8 w-8 text-blue-600" />
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Property Document Master</h1>
            <p className="text-gray-600">Manage required documents for property listings</p>
          </div>
        </div>
        <Button
          onClick={handleAddNew}
          style={{ backgroundColor: '#004182' }}
          className="hover:opacity-90 text-white flex items-center space-x-2"
        >
          <Plus className="h-4 w-4" />
          <span>Add New</span>
        </Button>
      </div>

      {/* Filters */}
      <DocumentTypeFilters
        filters={filters}
        onFilterChange={handleFilterChange}
      />

      {/* Table */}
      <DocumentTypeTable
        documentTypes={paginatedDocumentTypes}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

      {/* Pagination */}
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        totalItems={filteredDocumentTypes.length}
        itemsPerPage={itemsPerPage}
        onPageChange={setCurrentPage}
      />

      {/* Form Modal */}
      <Dialog open={isFormOpen} onOpenChange={handleFormCancel}>
        <DialogContent className="sm:max-w-md">
          <DocumentTypeForm
            formData={formData}
            errors={errors}
            isEdit={isEdit}
            onInputChange={handleInputChange}
            onSubmit={handleSubmit}
            onCancel={handleFormCancel}
            isSubmitting={isSubmitting}
          />
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Modal */}
      <DeleteConfirmationModal
        isOpen={isDeleteModalOpen}
        documentType={deletingDocumentType}
        onConfirm={handleConfirmDelete}
        onCancel={handleCancelDelete}
        isDeleting={isDeleting}
      />
    </div>
  );
};

export default PropertyDocumentMaster;
