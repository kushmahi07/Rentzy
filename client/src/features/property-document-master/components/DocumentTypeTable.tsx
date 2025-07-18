
import React from 'react';
import { Edit2, Trash2, FileText } from 'lucide-react';
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
import { DocumentType } from '../types';

interface DocumentTypeTableProps {
  documentTypes: DocumentType[];
  onEdit: (documentType: DocumentType) => void;
  onDelete: (documentType: DocumentType) => void;
}

const DocumentTypeTable: React.FC<DocumentTypeTableProps> = ({
  documentTypes,
  onEdit,
  onDelete
}) => {
  const formatFileTypes = (fileTypes: string[]) => {
    return fileTypes.map(type => type.toUpperCase()).join(', ');
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200">
      <Table>
        <TableHeader>
          <TableRow className="bg-gray-50">
            <TableHead className="font-semibold text-gray-700">Document Name</TableHead>
            <TableHead className="font-semibold text-gray-700">Property Type</TableHead>
            <TableHead className="font-semibold text-gray-700">Mandatory</TableHead>
            <TableHead className="font-semibold text-gray-700">Accepted File Types</TableHead>
            <TableHead className="font-semibold text-gray-700 text-center">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {documentTypes.length === 0 ? (
            <TableRow>
              <TableCell colSpan={5} className="text-center py-8">
                <div className="flex flex-col items-center space-y-3">
                  <FileText className="h-12 w-12 text-gray-400" />
                  <p className="text-gray-500">No document types found</p>
                </div>
              </TableCell>
            </TableRow>
          ) : (
            documentTypes.map((documentType) => (
              <TableRow key={documentType.id} className="hover:bg-gray-50">
                <TableCell className="font-medium text-gray-900">
                  {documentType.documentName}
                </TableCell>
                <TableCell>
                  <Badge
                    variant="outline"
                    className={
                      documentType.propertyType === 'Residential'
                        ? 'bg-blue-50 text-blue-700 border-blue-200'
                        : 'bg-green-50 text-green-700 border-green-200'
                    }
                  >
                    {documentType.propertyType}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Badge
                    variant={documentType.mandatory ? 'default' : 'secondary'}
                    className={
                      documentType.mandatory
                        ? 'bg-red-100 text-red-700'
                        : 'bg-gray-100 text-gray-700'
                    }
                  >
                    {documentType.mandatory ? 'Yes' : 'No'}
                  </Badge>
                </TableCell>
                <TableCell className="text-sm text-gray-600">
                  {formatFileTypes(documentType.acceptedFileTypes)}
                </TableCell>
                <TableCell className="text-center">
                  <div className="flex justify-center space-x-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onEdit(documentType)}
                      className="h-8 w-8 p-0 hover:bg-blue-50 hover:text-blue-600"
                    >
                      <Edit2 className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onDelete(documentType)}
                      className="h-8 w-8 p-0 hover:bg-red-50 hover:text-red-600"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default DocumentTypeTable;
