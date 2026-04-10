"use client";

import { Upload, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  FileUpload,
  FileUploadDropzone,
  FileUploadItem,
  FileUploadItemDelete,
  FileUploadItemMetadata,
  FileUploadItemPreview,
  FileUploadList,
  FileUploadTrigger,
} from "@/components/ui/file-upload";

type CourseFileUploadProps = {
  files: File[];
  onFilesChange: (files: File[]) => void;
  maxFiles: number;
  maxSize: number;
  helperText: string;
  browseLabel?: string;
};

export function CourseFileUpload({
  files,
  onFilesChange,
  maxFiles,
  maxSize,
  helperText,
  browseLabel = "Browse files",
}: CourseFileUploadProps) {
  return (
    <FileUpload
      maxFiles={maxFiles}
      maxSize={maxSize}
      className="w-full"
      value={files}
      onValueChange={onFilesChange}
      multiple
    >
      <FileUploadDropzone>
        <div className="flex flex-col items-center gap-1 text-center">
          <div className="flex items-center justify-center rounded-full border p-2.5">
            <Upload className="text-muted-foreground h-6 w-6" />
          </div>
          <p className="text-sm font-medium">Drag & drop files here</p>
          <p className="text-muted-foreground text-xs">{helperText}</p>
        </div>
        <FileUploadTrigger asChild>
          <Button variant="outline" size="sm" className="mt-2 w-fit">
            {browseLabel}
          </Button>
        </FileUploadTrigger>
      </FileUploadDropzone>
      <FileUploadList>
        {files.map((file, index) => (
          <FileUploadItem key={index} value={file}>
            <FileUploadItemPreview />
            <FileUploadItemMetadata />
            <FileUploadItemDelete asChild>
              <Button variant="ghost" size="icon" className="h-7 w-7">
                <X className="h-4 w-4" />
              </Button>
            </FileUploadItemDelete>
          </FileUploadItem>
        ))}
      </FileUploadList>
    </FileUpload>
  );
}
