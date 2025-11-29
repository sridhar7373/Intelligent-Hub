"use client";

import { AppHeader } from "@/components/app-header";
import FileUpload from "@/components/file-upload";
import { withAuth, WithAuthProps } from "@/hoc/withAuth";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { formatBytes, FileWithPreview } from "@/hooks/use-file-upload";
import { useKBUpload } from "@/hooks/useKBUpload";
import { useKnowldegeBase } from "@/hooks/useKnowldegeBase";
import { useParams } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { FileIcon, Trash2Icon } from "lucide-react";
import { Empty, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from "@/components/ui/empty";
import { Progress } from "@/components/ui/progress";
import { useMemo } from "react";
import { formatDate } from "@/lib/date-pipe";
import { useKBDelete } from "@/hooks/useKBDelete";
import Image from "next/image";

function KBPage({ user }: WithAuthProps) {
    const params = useParams();
    const baseId = params.baseId as string;

    const { data, error, isLoading, mutate: fetchKb } = useKnowldegeBase(baseId);
    const { trigger: uploadDoc, error: uploadError } = useKBUpload(baseId);
    const { trigger: deleteDoc, isMutating: deleting } = useKBDelete(baseId);

    function getFileCategory(type: string) {
        if (type.includes("pdf")) return "PDF";
        if (type.includes("word")) return "DOCX";
        if (type.includes("sheet")) return "XLSX";
        if (type.includes("csv")) return "CSV";
        if (type.includes("json")) return "JSON";
        if (type.includes("yaml") || type.includes("yml")) return "YAML";
        if (type.includes("markdown") || type.includes("md")) return "Markdown";
        if (type.includes("plain")) return "Text";

        return "Other";
    }

    function getFileIconSrc(type: string) {
        const ext = getFileCategory(type).toLowerCase();
        switch (ext) {
            case "pdf":
                return "/icons/pdf.png";
            case "docx":
            case "doc":
                return "/icons/docx.png";
            case "xlsx":
            case "xls":
                return "/icons/xlsx.png";
            case "csv":
                return "/icons/csv.png";
            case "json":
                return "/icons/json.png";
            case "yaml":
            case "yml":
                return "/icons/yaml.png";
            case "md":
                return "/icons/md.png";
            case "txt":
                return "/icons/txt.png";
        }
        return "/icons/json.png"
    }

    const { progressStats, total } = useMemo(() => {
        if (!data?.base?.documents) return { progressStats: [], total: 0 };

        const docs = data.base.documents;
        const total = docs.length;

        const counts: Record<string, number> = {};

        docs.forEach((doc: any) => {
            const type = doc.type;
            let category = getFileCategory(type)

            counts[category] = (counts[category] || 0) + 1;
        });

        const progressStats = Object.entries(counts).map(([type, count]) => ({
            type,
            count,
            percent: total ? (count / total) * 100 : 0,
        }));

        return { progressStats, total };
    }, [data]);

    if (isLoading) return <div>Loading...</div>;
    if (error || !data) return <div>Error loading KB</div>;

    // Upload handler
    async function onFilesAdded(files: FileWithPreview[]) {
        for (const file of files) {
            const form = new FormData();
            form.append("file", file.file as File);

            const uploadToast = toast.loading(`Uploading ${file.file.name}...`);

            try {
                const data = await uploadDoc(form); // must return parsed JSON
                await fetchKb();

                toast.success(data.title || "Upload Successful", {
                    id: uploadToast,
                    description: data.message || `${file.file.name} uploaded successfully!`,
                });

            } catch (err: any) {
                const apiMessage = err?.response?.data?.message || err?.message;

                toast.error("Upload Failed", {
                    id: uploadToast,
                    description: apiMessage || `Failed to upload ${file.file.name}`,
                });
            }
        }
    }


    function onFileDelete(file: any) {
        toast.promise(
            deleteDoc(file.id).then(() => fetchKb()),
            {
                loading: `Deleting ${file.name}...`,
                success: `${file.name} deleted!`,
                error: `Failed to delete ${file.name}`,
            }
        );
    }

    return (
        <>
            <AppHeader title={data.base.name} />

            <div className="grid grid-cols-1 lg:grid-cols-5 gap-4 p-4 ">
                <div className="col-span-4 flex flex-col gap-4">
                    <FileUpload onFilesAdded={onFilesAdded} />

                    <div className="overflow-hidden rounded-md border bg-background">
                        <Table className="min-w-full table-fixed">
                            <TableHeader className="text-xs">
                                <TableRow className="bg-muted/50">
                                    <TableHead className="w-[40%] text-left">Name</TableHead>
                                    <TableHead className="w-[15%] text-left">Type</TableHead>
                                    <TableHead className="w-[15%] text-left">Size</TableHead>
                                    <TableHead className="w-[20%] text-left">Uploaded At</TableHead>
                                    <TableHead className="w-[10%] text-right">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                        </Table>

                        <div className="h-[calc(100vh/2.2)] overflow-y-auto">
                            <Table className="min-w-full table-fixed">
                                <TableBody className="text-[13px]">
                                    {data.base.documents.length === 0 && (
                                        <TableRow>
                                            <TableCell colSpan={5} className="py-10 text-center">
                                                <Empty>
                                                    <EmptyHeader>
                                                        <EmptyMedia variant="icon">
                                                            <FileIcon />
                                                        </EmptyMedia>
                                                        <EmptyTitle>No documents uploaded</EmptyTitle>
                                                        <EmptyDescription>
                                                            Upload PDF, DOCX, TXT, CSV, JSON, MD, YAML, XLSX files.
                                                        </EmptyDescription>
                                                    </EmptyHeader>
                                                </Empty>
                                            </TableCell>
                                        </TableRow>
                                    )}

                                    {data.base.documents.map((file: any) => (
                                        <TableRow key={file.id}>
                                            <TableCell className="w-[50%] truncate font-medium flex items-center gap-2">
                                                <Image
                                                    src={getFileIconSrc(file.type)}
                                                    alt={file.type}
                                                    width={22}
                                                    height={22}
                                                    className="opacity-80"
                                                />
                                                {file.name}
                                            </TableCell>
                                            <TableCell className="w-[15%] text-muted-foreground">
                                                {getFileCategory(file.type)}
                                            </TableCell>
                                            <TableCell className="w-[15%] text-muted-foreground">
                                                {formatBytes(file.size)}
                                            </TableCell>
                                            <TableCell className="w-[20%] text-muted-foreground">
                                                {formatDate(file.uploadedAt, "dd MMM yyyy")}
                                            </TableCell>
                                            <TableCell className="w-[10%] text-right">
                                                <Button size="icon" variant="ghost" disabled={deleting} onClick={() => onFileDelete(file)}>
                                                    <Trash2Icon className="size-4" />
                                                </Button>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </div>
                    </div>

                </div>

                {/* Right panel */}
                <div className="overflow-hidden rounded-md border bg-background p-4 space-y-4">
                    {progressStats.length === 0 ? (
                        <p className="text-sm text-muted-foreground">No document statistics.</p>
                    ) : (
                        progressStats.map((item) => (
                            <div key={item.type} className="space-y-2">
                                <div className="flex justify-between text-xs">
                                    <span>{item.type}</span>
                                    <span>{item.count} / {total}</span>
                                </div>
                                <Progress value={item.percent} />
                            </div>
                        ))
                    )}
                </div>
            </div>
        </>
    );
}

export default withAuth(KBPage);
