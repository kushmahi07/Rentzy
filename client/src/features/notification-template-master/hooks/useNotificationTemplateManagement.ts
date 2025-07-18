
import { useState, useMemo } from 'react';
import { NotificationTemplate, NotificationTemplateFilters, NotificationTemplateFormData } from '../types';
import { mockNotificationTemplates } from '../mockData';

export function useNotificationTemplateManagement() {
  const [templates, setTemplates] = useState<NotificationTemplate[]>(mockNotificationTemplates);
  const [filters, setFilters] = useState<NotificationTemplateFilters>({
    triggerType: 'all',
    channel: 'all',
  });

  const filteredTemplates = useMemo(() => {
    return templates.filter((template) => {
      const matchesTriggerType = filters.triggerType === 'all' || template.triggerType === filters.triggerType;
      const matchesChannel = filters.channel === 'all' || template.channel === filters.channel;
      
      return matchesTriggerType && matchesChannel;
    });
  }, [templates, filters]);

  const addTemplate = (formData: NotificationTemplateFormData) => {
    const newTemplate: NotificationTemplate = {
      id: Date.now().toString(),
      triggerType: formData.triggerType as any,
      channel: formData.channel as any,
      title: formData.title,
      messageBody: formData.messageBody,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    setTemplates(prev => [newTemplate, ...prev]);
  };

  const updateTemplate = (id: string, formData: NotificationTemplateFormData) => {
    setTemplates(prev => prev.map(template => 
      template.id === id 
        ? {
            ...template,
            triggerType: formData.triggerType as any,
            channel: formData.channel as any,
            title: formData.title,
            messageBody: formData.messageBody,
            updatedAt: new Date().toISOString(),
          }
        : template
    ));
  };

  const deleteTemplate = (id: string) => {
    setTemplates(prev => prev.filter(template => template.id !== id));
  };

  return {
    templates: filteredTemplates,
    filters,
    setFilters,
    addTemplate,
    updateTemplate,
    deleteTemplate,
  };
}
