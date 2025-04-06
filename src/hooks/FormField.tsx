import React from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
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
import { CalendarIcon, X, Info } from "lucide-react";
import { cn } from "@/lib/utils";
import { format, parse, isValid } from "date-fns";
import { FieldProps } from "@/hooks/types";

interface FormFieldProps {
    fieldKey: string;
    field: FieldProps;
    sectionBgColor?: string;
    currentValue: any;
    onChange: (value: any) => void;
    editMode: boolean;
}

const TextInput = React.memo(
    ({ value, onChange, placeholder, disabled, id }: any) => (
        <Input
            id={id}
            value={value || ""}
            onChange={onChange}
            placeholder={placeholder || ""}
            disabled={disabled}
            className="bg-white"
        />
    )
);

const DateInput = React.memo(({ value, onChange, disabled }: any) => (
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
                            ? parse(value, "MM/dd/yyyy", new Date())
                            : undefined
                    }
                    onSelect={(date) => {
                        if (date && isValid(date)) {
                            onChange({
                                target: {
                                    value: format(date, "MM/dd/yyyy"),
                                },
                            });
                        }
                    }}
                    disabled={disabled}
                />
            </PopoverContent>
        </Popover>
    </div>
));

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
                <SelectValue placeholder={placeholder || "Select an option"} />
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

export const FormField = React.memo(
    ({
        fieldKey,
        field,
        sectionBgColor,
        currentValue,
        onChange,
        editMode,
    }: FormFieldProps) => {
        const originalType = field.interface.type;
        let currentType = originalType;

        if (currentValue !== undefined && currentValue !== "") {
            if (originalType === "boolean" && typeof currentValue !== "boolean")
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

        const resetField = () => onChange("");

        const renderFieldInput = () => {
            if (currentType !== originalType) {
                return (
                    <div className="flex items-center relative">
                        <TextInput
                            value={currentValue}
                            onChange={(
                                e: React.ChangeEvent<HTMLInputElement>
                            ) => onChange(e.target.value)}
                            className="pr-8 bg-white"
                            placeholder={field.placeholder}
                            disabled={field.disabled || !editMode}
                            id={fieldKey}
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

            switch (originalType) {
                case "text":
                    return (
                        <TextInput
                            value={currentValue}
                            onChange={(
                                e: React.ChangeEvent<HTMLInputElement>
                            ) => onChange(e.target.value)}
                            placeholder={field.placeholder}
                            disabled={field.disabled || !editMode}
                            id={fieldKey}
                        />
                    );

                case "boolean":
                    return (
                        <Checkbox
                            checked={currentValue === true}
                            onCheckedChange={(checked) => onChange(checked)}
                            disabled={field.disabled || !editMode}
                            className="bg-white"
                        />
                    );

                case "select":
                    return (
                        <SelectInput
                            value={currentValue}
                            onValueChange={(value: string) => onChange(value)}
                            options={field.interface.options}
                            defaultOptions={field.defaultOptions}
                            placeholder={field.placeholder}
                            disabled={field.disabled || !editMode}
                        />
                    );

                case "date":
                    return (
                        <DateInput
                            value={currentValue}
                            onChange={(
                                e: React.ChangeEvent<HTMLInputElement>
                            ) => onChange(e.target.value)}
                            disabled={field.disabled || !editMode}
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
                    <label htmlFor={fieldKey} className="text-sm font-medium">
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
    }
);
