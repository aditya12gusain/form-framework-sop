// useDntelForm.tsx
import React, { useState, useEffect, useRef, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Checkbox } from "@/components/ui/checkbox";
import { X, CalendarIcon, Info } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { format, parse, isValid } from "date-fns";

// Import types
import {
    FieldType,
    FieldOption,
    FieldInterface,
    FieldProps,
    SectionProps,
    FormData,
    UseDntelFormReturn,
} from "./types";

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

    useEffect(() => {
        console.log(changes);
    }, []);

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

    // Component to render a field based on its type
    const renderField = useCallback(
        (fieldKey: string, field: FieldProps, sectionBgColor?: string) => {
            const currentValue = getValue(fieldKey);
            // Determine if the value is of a different type than expected
            const originalType = field.interface.type;
            let currentType = originalType;

            if (currentValue !== undefined && currentValue !== "") {
                if (
                    originalType === "boolean" &&
                    typeof currentValue !== "boolean"
                )
                    currentType = "text";
                if (
                    originalType === "date" &&
                    !/^\d{1,2}\/\d{1,2}\/(\d{2}|\d{4})$/.test(currentValue)
                )
                    currentType = "text";
                if (
                    originalType === "select" &&
                    field.interface.options &&
                    !field.interface.options.includes(currentValue)
                )
                    currentType = "text";
            }

            const resetField = () => changeValue(fieldKey, "");

            // Create memoized input components to maintain focus
            const TextInput = React.memo(
                ({ value, onChange, placeholder, disabled }: any) => (
                    <Input
                        id={fieldKey}
                        value={value || ""}
                        onChange={onChange}
                        placeholder={placeholder || ""}
                        disabled={disabled}
                        className="bg-white"
                    />
                )
            );

            const DateInput = React.memo(
                ({ value, onChange, disabled }: any) => (
                    <div className="flex relative">
                        <Input
                            value={value || ""}
                            onChange={onChange}
                            placeholder="MM/DD/YYYY"
                            className="pr-10 bg-white"
                            disabled={disabled}
                        />
                        <Popover>
                            <PopoverTrigger asChild>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="absolute right-0 h-full"
                                    disabled={disabled}
                                >
                                    <CalendarIcon className="h-4 w-4" />
                                </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0" align="end">
                                <Calendar
                                    mode="single"
                                    selected={
                                        value
                                            ? parse(
                                                  value,
                                                  "MM/dd/yyyy",
                                                  new Date()
                                              )
                                            : undefined
                                    }
                                    onSelect={(date) => {
                                        if (date && isValid(date)) {
                                            onChange({
                                                target: {
                                                    value: format(
                                                        date,
                                                        "MM/dd/yyyy"
                                                    ),
                                                },
                                            });
                                        }
                                    }}
                                    disabled={disabled}
                                />
                            </PopoverContent>
                        </Popover>
                    </div>
                )
            );

            const SelectInput = React.memo(
                ({
                    value,
                    onValueChange,
                    options,
                    defaultOptions,
                    placeholder,
                    disabled,
                }: any) => (
                    <Select
                        value={value || ""}
                        onValueChange={onValueChange}
                        disabled={disabled}
                    >
                        <SelectTrigger className="bg-white w-full">
                            <SelectValue
                                placeholder={placeholder || "Select an option"}
                            />
                        </SelectTrigger>
                        <SelectContent>
                            {options?.map((option: string) => (
                                <SelectItem key={option} value={option}>
                                    {option}
                                </SelectItem>
                            ))}
                            {defaultOptions?.map((option: string) => (
                                <SelectItem key={option} value={option}>
                                    {option}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                )
            );

            const renderFieldInput = () => {
                // If current type is different from original, render as text with reset option
                if (currentType !== originalType) {
                    return (
                        
                        <div className="flex items-center relative">
                            <TextInput
                                value={currentValue}
                                onChange={(
                                    e: React.ChangeEvent<HTMLInputElement>
                                ) => changeValue(fieldKey, e.target.value)}
                                className="pr-8 bg-white"
                                placeholder={field.placeholder}
                                disabled={field.disabled || !editMode}
                            />
                            <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                className="absolute right-0 h-full px-2"
                                onClick={resetField}
                                disabled={!editMode}
                            >
                                <X className="h-4 w-4" />
                            </Button>
                        </div>
                    );
                }

                // Render based on original type
                switch (originalType) {
                    case "text":
                        return (
                            <TextInput
                                value={currentValue}
                                onChange={(
                                    e: React.ChangeEvent<HTMLInputElement>
                                ) => changeValue(fieldKey, e.target.value)}
                                placeholder={field.placeholder}
                                disabled={field.disabled || !editMode}
                                className="bg-white"
                            />
                        );

                    case "boolean":
                        return (
                            <Checkbox
                                checked={currentValue === true}
                                onCheckedChange={(checked) =>
                                    changeValue(fieldKey, checked)
                                }
                                disabled={field.disabled || !editMode}
                                className="bg-white"
                            />
                        );

                    case "select":
                        return (
                            <SelectInput
                                value={currentValue}
                                onValueChange={(value: string) =>
                                    changeValue(fieldKey, value)
                                }
                                options={field.interface.options}
                                defaultOptions={field.defaultOptions}
                                placeholder={field.placeholder}
                                disabled={field.disabled || !editMode}
                                className="bg-white"
                            />
                        );

                    case "date":
                        return (
                            <DateInput
                                value={currentValue}
                                onChange={(
                                    e: React.ChangeEvent<HTMLInputElement>
                                ) => changeValue(fieldKey, e.target.value)}
                                disabled={field.disabled || !editMode}
                                className="bg-white"
                            />
                        );

                    default:
                        return null;
                }
            };

            return (
                <div
                    key={fieldKey}
                    className={cn(
                        "flex flex-col space-y-1.5 p-2 rounded-md",
                        field.colSpan === "1" ? "col-span-1" : "col-span-2",
                        field.hidden ? "hidden" : ""
                    )}
                    style={{ backgroundColor: sectionBgColor }}
                >
                    <div className="flex items-center space-x-2">
                        <label
                            htmlFor={fieldKey}
                            className="text-sm font-medium"
                        >
                            {field.title}
                            {field.required && (
                                <span className="text-red-500">*</span>
                            )}
                        </label>
                        {field.tooltip && (
                            <Popover>
                                <PopoverTrigger>
                                    <Info className="h-4 w-4 text-gray-400" />
                                </PopoverTrigger>
                                <PopoverContent>{field.tooltip}</PopoverContent>
                            </Popover>
                        )}
                    </div>
                    {renderFieldInput()}
                </div>
            );
        },
        [getValue, changeValue, editMode]
    );

    // Special renderer for Codes section
    const renderCodesSection = useCallback(
        (section: SectionProps, sectionKey: string) => {
            if (sectionKey !== "Codes") return null;

            return (
                <div className="grid grid-cols-1 gap-4">
                    {Object.entries(section.fields).map(
                        ([codeKey, codeData]: [string, any]) => (
                            <Card
                                key={codeKey}
                                className="overflow-hidden py-0 gap-0"
                            >
                                <CardHeader className="bg-gray-50 p-4">
                                    <CardTitle className="text-base flex justify-between">
                                        <span>
                                            {codeKey} - {codeData.friendlyName}
                                        </span>
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="p-0">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2 p-4">
                                        {codeData.frequency && (
                                            <div className="col-span-1">
                                                {renderField(
                                                    codeData.frequency.key,
                                                    codeData.frequency,
                                                    section.bgColor
                                                )}
                                            </div>
                                        )}
                                        {codeData.coveragePercentage && (
                                            <div className="col-span-1">
                                                {renderField(
                                                    codeData.coveragePercentage
                                                        .key,
                                                    codeData.coveragePercentage,
                                                    section.bgColor
                                                )}
                                            </div>
                                        )}
                                    </div>

                                    {codeData.guidelines &&
                                        Object.keys(codeData.guidelines)
                                            .length > 0 && (
                                            <div className="border-t border-gray-200">
                                                <div className="p-4">
                                                    <h4 className="text-sm font-medium mb-2">
                                                        Guidelines
                                                    </h4>
                                                    <div className="grid grid-cols-1 gap-2">
                                                        {Object.entries(
                                                            codeData.guidelines
                                                        ).map(
                                                            ([
                                                                guidelineKey,
                                                                guidelineData,
                                                            ]: [
                                                                string,
                                                                any
                                                            ]) => (
                                                                <div
                                                                    key={
                                                                        guidelineKey
                                                                    }
                                                                    className="col-span-1"
                                                                >
                                                                    {renderField(
                                                                        guidelineData.key,
                                                                        guidelineData,
                                                                        section.bgColor
                                                                    )}
                                                                </div>
                                                            )
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        )}
                                </CardContent>
                            </Card>
                        )
                    )}
                </div>
            );
        },
        [renderField]
    );

    // Special renderer for ServiceHistory section
    const renderServiceHistorySection = useCallback(
        (section: SectionProps, sectionKey: string) => {
            if (sectionKey !== "ServiceHistory") return null;

            return (
                <div className="grid grid-cols-1 gap-4">
                    {Object.entries(section.fields).map(
                        ([categoryKey, categoryData]) => (
                            <Card
                                key={categoryKey}
                                className="overflow-hidden py-0 gap-0"
                            >
                                <CardHeader className="bg-gray-50 p-4">
                                    <CardTitle className="text-base">
                                        {categoryData.Category.value}
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="p-0">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4">
                                        {categoryData.Services.map(
                                            (service: any, index: number) => (
                                                <div
                                                    key={index}
                                                    className="space-y-4"
                                                >
                                                    <div className="grid grid-cols-2 gap-4">
                                                        <div>
                                                            {renderField(
                                                                service.CDTCode
                                                                    .key,
                                                                service.CDTCode,
                                                                section.bgColor
                                                            )}
                                                        </div>
                                                        <div>
                                                            {renderField(
                                                                service
                                                                    .FriendlyName
                                                                    .key,
                                                                service.FriendlyName,
                                                                section.bgColor
                                                            )}
                                                        </div>
                                                    </div>
                                                    <div>
                                                        {renderField(
                                                            service
                                                                .LastServiceDate
                                                                .key,
                                                            service.LastServiceDate,
                                                            section.bgColor
                                                        )}
                                                    </div>
                                                </div>
                                            )
                                        )}
                                    </div>
                                </CardContent>
                            </Card>
                        )
                    )}
                </div>
            );
        },
        []
    );
    // Main form component
    const FormComponent = React.memo(() => {
        const sortedSections = getSortedSections();

        return (
            <div className="space-y-6">
                <div className="flex justify-between items-center">
                    <div className="space-x-2">
                        <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={expandAll}
                        >
                            Expand All
                        </Button>
                        <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={collapseAll}
                        >
                            Collapse All
                        </Button>
                    </div>
                    <div className="space-x-2">
                        <Button
                            type="button"
                            variant={editMode ? "default" : "outline"}
                            size="sm"
                            onClick={() => setEditMode(!editMode)}
                        >
                            {editMode ? "Exit Edit Mode" : "Edit Mode"}
                        </Button>
                        {editMode && (
                            <>
                                <Button
                                    type="button"
                                    variant="outline"
                                    size="sm"
                                    onClick={reset}
                                >
                                    Reset
                                </Button>
                                {id && (
                                    <Button
                                        type="button"
                                        variant="outline"
                                        size="sm"
                                        onClick={clearLS}
                                    >
                                        Clear Storage
                                    </Button>
                                )}
                            </>
                        )}
                    </div>
                </div>

                <Accordion
                    type="multiple"
                    value={expandedSections}
                    onValueChange={(values) => {
                        setExpandedSections(values);
                        if (
                            values.length > 0 &&
                            !values.includes(activeSection)
                        ) {
                            setActiveSection(values[values.length - 1]);
                        }
                    }}
                    className="space-y-4 grid grid-cols-2 gap-4 items-start"
                >
                    {sortedSections.map((section) => (
                        <AccordionItem
                            key={section.key}
                            value={section.key}
                            ref={(el) => {
                                if (el) {
                                    sectionRefs.current[section.key] = el;
                                }
                            }}
                            className={cn(
                                "border rounded-lg overflow-hidden mb-0",
                                activeSection === section.key
                                    ? "ring-2 ring-primary"
                                    : "",
                                section.layout === "full" ? "col-span-2" : ""
                            )}
                        >
                            <AccordionTrigger
                                className="px-4 py-3 hover:no-underline hover:bg-gray-50"
                                onClick={() =>
                                    handleSectionToggle(
                                        section.key,
                                        !expandedSections.includes(section.key)
                                    )
                                }
                                style={{ backgroundColor: section.bgColor }}
                            >
                                <div className="flex items-center justify-between w-full">
                                    <div className="flex items-center space-x-2">
                                        <span className="font-medium">
                                            {section.title}
                                        </span>
                                        {section.tooltip && (
                                            <Popover>
                                                <PopoverTrigger>
                                                    <Info className="h-4 w-4 text-gray-400" />
                                                </PopoverTrigger>
                                                <PopoverContent>
                                                    {section.tooltip}
                                                </PopoverContent>
                                            </Popover>
                                        )}
                                    </div>
                                    {section.stats && (
                                        <span className="text-sm text-gray-500">
                                            {section.stats.filled}/
                                            {section.stats.total} filled
                                        </span>
                                    )}
                                </div>
                            </AccordionTrigger>
                            <AccordionContent className="p-0">
                                <div className="p-4">
                                    {section.module === "codes" ? (
                                        renderCodesSection(section, section.key)
                                    ) : section.module === "ServiceHistory" ? (
                                        <div className="grid grid-cols-1 gap-4">
                                            {Object.entries(section.fields).map(
                                                ([
                                                    categoryKey,
                                                    categoryData,
                                                ]) => (
                                                    <Card
                                                        key={categoryKey}
                                                        className="overflow-hidden py-0 gap-0"
                                                    >
                                                        <CardHeader className="bg-gray-50 p-4">
                                                            <CardTitle className="text-base">
                                                                {
                                                                    categoryData
                                                                        .Category
                                                                        .value
                                                                }
                                                            </CardTitle>
                                                        </CardHeader>
                                                        <CardContent className="p-0">
                                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4">
                                                                {categoryData.Services.map(
                                                                    (
                                                                        service: any,
                                                                        index: number
                                                                    ) => (
                                                                        <div
                                                                            key={
                                                                                index
                                                                            }
                                                                            className="space-y-4"
                                                                        >
                                                                            <div className="grid grid-cols-2 gap-4">
                                                                                <div>
                                                                                    {renderField(
                                                                                        service
                                                                                            .CDTCode
                                                                                            .key,
                                                                                        service.CDTCode,
                                                                                        section.bgColor
                                                                                    )}
                                                                                </div>
                                                                                <div>
                                                                                    {renderField(
                                                                                        service
                                                                                            .FriendlyName
                                                                                            .key,
                                                                                        service.FriendlyName,
                                                                                        section.bgColor
                                                                                    )}
                                                                                </div>
                                                                            </div>
                                                                            <div>
                                                                                {renderField(
                                                                                    service
                                                                                        .LastServiceDate
                                                                                        .key,
                                                                                    service.LastServiceDate,
                                                                                    section.bgColor
                                                                                )}
                                                                            </div>
                                                                        </div>
                                                                    )
                                                                )}
                                                            </div>
                                                        </CardContent>
                                                    </Card>
                                                )
                                            )}
                                        </div>
                                    ) : (
                                        <div
                                            className={cn(
                                                "grid grid-cols-2 gap-4",
                                                section.layout === "full"
                                                    ? "md:grid-cols-4"
                                                    : "md:grid-cols-2"
                                            )}
                                        >
                                            {Object.entries(section.fields).map(
                                                ([fieldKey, field]) =>
                                                    renderField(
                                                        `${section.key}.${fieldKey}`,
                                                        field as FieldProps,
                                                        section.bgColor
                                                    )
                                            )}
                                        </div>
                                    )}
                                </div>
                            </AccordionContent>
                        </AccordionItem>
                    ))}
                </Accordion>
            </div>
        );
    });

    return {
        FormComponent,
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
    };
}
