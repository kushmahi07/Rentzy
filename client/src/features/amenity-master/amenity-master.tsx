
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { useToast } from '@/shared/hooks/use-toast';
import {
  AmenityFilters,
  AmenityTable,
  AmenityForm,
  DeleteConfirmationModal,
} from './components';
import { useAmenityManagement } from './hooks/useAmenityManagement';
import { Amenity, AmenityFormData } from './types';

export default function AmenityMaster() {
  const { toast } = useToast();
  const {
    amenities,
    allAmenities,
    filters,
    setFilters,
    addAmenity,
    updateAmenity,
    deleteAmenity,
  } = useAmenityManagement();

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingAmenity, setEditingAmenity] = useState<Amenity | undefined>();
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deletingAmenity, setDeletingAmenity] = useState<Amenity | null>(null);

  const handleAddNew = () => {
    setEditingAmenity(undefined);
    setIsFormOpen(true);
  };

  const handleEdit = (amenity: Amenity) => {
    setEditingAmenity(amenity);
    setIsFormOpen(true);
  };

  const handleDelete = (amenity: Amenity) => {
    setDeletingAmenity(amenity);
    setIsDeleteModalOpen(true);
  };

  const handleFormSubmit = (data: AmenityFormData) => {
    try {
      if (editingAmenity) {
        updateAmenity(editingAmenity.id, data);
        toast({
          title: 'Success',
          description: 'Amenity updated successfully',
        });
      } else {
        addAmenity(data);
        toast({
          title: 'Success',
          description: 'Amenity added successfully',
        });
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to save amenity',
        variant: 'destructive',
      });
    }
  };

  const handleDeleteConfirm = () => {
    if (deletingAmenity) {
      try {
        deleteAmenity(deletingAmenity.id);
        toast({
          title: 'Success',
          description: 'Amenity deleted successfully',
        });
      } catch (error) {
        toast({
          title: 'Error',
          description: 'Failed to delete amenity',
          variant: 'destructive',
        });
      }
      setIsDeleteModalOpen(false);
      setDeletingAmenity(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Amenity Master</h1>
          <p className="text-gray-600 mt-1">
            Manage amenities for property listings
          </p>
        </div>
        <Button onClick={handleAddNew} className="bg-blue-600 hover:bg-blue-700">
          <Plus className="h-4 w-4 mr-2" />
          Add New
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Amenities</p>
              <p className="text-2xl font-bold text-gray-900">{allAmenities.length}</p>
            </div>
            <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
              <span className="text-lg">🏠</span>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Indoor Amenities</p>
              <p className="text-2xl font-bold text-gray-900">
                {allAmenities.filter(a => a.type === 'Indoor').length}
              </p>
            </div>
            <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
              <span className="text-lg">🏠</span>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Outdoor Amenities</p>
              <p className="text-2xl font-bold text-gray-900">
                {allAmenities.filter(a => a.type === 'Outdoor').length}
              </p>
            </div>
            <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
              <span className="text-lg">🌿</span>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <AmenityFilters filters={filters} onFiltersChange={setFilters} />

      {/* Table */}
      <AmenityTable
        amenities={amenities}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

      {/* Form Modal */}
      <AmenityForm
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        onSubmit={handleFormSubmit}
        amenity={editingAmenity}
        existingAmenities={allAmenities}
      />

      {/* Delete Confirmation Modal */}
      <DeleteConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={() => {
          setIsDeleteModalOpen(false);
          setDeletingAmenity(null);
        }}
        onConfirm={handleDeleteConfirm}
        amenity={deletingAmenity}
      />
    </div>
  );
}
