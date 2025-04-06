// CompleteExample.tsx - A full example using the DntelForm hook
import { useState } from "react";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
    CardDescription,
} from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
    CheckCircle2,
    AlertTriangle,
    Save,
    RotateCcw,
    X,
    Edit,
    ChevronsUpDown,
    Archive,
    FileJson,
} from "lucide-react";

// Import the useDntelForm hook and utilities
import { useDntelForm } from "@/hooks/useDntelForm";
import {
    validateForm,
    createPrintableForm,
    applyChangesToData,
} from "@/hooks/utils";

// Sample data
import sampleData from "@/data/input.json";
import { FormData } from "@/hooks";

const CompleteExample = () => {
    // State for the example UI
    const [activeTab, setActiveTab] = useState("form");
    const [showUnsavedDialog, setShowUnsavedDialog] = useState(false);
    const [showSuccessAlert, setShowSuccessAlert] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [formId] = useState(`patient-form-${Date.now()}`); // Generate a unique ID
    const [validationErrors, setValidationErrors] = useState<string[]>([]);
    const [showErrorsDialog, setShowErrorsDialog] = useState(false);

    // Use the DntelForm hook with the sample data
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
    } = useDntelForm(sampleData as FormData, formId);

    // Check for unsaved changes when exiting edit mode
    const handleEditModeToggle = () => {
        if (editMode && Object.keys(changes).length > 0) {
            setShowUnsavedDialog(true);
        } else {
            setEditMode(!editMode);
        }
    };

    // Handle saving the form
    const handleSave = async () => {
        // First validate the form
        const { valid, missingFields } = validateForm(
            sampleData as FormData,
            changes
        );

        if (!valid) {
            setValidationErrors(missingFields);
            setShowErrorsDialog(true);
            return;
        }

        setSubmitting(true);

        try {
            // Simulate API call
            await new Promise((resolve) => setTimeout(resolve, 1500));

            // Apply changes to data (in a real app, you'd send this to your backend)
            const updatedData = applyChangesToData(
                sampleData as FormData,
                changes
            );
            console.log("Saved data:", updatedData);

            // Show success message
            setShowSuccessAlert(true);
            setTimeout(() => setShowSuccessAlert(false), 5000);

            // Exit edit mode
            setEditMode(false);
            reset(); // Clear changes after saving
        } catch (error) {
            console.error("Error saving form:", error);
        } finally {
            setSubmitting(false);
        }
    };

    // Handle resetting the form
    const handleReset = () => {
        reset();
    };

    // Handle closing the unsaved changes dialog
    const handleCloseUnsavedDialog = (discard: boolean) => {
        setShowUnsavedDialog(false);

        if (discard) {
            reset();
            setEditMode(false);
        }
    };

    // Calculate some stats for the UI
    const totalFields = Object.values(sampleData.sections).reduce(
        (sum, section) => sum + (section.stats?.total || 0),
        0
    );

    const totalFilledFields = Object.keys(changes).length;

    return (
        <div className="container mx-auto py-8 px-4 max-w-6xl">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
                <div>
                    <h1 className="text-3xl font-bold">
                        Patient Insurance Verification
                    </h1>
                    <p className="text-gray-500 mt-1">
                        Review and update insurance details for Ricardo Boada
                    </p>
                </div>

                <div className="flex items-center space-x-2 mt-4 md:mt-0">
                    <Badge
                        variant={editMode ? "default" : "outline"}
                        className="text-xs"
                    >
                        {editMode ? "Edit Mode" : "View Mode"}
                    </Badge>
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={expandAll}
                        className="hidden sm:flex"
                    >
                        <ChevronsUpDown className="h-4 w-4 mr-2" />
                        Expand All
                    </Button>
                </div>
            </div>

            {/* Success alert */}
            {showSuccessAlert && (
                <Alert className="mb-6 border-green-500 bg-green-50">
                    <CheckCircle2 className="h-4 w-4 text-green-500" />
                    <AlertTitle>Success</AlertTitle>
                    <AlertDescription>
                        Form changes have been saved successfully.
                    </AlertDescription>
                </Alert>
            )}

            {/* Main content */}
            <Tabs
                value={activeTab}
                onValueChange={setActiveTab}
                className="space-y-6"
            >
                <div className="flex justify-between items-center">
                    <TabsList>
                        <TabsTrigger value="form">Form</TabsTrigger>
                        <TabsTrigger value="changes">
                            Changes
                            {Object.keys(changes).length > 0 && (
                                <Badge variant="secondary" className="ml-2">
                                    {Object.keys(changes).length}
                                </Badge>
                            )}
                        </TabsTrigger>
                        <TabsTrigger value="data">Data Preview</TabsTrigger>
                    </TabsList>

                    <div className="flex items-center space-x-2">
                        <Button
                            variant={editMode ? "default" : "outline"}
                            size="sm"
                            onClick={handleEditModeToggle}
                        >
                            {editMode ? (
                                <>
                                    <X className="h-4 w-4 mr-2" />
                                    Exit Edit Mode
                                </>
                            ) : (
                                <>
                                    <Edit className="h-4 w-4 mr-2" />
                                    Edit
                                </>
                            )}
                        </Button>

                        {editMode && (
                            <>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={handleReset}
                                    disabled={Object.keys(changes).length === 0}
                                >
                                    <RotateCcw className="h-4 w-4 mr-2" />
                                    Reset
                                </Button>

                                <Button
                                    size="sm"
                                    onClick={handleSave}
                                    disabled={
                                        Object.keys(changes).length === 0 ||
                                        submitting
                                    }
                                >
                                    {submitting ? (
                                        <div className="flex items-center">
                                            <div className="animate-spin h-4 w-4 mr-2 border-2 border-white border-t-transparent rounded-full" />
                                            Saving...
                                        </div>
                                    ) : (
                                        <>
                                            <Save className="h-4 w-4 mr-2" />
                                            Save
                                        </>
                                    )}
                                </Button>
                            </>
                        )}
                    </div>
                </div>

                <TabsContent value="form" className="space-y-6">
                    {/* Quick navigation */}
                    <Card>
                        <CardHeader className="pb-2">
                            <CardTitle className="text-lg">
                                Navigation
                            </CardTitle>
                            <CardDescription>
                                Jump to a specific section of the form
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="flex flex-wrap gap-2">
                                {Object.entries(sampleData.sections)
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
                                            {section.stats && (
                                                <span className="ml-2 text-xs text-gray-500">
                                                    {section.stats.filled}/
                                                    {section.stats.total}
                                                </span>
                                            )}
                                        </Button>
                                    ))}
                            </div>
                        </CardContent>
                    </Card>

                    {/* Form component */}
                    <FormComponent />

                    {/* Form status summary */}
                    <Card>
                        <CardHeader className="pb-2">
                            <CardTitle className="text-lg">
                                Form Status
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                <div className="p-4 bg-gray-50 rounded-md">
                                    <div className="text-sm text-gray-500">
                                        Total Fields
                                    </div>
                                    <div className="text-2xl font-bold">
                                        {totalFields}
                                    </div>
                                </div>
                                <div className="p-4 bg-gray-50 rounded-md">
                                    <div className="text-sm text-gray-500">
                                        Filled Fields
                                    </div>
                                    <div className="text-2xl font-bold">
                                        {totalFilledFields}
                                    </div>
                                </div>
                                <div className="p-4 bg-gray-50 rounded-md">
                                    <div className="text-sm text-gray-500">
                                        Completion
                                    </div>
                                    <div className="text-2xl font-bold">
                                        {Math.round(
                                            (totalFilledFields / totalFields) *
                                                100
                                        )}
                                        %
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="changes">
                    <Card>
                        <CardHeader>
                            <CardTitle>Current Changes</CardTitle>
                            <CardDescription>
                                These are the changes you've made to the form
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            {Object.keys(changes).length === 0 ? (
                                <div className="bg-gray-50 p-6 rounded-md text-center text-gray-500">
                                    <Archive className="h-12 w-12 mx-auto mb-2 text-gray-400" />
                                    <p>No changes have been made yet.</p>
                                    <p className="text-sm">
                                        Switch to edit mode and modify fields to
                                        see changes here.
                                    </p>
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    <div className="flex justify-between items-center">
                                        <span className="text-sm font-medium">
                                            {Object.keys(changes).length}{" "}
                                            changes
                                        </span>
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={handleReset}
                                        >
                                            Reset All
                                        </Button>
                                    </div>
                                    <Separator />
                                    <div className="max-h-96 overflow-y-auto">
                                        {Object.entries(changes).map(
                                            ([key, value]) => (
                                                <div
                                                    key={key}
                                                    className="py-2 border-b last:border-0"
                                                >
                                                    <div className="flex justify-between items-start">
                                                        <div>
                                                            <div className="font-medium text-sm">
                                                                {key}
                                                            </div>
                                                            <div className="text-xs text-gray-500 mt-1">
                                                                New value:{" "}
                                                                {typeof value ===
                                                                "boolean"
                                                                    ? value
                                                                        ? "Yes"
                                                                        : "No"
                                                                    : String(
                                                                          value
                                                                      )}
                                                            </div>
                                                        </div>
                                                        <Button
                                                            variant="ghost"
                                                            size="sm"
                                                            onClick={() =>
                                                                changeValue(
                                                                    key,
                                                                    ""
                                                                )
                                                            }
                                                            className="h-8 w-8 p-0"
                                                        >
                                                            <X className="h-4 w-4" />
                                                        </Button>
                                                    </div>
                                                </div>
                                            )
                                        )}
                                    </div>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="data">
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center">
                                <FileJson className="h-5 w-5 mr-2" />
                                Data Preview
                            </CardTitle>
                            <CardDescription>
                                This shows how the form data would look after
                                saving
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="bg-gray-50 p-4 rounded-md">
                                <pre className="overflow-x-auto text-xs max-h-96 whitespace-pre-wrap">
                                    {JSON.stringify(
                                        createPrintableForm(
                                            sampleData as FormData,
                                            changes
                                        ),
                                        null,
                                        2
                                    )}
                                </pre>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>

            {/* Unsaved changes dialog */}
            <Dialog
                open={showUnsavedDialog}
                onOpenChange={(open) => !open && setShowUnsavedDialog(false)}
            >
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Unsaved Changes</DialogTitle>
                        <DialogDescription>
                            You have unsaved changes. What would you like to do?
                        </DialogDescription>
                    </DialogHeader>
                    <div className="py-4">
                        <Alert variant="destructive" className="mb-4">
                            <AlertTriangle className="h-4 w-4" />
                            <AlertTitle>Warning</AlertTitle>
                            <AlertDescription>
                                If you exit edit mode without saving, your
                                changes will be lost.
                            </AlertDescription>
                        </Alert>
                    </div>
                    <DialogFooter>
                        <Button
                            variant="outline"
                            onClick={() => handleCloseUnsavedDialog(false)}
                        >
                            Continue Editing
                        </Button>
                        <Button
                            variant="destructive"
                            onClick={() => handleCloseUnsavedDialog(true)}
                        >
                            Discard Changes
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Validation errors dialog */}
            <Dialog open={showErrorsDialog} onOpenChange={setShowErrorsDialog}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Validation Errors</DialogTitle>
                        <DialogDescription>
                            Please fix the following issues before saving:
                        </DialogDescription>
                    </DialogHeader>
                    <div className="py-4">
                        <ul className="list-disc pl-5 space-y-2">
                            {validationErrors.map((error, index) => (
                                <li
                                    key={index}
                                    className="text-sm text-red-600"
                                >
                                    {error}
                                </li>
                            ))}
                        </ul>
                    </div>
                    <DialogFooter>
                        <Button onClick={() => setShowErrorsDialog(false)}>
                            Got it
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default CompleteExample;
