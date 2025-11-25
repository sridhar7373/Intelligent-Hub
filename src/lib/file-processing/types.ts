export type SupportedMimeType =
    | "text/plain"
    | "text/markdown"
    | "application/json"
    | "application/x-yaml"
    | "text/yaml"
    | "application/yaml"
    | "text/csv"
    | "application/csv"
    | "application/vnd.ms-excel"
    | "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    | "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
    | "application/pdf";

export const SUPPORTED_MIME_TYPES: SupportedMimeType[] = [
    "text/plain",
    "text/markdown",
    "application/json",
    "application/x-yaml",
    "text/yaml",
    "application/yaml",
    "text/csv",
    "application/csv",
    "application/vnd.ms-excel",
    "application/pdf",
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
];

export const SUPPORTED_EXTENSIONS = [
    "txt",
    "md",
    "json",
    "yaml",
    "csv",
    "xls",
    "xlsx",
    "docx",
    "pdf"
] as const;

export type SupportedExtension = typeof SUPPORTED_EXTENSIONS[number];