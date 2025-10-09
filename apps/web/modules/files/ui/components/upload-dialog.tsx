"use client"

import { useAction } from "convex/react";
import { useState } from "react";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle
} from "@workspace/ui/components/dialog";
import { Input } from "@workspace/ui/components/input";
import { Label } from "@workspace/ui/components/label";
import { Button } from "@workspace/ui/components/button";
import {
    Dropzone,
    DropzoneContent,
    DropzoneEmptyState
} from "@workspace/ui/components/dropzone";
import { api } from "@workspace/backend/_generated/api";
import { optional } from "zod/v4";

interface UploadDialogProps {
    open : boolean;
    onOpenChange: (open : boolean) => void;
    onFileUploaded?: () => void
}

export const UploadDialog = ({
    open,
    onOpenChange,
    onFileUploaded
} : UploadDialogProps) => {

    const addFile = useAction(api.private.files.addFile);

    const [uploadFiles , setUploadedFiles] = useState<File[]>([]);
    const [isUploading, setIsuploading] = useState(false);
    const [uploadForm, setUploadForm] = useState({
        category: "",
        filename : ""
    });

    const handleFileDrop = (acceptedFiles : File[]) => {
        const file =acceptedFiles[0];

        if(file){
            setUploadedFiles([file]);

            if(!uploadForm.filename){
                setUploadForm((prev) => ({ ...prev, filename: file.name}))
            }
        }
    };

    const handleUpload = async() => {
        setIsuploading(true);
        try {
            const blob = uploadFiles[0];

            if(!blob){
                return;
            }

            const filename = uploadForm.filename || blob.name;

            await addFile({
                bytes : await blob.arrayBuffer(),
                filename,
                mimeType : blob.type || "text/plain",
                category : uploadForm.category,
            });

            onFileUploaded?.();
            handleCancel();
        } catch (error) {
            console.error(error);
        } finally{
            setIsuploading(false);
        }
    }

    const handleCancel = () => {
        onOpenChange(false);
        setUploadedFiles([]);
        setUploadForm({
            category : "",
            filename : ""
        });
    }

    return(
        <Dialog
            onOpenChange={onOpenChange}
            open={open}
        >
            <DialogContent className="sm:max-w-lg">
                <DialogHeader>
                    <DialogTitle>
                        Upload Document
                    </DialogTitle>
                    <DialogDescription>
                        Upload Documents to your Knowledge Base for AI-powered Search and Retrieval
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="category">
                            Category
                        </Label>
                        <Input
                            className="w-full"
                            id="category"
                            onChange={(e) => setUploadForm((prev) => ({
                                ...prev,
                                category: e.target.value
                            }))}
                            placeholder="e.g., Documentation, Support, Product"
                            type="text"
                            value={uploadForm.category}
                        >
                        
                        </Input>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="filename">
                            Filename{" "}
                            <span className="text-muted-foreground text-xs">(optional)</span>
                        </Label>
                        <Input
                            className="w-full"
                            id="filename"
                            onChange={(e) => setUploadForm((prev) => ({
                                ...prev,
                                filename: e.target.value
                            }))}
                            placeholder="Override default filename"
                            type="text"
                            value={uploadForm.filename}
                        >
                        </Input>
                    </div>

                    <Dropzone
                        accept={{
                            "application/pdf": [".pdf"],
                            "text/csv": [".csv"],
                            "text/plain": [".txt"]
                        }}
                        disabled={isUploading}
                        maxFiles={1}
                        onDrop={handleFileDrop}
                        src={uploadFiles}
                    >
                        <DropzoneEmptyState/>
                        <DropzoneContent/>
                    </Dropzone>
                </div>

                <DialogFooter>
                    <Button
                        disabled={isUploading}
                        onClick={handleCancel}
                        variant="outline"
                    >
                        Cancel
                    </Button>
                    <Button
                        onClick={handleUpload}
                        disabled={uploadFiles.length === 0 || isUploading || !uploadForm.category}
                    >
                        {isUploading ? "Uploading..." : "Upload"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )

}