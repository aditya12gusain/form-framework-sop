import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CodesSectionProps } from "../index";

export const CodesSection = React.memo(
    ({ section, renderField }: CodesSectionProps) => {
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
                                                codeData.coveragePercentage.key,
                                                codeData.coveragePercentage,
                                                section.bgColor
                                            )}
                                        </div>
                                    )}
                                </div>

                                {codeData.guidelines &&
                                    Object.keys(codeData.guidelines).length >
                                        0 && (
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
                                                        ]: [string, any]) => (
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
    }
);
