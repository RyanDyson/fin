"use client";

import { useState, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Button } from "../ui/button";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogHeader,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { UploadSimpleIcon, FileIcon, TrashIcon } from "@phosphor-icons/react";
import { cn } from "@/lib/utils";
import { Input } from "../ui/input";

interface UploadDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onUpload: (files: File[]) => void;
}

export function UploadDialog({ isOpen, onClose, onUpload }: UploadDialogProps) {
  const [files, setFiles] = useState<File[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      setFiles((prev) => [...prev, ...Array.from(e.dataTransfer.files)]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFiles((prev) => [...prev, ...Array.from(e?.target?.files as File)]);
    }
    // Reset input value to allow selecting the same file again if removed
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const removeFile = (index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const handleUpload = () => {
    onUpload(files);
    setFiles([]);
    onClose();
  };

  const handleClose = () => {
    setFiles([]);
    onClose();
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 B";
    const k = 1024;
    const sizes = ["B", "KB", "MB", "GB", "TB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + " " + sizes[i];
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && handleClose()}>
      <DialogContent className="max-w-lg gap-0 overflow-hidden p-0 sm:rounded-3xl">
        {/* Header */}
        <DialogHeader>
          <DialogTitle className="text-primary text-lg font-semibold">
            Upload Materials
          </DialogTitle>
        </DialogHeader>

        {/* Content */}
        <div className="p-6">
          <Input
            type="file"
            multiple
            className="hidden"
            ref={fileInputRef}
            onChange={handleFileChange}
          />

          <div
            className={cn(
              "border-border group bg-muted/20 flex cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed px-6 py-10 transition-colors",
              isDragging
                ? "border-primary bg-primary/5"
                : "hover:border-primary/50 hover:bg-muted/40",
            )}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
          >
            <UploadSimpleIcon className="size-6" weight="bold" />

            <h3 className="text-foreground text-center font-medium">
              Click to upload or drag and drop
            </h3>
            <p className="text-muted-foreground mt-1 text-center text-sm">
              PDF, DOCX, PPTX, or Images (max 10MB)
            </p>
          </div>

          {/* Selected Files List */}
          <AnimatePresence>
            {files.length > 0 && (
              <motion.div
                initial={{ opacity: 0, height: 0, marginTop: 0 }}
                animate={{ opacity: 1, height: "auto", marginTop: 24 }}
                exit={{ opacity: 0, height: 0, marginTop: 0 }}
                className="space-y-3 overflow-hidden"
              >
                <h4 className="text-foreground text-sm font-medium">
                  Selected Files ({files.length})
                </h4>
                <div className="max-h-48 space-y-2 overflow-y-auto pr-2">
                  {files.map((file, index) => (
                    <motion.div
                      key={`${file.name}-${index}`}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 10 }}
                      className="border-border bg-background flex items-center justify-between rounded-xl border p-3"
                    >
                      <div className="flex items-center gap-3 overflow-hidden">
                        <div className="bg-primary/10 text-primary flex size-8 shrink-0 items-center justify-center rounded-lg">
                          <FileIcon className="size-4" weight="fill" />
                        </div>
                        <div className="overflow-hidden">
                          <p className="text-foreground truncate text-sm font-medium">
                            {file.name}
                          </p>
                          <p className="text-muted-foreground text-xs">
                            {formatFileSize(file.size)}
                          </p>
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-muted-foreground hover:text-destructive hover:bg-destructive/10 h-8 w-8 shrink-0 rounded-full"
                        onClick={(e) => {
                          e.stopPropagation();
                          removeFile(index);
                        }}
                      >
                        <TrashIcon className="size-4" />
                      </Button>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Footer */}
        <DialogFooter>
          <Button variant="ghost" onClick={handleClose}>
            Cancel
          </Button>
          <Button
            variant="gradient"
            onClick={handleUpload}
            disabled={files.length === 0}
          >
            Upload <UploadSimpleIcon className="size-4" />
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
