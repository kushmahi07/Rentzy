
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Plus, FileText } from 'lucide-react';
import { useToast } from '@/shared/hooks/use-toast';
import {
  SubscriptionAgreementFilters,
  SubscriptionAgreementTable,
  SubscriptionAgreementFormModal,
  DeleteConfirmationModal,
} from './components';
import { useSubscriptionAgreementManagement } from './hooks/useSubscriptionAgreementManagement';
import { SubscriptionAgreement, SubscriptionAgreementFormData } from './types';

export default function SubscriptionAgreementMaster() {
  const { toast } = useToast();
  const {
    agreements,
    filters,
    setFilters,
    addAgreement,
    updateAgreement,
    deleteAgreement,
    isDuplicateName,
  } = useSubscriptionAgreementManagement();

  // Form state
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingAgreement, setEditingAgreement] = useState<SubscriptionAgreement | undefined>();
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Delete state
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deletingAgreement, setDeletingAgreement] = useState<SubscriptionAgreement | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleAddNew = () => {
    setEditingAgreement(undefined);
    setIsFormOpen(true);
  };

  const handleEdit = (agreement: SubscriptionAgreement) => {
    setEditingAgreement(agreement);
    setIsFormOpen(true);
  };

  const handleDelete = (agreement: SubscriptionAgreement) => {
    setDeletingAgreement(agreement);
    setIsDeleteModalOpen(true);
  };

  const handlePreview = (agreement: SubscriptionAgreement) => {
    if (agreement.documentUrl) {
      window.open(agreement.documentUrl, '_blank');
    } else {
      toast({
        title: 'Preview not available',
        description: 'Document preview is not available for this agreement.',
        variant: 'destructive',
      });
    }
  };

  const handleFormSubmit = async (formData: SubscriptionAgreementFormData) => {
    setIsSubmitting(true);
    
    try {
      // Check for duplicate names
      if (isDuplicateName(formData.agreementName, editingAgreement?.id)) {
        toast({
          title: 'Duplicate agreement name',
          description: 'An agreement with this name already exists.',
          variant: 'destructive',
        });
        setIsSubmitting(false);
        return;
      }

      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));

      if (editingAgreement) {
        updateAgreement(editingAgreement.id, formData);
        toast({
          title: 'Agreement updated',
          description: 'Subscription agreement has been updated successfully.',
        });
      } else {
        addAgreement(formData);
        toast({
          title: 'Agreement created',
          description: 'New subscription agreement has been created successfully.',
        });
      }

      setIsFormOpen(false);
      setEditingAgreement(undefined);
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to save subscription agreement. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleConfirmDelete = async () => {
    if (!deletingAgreement) return;

    setIsDeleting(true);
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));

      deleteAgreement(deletingAgreement.id);
      toast({
        title: 'Agreement deleted',
        description: 'Subscription agreement has been deleted successfully.',
      });

      setIsDeleteModalOpen(false);
      setDeletingAgreement(null);
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to delete subscription agreement. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsDeleting(false);
    }
  };

  const handleCancelDelete = () => {
    setIsDeleteModalOpen(false);
    setDeletingAgreement(null);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Subscription Agreement Master</h1>
          <p className="text-gray-600 mt-1">
            Manage subscription agreement templates for investors
          </p>
        </div>
        <Button onClick={handleAddNew} className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          Add New Agreement
        </Button>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Agreements</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{agreements.length}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Agreements</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {agreements.filter(a => a.isActive).length}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Latest Version</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {agreements.length > 0 
                ? `v${Math.max(...agreements.map(a => parseFloat(a.version)))}` 
                : 'N/A'
              }
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <SubscriptionAgreementFilters 
            filters={filters}
            onFiltersChange={setFilters}
          />
        </CardContent>
      </Card>

      {/* Table */}
      <Card>
        <CardContent className="pt-6">
          <SubscriptionAgreementTable
            agreements={agreements}
            onEdit={handleEdit}
            onDelete={handleDelete}
            onPreview={handlePreview}
          />
        </CardContent>
      </Card>

      {/* Form Modal */}
      <SubscriptionAgreementFormModal
        isOpen={isFormOpen}
        onClose={() => {
          setIsFormOpen(false);
          setEditingAgreement(undefined);
        }}
        onSubmit={handleFormSubmit}
        agreement={editingAgreement}
        isSubmitting={isSubmitting}
      />

      {/* Delete Confirmation Modal */}
      <DeleteConfirmationModal
        isOpen={isDeleteModalOpen}
        agreement={deletingAgreement}
        onConfirm={handleConfirmDelete}
        onCancel={handleCancelDelete}
        isDeleting={isDeleting}
      />
    </div>
  );
}
