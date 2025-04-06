// DntelForm.tsx - Standalone form component
import React from "react";
import { useDntelForm } from "@/hooks/index";
import { FormData } from "@/hooks/types";
import { Button } from "@/components/ui/button";

interface DntelFormProps {
    initialData: FormData;
    id?: string;
    showNavigation?: boolean;
    showControls?: boolean;
    onSave?: (changes: Record<string, any>) => void;
    className?: string;
}

export const DntelForm: React.FC<DntelFormProps> = ({
    initialData,
    id,
    showNavigation = true,
    showControls = true,
    onSave,
    className = "",
}) => {
    const {
        FormComponent,
        changes,
        activeSection,
        scrollToSection,
        expandSection,
        reset,
        editMode,
    } = useDntelForm(initialData, id);

    const handleSave = () => {
        if (onSave && Object.keys(changes).length > 0) {
            onSave(changes);
        }
    };

    return (
        <div className={`space-y-6 ${className}`}>
            {showNavigation && (
                <div className="flex flex-wrap gap-2">
                    <h2 className="text-sm font-medium text-gray-500 w-full mb-2">
                        Jump to section:
                    </h2>
                    {Object.entries(initialData.sections)
                        .sort(([, a], [, b]) => a.order - b.order)
                        .map(([key, section]) => (
                            <Button
                                key={key}
                                variant="outline"
                                size="sm"
                                onClick={() => scrollToSection(key)}
                                className={
                                    activeSection === key
                                        ? "border-primary text-primary"
                                        : ""
                                }
                            >
                                {section.title}
                            </Button>
                        ))}
                </div>
            )}

            <FormComponent />

            {showControls && onSave && (
                <div className="flex justify-end space-x-2 pt-4">
                    <Button
                        variant="outline"
                        onClick={reset}
                        disabled={
                            !editMode || Object.keys(changes).length === 0
                        }
                    >
                        Cancel
                    </Button>
                    <Button
                        onClick={handleSave}
                        disabled={
                            !editMode || Object.keys(changes).length === 0
                        }
                    >
                        Save Changes
                    </Button>
                </div>
            )}
        </div>
    );
};
