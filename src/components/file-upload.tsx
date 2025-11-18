"use client";

import { FileWithPreview, useFileUpload } from "@/hooks/use-file-upload";
import { UploadIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface FileUploadProps {
    maxFiles?: number;
    maxSize?: number;
    multiple?: boolean;
    label?: string;
    description?: string;
    icon?: React.ReactNode;
    onFilesAdded?: (files: FileWithPreview[]) => void;
    className?: string;
}

export default function FileUpload({
    maxFiles = 5,
    maxSize = 100 * 1024 * 1024, // 100MB
    multiple = true,
    label = "Drop your documents here",
    description,
    icon,
    onFilesAdded,
    className
}: FileUploadProps) {

    const maxSizeInMB = (maxSize / (1024 * 1024)).toFixed(0);

    const [
        { files, isDragging, errors },
        {
            handleDragEnter,
            handleDragLeave,
            handleDragOver,
            handleDrop,
            openFileDialog,
            removeFile,
            getInputProps,
        },
    ] = useFileUpload({
        multiple,
        maxFiles,
        maxSize,
        onFilesAdded: onFilesAdded,
    });

    return (
        <div
            role="button"
            onClick={openFileDialog}
            onDragEnter={handleDragEnter}
            onDragLeave={handleDragLeave}
            onDragOver={handleDragOver}
            onDrop={handleDrop}
            data-dragging={isDragging || undefined}
            className={cn(
                "cursor-pointer relative flex min-h-52 flex-col items-center justify-center overflow-hidden rounded-xl border border-dashed border-input p-4 transition-colors hover:bg-accent/50 has-disabled:pointer-events-none has-disabled:opacity-50 has-[input:focus]:border-ring has-[input:focus]:ring-[3px] has-[input:focus]:ring-ring/50 data-[dragging=true]:bg-accent/50",
                className
            )}
        >
            <input
                {...getInputProps()}
                className="sr-only"
                aria-label="Upload documents"
            />

            <div className="flex flex-col items-center justify-center px-4 py-3 text-center">
                <div
                    className="mb-2 flex size-11 items-center justify-center rounded-full border bg-background"
                    aria-hidden="true"
                >
                    {icon || <UploadIcon className="size-4 opacity-60" />}
                </div>

                <p className="mb-1.5 text-sm font-medium">{label}</p>

                <p className="text-xs text-muted-foreground">
                    {description ?? `PDF, DOCX or TXT (max. ${maxSizeInMB}MB)`}
                </p>
            </div>
        </div>
    );
}
