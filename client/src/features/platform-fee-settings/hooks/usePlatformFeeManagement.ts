
import { useState, useMemo } from 'react';
import { PlatformFee, PlatformFeeFiltersType, PlatformFeeFormData } from '../types';
import { mockPlatformFees } from '../mockData';

export function usePlatformFeeManagement() {
  const [fees, setFees] = useState<PlatformFee[]>(mockPlatformFees);
  const [filters, setFilters] = useState<PlatformFeeFiltersType>({
    feeType: '',
    appliesTo: '',
  });
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [editingFee, setEditingFee] = useState<PlatformFee | null>(null);
  const [feeToDelete, setFeeToDelete] = useState<PlatformFee | null>(null);

  // Filter fees based on current filters
  const filteredFees = useMemo(() => {
    return fees.filter(fee => {
      const matchesFeeType = !filters.feeType || fee.feeType === filters.feeType;
      const matchesAppliesTo = !filters.appliesTo || fee.appliesTo === filters.appliesTo;
      
      return matchesFeeType && matchesAppliesTo;
    });
  }, [fees, filters]);

  const handleAddNew = () => {
    setEditingFee(null);
    setIsFormOpen(true);
  };

  const handleEdit = (fee: PlatformFee) => {
    setEditingFee(fee);
    setIsFormOpen(true);
  };

  const handleDelete = (fee: PlatformFee) => {
    setFeeToDelete(fee);
    setIsDeleteModalOpen(true);
  };

  const handleFormSubmit = (formData: PlatformFeeFormData) => {
    if (editingFee) {
      // Update existing fee
      setFees(prevFees =>
        prevFees.map(fee =>
          fee.id === editingFee.id
            ? {
                ...fee,
                feeType: formData.feeType as 'Flat' | '%',
                value: parseFloat(formData.value),
                appliesTo: formData.appliesTo as 'Residential' | 'Commercial' | 'Both',
                updatedAt: new Date().toISOString(),
              }
            : fee
        )
      );
    } else {
      // Add new fee
      const newFee: PlatformFee = {
        id: Date.now().toString(),
        feeType: formData.feeType as 'Flat' | '%',
        value: parseFloat(formData.value),
        appliesTo: formData.appliesTo as 'Residential' | 'Commercial' | 'Both',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      setFees(prevFees => [...prevFees, newFee]);
    }

    setIsFormOpen(false);
    setEditingFee(null);
  };

  const handleDeleteConfirm = () => {
    if (feeToDelete) {
      setFees(prevFees => prevFees.filter(fee => fee.id !== feeToDelete.id));
      setIsDeleteModalOpen(false);
      setFeeToDelete(null);
    }
  };

  const handleFormClose = () => {
    setIsFormOpen(false);
    setEditingFee(null);
  };

  const handleDeleteModalClose = () => {
    setIsDeleteModalOpen(false);
    setFeeToDelete(null);
  };

  return {
    fees: filteredFees,
    allFees: fees,
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
  };
}
