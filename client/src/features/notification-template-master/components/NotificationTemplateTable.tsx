
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Edit, Trash2, Mail, Smartphone, MessageSquare } from 'lucide-react';
import { NotificationTemplate } from '../types';

interface NotificationTemplateTableProps {
  templates: NotificationTemplate[];
  onEdit: (template: NotificationTemplate) => void;
  onDelete: (template: NotificationTemplate) => void;
}

export function NotificationTemplateTable({ 
  templates, 
  onEdit, 
  onDelete 
}: NotificationTemplateTableProps) {
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

  const getChannelColor = (channel: string) => {
    switch (channel) {
      case 'Email':
        return 'bg-blue-100 text-blue-800';
      case 'Push':
        return 'bg-green-100 text-green-800';
      case 'SMS':
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getTriggerTypeColor = (triggerType: string) => {
    switch (triggerType) {
      case 'Booking':
        return 'bg-orange-100 text-orange-800';
      case 'Payout':
        return 'bg-emerald-100 text-emerald-800';
      case 'Tokenization':
        return 'bg-indigo-100 text-indigo-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const truncateMessage = (message: string, maxLength: number = 80) => {
    return message.length > maxLength 
      ? `${message.substring(0, maxLength)}...` 
      : message;
  };

  if (templates.length === 0) {
    return (
      <Card>
        <CardContent className="py-16 px-6 text-center">
          <div className="flex flex-col items-center space-y-3">
            <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center">
              <Mail className="h-8 w-8 text-gray-400" />
            </div>
            <div>
              <p className="text-gray-600 font-medium">No notification templates found.</p>
              <p className="text-gray-500 text-sm mt-1">Create your first template to get started.</p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="text-left py-4 px-6 font-medium text-gray-700 text-sm">Trigger Type</th>
                <th className="text-left py-4 px-6 font-medium text-gray-700 text-sm">Channel</th>
                <th className="text-left py-4 px-6 font-medium text-gray-700 text-sm">Title</th>
                <th className="text-left py-4 px-6 font-medium text-gray-700 text-sm">Message Body</th>
                <th className="text-left py-4 px-6 font-medium text-gray-700 text-sm">Last Updated</th>
                <th className="text-left py-4 px-6 font-medium text-gray-700 text-sm">Actions</th>
              </tr>
            </thead>
            <tbody>
              {templates.map((template) => (
                <tr key={template.id} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="py-4 px-6">
                    <Badge className={getTriggerTypeColor(template.triggerType)}>
                      {template.triggerType}
                    </Badge>
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-2">
                      <Badge className={`${getChannelColor(template.channel)} flex items-center gap-1`}>
                        {getChannelIcon(template.channel)}
                        {template.channel}
                      </Badge>
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <div className="font-medium text-gray-900 max-w-xs truncate">
                      {template.title}
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <div className="text-gray-600 text-sm max-w-md">
                      {truncateMessage(template.messageBody)}
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <div className="text-gray-600 text-sm">
                      {new Date(template.updatedAt).toLocaleDateString()}
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => onEdit(template)}
                        className="h-8 w-8 p-0"
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => onDelete(template)}
                        className="h-8 w-8 p-0 text-red-600 hover:text-red-700 hover:bg-red-50"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
}
