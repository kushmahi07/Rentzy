
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Edit, Trash2 } from "lucide-react";
import { Amenity } from "../types";

interface AmenityTableProps {
  amenities: Amenity[];
  onEdit: (amenity: Amenity) => void;
  onDelete: (amenity: Amenity) => void;
}

export function AmenityTable({ amenities, onEdit, onDelete }: AmenityTableProps) {
  if (amenities.length === 0) {
    return (
      <div className="bg-white rounded-lg border border-gray-200 p-8">
        <div className="text-center">
          <div className="mx-auto w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center mb-4">
            <span className="text-2xl">🏠</span>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No amenities found</h3>
          <p className="text-gray-500">Try adjusting your search criteria or add a new amenity.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow className="bg-gray-50">
            <TableHead className="font-medium">Amenity Name</TableHead>
            <TableHead className="font-medium">Type</TableHead>
            <TableHead className="font-medium">Icon</TableHead>
            <TableHead className="font-medium text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {amenities.map((amenity) => (
            <TableRow key={amenity.id} className="hover:bg-gray-50">
              <TableCell className="font-medium">{amenity.name}</TableCell>
              <TableCell>
                <Badge
                  variant={amenity.type === 'Indoor' ? 'default' : 'secondary'}
                  className={
                    amenity.type === 'Indoor' 
                      ? 'bg-blue-100 text-blue-800' 
                      : 'bg-green-100 text-green-800'
                  }
                >
                  {amenity.type}
                </Badge>
              </TableCell>
              <TableCell>
                {amenity.icon && (
                  <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center text-lg">
                    {amenity.icon}
                  </div>
                )}
              </TableCell>
              <TableCell className="text-right">
                <div className="flex gap-2 justify-end">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onEdit(amenity)}
                    className="h-8 w-8 p-0"
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onDelete(amenity)}
                    className="h-8 w-8 p-0 text-red-600 hover:text-red-700"
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
