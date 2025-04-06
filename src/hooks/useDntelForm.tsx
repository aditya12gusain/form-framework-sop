// useDntelForm.tsx
import { useState, useEffect, useRef, useCallback } from "react";
import { FormField } from "@/hooks/FormField";
import { DntelForm } from "@/hooks/DntelForm";

// Import types
import { FieldProps, FormData, UseDntelFormReturn } from "./types";

// Custom hook for form handling
export function useDntelForm(
    initialData: FormData,
    id?: string
): UseDntelFormReturn {
    const [data, setData] = useState<FormData>(initialData);
    const [changes, setChanges] = useState<Record<string, any>>({});
    const [activeSection, setActiveSection] = useState<string>("");
    const [expandedSections, setExpandedSections] = useState<string[]>([]);
    const [lastChanged, setLastChanged] = useState<number | null>(null);
    const [editMode, setEditMode] = useState<boolean>(false);
    const sectionRefs = useRef<Record<string, HTMLElement | null>>({});

    // Load saved draft from localStorage if id is provided
    useEffect(() => {
        if (id) {
            const savedChanges = localStorage.getItem(`dntel-form-${id}`);
            if (savedChanges) {
                try {
                    setChanges(JSON.parse(savedChanges));
                } catch (error) {
                    console.error("Failed to parse saved changes:", error);
                }
            }
        }
    }, [id]);

    // Save changes to localStorage if id is provided
    useEffect(() => {
        if (id && Object.keys(changes).length > 0) {
            localStorage.setItem(`dntel-form-${id}`, JSON.stringify(changes));
        }
    }, [changes, id]);

    // Helper to get sorted sections
    const getSortedSections = useCallback(() => {
        return Object.entries(data.sections)
            .map(([key, section]) => ({ key, ...section }))
            .sort((a, b) => a.order - b.order);
    }, [data.sections]);

    // Set the first section as active if none is selected
    useEffect(() => {
        if (!activeSection && data.sections) {
            const sortedSections = getSortedSections();
            if (sortedSections.length > 0) {
                setActiveSection(sortedSections[0].key);
                setExpandedSections([sortedSections[0].key]);
            }
        }
    }, [activeSection, data.sections, getSortedSections]);

    // Functions for section expansion/collapse
    const expandAll = useCallback(() => {
        setExpandedSections(Object.keys(data.sections));
    }, [data.sections]);

    const collapseAll = useCallback(() => {
        setExpandedSections([]);
    }, []);

    const expandSection = useCallback(
        (sectionId: string) => {
            if (!expandedSections.includes(sectionId)) {
                setExpandedSections((prev) => [...prev, sectionId]);
            }
            setActiveSection(sectionId);
        },
        [expandedSections]
    );

    const scrollToSection = useCallback(
        (sectionId: string) => {
            const element = sectionRefs.current[sectionId];
            if (element) {
                element.scrollIntoView({ behavior: "smooth", block: "start" });
                expandSection(sectionId);
            }
        },
        [expandSection]
    );

    // Function to change a field's value
    const changeValue = useCallback((key: string, value: any) => {
        setChanges((prev) => {
            // If value is empty or matches original, remove the change
            if (value === "" || getOriginalValue(key) === value) {
                const { [key]: _, ...rest } = prev;
                return rest;
            }
            return { ...prev, [key]: value };
        });
        setLastChanged(Date.now());
    }, []);

    // Function to get original value from the data structure
    const getOriginalValue = useCallback(
        (key: string) => {
            // Split the key by dots to navigate the nested structure
            const parts = key.split(".");
            let current: any = data;

            for (let i = 0; i < parts.length; i++) {
                if (current.sections && parts[0] in current.sections) {
                    // Handle first level (section)
                    current = current.sections[parts[0]];
                } else if (current.fields && parts[1] in current.fields) {
                    // Handle second level (field)
                    current = current.fields[parts[1]];
                } else if (current[parts[i]]) {
                    // Handle deeper nesting
                    current = current[parts[i]];
                } else {
                    // If path doesn't exist
                    return undefined;
                }
            }

            // Return the value if found
            return current?.value !== undefined ? current.value : undefined;
        },
        [data]
    );

    // Function to get the current value (original or changed)
    const getValue = useCallback(
        (key: string) => {
            return key in changes ? changes[key] : getOriginalValue(key);
        },
        [changes, getOriginalValue]
    );

    // Function to reset all changes
    const reset = useCallback(() => {
        setChanges({});
        setLastChanged(null);
    }, []);

    // Function to clear localStorage
    const clearLS = useCallback(() => {
        if (id) {
            localStorage.removeItem(`dntel-form-${id}`);
            reset();
        }
    }, [id, reset]);

    // Handle section expansion state changes
    const handleSectionToggle = useCallback(
        (sectionId: string, isOpen: boolean) => {
            setExpandedSections((prev) =>
                isOpen
                    ? [...prev, sectionId]
                    : prev.filter((id) => id !== sectionId)
            );
            if (isOpen) {
                setActiveSection(sectionId);
            }
        },
        []
    );

    // Replace the renderField function with a simpler version that uses FormField
    const renderField = useCallback(
        (fieldKey: string, field: FieldProps, sectionBgColor?: string) => {
            const currentValue = getValue(fieldKey);
            return (
                <FormField
                    fieldKey={fieldKey}
                    field={field}
                    sectionBgColor={sectionBgColor}
                    currentValue={currentValue}
                    onChange={(value) => changeValue(fieldKey, value)}
                    editMode={editMode}
                />
            );
        },
        [getValue, changeValue, editMode]
    );

    return [
        <DntelForm
            sortedSections={getSortedSections()}
            expandedSections={expandedSections}
            activeSection={activeSection}
            editMode={editMode}
            sectionRefs={sectionRefs}
            onSectionToggle={handleSectionToggle}
            onExpandAll={expandAll}
            onCollapseAll={collapseAll}
            onEditModeToggle={() => setEditMode(!editMode)}
            onReset={reset}
            onClearLS={clearLS}
            renderField={renderField}
            id={id}
        />,
        {
            changes,
            activeSection,
            expandedSections,
            lastChanged,
            expandAll,
            collapseAll,
            scrollToSection,
            expandSection,
            reset,
            changeValue,
            clearLS,
            editMode,
            setEditMode,
        },
    ];
}
