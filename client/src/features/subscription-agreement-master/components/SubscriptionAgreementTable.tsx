
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Edit, Trash2, FileText, Eye } from 'lucide-react';
import { SubscriptionAgreement } from '../types';

interface SubscriptionAgreementTableProps {
  agreements: SubscriptionAgreement[];
  onEdit: (agreement: SubscriptionAgreement) => void;
  onDelete: (agreement: SubscriptionAgreement) => void;
  onPreview: (agreement: SubscriptionAgreement) => void;
}

export function SubscriptionAgreementTable({
  agreements,
  onEdit,
  onDelete,
  onPreview,
}: SubscriptionAgreementTableProps) {
  if (agreements.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="flex flex-col items-center space-y-3">
          <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center">
            <FileText className="h-8 w-8 text-gray-400" />
          </div>
          <div className="text-center">
            <p className="text-gray-600 font-medium">No subscription agreements found.</p>
            <p className="text-gray-500 text-sm mt-1">
              Create your first subscription agreement template.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Agreement Name</TableHead>
            <TableHead>Document</TableHead>
            <TableHead>Version</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Created</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {agreements.map((agreement) => (
            <TableRow key={agreement.id}>
              <TableCell className="font-medium">
                {agreement.agreementName}
              </TableCell>
              <TableCell>
                <div className="flex items-center space-x-2">
                  <FileText className="h-4 w-4 text-red-500" />
                  <span className="text-sm text-gray-600 truncate max-w-[200px]">
                    {agreement.documentFilename}
                  </span>
                </div>
              </TableCell>
              <TableCell>
                <Badge variant="outline" className="font-mono">
                  v{agreement.version}
                </Badge>
              </TableCell>
              <TableCell>
                <Badge 
                  variant={agreement.isActive ? "default" : "secondary"}
                  className={agreement.isActive 
                    ? "bg-green-100 text-green-800" 
                    : "bg-gray-100 text-gray-800"
                  }
                >
                  {agreement.isActive ? 'Active' : 'Inactive'}
                </Badge>
              </TableCell>
              <TableCell className="text-sm text-gray-600">
                {agreement.createdAt.toLocaleDateString()}
              </TableCell>
              <TableCell className="text-right">
                <div className="flex items-center justify-end space-x-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onPreview(agreement)}
                    className="h-8 w-8 p-0"
                    title="Preview"
                  >
                    <Eye className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onEdit(agreement)}
                    className="h-8 w-8 p-0"
                    title="Edit"
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onDelete(agreement)}
                    className="h-8 w-8 p-0 text-red-600 hover:text-red-800"
                    title="Delete"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
