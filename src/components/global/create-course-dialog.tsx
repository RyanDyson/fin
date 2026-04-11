"use client";

import { useState, useEffect, useMemo } from "react";
import Image from "next/image";
import { User } from "lucide-react";
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

const BRAINROT_IMAGE_MAP: Record<string, string> = {
  "Chimpanzini Bananini": "/img/brainrot_profile/chimpanzini_bananini.png",
  "Balerinna Cappucinna": "/img/brainrot_profile/balerinna_cappucinna.webp",
  "Brr Brr Patapim": "/img/brainrot_profile/brr_brr_patapim.webp",
  "Trippi Troppi": "/img/brainrot_profile/trippi_troppi.webp",
  "Tung Tung": "/img/brainrot_profile/tung_tung.webp",
};

function getBrainrotImage(name?: string) {
  if (!name) return null;
  return BRAINROT_IMAGE_MAP[name] ?? null;
}

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
  // Always put 'Normal' first
  const sortedBrainrotOptions = useMemo(() => {
    return [...brainrotOptions].sort((a, b) => {
      if (a.name === "Normal") return -1;
      if (b.name === "Normal") return 1;
      return 0;
    });
  }, [brainrotOptions]);

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
      // Always select 'Normal' if present, else first
      const normal = sortedBrainrotOptions.find((b) => b.name === "Normal");
      setSelectedBrainrot(normal?.id ?? sortedBrainrotOptions[0]?.id ?? null);
    }
  }, [isOpen, sortedBrainrotOptions]);

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

  const selectedOption = sortedBrainrotOptions.find(
    (opt) => opt.id === selectedBrainrot,
  );
  const selectedOptionImage = getBrainrotImage(selectedOption?.name);

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="w-fit max-w-none min-w-fit gap-0 overflow-hidden p-0 sm:rounded-3xl">
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
                <div className="flex aspect-square h-24 w-24 items-center justify-center rounded-full border text-[10px] font-medium tracking-wide uppercase">
                  {selectedOptionImage ? (
                    <Image
                      src={selectedOptionImage}
                      alt={selectedOption?.name ?? "Selected brainrot"}
                      width={96}
                      height={96}
                      className="h-full w-full rounded-full object-cover"
                    />
                  ) : (
                    <User className="text-muted-foreground h-12 w-12" />
                  )}
                </div>
                <div>
                  <p className="text-base font-semibold">
                    {selectedOption?.name ?? "Select an option"}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                {sortedBrainrotOptions.map((option) => {
                  const optionImage = getBrainrotImage(option.name);
                  return (
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
                      <div className="mx-auto mb-3 flex aspect-square w-16 items-center justify-center rounded-full border text-[10px] font-medium tracking-wide uppercase">
                        {optionImage ? (
                          <Image
                            src={optionImage}
                            alt={option.name}
                            width={64}
                            height={64}
                            className="h-full w-full rounded-full object-cover"
                          />
                        ) : (
                          <User className="text-muted-foreground h-8 w-8" />
                        )}
                      </div>
                      <p className="text-sm font-semibold">{option.name}</p>
                    </button>
                  );
                })}
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
