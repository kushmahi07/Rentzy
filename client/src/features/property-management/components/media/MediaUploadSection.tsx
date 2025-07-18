
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Camera, Upload, X, CheckCircle } from "lucide-react";

interface MediaUploadSectionProps {
  title: string;
  description: string[];
  files: File[];
  acceptedTypes: string;
  fileInputId: string;
  isRequired?: boolean;
  minFiles?: number;
  maxFiles?: number;
  onFilesChange: (files: FileList | null) => void;
  onRemoveFile: (index: number) => void;
  renderFilePreview?: (file: File, index: number) => React.ReactNode;
  linkValue?: string;
  onLinkChange?: (value: string) => void;
  linkLabel?: string;
  linkPlaceholder?: string;
}

export const MediaUploadSection: React.FC<MediaUploadSectionProps> = ({
  title,
  description,
  files,
  acceptedTypes,
  fileInputId,
  isRequired = false,
  minFiles = 0,
  maxFiles,
  onFilesChange,
  onRemoveFile,
  renderFilePreview,
  linkValue,
  onLinkChange,
  linkLabel,
  linkPlaceholder
}) => {
  const hasMinFiles = files.length >= minFiles;
  const hasMaxFiles = maxFiles ? files.length >= maxFiles : false;

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <h3 className="text-xl font-semibold text-gray-900">{title}</h3>
        {isRequired && minFiles > 0 && (
          <Badge variant="destructive">Required - Min {minFiles} files</Badge>
        )}
        {!isRequired && <Badge variant="outline">Optional</Badge>}
      </div>
      
      <div className="space-y-4">
        <div className="text-sm text-gray-600">
          {description.map((line, index) => (
            <p key={index}>• {line}</p>
          ))}
        </div>
        
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
          <div className="flex flex-col items-center gap-4">
            <div className="h-16 w-16 bg-gray-100 rounded-lg flex items-center justify-center">
              <Camera className="h-8 w-8 text-gray-400" />
            </div>
            <div>
              <p className="text-lg font-medium">{title}</p>
              <p className="text-sm text-gray-500">Drag and drop or click to select</p>
            </div>
            <input
              type="file"
              accept={acceptedTypes}
              multiple={!maxFiles || maxFiles > 1}
              onChange={(e) => onFilesChange(e.target.files)}
              className="hidden"
              id={fileInputId}
              disabled={hasMaxFiles}
            />
            <Button 
              variant="outline" 
              onClick={() => document.getElementById(fileInputId)?.click()}
              className="flex items-center gap-2"
              disabled={hasMaxFiles}
            >
              <Upload className="h-4 w-4" />
              Select Files
            </Button>
          </div>
          
          {files.length > 0 && (
            <div className="mt-6">
              <div className="flex items-center justify-between mb-4">
                <p className="text-sm font-medium text-gray-700">
                  {files.length} file(s) uploaded
                  {minFiles > 0 && files.length < minFiles && (
                    <span className="text-red-600 ml-1">
                      (Need {minFiles - files.length} more)
                    </span>
                  )}
                  {hasMinFiles && (
                    <span className="text-green-600 ml-1">✓ Minimum requirement met</span>
                  )}
                </p>
              </div>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {files.map((file, index) => (
                  <div key={index} className="relative group">
                    {renderFilePreview ? (
                      renderFilePreview(file, index)
                    ) : (
                      <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden border-2 border-gray-200">
                        <img
                          src={URL.createObjectURL(file)}
                          alt={`File ${index + 1}`}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    )}
                    <button
                      onClick={() => onRemoveFile(index)}
                      className="absolute -top-2 -right-2 bg-red-500 hover:bg-red-600 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity shadow-lg"
                      title="Remove file"
                    >
                      <X className="h-4 w-4" />
                    </button>
                    <p className="text-xs text-gray-600 mt-1 truncate text-center">
                      {file.name}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Optional Link Input */}
        {onLinkChange && linkLabel && (
          <div className="border-t pt-4">
            <Label htmlFor={`${fileInputId}-link`}>{linkLabel}</Label>
            <div className="mt-2 flex gap-2">
              <Input
                id={`${fileInputId}-link`}
                type="url"
                placeholder={linkPlaceholder}
                value={linkValue || ''}
                onChange={(e) => onLinkChange(e.target.value)}
                className="flex-1"
              />
              <Button 
                variant="outline"
                onClick={() => {
                  if (linkValue) {
                    window.open(linkValue, '_blank');
                  }
                }}
                disabled={!linkValue}
                className="flex items-center gap-2"
              >
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
                Preview
              </Button>
            </div>
            {linkValue && (
              <p className="text-sm text-green-600 flex items-center gap-1 mt-2">
                <CheckCircle className="h-3 w-3" />
                Link added
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default MediaUploadSection;
