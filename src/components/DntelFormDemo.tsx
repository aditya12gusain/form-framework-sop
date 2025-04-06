// DntelFormDemo.tsx
import { useState, useEffect } from "react";
import { useDntelForm } from "@/hooks/useDntelForm";
import { Button } from "@/components/ui/button";
import data from "@/data/input.json";
import { FormData } from "@/hooks";

export default function DntelFormDemo() {
    // Unique ID for this form instance
    const formId = "patient-form-1";

    // Use our custom form hook
    const {
        FormComponent,
        changes,
        activeSection,
        expandedSections,
        lastChanged,
        expandAll,
        collapseAll,
        scrollToSection,
        expandSection,
        editMode,
        setEditMode,
        reset,
        changeValue,
        clearLS,
    } = useDntelForm(data as FormData, formId);

    // Display current state for demo purposes
    const [stateDisplay, setStateDisplay] = useState(false);

    // Update state display whenever changes occur
    useEffect(() => {
        if (lastChanged) {
            setStateDisplay(true);
        }
    }, [lastChanged]);

    return (
        <div className="container mx-auto p-4 space-y-8">
            <div className="bg-white p-6 rounded-lg shadow-md">
                <h1 className="text-2xl font-bold mb-6">
                    Dental Insurance Verification Form
                </h1>

                {/* Quick navigation buttons */}
                <div className="mb-6 flex flex-wrap gap-2">
                    <h2 className="text-sm font-medium text-gray-500 w-full mb-2">
                        Jump to section:
                    </h2>
                    {Object.entries(data.sections)
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

                {/* The main form */}
                <FormComponent />
            </div>

            {/* State display for demo purposes */}
            {stateDisplay && (
                <div className="bg-white p-6 rounded-lg shadow-md">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-xl font-semibold">
                            Current Form State
                        </h2>
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setStateDisplay(false)}
                        >
                            Hide
                        </Button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <h3 className="text-sm font-medium mb-2">
                                Changes
                            </h3>
                            <pre className="bg-gray-100 p-4 rounded-md overflow-auto max-h-80">
                                {JSON.stringify(changes, null, 2)}
                            </pre>
                        </div>

                        <div>
                            <h3 className="text-sm font-medium mb-2">
                                Other State
                            </h3>
                            <div className="bg-gray-100 p-4 rounded-md">
                                <p>
                                    <span className="font-medium">
                                        Active Section:
                                    </span>{" "}
                                    {activeSection}
                                </p>
                                <p>
                                    <span className="font-medium">
                                        Expanded Sections:
                                    </span>{" "}
                                    {expandedSections.join(", ")}
                                </p>
                                <p>
                                    <span className="font-medium">
                                        Edit Mode:
                                    </span>{" "}
                                    {editMode ? "Yes" : "No"}
                                </p>
                                <p>
                                    <span className="font-medium">
                                        Last Changed:
                                    </span>{" "}
                                    {lastChanged
                                        ? new Date(lastChanged).toLocaleString()
                                        : "N/A"}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
