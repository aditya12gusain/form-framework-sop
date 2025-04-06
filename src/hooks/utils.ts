// utils.ts - Utility functions for working with DntelForm

import { FormData } from "./types";

/**
 * Validates if all required fields are filled
 */
export function validateForm(
    data: FormData,
    changes: Record<string, any>
): { valid: boolean; missingFields: string[] } {
    const missingFields: string[] = [];

    Object.entries(data.sections).forEach(([sectionKey, section]) => {
        if (section.module === "codes" || section.module === "ServiceHistory") {
            // Skip special sections
            return;
        }

        Object.entries(section.fields).forEach(
            ([fieldKey, field]: [string, any]) => {
                const key = `${sectionKey}.${fieldKey}`;
                const value = changes[key] ?? field.value;

                if (field.required && (!value || value === "")) {
                    missingFields.push(key);
                }
            }
        );
    });

    return {
        valid: missingFields.length === 0,
        missingFields,
    };
}

/**
 * Creates a printable version of the form data
 */
export function createPrintableForm(
    data: FormData,
    changes: Record<string, any>
): Record<string, any> {
    const result: Record<string, any> = {};

    Object.entries(data.sections).forEach(([sectionKey, section]) => {
        result[section.title] = {};

        if (section.module === "codes") {
            // Handle Codes section
            Object.entries(section.fields).forEach(
                ([codeKey, codeData]: [string, any]) => {
                    const codeResult: Record<string, any> = {};

                    if (codeData.frequency) {
                        const key = codeData.frequency.key;
                        codeResult["Frequency"] =
                            changes[key] ?? codeData.frequency.value ?? "";
                    }

                    if (codeData.coveragePercentage) {
                        const key = codeData.coveragePercentage.key;
                        codeResult["Coverage"] =
                            changes[key] ??
                            codeData.coveragePercentage.value ??
                            "";
                    }

                    if (codeData.guidelines) {
                        codeResult["Guidelines"] = {};
                        Object.entries(codeData.guidelines).forEach(
                            ([guideKey, guideData]: [string, any]) => {
                                const key = guideData.key;
                                codeResult["Guidelines"][guideData.title] =
                                    changes[key] ?? guideData.value ?? "";
                            }
                        );
                    }

                    result[section.title][
                        `${codeKey} - ${codeData.friendlyName}`
                    ] = codeResult;
                }
            );
        } else if (section.module === "ServiceHistory") {
            // Handle ServiceHistory section

            // Process each category
            section.fields.forEach((category: any) => {
                const categoryName = category.Category.value;
                result[section.title][categoryName] = {};

                // Process each service in the category
                category.Services.forEach((service: any) => {
                    const serviceKey = `${service.CDTCode.value} - ${service.FriendlyName.value}`;
                    result[section.title][categoryName][serviceKey] = {
                        "CDT Code": service.CDTCode.value,
                        "Friendly Name": service.FriendlyName.value,
                        "Last Service Date":
                            changes[service.LastServiceDate.key] ??
                            service.LastServiceDate.value ??
                            "",
                    };
                });
            });
        } else {
            // Handle regular sections
            Object.entries(section.fields).forEach(
                ([fieldKey, field]: [string, any]) => {
                    const key = `${sectionKey}.${fieldKey}`;
                    result[section.title][field.title] =
                        changes[key] ?? field.value ?? "";
                }
            );
        }
    });

    return result;
}

/**
 * Apply changes back to the original data structure
 */
export function applyChangesToData(
    data: FormData,
    changes: Record<string, any>
): FormData {
    const newData = JSON.parse(JSON.stringify(data)) as FormData;

    // Apply changes to regular sections
    Object.entries(changes).forEach(([key, value]) => {
        const keyParts = key.split(".");

        if (keyParts.length === 2 && keyParts[0] in newData.sections) {
            // Handle regular section fields
            const [sectionKey, fieldKey] = keyParts;

            if (newData.sections[sectionKey].fields[fieldKey]) {
                newData.sections[sectionKey].fields[fieldKey].value = value;
            }
        } else if (
            keyParts[0] === "CustomCodes" ||
            keyParts[0] === "CustomQuestions" ||
            keyParts[0] === "SharedFrequencies"
        ) {
            // Handle Codes section fields
            // These require special handling based on the custom structure
            Object.entries(newData.sections).forEach(
                ([sectionKey, section]) => {
                    if (section.module === "codes") {
                        Object.entries(section.fields).forEach(
                            ([codeKey, codeData]: [string, any]) => {
                                // Check frequency
                                if (
                                    codeData.frequency &&
                                    codeData.frequency.key === key
                                ) {
                                    codeData.frequency.value = value;
                                }

                                // Check coverage percentage
                                if (
                                    codeData.coveragePercentage &&
                                    codeData.coveragePercentage.key === key
                                ) {
                                    codeData.coveragePercentage.value = value;
                                }

                                // Check guidelines
                                if (codeData.guidelines) {
                                    Object.entries(codeData.guidelines).forEach(
                                        ([guideKey, guideData]: [
                                            string,
                                            any
                                        ]) => {
                                            if (guideData.key === key) {
                                                guideData.value = value;
                                            }
                                        }
                                    );
                                }
                            }
                        );
                    }
                }
            );
        }
    });

    // Update stats for each section
    Object.entries(newData.sections).forEach(([sectionKey, section]) => {
        if (
            section.stats &&
            section.module !== "codes" &&
            section.module !== "ServiceHistory"
        ) {
            let filled = 0;

            Object.entries(section.fields).forEach(
                ([fieldKey, field]: [string, any]) => {
                    const value = field.value;
                    if (value !== undefined && value !== null && value !== "") {
                        filled++;
                    }
                }
            );

            section.stats.filled = filled;
        }
    });

    return newData;
}
