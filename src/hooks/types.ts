// types.ts - Common types used throughout the package

export type FieldType = "text" | "boolean" | "select" | "date";

export interface FieldOption {
    value: string;
    label: string;
}

export interface FieldInterface {
    type: FieldType;
    options?: string[];
}

export interface FieldProps {
    value: any;
    title: string;
    interface: FieldInterface;
    key: string;
    required?: boolean;
    defaultValue?: string;
    defaultOptions?: string[];
    hidden?: boolean;
    placeholder?: string;
    disabled?: boolean;
    tooltip?: string;
    colSpan?: string;
    source?: {
        channel: string;
        system?: {
            id: string;
        };
        human?: {
            id: string;
            name: string;
            email: string;
        };
        timestamp: string;
    };
}

export interface SectionProps {
    order: number;
    layout: "full" | "right" | "left";
    title: string;
    tooltip?: string;
    bgColor?: string;
    fields: Record<string, FieldProps | any>;
    module?: string;
    stats?: {
        total: number;
        filled: number;
    };
}

export interface FormData {
    sections: Record<string, SectionProps>;
}

// Hook return type
export interface UseDntelFormReturn {
    FormComponent: React.FC;
    changes: Record<string, any>;
    activeSection: string;
    expandedSections: string[];
    lastChanged: number | null;
    expandAll: () => void;
    collapseAll: () => void;
    scrollToSection: (id: string) => void;
    expandSection: (id: string) => void;
    reset: () => void;
    changeValue: (key: string, value: any) => void;
    clearLS: () => void;
    editMode: boolean;
    setEditMode: (enabled: boolean) => void;
}
