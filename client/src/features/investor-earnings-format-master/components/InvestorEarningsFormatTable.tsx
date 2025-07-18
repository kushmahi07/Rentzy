
import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Edit2, Trash2, FileText, Table } from 'lucide-react';
import { InvestorEarningsFormat } from '../types';

interface InvestorEarningsFormatTableProps {
  formats: InvestorEarningsFormat[];
  onEdit: (format: InvestorEarningsFormat) => void;
  onDelete: (format: InvestorEarningsFormat) => void;
  loading?: boolean;
}

export function InvestorEarningsFormatTable({ 
  formats, 
  onEdit, 
  onDelete, 
  loading 
}: InvestorEarningsFormatTableProps) {
  const formatQuarter = (start: string, end: string) => {
    const startDate = new Date(start);
    const endDate = new Date(end);
    return `Q${Math.ceil((startDate.getMonth() + 1) / 3)} ${startDate.getFullYear()}`;
  };

  const formatDateRange = (start: string, end: string) => {
    const startDate = new Date(start).toLocaleDateString();
    const endDate = new Date(end).toLocaleDateString();
    return `${startDate} - ${endDate}`;
  };

  const getFormatIcon = (format: string) => {
    return format === 'PDF' ? <FileText className="h-4 w-4" /> : <Table className="h-4 w-4" />;
  };

  const getFormatColor = (format: string) => {
    return format === 'PDF' ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800';
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg border border-gray-200">
        <div className="p-8 text-center">
          <div className="text-gray-500">Loading earnings formats...</div>
        </div>
      </div>
    );
  }

  if (formats.length === 0) {
    return (
      <div className="bg-white rounded-lg border border-gray-200">
        <div className="p-8 text-center">
          <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            No earnings formats found
          </h3>
          <p className="text-gray-500">
            Create your first investor earnings format to get started.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="text-left py-3 px-4 font-medium text-gray-700 text-sm">
                Format
              </th>
              <th className="text-left py-3 px-4 font-medium text-gray-700 text-sm">
                Fields Included
              </th>
              <th className="text-left py-3 px-4 font-medium text-gray-700 text-sm">
                Quarter
              </th>
              <th className="text-left py-3 px-4 font-medium text-gray-700 text-sm">
                Date Range
              </th>
              <th className="text-left py-3 px-4 font-medium text-gray-700 text-sm">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {formats.map((format) => (
              <tr key={format.id} className="border-b border-gray-100 hover:bg-gray-50">
                <td className="py-4 px-4">
                  <div className="flex items-center gap-2">
                    <Badge 
                      className={`flex items-center gap-1 ${getFormatColor(format.format)}`}
                    >
                      {getFormatIcon(format.format)}
                      {format.format}
                    </Badge>
                  </div>
                </td>
                <td className="py-4 px-4">
                  <div className="flex flex-wrap gap-1">
                    {format.fieldsIncluded.slice(0, 3).map((field, index) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {field}
                      </Badge>
                    ))}
                    {format.fieldsIncluded.length > 3 && (
                      <Badge variant="outline" className="text-xs">
                        +{format.fieldsIncluded.length - 3} more
                      </Badge>
                    )}
                  </div>
                </td>
                <td className="py-4 px-4">
                  <div className="font-medium text-gray-900">
                    {formatQuarter(format.quarterStart, format.quarterEnd)}
                  </div>
                </td>
                <td className="py-4 px-4">
                  <div className="text-sm text-gray-600">
                    {formatDateRange(format.quarterStart, format.quarterEnd)}
                  </div>
                </td>
                <td className="py-4 px-4">
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onEdit(format)}
                      className="flex items-center gap-1"
                    >
                      <Edit2 className="h-3 w-3" />
                      Edit
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onDelete(format)}
                      className="flex items-center gap-1 text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="h-3 w-3" />
                      Delete
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
