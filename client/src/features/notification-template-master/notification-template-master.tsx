
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Plus, Bell } from 'lucide-react';
import { NotificationTemplate } from './types';
import { useNotificationTemplateManagement } from './hooks/useNotificationTemplateManagement';
import {
  NotificationTemplateFilters,
  NotificationTemplateTable,
  NotificationTemplateFormModal,
  DeleteConfirmationModal,
} from './components';

export default function NotificationTemplateMaster() {
  const {
    templates,
    filters,
    setFilters,
    addTemplate,
    updateTemplate,
    deleteTemplate,
  } = useNotificationTemplateManagement();

  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<NotificationTemplate | null>(null);

  const handleAddNew = () => {
    setSelectedTemplate(null);
    setIsFormModalOpen(true);
  };

  const handleEdit = (template: NotificationTemplate) => {
    setSelectedTemplate(template);
    setIsFormModalOpen(true);
  };

  const handleDelete = (template: NotificationTemplate) => {
    setSelectedTemplate(template);
    setIsDeleteModalOpen(true);
  };

  const handleSave = (formData: any) => {
    if (selectedTemplate) {
      updateTemplate(selectedTemplate.id, formData);
    } else {
      addTemplate(formData);
    }
  };

  const handleConfirmDelete = () => {
    if (selectedTemplate) {
      deleteTemplate(selectedTemplate.id);
      setSelectedTemplate(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <Bell className="h-8 w-8 text-blue-600" />
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Notification Template Master</h1>
            <p className="text-gray-600">Manage notification templates for consistent user messaging</p>
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
      <NotificationTemplateFilters
        filters={filters}
        onFiltersChange={setFilters}
      />

      {/* Table */}
      <NotificationTemplateTable
        templates={templates}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

      {/* Form Modal */}
      <NotificationTemplateFormModal
        isOpen={isFormModalOpen}
        onClose={() => setIsFormModalOpen(false)}
        onSave={handleSave}
        template={selectedTemplate}
      />

      {/* Delete Confirmation Modal */}
      <DeleteConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleConfirmDelete}
        template={selectedTemplate}
      />
    </div>
  );
}
