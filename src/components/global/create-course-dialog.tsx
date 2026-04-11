"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogHeader,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { UploadArea } from "./upload-area";

export interface BrainrotOption {
  id: number;
  name: string;
}

export interface CreateCourseData {
  name: string;
  description: string;
  files: File[];
  brainrotId: number;
}

interface CreateCourseDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onCreate: (data: CreateCourseData) => void;
  isCreating: boolean;
  brainrotOptions: BrainrotOption[];
}

enum Steps {
  DETAILS = "details",
  BRAINROT = "brainrot",
}

export function CreateCourseDialog({
  isOpen,
  onClose,
  onCreate,
  isCreating,
  brainrotOptions,
}: CreateCourseDialogProps) {
  const [step, setStep] = useState<Steps>(Steps.DETAILS);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [files, setFiles] = useState<File[]>([]);
  const [selectedBrainrot, setSelectedBrainrot] = useState<number | null>(null);

  // Reset internal state whenever the dialog opens
  useEffect(() => {
    if (isOpen) {
      setStep(Steps.DETAILS);
      setName("");
      setDescription("");
      setFiles([]);
      setSelectedBrainrot(brainrotOptions[0]?.id ?? null);
    }
  }, [isOpen, brainrotOptions]);

  const canGoNext = name.trim() !== "" && files.length > 0;

  const handleNext = () => {
    if (canGoNext) {
      setStep(Steps.BRAINROT);
    }
  };

  const handleCreate = () => {
    if (selectedBrainrot) {
      onCreate({
        name,
        description,
        files,
        brainrotId: selectedBrainrot,
      });
    }
  };

  const selectedOption = brainrotOptions.find(
    (opt) => opt.id === selectedBrainrot,
  );

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-xl gap-0 overflow-hidden p-0 sm:rounded-3xl">
        {step === Steps.DETAILS ? (
          <>
            {/* Step 1: Course Details */}
            <DialogHeader>
              <DialogTitle className="text-primary text-lg font-semibold">
                Create New Course
              </DialogTitle>
              <DialogDescription>
                Add course details and optional PDF material files.
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4 p-6">
              <div className="space-y-2">
                <Label htmlFor="course-name">Course name</Label>
                <Input
                  id="course-name"
                  placeholder="e.g. Linear Algebra II"
                  value={name}
                  onChange={(event) => setName(event.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="course-description">Description</Label>
                <Textarea
                  id="course-description"
                  placeholder="Add description"
                  value={description}
                  onChange={(event) => setDescription(event.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="course-files">Course materials</Label>
                <UploadArea
                  files={files}
                  onChange={setFiles}
                  maxFiles={5}
                  maxSize={5 * 1024 * 1024}
                  helperText="Or click to browse (max 5 files, up to 5MB each)"
                />
              </div>
            </div>

            <DialogFooter>
              <Button variant="ghost" onClick={onClose}>
                Cancel
              </Button>
              <Button
                variant="gradient"
                onClick={handleNext}
                disabled={!canGoNext}
              >
                Next Step
              </Button>
            </DialogFooter>
          </>
        ) : (
          <>
            {/* Step 2: Choose Brainrot */}
            <DialogHeader>
              <DialogTitle className="text-primary text-lg font-semibold">
                Choose your brainrot
              </DialogTitle>
            </DialogHeader>

            <div className="p-6">
              <div className="mb-8 flex flex-col items-center gap-3 text-center">
                <div className="bg-muted text-muted-foreground flex aspect-square h-24 w-24 items-center justify-center rounded-full border text-[10px] font-medium tracking-wide uppercase">
                  placeholder
                </div>
                <div>
                  <p className="text-base font-semibold">
                    {selectedOption?.name ?? "Select an option"}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                {brainrotOptions.map((option) => (
                  <button
                    key={option.id}
                    type="button"
                    aria-pressed={selectedBrainrot === option.id}
                    onClick={() => setSelectedBrainrot(option.id)}
                    className={cn(
                      "rounded-xl border p-4 text-center transition-all",
                      selectedBrainrot === option.id
                        ? "border-primary ring-primary/30 bg-primary/5 ring-2"
                        : "hover:border-primary/40 border-border",
                    )}
                  >
                    <div className="bg-muted text-muted-foreground mx-auto mb-3 flex aspect-square w-16 items-center justify-center rounded-full border text-[10px] font-medium tracking-wide uppercase">
                      img
                    </div>
                    <p className="text-sm font-semibold">{option.name}</p>
                  </button>
                ))}
              </div>
            </div>

            <DialogFooter>
              <Button variant="ghost" onClick={() => setStep(Steps.DETAILS)}>
                Back
              </Button>
              <Button
                variant="gradient"
                onClick={handleCreate}
                disabled={!selectedBrainrot || isCreating}
              >
                {isCreating ? "Creating..." : "Create course"}
              </Button>
            </DialogFooter>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
