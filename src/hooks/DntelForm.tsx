// DntelForm.tsx - Standalone form component
import React from "react";
import { Button } from "@/components/ui/button";
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import { Info } from "lucide-react";
import { cn } from "@/lib/utils";
import { CodesSection } from "./CodesSection";
import { ServiceHistorySection } from "./ServiceHistorySection";
import { SectionProps, FieldProps } from "@/hooks/types";

interface DntelFormProps {
    sortedSections: Array<{ key: string } & SectionProps>;
    expandedSections: string[];
    activeSection: string;
    editMode: boolean;
    sectionRefs: React.RefObject<Record<string, HTMLElement | null>>;
    onSectionToggle: (sectionId: string, isOpen: boolean) => void;
    onExpandAll: () => void;
    onCollapseAll: () => void;
    onEditModeToggle: () => void;
    onReset: () => void;
    onClearLS: () => void;
    renderField: (
        key: string,
        field: FieldProps,
        bgColor?: string
    ) => React.ReactElement;
    id?: string;
}

export const DntelForm = React.memo(
    ({
        sortedSections,
        expandedSections,
        activeSection,
        editMode,
        sectionRefs,
        onSectionToggle,
        onExpandAll,
        onCollapseAll,
        onEditModeToggle,
        onReset,
        onClearLS,
        renderField,
        id,
    }: DntelFormProps) => {
        return (
            <div className="space-y-6">
                <div className="flex justify-between items-center">
                    <div className="space-x-2">
                        <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={onExpandAll}
                        >
                            Expand All
                        </Button>
                        <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={onCollapseAll}
                        >
                            Collapse All
                        </Button>
                    </div>
                    <div className="space-x-2">
                        <Button
                            type="button"
                            variant={editMode ? "default" : "outline"}
                            size="sm"
                            onClick={onEditModeToggle}
                        >
                            {editMode ? "Exit Edit Mode" : "Edit Mode"}
                        </Button>
                        {editMode && (
                            <>
                                <Button
                                    type="button"
                                    variant="outline"
                                    size="sm"
                                    onClick={onReset}
                                >
                                    Reset
                                </Button>
                                {id && (
                                    <Button
                                        type="button"
                                        variant="outline"
                                        size="sm"
                                        onClick={onClearLS}
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
                        onSectionToggle(
                            values[values.length - 1],
                            values.includes(values[values.length - 1])
                        );
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
                                    onSectionToggle(
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
                                        <CodesSection
                                            section={section}
                                            renderField={renderField}
                                        />
                                    ) : section.module === "ServiceHistory" ? (
                                        <ServiceHistorySection
                                            section={section}
                                            renderField={renderField}
                                        />
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
    }
);
