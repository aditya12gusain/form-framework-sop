// Export the main hook
export { useDntelForm } from "./useDntelForm";

// Export components
export { DntelForm } from "./components/DntelForm";
export { FormField } from "./components/FormField";
export { CodesSection } from "./components/CodesSection";
export { ServiceHistorySection } from "./components/ServiceHistorySection";

// Export types
export type {
    FieldProps,
    SectionProps,
    FormData,
    UseDntelFormReturn,
    DntelFormProps,
    CodesSectionProps,
    ServiceHistorySectionProps,
    FormFieldProps,
} from "./types/types";

// Export utils
export {
    validateForm,
    createPrintableForm,
    applyChangesToData,
    getAllFieldKeys,
} from "./utils/utils";
