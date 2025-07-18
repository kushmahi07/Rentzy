import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/shared/hooks/use-toast";
import { Plus } from "lucide-react";
import {
  PropertyTypeTagFilters,
  PropertyTypeTagTable,
  PropertyTypeTagForm,
  DeleteConfirmationModal,
} from "./components";
import { usePropertyTypeTagManagement } from "./hooks/usePropertyTypeTagManagement";
import { PropertyTypeTag, PropertyTypeTagFormData } from "./types";

function PropertyTypeTagsMaster() {
  const { toast } = useToast();
  const {
    tags,
    allTags,
    filters,
    setFilters,
    addTag,
    updateTag,
    deleteTag,
  } = usePropertyTypeTagManagement();

  // Form state
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingTag, setEditingTag] = useState<PropertyTypeTag | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Delete state
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deletingTag, setDeletingTag] = useState<PropertyTypeTag | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleAddNew = () => {
    setEditingTag(null);
    setIsFormOpen(true);
  };

  const handleEdit = (tag: PropertyTypeTag) => {
    setEditingTag(tag);
    setIsFormOpen(true);
  };

  const handleDelete = (tag: PropertyTypeTag) => {
    setDeletingTag(tag);
    setIsDeleteModalOpen(true);
  };

  const handleFormSubmit = async (formData: PropertyTypeTagFormData) => {
    setIsSubmitting(true);
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));

      if (editingTag) {
        updateTag(editingTag.id, formData);
        toast({
          title: "Property type tag updated successfully",
          description: `${formData.tagName} has been updated.`,
        });
      } else {
        addTag(formData);
        toast({
          title: "Property type tag added successfully",
          description: `${formData.tagName} has been added to the list.`,
        });
      }

      setIsFormOpen(false);
      setEditingTag(null);
    } catch (error) {
      toast({
        title: "Error",
        description: "Something went wrong. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!deletingTag) return;

    setIsDeleting(true);
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));

      deleteTag(deletingTag.id);
      toast({
        title: "Property type tag deleted successfully",
        description: `${deletingTag.tagName} has been removed from the list.`,
      });

      setIsDeleteModalOpen(false);
      setDeletingTag(null);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete the property type tag. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsDeleting(false);
    }
  };

  const handleFormClose = () => {
    setIsFormOpen(false);
    setEditingTag(null);
  };

  const handleDeleteClose = () => {
    setIsDeleteModalOpen(false);
    setDeletingTag(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Property Type Tags Master</h1>
          <p className="text-gray-600">Manage property type tags for categorizing listings</p>
        </div>
        <Button onClick={handleAddNew} className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          Add New Tag
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Filter Tags</CardTitle>
        </CardHeader>
        <CardContent>
          <PropertyTypeTagFilters filters={filters} onFiltersChange={setFilters} />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>Property Type Tags ({tags.length})</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <PropertyTypeTagTable
            tags={tags}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        </CardContent>
      </Card>

      <PropertyTypeTagForm
        open={isFormOpen}
        onClose={handleFormClose}
        onSubmit={handleFormSubmit}
        editingTag={editingTag}
        isSubmitting={isSubmitting}
        existingTags={allTags}
      />

      <DeleteConfirmationModal
        open={isDeleteModalOpen}
        onClose={handleDeleteClose}
        onConfirm={handleDeleteConfirm}
        tag={deletingTag}
        isDeleting={isDeleting}
      />
    </div>
  );
};

export default PropertyTypeTagsMaster;