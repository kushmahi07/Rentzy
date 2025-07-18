
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Edit, Trash2 } from "lucide-react";
import { PropertyTypeTag } from "../types";

interface PropertyTypeTagTableProps {
  tags: PropertyTypeTag[];
  onEdit: (tag: PropertyTypeTag) => void;
  onDelete: (tag: PropertyTypeTag) => void;
}

export function PropertyTypeTagTable({ tags, onEdit, onDelete }: PropertyTypeTagTableProps) {
  return (
    <div className="border rounded-lg">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Tag Name</TableHead>
            <TableHead>Description</TableHead>
            <TableHead>Sort Order</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {tags.length === 0 ? (
            <TableRow>
              <TableCell colSpan={4} className="text-center py-8 text-gray-500">
                No property type tags found
              </TableCell>
            </TableRow>
          ) : (
            tags.map((tag) => (
              <TableRow key={tag.id}>
                <TableCell className="font-medium">{tag.tagName}</TableCell>
                <TableCell className="max-w-xs">
                  <div className="truncate" title={tag.description}>
                    {tag.description || 'No description'}
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant="outline">{tag.sortOrder}</Badge>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onEdit(tag)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onDelete(tag)}
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
}
