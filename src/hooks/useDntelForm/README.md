# useDntelForm Hook

A powerful React hook for managing complex form state with sections, automatic draft saving, and field-level changes tracking.

## Features

-   **Section-based Form Management**: Organize form fields into collapsible sections
-   **Automatic Draft Saving**: Automatically saves form changes to localStorage
-   **Change Tracking**: Track individual field changes separately from original values
-   **Section Navigation**: Programmatic section expansion/collapse and scrolling
-   **Edit Mode Toggle**: Global edit mode for the entire form
-   **Form Validation**: Built-in validation utilities
-   **Printable Form Generation**: Create printable versions of the form
-   **TypeScript Support**: Fully typed API and components


## Dependencies

The hook has the following peer dependencies:

-   shadcn/ui components
-   lucide-react
-   tailwindcss

Make sure you have these dependencies installed in your project. The hook is compatible with React 16.8 and above, as it uses React Hooks.

### Required Configuration

1. Make sure you have Tailwind CSS configured in your project
2. Add the following to your `tailwind.config.js`:

```js
module.exports = {
    // ... other config
    plugins: [require("tailwindcss-animate")],
};
```

3. Ensure you have the shadcn/ui components installed and configured in your project

## Basic Usage

```tsx
import { useDntelForm } from "@hooks/useDntelForm";

const MyForm = () => {
    const [form, formControls] = useDntelForm(initialData, "unique-form-id");

    return (
        <div>
            {form}
            <button onClick={formControls.reset}>Reset Form</button>
        </div>
    );
};
```

## API

### Hook Parameters

```typescript
useDntelForm(initialData: FormData, id?: string): [JSX.Element, UseDntelFormReturn]
```

-   `initialData`: The initial form data structure
-   `id`: Optional unique identifier for localStorage persistence

### Return Value

The hook returns a tuple containing:

1. The rendered form component
2. An object with form control methods and state

### Form Controls

The second return value provides the following controls:

-   `changes`: Object containing all field changes
-   `activeSection`: Currently active section ID
-   `expandedSections`: Array of expanded section IDs
-   `lastChanged`: Timestamp of last change
-   `editMode`: Boolean indicating if form is in edit mode
-   `expandAll()`: Expand all sections
-   `collapseAll()`: Collapse all sections
-   `scrollToSection(sectionId)`: Scroll to and expand a specific section
-   `expandSection(sectionId)`: Expand a specific section
-   `reset()`: Reset all changes
-   `changeValue(key, value)`: Change a field's value
-   `clearLS()`: Clear localStorage data
-   `setEditMode(boolean)`: Toggle edit mode

## Form Data Structure

The form expects data in the following structure:

```typescript
interface FormData {
    sections: {
        [sectionId: string]: {
            title: string;
            order: number;
            fields: {
                [fieldId: string]: FieldProps;
            };
        };
    };
}
```

## Components

The package includes several pre-built components:

-   `DntelForm`: Main form component
-   `FormField`: Individual form field component
-   `CodesSection`: Specialized section for code fields
-   `ServiceHistorySection`: Specialized section for service history

## Utilities

The package provides several utility functions:

-   `validateForm`: Validate form data
-   `createPrintableForm`: Generate a printable version of the form
-   `applyChangesToData`: Apply changes to the original data
-   `getAllFieldKeys`: Get all field keys in the form

## Example

```tsx
import { useDntelForm } from "@hooks/useDntelForm";

const initialData = {
    sections: {
        personal: {
            title: "Personal Information",
            order: 1,
            fields: {
                name: {
                    type: "text",
                    label: "Full Name",
                    value: "",
                },
                // ... more fields
            },
        },
        // ... more sections
    },
};

const MyForm = () => {
    const [form, { changes, reset, editMode, setEditMode }] = useDntelForm(
        initialData,
        "my-form"
    );

    return (
        <div>
            <button onClick={() => setEditMode(!editMode)}>
                {editMode ? "View Mode" : "Edit Mode"}
            </button>
            {form}
            <button onClick={reset}>Reset Changes</button>
            <pre>{JSON.stringify(changes, null, 2)}</pre>
        </div>
    );
};
```

## TypeScript Support

All components and utilities are fully typed. The package exports the following types:

-   `FieldProps`
-   `SectionProps`
-   `FormData`
-   `UseDntelFormReturn`
-   `DntelFormProps`
-   `CodesSectionProps`
-   `ServiceHistorySectionProps`
-   `FormFieldProps`
