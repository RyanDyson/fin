"use client";

import { useState } from "react";
import { Button } from "../ui/button";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogHeader,
  DialogFooter,
} from "@/components/ui/dialog";
import { UploadSimpleIcon } from "@phosphor-icons/react";
import { UploadArea } from "./upload-area";

interface UploadDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onUpload: (files: File[]) => void;
}

export function UploadDialog({ isOpen, onClose, onUpload }: UploadDialogProps) {
  const [files, setFiles] = useState<File[]>([]);

  const handleUpload = () => {
    onUpload(files);
    setFiles([]);
    onClose();
  };

  const handleClose = () => {
    setFiles([]);
    onClose();
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
          <UploadArea files={files} onChange={setFiles} />
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
