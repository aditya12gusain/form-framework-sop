// index.ts - Main package export

// Export the main hook
export { useDntelForm } from "./useDntelForm";

// Export any necessary types
export type {
    // Define your types here to be exported
    FieldType,
    FieldOption,
    FieldInterface,
    FieldProps,
    SectionProps,
    FormData,
} from "@/hooks/types";

// Optional: Export pre-configured components
export { DntelForm } from "@/components/DntelForm";

// Optional: Export utility functions
export * from "@/hooks/utils";
