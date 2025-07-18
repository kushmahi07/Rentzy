
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { NotificationTemplate, NotificationTemplateFormData, TriggerType, Channel } from '../types';
import { Eye, Mail, Smartphone, MessageSquare } from 'lucide-react';

interface NotificationTemplateFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: NotificationTemplateFormData) => void;
  template?: NotificationTemplate | null;
}

export function NotificationTemplateFormModal({
  isOpen,
  onClose,
  onSave,
  template,
}: NotificationTemplateFormModalProps) {
  const [formData, setFormData] = useState<NotificationTemplateFormData>({
    triggerType: '',
    channel: '',
    title: '',
    messageBody: '',
  });
  const [showPreview, setShowPreview] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (template) {
      setFormData({
        triggerType: template.triggerType,
        channel: template.channel,
        title: template.title,
        messageBody: template.messageBody,
      });
    } else {
      setFormData({
        triggerType: '',
        channel: '',
        title: '',
        messageBody: '',
      });
    }
    setErrors({});
    setShowPreview(false);
  }, [template, isOpen]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.triggerType) {
      newErrors.triggerType = 'Trigger type is required';
    }
    if (!formData.channel) {
      newErrors.channel = 'Channel is required';
    }
    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    } else if (formData.title.length > 100) {
      newErrors.title = 'Title must not exceed 100 characters';
    }
    if (!formData.messageBody.trim()) {
      newErrors.messageBody = 'Message body is required';
    } else if (formData.messageBody.length > 2000) {
      newErrors.messageBody = 'Message body must not exceed 2000 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = () => {
    if (validateForm()) {
      onSave(formData);
      onClose();
    }
  };

  const handlePreview = () => {
    if (validateForm()) {
      setShowPreview(true);
    }
  };

  const getChannelIcon = (channel: string) => {
    switch (channel) {
      case 'Email':
        return <Mail className="h-4 w-4" />;
      case 'Push':
        return <Smartphone className="h-4 w-4" />;
      case 'SMS':
        return <MessageSquare className="h-4 w-4" />;
      default:
        return null;
    }
  };

  const renderPreview = () => {
    if (!showPreview) return null;

    return (
      <div className="mt-6 p-4 border rounded-lg bg-gray-50">
        <div className="flex items-center gap-2 mb-3">
          <h4 className="font-medium text-gray-900">Preview:</h4>
          <Badge className="flex items-center gap-1">
            {getChannelIcon(formData.channel)}
            {formData.channel}
          </Badge>
        </div>
        <div className="space-y-2">
          <div>
            <strong className="text-sm text-gray-700">Subject/Title:</strong>
            <p className="text-sm text-gray-900 mt-1">{formData.title}</p>
          </div>
          <div>
            <strong className="text-sm text-gray-700">Message:</strong>
            <div className="text-sm text-gray-900 mt-1 whitespace-pre-wrap">
              {formData.messageBody}
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {template ? 'Edit Notification Template' : 'Add New Notification Template'}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6 mt-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="triggerType">Trigger Type *</Label>
              <Select
                value={formData.triggerType}
                onValueChange={(value) => setFormData({ ...formData, triggerType: value as TriggerType })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select trigger type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Booking">Booking</SelectItem>
                  <SelectItem value="Payout">Payout</SelectItem>
                  <SelectItem value="Tokenization">Tokenization</SelectItem>
                </SelectContent>
              </Select>
              {errors.triggerType && (
                <p className="text-red-500 text-sm">{errors.triggerType}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="channel">Channel *</Label>
              <Select
                value={formData.channel}
                onValueChange={(value) => setFormData({ ...formData, channel: value as Channel })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select channel" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Email">Email</SelectItem>
                  <SelectItem value="Push">Push</SelectItem>
                  <SelectItem value="SMS">SMS</SelectItem>
                </SelectContent>
              </Select>
              {errors.channel && (
                <p className="text-red-500 text-sm">{errors.channel}</p>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="title">Title *</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="Enter notification title"
              maxLength={100}
            />
            <div className="flex justify-between text-sm text-gray-500">
              <span>{errors.title && <span className="text-red-500">{errors.title}</span>}</span>
              <span>{formData.title.length}/100</span>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="messageBody">Message Body *</Label>
            <Textarea
              id="messageBody"
              value={formData.messageBody}
              onChange={(e) => setFormData({ ...formData, messageBody: e.target.value })}
              placeholder="Enter the message content. You can use variables like {{propertyName}}, {{amount}}, {{checkInDate}}, etc."
              rows={8}
              maxLength={2000}
              className="resize-none"
            />
            <div className="flex justify-between text-sm text-gray-500">
              <span>{errors.messageBody && <span className="text-red-500">{errors.messageBody}</span>}</span>
              <span>{formData.messageBody.length}/2000</span>
            </div>
            <p className="text-xs text-gray-500 mt-1">
              Use double curly braces for variables: {`{{propertyName}}, {{amount}}, {{checkInDate}}, {{tokenCount}}`}, etc.
            </p>
          </div>

          {renderPreview()}

          <div className="flex items-center justify-end space-x-3 pt-6 border-t">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button
              variant="outline"
              onClick={handlePreview}
              className="flex items-center gap-2"
              disabled={!formData.title || !formData.messageBody}
            >
              <Eye className="h-4 w-4" />
              Preview
            </Button>
            <Button
              onClick={handleSave}
              style={{ backgroundColor: '#004182' }}
              className="hover:opacity-90 text-white"
            >
              {template ? 'Update Template' : 'Save Template'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
