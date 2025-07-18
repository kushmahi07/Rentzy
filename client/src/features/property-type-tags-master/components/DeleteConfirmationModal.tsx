
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { PropertyTypeTag } from "../types";

interface DeleteConfirmationModalProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  tag: PropertyTypeTag | null;
  isDeleting: boolean;
}

export function DeleteConfirmationModal({
  open,
  onClose,
  onConfirm,
  tag,
  isDeleting,
}: DeleteConfirmationModalProps) {
  return (
    <AlertDialog open={open} onOpenChange={onClose}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete Property Type Tag</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to delete the tag "{tag?.tagName}"? This action cannot be undone.
            {tag && (
              <div className="mt-2 p-2 bg-gray-50 rounded text-sm">
                <strong>Tag:</strong> {tag.tagName}<br />
                <strong>Description:</strong> {tag.description || 'No description'}<br />
                <strong>Sort Order:</strong> {tag.sortOrder}
              </div>
            )}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={onConfirm}
            disabled={isDeleting}
            className="bg-red-600 hover:bg-red-700"
          >
            {isDeleting ? 'Deleting...' : 'Delete'}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
